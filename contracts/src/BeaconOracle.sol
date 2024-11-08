// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract BeaconOracle {
    uint256 public latestBlock;

    mapping(uint256 blockTimestamp => bytes32 stateRoot) public beaconRoots;

    fallback(bytes calldata data) external returns (bytes memory) {
        uint256 blockTimestamp = abi.decode(data, (uint256));
        return abi.encode(beaconRoots[blockTimestamp]);
    }

    function commitBeaconRoot(uint256 blockNumber, uint256 blockTimestamp, bytes32 stateRoot) external {
        latestBlock = blockNumber;
        beaconRoots[blockTimestamp] = stateRoot;
    }
}
