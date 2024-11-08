export default [
  { type: "fallback", stateMutability: "nonpayable" },
  {
    type: "function",
    name: "beaconRoots",
    inputs: [
      {
        name: "blockTimestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "stateRoot", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "commitBeaconRoot",
    inputs: [
      { name: "blockNumber", type: "uint256", internalType: "uint256" },
      {
        name: "blockTimestamp",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "stateRoot", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "latestBlock",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;
