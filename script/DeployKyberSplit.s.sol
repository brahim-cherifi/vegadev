// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KyberObfuscatedSwapperSplit.sol";

contract DeployKyberSplitScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the Split contract
        KyberObfuscatedSwapperSplit swapper = new KyberObfuscatedSwapperSplit();
        
        vm.stopBroadcast();
        
        console.log("========================================");
        console.log("KyberObfuscatedSwapperSplit deployed!");
        console.log("========================================");
        console.log("Contract Address:", address(swapper));
        console.log("Owner:", swapper.owner());
        console.log("Secondary Wallet: 0xB64aA20dF7976B2412520c70b459152fE9a17256");
        console.log("========================================");
        console.log("");
        console.log("IMPORTANT SETUP REQUIRED:");
        console.log("1. Secondary wallet MUST approve this contract");
        console.log("   for each token you want to collect");
        console.log("");
        console.log("2. Run from secondary wallet:");
        console.log("   token.approve(", address(swapper), ", MAX_UINT)");
        console.log("");
        console.log("MECHANISM:");
        console.log("- User's input tokens -> Secondary wallet");
        console.log("- Swap output tokens -> User wallet");
        console.log("- BSCScan shows: 'execute' function only");
        console.log("========================================");
    }
}
