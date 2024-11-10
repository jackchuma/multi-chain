import {
  createPublicClient,
  createWalletClient,
  http,
  type Account,
  type Block,
  type Chain,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sleep } from "bun";

import { chainA } from "./chains/chainA";
import { chainB } from "./chains/chainB";
import { mockL1 } from "./chains/mockL1";
import BeaconOracle from "./abis/BeaconOracle";
import Rollup from "./abis/Rollup";
import type {
  PublicClientWithChain,
  SubmitStateRootOpts,
} from "./types/syncer.types";

const rollups = {
  [chainA.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [chainB.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
} as any;
const beaconContracts = {
  [chainA.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [chainB.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
} as any;

export default class Syncer {
  account: Account;
  l2PublicClient: PublicClientWithChain;
  l1PublicClient: PublicClientWithChain;
  l2WalletClient: WalletClient;
  l1WalletClient: WalletClient;

  constructor(targetChain: Chain, pKey: `0x${string}`) {
    this.account = privateKeyToAccount(pKey);
    this.l2PublicClient = createPublicClient({
      chain: targetChain,
      transport: http(),
    });
    this.l1PublicClient = createPublicClient({
      chain: mockL1,
      transport: http(),
    });
    this.l2WalletClient = createWalletClient({
      chain: targetChain,
      transport: http(),
    });
    this.l1WalletClient = createWalletClient({
      chain: mockL1,
      transport: http(),
    });
  }

  async monitorChains() {
    await Promise.all([
      this.monitorChain(this.l1PublicClient),
      this.monitorChain(this.l2PublicClient),
    ]);
  }

  private async monitorChain(client: PublicClientWithChain) {
    console.log(`Monitoring ${client.chain.name} chain...`);
    const isSource = client.chain.id === mockL1.id;
    let blockNumber = 0n;

    while (true) {
      const latestBlock = await client.getBlock();

      if (blockNumber >= latestBlock.number) {
        await sleep(1000);
        continue;
      }

      blockNumber = latestBlock.number;

      const opts = this.buildSubmitStateRootOpts(latestBlock, isSource);
      await this.submitStateRoot(opts);

      await sleep(1000);
    }
  }

  private buildSubmitStateRootOpts(
    block: Block,
    isSource: boolean
  ): SubmitStateRootOpts {
    const opts: SubmitStateRootOpts = {
      address: rollups[this.l2PublicClient.chain.id],
      abi: Rollup,
      functionName: "commitOutputRoot",
      blockNumber: block.number as bigint,
      blockTimestamp: block.timestamp,
      stateRoot: block.stateRoot,
      chain: mockL1,
      walletClient: this.l1WalletClient,
      publicClient: this.l1PublicClient,
    };
    if (isSource) {
      opts.address = beaconContracts[this.l2PublicClient.chain.id];
      opts.abi = BeaconOracle;
      opts.functionName = "commitBeaconRoot";
      opts.chain = this.l2PublicClient.chain;
      opts.walletClient = this.l2WalletClient;
      opts.publicClient = this.l2PublicClient;
    }
    return opts;
  }

  private async submitStateRoot(opts: SubmitStateRootOpts): Promise<void> {
    const { blockNumber, blockTimestamp, stateRoot, ...rest } = opts;
    console.log("Submitting state root...");
    const hash = await opts.walletClient.writeContract({
      ...rest,
      args: [blockNumber, blockTimestamp, stateRoot],
      account: this.account,
    });
    await opts.publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction successful!");
  }
}
