import { CipherOptions } from "../core/types";
import { pkcs7Pad, pkcs7Unpad } from "./padding/pkcs7";

const SBOX: number[] = [];
const INV_SBOX: number[] = [];
const SUB_MIX_0: number[] = [];
const SUB_MIX_1: number[] = [];
const SUB_MIX_2: number[] = [];
const SUB_MIX_3: number[] = [];
const INV_SUB_MIX_0: number[] = [];
const INV_SUB_MIX_1: number[] = [];
const INV_SUB_MIX_2: number[] = [];
const INV_SUB_MIX_3: number[] = [];

const d: number[] = [];
for (let i = 0; i < 256; i++) {
  if (i < 128) {
    d[i] = i << 1;
  } else {
    d[i] = (i << 1) ^ 0x11b;
  }
}

let x = 0;
let xi = 0;
for (let i = 0; i < 256; i++) {
  let sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
  sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
  SBOX[x] = sx;
  INV_SBOX[sx] = x;

  const x2 = d[x];
  const x4 = d[x2];
  const x8 = d[x4];

  let t = (d[sx] * 0x101) ^ (sx * 0x1010100);
  SUB_MIX_0[x] = (t << 24) | (t >>> 8);
  SUB_MIX_1[x] = (t << 16) | (t >>> 16);
  SUB_MIX_2[x] = (t << 8) | (t >>> 24);
  SUB_MIX_3[x] = t;

  t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
  INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
  INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
  INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
  INV_SUB_MIX_3[sx] = t;

  if (!x) {
    x = xi = 1;
  } else {
    x = x2 ^ d[d[d[x8 ^ x2]]];
    xi ^= d[d[xi]];
  }
}

const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

function expandKey(key: Uint8Array): {
  keySchedule: number[];
  invKeySchedule: number[];
  nRounds: number;
} {
  const keyWords: number[] = [];
  const keyLen = key.length;
  const nk = keyLen / 4;
  const nRounds = nk + 6;

  for (let i = 0; i < nk; i++) {
    keyWords[i] =
      (key[i * 4] << 24) | (key[i * 4 + 1] << 16) | (key[i * 4 + 2] << 8) | key[i * 4 + 3];
  }

  const ksRows = (nRounds + 1) * 4;
  const keySchedule: number[] = [];
  let t: number;

  for (let ksRow = 0; ksRow < ksRows; ksRow++) {
    if (ksRow < nk) {
      keySchedule[ksRow] = keyWords[ksRow];
    } else {
      t = keySchedule[ksRow - 1];
      if (!(ksRow % nk)) {
        t = (t << 8) | (t >>> 24);
        t =
          (SBOX[t >>> 24] << 24) |
          (SBOX[(t >>> 16) & 0xff] << 16) |
          (SBOX[(t >>> 8) & 0xff] << 8) |
          SBOX[t & 0xff];
        t ^= RCON[(ksRow / nk) | 0] << 24;
      } else if (nk > 6 && ksRow % nk === 4) {
        t =
          (SBOX[t >>> 24] << 24) |
          (SBOX[(t >>> 16) & 0xff] << 16) |
          (SBOX[(t >>> 8) & 0xff] << 8) |
          SBOX[t & 0xff];
      }
      keySchedule[ksRow] = keySchedule[ksRow - nk] ^ t;
    }
  }

  const invKeySchedule: number[] = [];
  for (let invKsRow = 0; invKsRow < ksRows; invKsRow++) {
    const ksRow = ksRows - invKsRow;
    t = invKsRow % 4 ? keySchedule[ksRow] : keySchedule[ksRow - 4];
    if (invKsRow < 4 || ksRow <= 4) {
      invKeySchedule[invKsRow] = t;
    } else {
      invKeySchedule[invKsRow] =
        INV_SUB_MIX_0[SBOX[t >>> 24]] ^
        INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
        INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^
        INV_SUB_MIX_3[SBOX[t & 0xff]];
    }
  }

  return { keySchedule, invKeySchedule, nRounds };
}

