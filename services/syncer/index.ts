import { chainA } from "./src/chains/chainA";
import { chainB } from "./src/chains/chainB";
import Syncer from "./src/syncer";

async function main() {
  const chainAKey = process.env.CHAIN_A_KEY as `0x${string}`;
  const chainBKey = process.env.CHAIN_B_KEY as `0x${string}`;

  const syncerA = new Syncer(chainA, chainAKey);
  const syncerB = new Syncer(chainB, chainBKey);

  await Promise.all([syncerA.monitorChains(), syncerB.monitorChains()]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
