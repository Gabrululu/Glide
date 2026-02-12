// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TrialUSDC} from "../src/TrialUSDC.sol";

contract DeployTrialUSDC is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        TrialUSDC usdc = new TrialUSDC();
        
        vm.stopBroadcast();
        
        console.log("========================================");
        console.log("TrialUSDC deployed to:", address(usdc));
        console.log("========================================");
        console.log("");
        console.log("Add this to your .env.local:");
        console.log("NEXT_PUBLIC_TRIAL_USDC=%s", address(usdc));
        console.log("");
        console.log("View on BaseScan:");
        console.log("https://sepolia.basescan.org/address/%s", address(usdc));
    }
}
