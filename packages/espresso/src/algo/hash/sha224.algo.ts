import { WordArray } from "../../core/word-array";

import { SHA256Algo } from "./sha256.algo";

/**
 * SHA224算法
 *
 * @author rikka
 * @exports
 * @class SHA224Algo
 * @augments {SHA256Algo}
 */
export class SHA224Algo extends SHA256Algo {
  reset(): void {
    super.reset();
    this._hash = new WordArray([
      0xc1_05_9e_d8, 0x36_7c_d5_07, 0x30_70_dd_17, 0xf7_0e_59_39, 0xff_c0_0b_31,
      0x68_58_15_11, 0x64_f9_8f_a7, 0xbe_fa_4f_a4
    ]);
  }

  public _doFinalize(): WordArray {
    const hash = super._doFinalize.call(this);
    hash.sigBytes -= 4;
    return hash;
  }
}
