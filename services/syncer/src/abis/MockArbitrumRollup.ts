export default [
  {
    type: "function",
    name: "commitNode",
    inputs: [
      { name: "nodeId", type: "uint64", internalType: "uint64" },
      {
        name: "node",
        type: "tuple",
        internalType: "struct MockArbitrumRollup.Node",
        components: [
          {
            name: "stateHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "challengeHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "confirmData",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
