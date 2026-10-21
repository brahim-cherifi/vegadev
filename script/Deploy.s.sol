// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/ObfuscatedSwapper.sol";

contract DeployScript is Script {
    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        ObfuscatedSwapper swapper = new ObfuscatedSwapper();
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("========================================");
        console.log("ObfuscatedSwapper deployed to:", address(swapper));
        console.log("Owner:", swapper.owner());
        console.log("========================================");
        console.log("");
        console.log("Operation Codes:");
        console.log("  1 = Token to Token swap");
        console.log("  2 = Any Token to USDT swap");
        console.log("  3 = USDT to any Token swap");
        console.log("");
        console.log("Save this address to interact with the contract!");
    }
}
