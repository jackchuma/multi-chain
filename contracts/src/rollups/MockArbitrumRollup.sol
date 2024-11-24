// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract MockArbitrumRollup {
    struct Node {
        // Hash of the state of the chain as of this node
        bytes32 stateHash;
        // Hash of the data that can be challenged
        bytes32 challengeHash;
        // Hash of the data that will be committed if this node is confirmed
        bytes32 confirmData;
    }

    address[118] gap;

    mapping(uint64 => Node) private _nodes;

    uint64 public latestConfirmed;

    function commitNode(uint64 nodeId, Node memory node) external {
        _nodes[nodeId] = node;
        latestConfirmed = nodeId;
    }
}
