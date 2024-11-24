// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract MockOPStackRollup {
    struct OutputRoot {
        bytes32 root;
        uint256 l2BlockNumber;
    }
    uint256 placeholder;

    mapping(uint32 => OutputRoot) public anchors;

    function commitOutputRoot(uint256 l2BlockNumber, bytes32 root) external {
        anchors[0] = OutputRoot({
            root: root,
            l2BlockNumber: l2BlockNumber
        });
    }
}
