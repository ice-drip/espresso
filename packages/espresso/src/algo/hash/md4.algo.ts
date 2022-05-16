// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-math-trunc,jsdoc/require-jsdoc */
import { Hasher } from "../../core/hash/hasher";
import { WordArray } from "../../core/word-array";

const S = [
  [3, 7, 11, 19],
  [3, 5, 9, 13],
  [3, 9, 11, 15]
];
const FF = 0x00_00_00_00;
const GG = 0x5a_82_79_99;
const HH = 0x6e_d9_eb_a1;

function ROTL(num: number, cnt: number) {
  return (num << cnt) | (num >>> (32 - cnt));
}

function CC(
  // eslint-disable-next-line @typescript-eslint/ban-types
  f: (_x: number, _y: number, _z: number) => number,
  k: number,
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number
) {
  return ROTL(a + f(b, c, d) + x + k, s);
}

function FFF(x: number, y: number, z: number): number {
  return (x & y) | (~x & z);
}

function GGG(x: number, y: number, z: number): number {
  return (x & y) | (x & z) | (y & z);
}

function HHH(x: number, y: number, z: number): number {
  return x ^ y ^ z;
}

export class MD4Algo extends Hasher {
  private _hash!: WordArray;
  reset(): void {
    super.reset();
    this._hash = new WordArray([
      0x67_45_23_01, 0xef_cd_ab_89, 0x98_ba_dc_fe, 0x10_32_54_76
    ]);
  }
  public _doFinalize(): WordArray {
    // Shortcuts
    const data = this._data;
    const dataWords = data.words;

    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = data.sigBytes * 8;

    // Add padding
    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));

    const nBitsTotalH = Math.floor(nBitsTotal / 0x1_00_00_00_00);
    const nBitsTotalL = nBitsTotal;
    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] =
      (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00_ff_00_ff) |
      (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff_00_ff_00);
    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] =
      (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00_ff_00_ff) |
      (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff_00_ff_00);

    data.sigBytes = (dataWords.length + 1) * 4;

    // Hash final blocks
    this._process();

    // Shortcuts
    const hash = this._hash;
    const H = hash.words;

    // Swap endian
    for (let i = 0; i < 4; i++) {
      // Shortcut
      const H_i = H[i];

      H[i] =
        (((H_i << 8) | (H_i >>> 24)) & 0x00_ff_00_ff) |
        (((H_i << 24) | (H_i >>> 8)) & 0xff_00_ff_00);
    }

    // Return final computed hash
    return hash;
  }
  _doProcessBlock(M: number[], offset: number): void {
    // Swap endian
    for (let i = 0; i < 16; i++) {
      // Shortcuts
      const offset_i = offset + i;
      const M_offset_i = M[offset_i];

      M[offset_i] =
        (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00_ff_00_ff) |
        (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff_00_ff_00);
    }
    // Shortcuts
    const H = this._hash.words;

    const M_offset_0 = M[offset + 0];
    const M_offset_1 = M[offset + 1];
    const M_offset_2 = M[offset + 2];
    const M_offset_3 = M[offset + 3];
    const M_offset_4 = M[offset + 4];
    const M_offset_5 = M[offset + 5];
    const M_offset_6 = M[offset + 6];
    const M_offset_7 = M[offset + 7];
    const M_offset_8 = M[offset + 8];
    const M_offset_9 = M[offset + 9];
    const M_offset_10 = M[offset + 10];
    const M_offset_11 = M[offset + 11];
    const M_offset_12 = M[offset + 12];
    const M_offset_13 = M[offset + 13];
    const M_offset_14 = M[offset + 14];
    const M_offset_15 = M[offset + 15];

    // Working varialbes
    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];

    // Computation
    a = CC(FFF, FF, a, b, c, d, M_offset_0, S[0][0]);
    d = CC(FFF, FF, d, a, b, c, M_offset_1, S[0][1]);
    c = CC(FFF, FF, c, d, a, b, M_offset_2, S[0][2]);
    b = CC(FFF, FF, b, c, d, a, M_offset_3, S[0][3]);
    a = CC(FFF, FF, a, b, c, d, M_offset_4, S[0][0]);
    d = CC(FFF, FF, d, a, b, c, M_offset_5, S[0][1]);
    c = CC(FFF, FF, c, d, a, b, M_offset_6, S[0][2]);
    b = CC(FFF, FF, b, c, d, a, M_offset_7, S[0][3]);
    a = CC(FFF, FF, a, b, c, d, M_offset_8, S[0][0]);
    d = CC(FFF, FF, d, a, b, c, M_offset_9, S[0][1]);
    c = CC(FFF, FF, c, d, a, b, M_offset_10, S[0][2]);
    b = CC(FFF, FF, b, c, d, a, M_offset_11, S[0][3]);
    a = CC(FFF, FF, a, b, c, d, M_offset_12, S[0][0]);
    d = CC(FFF, FF, d, a, b, c, M_offset_13, S[0][1]);
    c = CC(FFF, FF, c, d, a, b, M_offset_14, S[0][2]);
    b = CC(FFF, FF, b, c, d, a, M_offset_15, S[0][3]);

    a = CC(GGG, GG, a, b, c, d, M_offset_0, S[1][0]);
    d = CC(GGG, GG, d, a, b, c, M_offset_4, S[1][1]);
    c = CC(GGG, GG, c, d, a, b, M_offset_8, S[1][2]);
    b = CC(GGG, GG, b, c, d, a, M_offset_12, S[1][3]);
    a = CC(GGG, GG, a, b, c, d, M_offset_1, S[1][0]);
    d = CC(GGG, GG, d, a, b, c, M_offset_5, S[1][1]);
    c = CC(GGG, GG, c, d, a, b, M_offset_9, S[1][2]);
    b = CC(GGG, GG, b, c, d, a, M_offset_13, S[1][3]);
    a = CC(GGG, GG, a, b, c, d, M_offset_2, S[1][0]);
    d = CC(GGG, GG, d, a, b, c, M_offset_6, S[1][1]);
    c = CC(GGG, GG, c, d, a, b, M_offset_10, S[1][2]);
    b = CC(GGG, GG, b, c, d, a, M_offset_14, S[1][3]);
    a = CC(GGG, GG, a, b, c, d, M_offset_3, S[1][0]);
    d = CC(GGG, GG, d, a, b, c, M_offset_7, S[1][1]);
    c = CC(GGG, GG, c, d, a, b, M_offset_11, S[1][2]);
    b = CC(GGG, GG, b, c, d, a, M_offset_15, S[1][3]);

    a = CC(HHH, HH, a, b, c, d, M_offset_0, S[2][0]);
    d = CC(HHH, HH, d, a, b, c, M_offset_8, S[2][1]);
    c = CC(HHH, HH, c, d, a, b, M_offset_4, S[2][2]);
    b = CC(HHH, HH, b, c, d, a, M_offset_12, S[2][3]);
    a = CC(HHH, HH, a, b, c, d, M_offset_2, S[2][0]);
    d = CC(HHH, HH, d, a, b, c, M_offset_10, S[2][1]);
    c = CC(HHH, HH, c, d, a, b, M_offset_6, S[2][2]);
    b = CC(HHH, HH, b, c, d, a, M_offset_14, S[2][3]);
    a = CC(HHH, HH, a, b, c, d, M_offset_1, S[2][0]);
    d = CC(HHH, HH, d, a, b, c, M_offset_9, S[2][1]);
    c = CC(HHH, HH, c, d, a, b, M_offset_5, S[2][2]);
    b = CC(HHH, HH, b, c, d, a, M_offset_13, S[2][3]);
    a = CC(HHH, HH, a, b, c, d, M_offset_3, S[2][0]);
    d = CC(HHH, HH, d, a, b, c, M_offset_11, S[2][1]);
    c = CC(HHH, HH, c, d, a, b, M_offset_7, S[2][2]);
    b = CC(HHH, HH, b, c, d, a, M_offset_15, S[2][3]);

    // Intermediate hash value
    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
  }
}
