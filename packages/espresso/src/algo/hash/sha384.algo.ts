import { WordArray } from "../../core/word-array";
import { X64Word, X64WordArray } from "../../core/x64-word";

import { SHA512Algo } from "./sha512.algo";

/**
 * SHA384算法
 *
 * @author rikka
 * @exports
 * @class SHA384Algo
 * @augments {SHA512Algo}
 */
export class SHA384Algo extends SHA512Algo {
  reset(): void {
    super.reset();
    this._hash = new X64WordArray([
      new X64Word(0xcb_bb_9d_5d, 0xc1_05_9e_d8),
      new X64Word(0x62_9a_29_2a, 0x36_7c_d5_07),
      new X64Word(0x91_59_01_5a, 0x30_70_dd_17),
      new X64Word(0x15_2f_ec_d8, 0xf7_0e_59_39),
      new X64Word(0x67_33_26_67, 0xff_c0_0b_31),
      new X64Word(0x8e_b4_4a_87, 0x68_58_15_11),
      new X64Word(0xdb_0c_2e_0d, 0x64_f9_8f_a7),
      new X64Word(0x47_b5_48_1d, 0xbe_fa_4f_a4)
    ]);
  }

  _doFinalize(): WordArray {
    const hash = super._doFinalize.call(this);
    hash.sigBytes -= 16;
    return hash;
  }
}
