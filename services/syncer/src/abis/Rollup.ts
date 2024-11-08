export default [
  {
    type: "function",
    name: "commitOutputRoot",
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
    name: "latestConfirmed",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "outputRoots",
    inputs: [
      {
        name: "blockTimestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "outputRoot", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
] as const;
