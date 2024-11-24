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
import type {
  PublicClientWithChain,
  SubmitStateRootOpts,
} from "./types/syncer.types";
import deriveBeaconRoot from "./common/utils/deriveBeaconRoot";
import buildRollupInput from "./common/utils/buildRollupInput";

const beaconContracts = {
  [chainA.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [chainB.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
    const opts: SubmitStateRootOpts = buildRollupInput(
      block,
      this.l2PublicClient.chain,
      this.l1WalletClient,
      this.l1PublicClient
    );
    if (isSource) {
      opts.address = beaconContracts[this.l2PublicClient.chain.id];
      opts.abi = BeaconOracle;
      opts.functionName = "commitBeaconRoot";
      opts.chain = this.l2PublicClient.chain;
      opts.walletClient = this.l2WalletClient;
      opts.publicClient = this.l2PublicClient;
      opts.args = [
        block.number,
        block.timestamp,
        deriveBeaconRoot(block.stateRoot),
      ];
    }
    return opts;
  }

  private async submitStateRoot(opts: SubmitStateRootOpts): Promise<void> {
    console.log("Submitting state root...");
    const hash = await opts.walletClient.writeContract({
      ...opts,
      account: this.account,
    });
    await opts.publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction successful!");
  }
}
