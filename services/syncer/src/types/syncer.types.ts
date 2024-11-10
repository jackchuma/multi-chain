import type { Abi, Chain, PublicClient, WalletClient } from "viem";

export type PublicClientWithChain = PublicClient & { chain: Chain };
export type SubmitStateRootOpts = {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  blockNumber: bigint;
  blockTimestamp: bigint;
  stateRoot: `0x${string}`;
  chain: Chain;
  walletClient: WalletClient;
  publicClient: PublicClientWithChain;
};
