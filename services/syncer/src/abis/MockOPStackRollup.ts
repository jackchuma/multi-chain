export default [
  {
    type: "function",
    name: "anchors",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "root", type: "bytes32", internalType: "bytes32" },
      {
        name: "l2BlockNumber",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "commitOutputRoot",
    inputs: [
      {
        name: "l2BlockNumber",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "root", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
