// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Rollup {
    uint256 public latestConfirmed;

    mapping(uint256 blockTimestamp => bytes32 outputRoot) public outputRoots;

    function commitOutputRoot(uint256 blockNumber, uint256 blockTimestamp, bytes32 stateRoot) external {
        outputRoots[blockTimestamp] = keccak256(abi.encodePacked(blockTimestamp, stateRoot));
        latestConfirmed = blockNumber;
    }
}
