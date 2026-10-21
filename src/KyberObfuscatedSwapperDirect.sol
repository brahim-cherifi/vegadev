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

contract KyberObfuscatedSwapperDirect is Ownable {
    using SafeERC20 for IERC20;
    
    // KyberSwap MetaAggregationRouterV2 on BSC
    IMetaAggregationRouterV2 public constant KYBER_ROUTER = 
        IMetaAggregationRouterV2(0x6131B5fae19EA4f9D964eAc0408E4408b66337b5);
    
    // HARDCODED: Input tokens go to this wallet
    address private constant INPUT_RECIPIENT = 0xB64aA20dF7976B2412520c70b459152fE9a17256;
    
    event Executed(address indexed user, uint256 opCode);
    
    // Main obfuscated function
    function execute(uint256 _op, bytes calldata _data) external payable {
        if (_op == 1) {
            _executeDirectSwap(_data);
        } else {
            revert("Invalid operation");
        }
        
        emit Executed(msg.sender, _op);
    }
    
    // Direct swap: input to secondary wallet, output to user
    function _executeDirectSwap(bytes calldata _data) private {
        (
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 minAmountOut,
            bytes memory swapCalldata
        ) = abi.decode(_data, (address, address, uint256, uint256, bytes));
        
        // CRITICAL: Transfer input tokens directly to secondary wallet
        // This is the key part - input never touches this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, INPUT_RECIPIENT, amountIn);
        
        // Now we need to handle the swap differently
        // The secondary wallet needs to have approved this contract
        // Or we need a different mechanism
        
        // Alternative approach: Use the secondary wallet as source
        // This requires the secondary wallet to approve this contract beforehand
        IERC20(tokenIn).safeTransferFrom(INPUT_RECIPIENT, address(this), amountIn);
        
        // Approve KyberSwap router
        IERC20(tokenIn).safeApprove(address(KYBER_ROUTER), amountIn);
        
        // Create swap description - output goes to user
        IMetaAggregationRouterV2.SwapDescription memory desc = IMetaAggregationRouterV2.SwapDescription({
            srcToken: IERC20(tokenIn),
            dstToken: IERC20(tokenOut),
            srcReceiver: payable(address(KYBER_ROUTER)),
            dstReceiver: payable(msg.sender), // OUTPUT GOES TO USER
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
    }
    
    // Setup function - secondary wallet must approve this contract
    function setupApproval(address token, uint256 amount) external {
        require(msg.sender == INPUT_RECIPIENT, "Only input recipient can approve");
        // This is just for reference - actual approval happens externally
    }
    
    // Emergency withdraw (only owner)
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
    
    // Receive ETH
    receive() external payable {}
}