function doCryptBlock(
  state: number[],
  keySchedule: number[],
  subMix0: number[],
  subMix1: number[],
  subMix2: number[],
  subMix3: number[],
  sbox: number[],
  nRounds: number,
): void {
  let s0 = state[0] ^ keySchedule[0];
  let s1 = state[1] ^ keySchedule[1];
  let s2 = state[2] ^ keySchedule[2];
  let s3 = state[3] ^ keySchedule[3];
  let ksRow = 4;

  for (let round = 1; round < nRounds; round++) {
    const t0 =
      subMix0[s0 >>> 24] ^
      subMix1[(s1 >>> 16) & 0xff] ^
      subMix2[(s2 >>> 8) & 0xff] ^
      subMix3[s3 & 0xff] ^
      keySchedule[ksRow++];
    const t1 =
      subMix0[s1 >>> 24] ^
      subMix1[(s2 >>> 16) & 0xff] ^
      subMix2[(s3 >>> 8) & 0xff] ^
      subMix3[s0 & 0xff] ^
      keySchedule[ksRow++];
    const t2 =
      subMix0[s2 >>> 24] ^
      subMix1[(s3 >>> 16) & 0xff] ^
      subMix2[(s0 >>> 8) & 0xff] ^
      subMix3[s1 & 0xff] ^
      keySchedule[ksRow++];
    const t3 =
      subMix0[s3 >>> 24] ^
      subMix1[(s0 >>> 16) & 0xff] ^
      subMix2[(s1 >>> 8) & 0xff] ^
      subMix3[s2 & 0xff] ^
      keySchedule[ksRow++];
    s0 = t0;
    s1 = t1;
    s2 = t2;
    s3 = t3;
  }

  const u0 =
    ((sbox[s0 >>> 24] << 24) |
      (sbox[(s1 >>> 16) & 0xff] << 16) |
      (sbox[(s2 >>> 8) & 0xff] << 8) |
      sbox[s3 & 0xff]) ^
    keySchedule[ksRow++];
  const u1 =
    ((sbox[s1 >>> 24] << 24) |
      (sbox[(s2 >>> 16) & 0xff] << 16) |
      (sbox[(s3 >>> 8) & 0xff] << 8) |
      sbox[s0 & 0xff]) ^
    keySchedule[ksRow++];
  const u2 =
    ((sbox[s2 >>> 24] << 24) |
      (sbox[(s3 >>> 16) & 0xff] << 16) |
      (sbox[(s0 >>> 8) & 0xff] << 8) |
      sbox[s1 & 0xff]) ^
    keySchedule[ksRow++];
  const u3 =
    ((sbox[s3 >>> 24] << 24) |
      (sbox[(s0 >>> 16) & 0xff] << 16) |
      (sbox[(s1 >>> 8) & 0xff] << 8) |
      sbox[s2 & 0xff]) ^
    keySchedule[ksRow];

  state[0] = u0;
  state[1] = u1;
  state[2] = u2;
  state[3] = u3;
}

function encryptBlock(block: Uint8Array, keySchedule: number[], nRounds: number): void {
  const state = [
    (block[0] << 24) | (block[1] << 16) | (block[2] << 8) | block[3],
    (block[4] << 24) | (block[5] << 16) | (block[6] << 8) | block[7],
    (block[8] << 24) | (block[9] << 16) | (block[10] << 8) | block[11],
    (block[12] << 24) | (block[13] << 16) | (block[14] << 8) | block[15],
  ];

  doCryptBlock(state, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX, nRounds);

  block[0] = (state[0] >>> 24) & 0xff;
  block[1] = (state[0] >>> 16) & 0xff;
  block[2] = (state[0] >>> 8) & 0xff;
  block[3] = state[0] & 0xff;
  block[4] = (state[1] >>> 24) & 0xff;
  block[5] = (state[1] >>> 16) & 0xff;
  block[6] = (state[1] >>> 8) & 0xff;
  block[7] = state[1] & 0xff;
  block[8] = (state[2] >>> 24) & 0xff;
  block[9] = (state[2] >>> 16) & 0xff;
  block[10] = (state[2] >>> 8) & 0xff;
  block[11] = state[2] & 0xff;
  block[12] = (state[3] >>> 24) & 0xff;
  block[13] = (state[3] >>> 16) & 0xff;
  block[14] = (state[3] >>> 8) & 0xff;
  block[15] = state[3] & 0xff;
}

