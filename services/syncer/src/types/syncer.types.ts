import type { Abi, Chain, PublicClient, WalletClient } from "viem";

export type PublicClientWithChain = PublicClient & { chain: Chain };
export type SubmitStateRootOpts = {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  chain: Chain;
  walletClient: WalletClient;
  publicClient: PublicClientWithChain;
  args: any[];
};
