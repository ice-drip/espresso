// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-math-trunc,jsdoc/require-jsdoc */

import { Hasher } from "../../core/hash/hasher";
import { WordArray } from "../../core/word-array";

// Constants table
const _zl = new WordArray([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15,
  3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11,
  5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7,
  12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
]);
const _zr = new WordArray([
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
  10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0,
  4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1,
  5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
]);
const _sl = new WordArray([
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7,
  15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5,
  12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5,
  11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
]);
const _sr = new WordArray([
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
  9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
  13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
  12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
]);

const _hl = new WordArray([
  0x00_00_00_00, 0x5a_82_79_99, 0x6e_d9_eb_a1, 0x8f_1b_bc_dc, 0xa9_53_fd_4e
]);
const _hr = new WordArray([
  0x50_a2_8b_e6, 0x5c_4d_d1_24, 0x6d_70_3e_f3, 0x7a_6d_76_e9, 0x00_00_00_00
]);

function f1(x: number, y: number, z: number): number {
  return x ^ y ^ z;
}

function f2(x: number, y: number, z: number): number {
  return (x & y) | (~x & z);
}

function f3(x: number, y: number, z: number): number {
  return (x | ~y) ^ z;
}

function f4(x: number, y: number, z: number): number {
  return (x & z) | (y & ~z);
}

function f5(x: number, y: number, z: number): number {
  return x ^ (y | ~z);
}

function rotl(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n));
}

export class RIPEMD320Algo extends Hasher {
  private _hash!: WordArray;

  reset(): void {
    super.reset();
    this._hash = new WordArray([
      0x67_45_23_01, 0xef_cd_ab_89, 0x98_ba_dc_fe, 0x10_32_54_76, 0xc3_d2_e1_f0,
      0x76_54_32_10, 0xfe_dc_ba_98, 0x89_ab_cd_ef, 0x01_23_45_67, 0x3c_2d_1e_0f
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
    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] =
      (((nBitsTotal << 8) | (nBitsTotal >>> 24)) & 0x00_ff_00_ff) |
      (((nBitsTotal << 24) | (nBitsTotal >>> 8)) & 0xff_00_ff_00);
    data.sigBytes = (dataWords.length + 1) * 4;

    // Hash final blocks
    this._process();

    // Shortcuts
    const hash = this._hash;
    const H = hash.words;

    // Swap endian
    for (let i = 0; i < 10; i++) {
      // Shortcut
      const H_i = H[i];

      // Swap
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

      // Swap
      M[offset_i] =
        (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00_ff_00_ff) |
        (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff_00_ff_00);
    }
    // Shortcut
    const H = this._hash.words;
    const hl = _hl.words;
    const hr = _hr.words;
    const zl = _zl.words;
    const zr = _zr.words;
    const sl = _sl.words;
    const sr = _sr.words;

    // Working variables
    let al, bl, cl, dl, el;
    let ar, br, cr, dr, er;

    al = H[0];
    bl = H[1];
    cl = H[2];
    dl = H[3];
    el = H[4];
    ar = H[5];
    br = H[6];
    cr = H[7];
    dr = H[8];
    er = H[9];
    // Computation
    let t;
    for (let i = 0; i < 80; i += 1) {
      t = (al + M[offset + zl[i]]) | 0;
      if (i < 16) {
        t += f1(bl, cl, dl) + hl[0];
      } else if (i < 32) {
        t += f2(bl, cl, dl) + hl[1];
      } else if (i < 48) {
        t += f3(bl, cl, dl) + hl[2];
      } else if (i < 64) {
        t += f4(bl, cl, dl) + hl[3];
      } else {
        t += f5(bl, cl, dl) + hl[4];
      }
      t = t | 0;
      t = rotl(t, sl[i]);
      t = (t + el) | 0;
      al = el;
      el = dl;
      dl = rotl(cl, 10);
      cl = bl;
      bl = t;

      t = (ar + M[offset + zr[i]]) | 0;
      if (i < 16) {
        t += f5(br, cr, dr) + hr[0];
      } else if (i < 32) {
        t += f4(br, cr, dr) + hr[1];
      } else if (i < 48) {
        t += f3(br, cr, dr) + hr[2];
      } else if (i < 64) {
        t += f2(br, cr, dr) + hr[3];
      } else {
        // if (i<80) {
        t += f1(br, cr, dr) + hr[4];
      }
      t = t | 0;
      t = rotl(t, sr[i]);
      t = (t + er) | 0;
      ar = er;
      er = dr;
      dr = rotl(cr, 10);
      cr = br;
      br = t;

      if (i == 15) {
        t = bl;
        bl = br;
        br = t;
      } else if (i == 31) {
        t = dl;
        dl = dr;
        dr = t;
      } else if (i == 47) {
        t = al;
        al = ar;
        ar = t;
      } else if (i == 63) {
        t = cl;
        cl = cr;
        cr = t;
      } else if (i == 79) {
        t = el;
        el = er;
        er = t;
      }
    }
    // Intermediate hash value
    H[0] = (H[0] + al) | 0;
    H[1] = (H[1] + bl) | 0;
    H[2] = (H[2] + cl) | 0;
    H[3] = (H[3] + dl) | 0;
    H[4] = (H[4] + el) | 0;
    H[5] = (H[5] + ar) | 0;
    H[6] = (H[6] + br) | 0;
    H[7] = (H[7] + cr) | 0;
    H[8] = (H[8] + dr) | 0;
    H[9] = (H[9] + er) | 0;
  }
}
