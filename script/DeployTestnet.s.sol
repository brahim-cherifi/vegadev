// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KyberObfuscatedSwapper.sol";

contract DeployTestnetScript is Script {
    function run() external {
        // Use a default test private key if not provided
        uint256 deployerPrivateKey;
        
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            // Default test private key (DO NOT USE IN PRODUCTION)
            console.log("WARNING: Using test private key. Set PRIVATE_KEY in .env for production!");
            deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        }
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the KyberSwap version
        KyberObfuscatedSwapper swapper = new KyberObfuscatedSwapper();
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("========================================");
        console.log("KyberObfuscatedSwapper deployed to BSC TESTNET");
        console.log("========================================");
        console.log("Contract Address:", address(swapper));
        console.log("Owner:", swapper.owner());
        console.log("Network: BSC Testnet (Chain ID 97)");
        console.log("========================================");
        console.log("");
        console.log("IMPORTANT: Save this contract address!");
        console.log("You'll need it for the web interface configuration.");
        console.log("");
        console.log("Next steps:");
        console.log("1. Copy the contract address above");
        console.log("2. Add it to web/.env as REACT_APP_CONTRACT_ADDRESS");
        console.log("3. Run: cd web && npm start");
        console.log("========================================");
    }
}
