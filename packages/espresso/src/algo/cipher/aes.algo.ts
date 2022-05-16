import { BlockCipher } from "../../core/cipher/block-cipher";
import { WordArray } from "../../core/word-array";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

// Lookup tables
const _SBOX: number[] = [];
const INV_SBOX: number[] = [];
const _SUB_MIX_0: number[] = [];
const _SUB_MIX_1: number[] = [];
const _SUB_MIX_2: number[] = [];
const _SUB_MIX_3: number[] = [];
const INV_SUB_MIX_0: number[] = [];
const INV_SUB_MIX_1: number[] = [];
const INV_SUB_MIX_2: number[] = [];
const INV_SUB_MIX_3: number[] = [];

// Compute lookup tables

// Compute double table
const d = [];
for (let i = 0; i < 256; i++) {
  if (i < 128) {
    d[i] = i << 1;
  } else {
    d[i] = (i << 1) ^ 0x1_1b;
  }
}

// Walk GF(2^8)
let x = 0;
let xi = 0;
for (let i = 0; i < 256; i++) {
  // Compute sbox
  let sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
  sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
  _SBOX[x] = sx;
  INV_SBOX[sx] = x;

  // Compute multiplication
  const x2 = d[x];
  const x4 = d[x2];
  const x8 = d[x4];

  // Compute sub bytes, mix columns tables
  let t = (d[sx] * 0x1_01) ^ (sx * 0x1_01_01_00);
  _SUB_MIX_0[x] = (t << 24) | (t >>> 8);
  _SUB_MIX_1[x] = (t << 16) | (t >>> 16);
  _SUB_MIX_2[x] = (t << 8) | (t >>> 24);
  _SUB_MIX_3[x] = t;

  // Compute inv sub bytes, inv mix columns tables
  t =
    (x8 * 0x1_01_01_01) ^ (x4 * 0x1_00_01) ^ (x2 * 0x1_01) ^ (x * 0x1_01_01_00);
  INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
  INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
  INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
  INV_SUB_MIX_3[sx] = t;

  // Compute next counter
  if (!x) {
    x = xi = 1;
  } else {
    x = x2 ^ d[d[d[x8 ^ x2]]];
    xi ^= d[d[xi]];
  }
}

// Precomputed Rcon lookup
const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

export class AESAlgo extends BlockCipher {
  public static keySize = 256 / 32;

  _nRounds!: number;

  _keyPriorReset!: WordArray;

  _keySchedule!: Array<number>;

  _invKeySchedule!: Array<number>;

  constructor(
    xformMode: number,
    key: WordArray,
    cfg?: BufferedBlockAlgorithmConfig
  ) {
    super(xformMode, key, cfg);
  }

  public encryptBlock(M: number[], offset: number): void {
    this._doCryptBlock(
      M,
      offset,
      this._keySchedule,
      _SUB_MIX_0,
      _SUB_MIX_1,
      _SUB_MIX_2,
      _SUB_MIX_3,
      _SBOX
    );
  }
  public decryptBlock(M: number[], offset: number): void {
    const _M = M;
    let t = _M[offset + 1];
    _M[offset + 1] = _M[offset + 3];
    _M[offset + 3] = t;
    this._doCryptBlock(
      _M,
      offset,
      this._invKeySchedule,
      INV_SUB_MIX_0,
      INV_SUB_MIX_1,
      INV_SUB_MIX_2,
      INV_SUB_MIX_3,
      INV_SBOX
    );
    t = _M[offset + 1];
    _M[offset + 1] = _M[offset + 3];
    _M[offset + 3] = t;
  }

  public reset(): void {
    super.reset();
    let t: number;
    if (this._nRounds && this._keyPriorReset === this._key) {
      return;
    }
    this._keyPriorReset = this._key;
    const key = this._keyPriorReset;
    const keyWords = key.words;
    const keySize = key.sigBytes / 4;

    this._nRounds = keySize + 6;
    const nRounds = this._nRounds;

    const ksRows = (nRounds + 1) * 4;

    this._keySchedule = [];
    const keySchedule = this._keySchedule;
    for (let ksRow = 0; ksRow < ksRows; ksRow++) {
      if (ksRow < keySize) {
        keySchedule[ksRow] = keyWords[ksRow];
      } else {
        t = keySchedule[ksRow - 1];
        if (!(ksRow % keySize)) {
          // Rot word
          t = (t << 8) | (t >>> 24);

          // Sub word
          t =
            (_SBOX[t >>> 24] << 24) |
            (_SBOX[(t >>> 16) & 0xff] << 16) |
            (_SBOX[(t >>> 8) & 0xff] << 8) |
            _SBOX[t & 0xff];

          // Mix Rcon
          // eslint-disable-next-line unicorn/prefer-math-trunc
          t ^= RCON[(ksRow / keySize) | 0] << 24;
        } else if (keySize > 6 && ksRow % keySize == 4) {
          // Sub word
          t =
            (_SBOX[t >>> 24] << 24) |
            (_SBOX[(t >>> 16) & 0xff] << 16) |
            (_SBOX[(t >>> 8) & 0xff] << 8) |
            _SBOX[t & 0xff];
        }
        keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
      }
    }

    this._invKeySchedule = [];
    const invKeySchedule = this._invKeySchedule;
    for (let invKsRow = 0; invKsRow < ksRows; invKsRow++) {
      const ksRow = ksRows - invKsRow;

      t = invKsRow % 4 ? keySchedule[ksRow] : keySchedule[ksRow - 4];
      if (invKsRow < 4 || ksRow <= 4) {
        invKeySchedule[invKsRow] = t;
      } else {
        invKeySchedule[invKsRow] =
          INV_SUB_MIX_0[_SBOX[t >>> 24]] ^
          INV_SUB_MIX_1[_SBOX[(t >>> 16) & 0xff]] ^
          INV_SUB_MIX_2[_SBOX[(t >>> 8) & 0xff]] ^
          INV_SUB_MIX_3[_SBOX[t & 0xff]];
      }
    }
  }

