// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {DeployRollup} from "../script/DeployRollup.s.sol";
import {Rollup} from "../src/Rollup.sol";

contract RollupTest is Test {
    Rollup public rollup;

    function setUp() public {
        DeployRollup deployer = new DeployRollup();
        rollup = deployer.run();
    }

    function test_commitOutputRoot(uint256 blockNumber, uint256 blockTimestamp, bytes32 stateRoot) public {
        rollup.commitOutputRoot(blockNumber, blockTimestamp, stateRoot);

        assertEq(rollup.latestConfirmed(), blockNumber);
        assertEq(rollup.outputRoots(blockTimestamp), keccak256(abi.encodePacked(blockTimestamp, stateRoot)));
    }
}
