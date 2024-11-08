// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {DeployBeaconOracle} from "../script/DeployBeaconOracle.s.sol";
import {BeaconOracle} from "../src/BeaconOracle.sol";

contract BeaconOracleTest is Test {
    BeaconOracle public beaconOracle;

    function setUp() public {
        DeployBeaconOracle deployer = new DeployBeaconOracle();
        beaconOracle = deployer.run();
    }

    function test_commitBeaconRoot(uint256 blockNumber, uint256 blockTimestamp, bytes32 stateRoot) public {
        beaconOracle.commitBeaconRoot(blockNumber, blockTimestamp, stateRoot);

        assertEq(beaconOracle.latestBlock(), blockNumber);
        assertEq(beaconOracle.beaconRoots(blockTimestamp), stateRoot);
    }

    function test_staticcall(uint256 blockNumber, uint256 blockTimestamp, bytes32 stateRoot) public {
        beaconOracle.commitBeaconRoot(blockNumber, blockTimestamp, stateRoot);

        (bool success, bytes memory returnData) = address(beaconOracle).staticcall(abi.encode(blockTimestamp));
        assertTrue(success);
        assertEq(abi.decode(returnData, (bytes32)), stateRoot);
    }
}
