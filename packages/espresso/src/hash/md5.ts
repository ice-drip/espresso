

const T: number[] = [];
for (let i = 0; i < 64; i++) {
  T[i] = (Math.abs(Math.sin(i + 1)) * 0x1_00_00_00_00) | 0;
}

function FF(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  const n = a + ((b & c) | (~b & d)) + x + t;
  return ((n << s) | (n >>> (32 - s))) + b;
}

function GG(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  const n = a + ((b & d) | (c & ~d)) + x + t;
  return ((n << s) | (n >>> (32 - s))) + b;
}

function HH(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  const n = a + (b ^ c ^ d) + x + t;
  return ((n << s) | (n >>> (32 - s))) + b;
}

function II(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  const n = a + (c ^ (b | ~d)) + x + t;
  return ((n << s) | (n >>> (32 - s))) + b;
}

function wordsToBytes(words: number[]): Uint8Array {
  const bytes = new Uint8Array(words.length * 4);
  for (let i = 0; i < words.length; i++) {
    bytes[i * 4] = words[i] & 0xff;
    bytes[i * 4 + 1] = (words[i] >>> 8) & 0xff;
    bytes[i * 4 + 2] = (words[i] >>> 16) & 0xff;
    bytes[i * 4 + 3] = (words[i] >>> 24) & 0xff;
  }
  return bytes;
}

export function md5(data: Uint8Array): Uint8Array {
  const msg = new Uint8Array(data.length + 1);
  msg.set(data);
  msg[data.length] = 0x80;

  const nBitsTotal = data.length * 8;
  let paddedLength = msg.length;
  while (paddedLength % 64 !== 56) {
    paddedLength++;
  }
  paddedLength += 8;

  const padded = new Uint8Array(paddedLength);
  padded.set(msg);
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 8, nBitsTotal >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(nBitsTotal / 0x1_00_00_00_00), true);

  let h0 = 0x67_45_23_01;
  let h1 = 0xef_cd_ab_89;
  let h2 = 0x98_ba_dc_fe;
  let h3 = 0x10_32_54_76;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const M: number[] = [];
    for (let i = 0; i < 16; i++) {
      const idx = offset + i * 4;
      M[i] =
        (padded[idx] |
          (padded[idx + 1] << 8) |
          (padded[idx + 2] << 16) |
          (padded[idx + 3] << 24)) >>>
        0;
    }

    let a = h0,
      b = h1,
      c = h2,
      d = h3;

    // Round 1
    a = FF(a, b, c, d, M[0], 7, T[0]);
    d = FF(d, a, b, c, M[1], 12, T[1]);
    c = FF(c, d, a, b, M[2], 17, T[2]);
    b = FF(b, c, d, a, M[3], 22, T[3]);
    a = FF(a, b, c, d, M[4], 7, T[4]);
    d = FF(d, a, b, c, M[5], 12, T[5]);
    c = FF(c, d, a, b, M[6], 17, T[6]);
    b = FF(b, c, d, a, M[7], 22, T[7]);
    a = FF(a, b, c, d, M[8], 7, T[8]);
    d = FF(d, a, b, c, M[9], 12, T[9]);
    c = FF(c, d, a, b, M[10], 17, T[10]);
    b = FF(b, c, d, a, M[11], 22, T[11]);
    a = FF(a, b, c, d, M[12], 7, T[12]);
    d = FF(d, a, b, c, M[13], 12, T[13]);
    c = FF(c, d, a, b, M[14], 17, T[14]);
    b = FF(b, c, d, a, M[15], 22, T[15]);

    // Round 2
    a = GG(a, b, c, d, M[1], 5, T[16]);
    d = GG(d, a, b, c, M[6], 9, T[17]);
    c = GG(c, d, a, b, M[11], 14, T[18]);
    b = GG(b, c, d, a, M[0], 20, T[19]);
    a = GG(a, b, c, d, M[5], 5, T[20]);
    d = GG(d, a, b, c, M[10], 9, T[21]);
    c = GG(c, d, a, b, M[15], 14, T[22]);
    b = GG(b, c, d, a, M[4], 20, T[23]);
    a = GG(a, b, c, d, M[9], 5, T[24]);
    d = GG(d, a, b, c, M[14], 9, T[25]);
    c = GG(c, d, a, b, M[3], 14, T[26]);
    b = GG(b, c, d, a, M[8], 20, T[27]);
    a = GG(a, b, c, d, M[13], 5, T[28]);
    d = GG(d, a, b, c, M[2], 9, T[29]);
    c = GG(c, d, a, b, M[7], 14, T[30]);
    b = GG(b, c, d, a, M[12], 20, T[31]);

    // Round 3
    a = HH(a, b, c, d, M[5], 4, T[32]);
    d = HH(d, a, b, c, M[8], 11, T[33]);
    c = HH(c, d, a, b, M[11], 16, T[34]);
    b = HH(b, c, d, a, M[14], 23, T[35]);
    a = HH(a, b, c, d, M[1], 4, T[36]);
    d = HH(d, a, b, c, M[4], 11, T[37]);
    c = HH(c, d, a, b, M[7], 16, T[38]);
    b = HH(b, c, d, a, M[10], 23, T[39]);
    a = HH(a, b, c, d, M[13], 4, T[40]);
    d = HH(d, a, b, c, M[0], 11, T[41]);
    c = HH(c, d, a, b, M[3], 16, T[42]);
    b = HH(b, c, d, a, M[6], 23, T[43]);
    a = HH(a, b, c, d, M[9], 4, T[44]);
    d = HH(d, a, b, c, M[12], 11, T[45]);
    c = HH(c, d, a, b, M[15], 16, T[46]);
    b = HH(b, c, d, a, M[2], 23, T[47]);

    // Round 4
    a = II(a, b, c, d, M[0], 6, T[48]);
    d = II(d, a, b, c, M[7], 10, T[49]);
    c = II(c, d, a, b, M[14], 15, T[50]);
    b = II(b, c, d, a, M[5], 21, T[51]);
    a = II(a, b, c, d, M[12], 6, T[52]);
    d = II(d, a, b, c, M[3], 10, T[53]);
    c = II(c, d, a, b, M[10], 15, T[54]);
    b = II(b, c, d, a, M[1], 21, T[55]);
    a = II(a, b, c, d, M[8], 6, T[56]);
    d = II(d, a, b, c, M[15], 10, T[57]);
    c = II(c, d, a, b, M[6], 15, T[58]);
    b = II(b, c, d, a, M[13], 21, T[59]);
    a = II(a, b, c, d, M[4], 6, T[60]);
    d = II(d, a, b, c, M[11], 10, T[61]);
    c = II(c, d, a, b, M[2], 15, T[62]);
    b = II(b, c, d, a, M[9], 21, T[63]);

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
  }

  return wordsToBytes([h0, h1, h2, h3]);
}
