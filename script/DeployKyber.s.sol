// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KyberObfuscatedSwapper.sol";

contract DeployKyberScript is Script {
    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the KyberSwap version
        KyberObfuscatedSwapper swapper = new KyberObfuscatedSwapper();
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("========================================");
        console.log("KyberObfuscatedSwapper deployed to:", address(swapper));
        console.log("Owner:", swapper.owner());
        console.log("========================================");
        console.log("");
        console.log("Features:");
        console.log("  - Uses KyberSwap aggregator for optimized routing");
        console.log("  - Finds best rates across multiple DEXs");
        console.log("  - Lower slippage and better prices");
        console.log("");
        console.log("Operation Codes:");
        console.log("  1 = Token to Token swap (optimized)");
        console.log("  2 = Any Token to USDT swap");
        console.log("  3 = USDT to any Token swap");
        console.log("  4 = Multi-hop optimized swap");
        console.log("");
        console.log("KyberSwap Aggregator:", 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5);
        console.log("");
        console.log("Save this contract address!");
    }
}
