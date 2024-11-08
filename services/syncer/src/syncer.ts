import { createPublicClient, createWalletClient, http, type Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sleep } from "bun";

import { chainA } from "./chains/chainA";
import { chainB } from "./chains/chainB";
import { mockL1 } from "./chains/mockL1";
import BeaconOracle from "./abis/BeaconOracle";
import Rollup from "./abis/Rollup";

const rollups = {
  [chainA.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [chainB.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
} as any;
const beaconContracts = {
  [chainA.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [chainB.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
} as any;

export default class Syncer {
  publicClient: any;
  sourceWallet: any;

  targetClient: any;
  targetWallet: any;

  constructor(targetChain: Chain, pKey: `0x${string}`) {
    this.publicClient = createPublicClient({
      chain: mockL1,
      transport: http(),
    });
    this.sourceWallet = createWalletClient({
      chain: mockL1,
      transport: http(),
      account: privateKeyToAccount(pKey),
    });

    this.targetClient = createPublicClient({
      chain: targetChain,
      transport: http(),
    });
    this.targetWallet = createWalletClient({
      chain: targetChain,
      transport: http(),
      account: privateKeyToAccount(pKey),
    });
  }

  async monitorChains() {
    await Promise.all([
      this.monitorChain(this.publicClient, true),
      this.monitorChain(this.targetClient, false),
    ]);
  }

  private async monitorChain(client: any, isSource: boolean) {
    console.log(`Monitoring ${client.chain.name} chain...`);
    let blockNumber = 0n;

    while (true) {
      const latestBlockNumber = await client.getBlockNumber();

      if (blockNumber >= latestBlockNumber) {
        await sleep(1000);
        continue;
      }

      blockNumber = latestBlockNumber;

      const block = await client.getBlock({ blockNumber });
      if (isSource) {
        await this.submitStateRootToTargetChain(
          blockNumber,
          block.timestamp,
          block.stateRoot
        );
      } else {
        await this.submitStateRootToSourceChain(
          blockNumber,
          block.timestamp,
          block.stateRoot
        );
      }

      await sleep(1000);
    }
  }

  async submitStateRootToTargetChain(
    blockNumber: bigint,
    blockTimestamp: bigint,
    stateRoot: string
  ) {
    console.log("Submitting state root to target chain...");
    const hash = await this.targetWallet.writeContract({
      address: beaconContracts[this.targetClient.chain.id],
      abi: BeaconOracle,
      functionName: "commitBeaconRoot",
      args: [blockNumber, blockTimestamp, stateRoot],
    });
    await this.targetClient.waitForTransactionReceipt({ hash });
    console.log("Transaction successful!");
  }

  async submitStateRootToSourceChain(
    blockNumber: bigint,
    blockTimestamp: bigint,
    stateRoot: string
  ) {
    console.log("Submitting state root to source chain...");
    const hash = await this.sourceWallet.writeContract({
      address: rollups[this.targetClient.chain.id],
      abi: Rollup,
      functionName: "commitOutputRoot",
      args: [blockNumber, blockTimestamp, stateRoot],
    });
    await this.publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction successful!");
  }
}
