import { WordArray } from "../core/word-array";
import { Padding } from "../typings/padding.typing";

import { ZeroPadding } from "./zero-padding";

export const ISO97971: Padding = {
  pad(data: WordArray, blockSize: number): void {
    // eslint-disable-next-line unicorn/prefer-spread
    data.concat(new WordArray([0x80_00_00_00], 1));

    // Zero pad the rest
    ZeroPadding.pad(data, blockSize);
  },
  unpad(data: WordArray): void {
    ZeroPadding.unpad(data);
    // Unpad
    data.sigBytes--;
  }
};
