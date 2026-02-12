// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {GlideSession} from "../src/GlideSession.sol";

contract DeploySession is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        GlideSession session = new GlideSession();
        
        vm.stopBroadcast();
        
        console.log("========================================");
        console.log("GlideSession deployed to:", address(session));
        console.log("========================================");
        console.log("");
        console.log("Add this to your .env.local:");
        console.log("NEXT_PUBLIC_SESSION_CONTRACT=%s", address(session));
        console.log("");
        console.log("View on BaseScan:");
        console.log("https://sepolia.basescan.org/address/%s", address(session));
    }
}
