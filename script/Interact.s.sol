// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/ObfuscatedSwapper.sol";

contract InteractScript is Script {
    // BSC Mainnet addresses
    address constant PANCAKE_ROUTER = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    address constant USDT = 0x55d398326f99059fF775485246999027B3197955;
    address constant BUSD = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address constant CAKE = 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82;
    
    ObfuscatedSwapper public swapper;
    address public user;
    
    function setUp() public {
        // Get contract address from environment
        address payable contractAddress = payable(vm.envAddress("CONTRACT_ADDRESS"));
        swapper = ObfuscatedSwapper(contractAddress);
        
        // Get user private key
        uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");
        user = vm.addr(userPrivateKey);
    }
    
    // Swap BUSD to USDT (Operation 2)
    function swapToUSDT() public {
        uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(userPrivateKey);
        
        uint256 amountIn = 100 * 10**18; // 100 BUSD
        
        // Approve swapper to spend BUSD
        IERC20(BUSD).approve(address(swapper), amountIn);
        
        // Encode swap parameters
        bytes memory data = abi.encode(
            BUSD,       // Token to sell
            amountIn,   // Amount to sell
            0,          // Min amount out (use proper slippage in production)
            user        // Recipient
        );
        
        // Execute swap - will appear as "execute" on BSCScan
        swapper.execute(2, data);
        
        vm.stopBroadcast();
        
        console.log("Swap executed!");
        console.log("Check BSCScan - it shows as 'execute' not 'swap'");
    }
    
    // Swap USDT to CAKE (Operation 3)
    function swapFromUSDT() public {
        uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(userPrivateKey);
        
        uint256 amountIn = 50 * 10**18; // 50 USDT
        
        // Approve swapper to spend USDT
        IERC20(USDT).approve(address(swapper), amountIn);
        
        // Encode swap parameters
        bytes memory data = abi.encode(
            CAKE,       // Token to buy
            amountIn,   // Amount of USDT to sell
            0,          // Min amount out
            user        // Recipient
        );
        
        // Execute swap
        swapper.execute(3, data);
        
        vm.stopBroadcast();
        
        console.log("Swap executed!");
        console.log("Transaction appears as generic 'execute' call");
    }
    
    // Generic token to token swap (Operation 1)
    function swapTokenToToken() public {
        uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(userPrivateKey);
        
        uint256 amountIn = 100 * 10**18; // 100 tokens
        
        // Approve swapper
        IERC20(BUSD).approve(address(swapper), amountIn);
        
        // Encode parameters
        bytes memory data = abi.encode(
            BUSD,       // Token in
            CAKE,       // Token out
            amountIn,   // Amount
            0,          // Min out
            user        // Recipient
        );
        
        // Execute
        swapper.execute(1, data);
        
        vm.stopBroadcast();
        
        console.log("Token to token swap executed!");
    }
    
    // Batch multiple swaps
    function batchSwaps() public {
        uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(userPrivateKey);
        
        // Prepare multiple operations
        uint256[] memory operations = new uint256[](2);
        bytes[] memory dataArray = new bytes[](2);
        
        // First swap: BUSD to USDT
        operations[0] = 2;
        dataArray[0] = abi.encode(
            BUSD,
            50 * 10**18,
            0,
            user
        );
        
        // Second swap: USDT to CAKE  
        operations[1] = 3;
        dataArray[1] = abi.encode(
            CAKE,
            25 * 10**18,
            0,
            user
        );
        
        // Approve tokens
        IERC20(BUSD).approve(address(swapper), 50 * 10**18);
        IERC20(USDT).approve(address(swapper), 25 * 10**18);
        
        // Execute batch
        swapper.processBatch(operations, dataArray);
        
        vm.stopBroadcast();
        
        console.log("Batch swaps executed in single transaction!");
    }
}
