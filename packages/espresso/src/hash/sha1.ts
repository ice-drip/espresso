import { rotateRight } from '../core/utils';

const H0 = [
  0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
];

function sha1Block(h: number[], block: Uint8Array): void {
  const w = new Array(80);
  for (let i = 0; i < 16; i++) {
    w[i] = ((block[i * 4] << 24) | (block[i * 4 + 1] << 16) | (block[i * 4 + 2] << 8) | block[i * 4 + 3]) >>> 0;
  }
  for (let i = 16; i < 80; i++) {
    const n = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
    w[i] = ((n << 1) | (n >>> 31)) >>> 0;
  }

  let [a, b, c, d, e] = h;

  for (let i = 0; i < 80; i++) {
    let f: number, k: number;
    if (i < 20) {
      f = ((b & c) | (~b & d)) >>> 0;
      k = 0x5a827999;
    } else if (i < 40) {
      f = (b ^ c ^ d) >>> 0;
      k = 0x6ed9eba1;
    } else if (i < 60) {
      f = ((b & c) | (b & d) | (c & d)) >>> 0;
      k = 0x8f1bbcdc;
    } else {
      f = (b ^ c ^ d) >>> 0;
      k = 0xca62c1d6;
    }

    const temp = (rotateRight(a, 27) + f + e + k + w[i]) | 0;
    e = d;
    d = c;
    c = rotateRight(b, 2);
    b = a;
    a = temp;
  }

  h[0] = (h[0] + a) | 0;
  h[1] = (h[1] + b) | 0;
  h[2] = (h[2] + c) | 0;
  h[3] = (h[3] + d) | 0;
  h[4] = (h[4] + e) | 0;
}

export function sha1(data: Uint8Array): Uint8Array {
  const msgLen = data.length;
  const totalLen = msgLen + 1 + 8;
  const paddedLen = Math.ceil(totalLen / 64) * 64;

  const padded = new Uint8Array(paddedLen);
  padded.set(data);
  padded[msgLen] = 0x80;

  const bitLen = msgLen * 8;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000) >>> 0, false);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);

  const h = H0.slice();

  for (let offset = 0; offset < paddedLen; offset += 64) {
    sha1Block(h, padded.subarray(offset, offset + 64));
  }

  const result = new Uint8Array(20);
  for (let i = 0; i < 5; i++) {
    result[i * 4] = (h[i] >>> 24) & 0xff;
    result[i * 4 + 1] = (h[i] >>> 16) & 0xff;
    result[i * 4 + 2] = (h[i] >>> 8) & 0xff;
    result[i * 4 + 3] = h[i] & 0xff;
  }
  return result;
}
