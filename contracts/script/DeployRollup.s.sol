// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {Rollup} from "../src/Rollup.sol";

contract DeployRollup is Script {
    function run() external returns (Rollup) {
        vm.startBroadcast();
        Rollup rollup = new Rollup();
        vm.stopBroadcast();
        return rollup;
    }
}
