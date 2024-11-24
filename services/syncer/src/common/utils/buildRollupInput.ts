import {
  encodePacked,
  keccak256,
  zeroHash,
  type Chain,
  type WalletClient,
} from "viem";

import Rollup from "../../abis/Rollup";
import { mockL1 } from "../../chains/mockL1";
import { chainA } from "../../chains/chainA";
import { chainB } from "../../chains/chainB";
import type {
  PublicClientWithChain,
  SubmitStateRootOpts,
} from "../../types/syncer.types";
import MockArbitrumRollup from "../../abis/MockArbitrumRollup";
import MockOPStackRollup from "../../abis/MockOPStackRollup";

const rollups = {
  [chainA.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [chainB.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
} as any;

export default function buildRollupInput(
  block: any,
  chain: Chain,
  walletClient: WalletClient,
  publicClient: PublicClientWithChain
): SubmitStateRootOpts {
  switch (process.env.MODE) {
    case "arbitrum": // this is untested
      const node = {
        stateHash: block.stateRoot,
        challengeHash: keccak256(block.extraData),
        confirmData: keccak256(
          encodePacked(["bytes32", "bytes"], [block.hash, block.extraData])
        ),
      };
      return {
        address: rollups[chain.id],
        abi: MockArbitrumRollup,
        functionName: "commitNode",
        chain: mockL1,
        args: [block.number, node],
        walletClient,
        publicClient,
      };
    case "opstack":
      const messagePasserStorageRoot =
        "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421";
      const outputRoot = keccak256(
        encodePacked(
          ["bytes32", "bytes32", "bytes32", "bytes32"],
          [zeroHash, block.stateRoot, messagePasserStorageRoot, block.hash]
        )
      );
      return {
        address: rollups[chain.id],
        abi: MockOPStackRollup,
        functionName: "commitOutputRoot",
        chain: mockL1,
        args: [block.number, outputRoot],
        walletClient,
        publicClient,
      };
    default:
      return {
        address: rollups[chain.id],
        abi: Rollup,
        functionName: "commitOutputRoot",
        chain: mockL1,
        args: [block.number, block.timestamp, block.stateRoot],
        walletClient,
        publicClient,
      };
  }
}