function decryptBlock(block: Uint8Array, invKeySchedule: number[], nRounds: number): void {
  const state = [
    (block[0] << 24) | (block[1] << 16) | (block[2] << 8) | block[3],
    (block[4] << 24) | (block[5] << 16) | (block[6] << 8) | block[7],
    (block[8] << 24) | (block[9] << 16) | (block[10] << 8) | block[11],
    (block[12] << 24) | (block[13] << 16) | (block[14] << 8) | block[15],
  ];

  let t = state[1];
  state[1] = state[3];
  state[3] = t;

  doCryptBlock(
    state,
    invKeySchedule,
    INV_SUB_MIX_0,
    INV_SUB_MIX_1,
    INV_SUB_MIX_2,
    INV_SUB_MIX_3,
    INV_SBOX,
    nRounds,
  );

  t = state[1];
  state[1] = state[3];
  state[3] = t;

  block[0] = (state[0] >>> 24) & 0xff;
  block[1] = (state[0] >>> 16) & 0xff;
  block[2] = (state[0] >>> 8) & 0xff;
  block[3] = state[0] & 0xff;
  block[4] = (state[1] >>> 24) & 0xff;
  block[5] = (state[1] >>> 16) & 0xff;
  block[6] = (state[1] >>> 8) & 0xff;
  block[7] = state[1] & 0xff;
  block[8] = (state[2] >>> 24) & 0xff;
  block[9] = (state[2] >>> 16) & 0xff;
  block[10] = (state[2] >>> 8) & 0xff;
  block[11] = state[2] & 0xff;
  block[12] = (state[3] >>> 24) & 0xff;
  block[13] = (state[3] >>> 16) & 0xff;
  block[14] = (state[3] >>> 8) & 0xff;
  block[15] = state[3] & 0xff;
}

export function aesEncrypt(data: Uint8Array, key: Uint8Array, opts: CipherOptions): Uint8Array {
  const { keySchedule, nRounds } = expandKey(key);
  const mode = opts.mode ?? "cbc";
  const iv = typeof opts.iv === "string" ? hexToBytes(opts.iv) : opts.iv;
  const padding = opts.padding ?? "pkcs7";

  let padded = data;
  if (padding === "pkcs7") {
    padded = pkcs7Pad(data, 16);
  }

  const result = new Uint8Array(padded.length);
  const block = new Uint8Array(16);
  let prevBlock = iv ?? new Uint8Array(16);

  for (let i = 0; i < padded.length; i += 16) {
    const currentBlock = padded.slice(i, i + 16);

    if (mode === "cbc") {
      for (let j = 0; j < 16; j++) {
        block[j] = currentBlock[j] ^ prevBlock[j];
      }
      encryptBlock(block, keySchedule, nRounds);
      result.set(block, i);
      prevBlock = block.slice();
    } else if (mode === "ecb") {
      block.set(currentBlock);
      encryptBlock(block, keySchedule, nRounds);
      result.set(block, i);
    }
  }

  return result;
}

export function aesDecrypt(data: Uint8Array, key: Uint8Array, opts: CipherOptions): Uint8Array {
  const { invKeySchedule, nRounds } = expandKey(key);
  const mode = opts.mode ?? "cbc";
  const iv = typeof opts.iv === "string" ? hexToBytes(opts.iv) : opts.iv;
  const padding = opts.padding ?? "pkcs7";

  const result = new Uint8Array(data.length);
  const block = new Uint8Array(16);
  let prevBlock = iv ?? new Uint8Array(16);

  for (let i = 0; i < data.length; i += 16) {
    const currentBlock = data.slice(i, i + 16);

    if (mode === "cbc") {
      block.set(currentBlock);
      decryptBlock(block, invKeySchedule, nRounds);
      for (let j = 0; j < 16; j++) {
        result[i + j] = block[j] ^ prevBlock[j];
      }
      prevBlock = currentBlock.slice();
    } else if (mode === "ecb") {
      block.set(currentBlock);
      decryptBlock(block, invKeySchedule, nRounds);
      result.set(block, i);
    }
  }

  if (padding === "pkcs7") {
    return pkcs7Unpad(result);
  }
  return result;
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
