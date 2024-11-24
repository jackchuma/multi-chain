import { sha256, encodePacked } from "viem";

import { MOCK_L1_STATE_ROOT_PROOF } from "../../constants";

export default function deriveBeaconRoot(curr: `0x${string}`): `0x${string}` {
  let index = 6434;
  const types = ["bytes32", "bytes32"];

  for (let i = 0; i < MOCK_L1_STATE_ROOT_PROOF.length; i++) {
    const preImage = [MOCK_L1_STATE_ROOT_PROOF[i], curr];

    if ((index & 1) === 0) {
      preImage.reverse();
    }

    curr = sha256(encodePacked(types, preImage));

    index >>= 1;
  }

  return curr;
}
