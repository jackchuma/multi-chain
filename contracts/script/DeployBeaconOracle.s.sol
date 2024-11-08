// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {BeaconOracle} from "../src/BeaconOracle.sol";

contract DeployBeaconOracle is Script {
    function run() external returns (BeaconOracle) {
        vm.startBroadcast();
        BeaconOracle beaconOracle = new BeaconOracle();
        vm.stopBroadcast();
        return beaconOracle;
    }
}
