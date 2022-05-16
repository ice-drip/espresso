// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-math-trunc */
import { Hasher } from "../../core/hash/hasher";
import { WordArray } from "../../core/word-array";

// Reusable object
const W: Array<number> = [];

/**
 * SHA1算法
 *
 * @author rikka
 * @exports
 * @class SHA1Algo
 * @augments {Hasher}
 */
export class SHA1Algo extends Hasher {
  private _hash!: WordArray;

  reset(): void {
    super.reset();
    this._hash = new WordArray([
      0x67_45_23_01, 0xef_cd_ab_89, 0x98_ba_dc_fe, 0x10_32_54_76, 0xc3_d2_e1_f0
    ]);
  }
  public _doFinalize(): WordArray {
    const data = this._data;
    const dataWords = data.words;

    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = data.sigBytes * 8;

    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
      nBitsTotal / 0x1_00_00_00_00
    );
    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
    data.sigBytes = dataWords.length * 4;
    this._process();
    return this._hash;
  }

  _doProcessBlock(M: number[], offset: number): void {
    const H = this._hash.words;

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];

    for (let i = 0; i < 80; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
        W[i] = (n << 1) | (n >>> 31);
      }

      let t = ((a << 5) | (a >>> 27)) + e + W[i];
      if (i < 20) {
        t += ((b & c) | (~b & d)) + 0x5a_82_79_99;
      } else if (i < 40) {
        t += (b ^ c ^ d) + 0x6e_d9_eb_a1;
      } else if (i < 60) {
        t += ((b & c) | (b & d) | (c & d)) - 0x70_e4_43_24;
      } /* if (i < 80) */ else {
        t += (b ^ c ^ d) - 0x35_9d_3e_2a;
      }

      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
  }
}