  _doCryptBlock(
    M: number[],
    offset: number,
    keySchedule: number[],
    SUB_MIX_0: number[],
    SUB_MIX_1: number[],
    SUB_MIX_2: number[],
    SUB_MIX_3: number[],
    SBOX: number[]
  ): void {
    const _M = M;

    // Shortcut
    const nRounds = this._nRounds;

    // Get input, add round key
    let s0 = _M[offset] ^ keySchedule[0];
    let s1 = _M[offset + 1] ^ keySchedule[1];
    let s2 = _M[offset + 2] ^ keySchedule[2];
    let s3 = _M[offset + 3] ^ keySchedule[3];

    // Key schedule row counter
    let ksRow = 4;

    // Rounds
    for (let round = 1; round < nRounds; round++) {
      // Shift rows, sub bytes, mix columns, add round key

      const t0 =
        SUB_MIX_0[s0 >>> 24] ^
        SUB_MIX_1[(s1 >>> 16) & 0xff] ^
        SUB_MIX_2[(s2 >>> 8) & 0xff] ^
        SUB_MIX_3[s3 & 0xff] ^
        keySchedule[ksRow++];
      const t1 =
        SUB_MIX_0[s1 >>> 24] ^
        SUB_MIX_1[(s2 >>> 16) & 0xff] ^
        SUB_MIX_2[(s3 >>> 8) & 0xff] ^
        SUB_MIX_3[s0 & 0xff] ^
        keySchedule[ksRow++];
      const t2 =
        SUB_MIX_0[s2 >>> 24] ^
        SUB_MIX_1[(s3 >>> 16) & 0xff] ^
        SUB_MIX_2[(s0 >>> 8) & 0xff] ^
        SUB_MIX_3[s1 & 0xff] ^
        keySchedule[ksRow++];
      const t3 =
        SUB_MIX_0[s3 >>> 24] ^
        SUB_MIX_1[(s0 >>> 16) & 0xff] ^
        SUB_MIX_2[(s1 >>> 8) & 0xff] ^
        SUB_MIX_3[s2 & 0xff] ^
        keySchedule[ksRow++];

      // Update state
      s0 = t0;
      s1 = t1;
      s2 = t2;
      s3 = t3;
    }

    // Shift rows, sub bytes, add round key
    const t0 =
      ((SBOX[s0 >>> 24] << 24) |
        (SBOX[(s1 >>> 16) & 0xff] << 16) |
        (SBOX[(s2 >>> 8) & 0xff] << 8) |
        SBOX[s3 & 0xff]) ^
      keySchedule[ksRow++];
    const t1 =
      ((SBOX[s1 >>> 24] << 24) |
        (SBOX[(s2 >>> 16) & 0xff] << 16) |
        (SBOX[(s3 >>> 8) & 0xff] << 8) |
        SBOX[s0 & 0xff]) ^
      keySchedule[ksRow++];
    const t2 =
      ((SBOX[s2 >>> 24] << 24) |
        (SBOX[(s3 >>> 16) & 0xff] << 16) |
        (SBOX[(s0 >>> 8) & 0xff] << 8) |
        SBOX[s1 & 0xff]) ^
      keySchedule[ksRow++];
    const t3 =
      ((SBOX[s3 >>> 24] << 24) |
        (SBOX[(s0 >>> 16) & 0xff] << 16) |
        (SBOX[(s1 >>> 8) & 0xff] << 8) |
        SBOX[s2 & 0xff]) ^
      keySchedule[ksRow++];

    // Set output
    _M[offset] = t0;
    _M[offset + 1] = t1;
    _M[offset + 2] = t2;
    _M[offset + 3] = t3;
  }
}
