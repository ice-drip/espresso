const BOX_SIZE = 8;

function rotateLeft32(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function add32(a: number, b: number): number {
  return (a + b) >>> 0;
}

function gFunction(x: number): number {
  const s = (x >>> 16) & 0xffff;
  const t = x & 0xffff;
  const gs = (((s * s) >>> 0) + s) >>> 0;
  const gt = (((t * t) >>> 0) + t) >>> 0;
  const gsLow = (gs & 0xffff) + (gs >>> 16);
  const gtLow = (gt & 0xffff) + (gt >>> 16);
  return (((gtLow << 16) | (gsLow & 0xffff)) >>> 0) ^ rotateLeft32(gsLow >>> 16, 16);
}

function nextCounter(c: Uint32Array): void {
  const J = [0x4D34D34D, 0xD34D34D3, 0x34D34D34, 0x4D34D34D, 0xD34D34D3, 0x34D34D34, 0x4D34D34D, 0xD34D34D3];
  for (let i = 0; i < BOX_SIZE; i++) {
    c[i] = add32(c[i], J[i]);
    if (i === 0) {
      if (c[0] < J[0] || (c[0] === J[0] && c[7] < 0xD34D34D3)) {
        // overflow handled by modular arithmetic
      }
    }
  }
}

function keySetup(key: Uint8Array, iv?: Uint8Array, legacy = false): { x: Uint32Array; c: Uint32Array } {
  const s = new Uint32Array(BOX_SIZE);
  const k = new Uint32Array(BOX_SIZE);

  for (let i = 0; i < BOX_SIZE; i++) {
    const offset = i * 4;
    if (legacy) {
      k[i] = ((key[offset + 3] << 24) | (key[offset + 2] << 16) | (key[offset + 1] << 8) | key[offset]) >>> 0;
    } else {
      k[i] = ((key[offset] << 24) | (key[offset + 1] << 16) | (key[offset + 2] << 8) | key[offset + 3]) >>> 0;
    }
  }

  const x = new Uint32Array(BOX_SIZE);
  const c = new Uint32Array(BOX_SIZE);

  x[0] = k[0]; x[1] = (k[3] << 16) | (k[2] >>> 16);
  x[2] = k[1]; x[3] = (k[0] << 16) | (k[3] >>> 16);
  x[4] = k[2]; x[5] = (k[1] << 16) | (k[0] >>> 16);
  x[6] = k[3]; x[7] = (k[2] << 16) | (k[1] >>> 16);

  if (iv) {
    c[0] = (iv[0] | (iv[1] << 8) | (iv[2] << 16) | (iv[3] << 24)) >>> 0;
    c[1] = ((iv[4] | (iv[5] << 8) | (iv[6] << 16) | (iv[7] << 24)) << 16) | ((iv[4] | (iv[5] << 8) | (iv[6] << 16) | (iv[7] << 24)) >>> 16);
    c[2] = ((iv[8] | (iv[9] << 8) | (iv[10] << 16) | (iv[11] << 24)) << 16) | ((iv[8] | (iv[9] << 8) | (iv[10] << 16) | (iv[11] << 24)) >>> 16);
    c[3] = (iv[12] | (iv[13] << 8) | (iv[14] << 16) | (iv[15] << 24)) >>> 0;
    c[4] = (c[0] << 16) | (c[2] >>> 16);
    c[5] = (c[3] << 16) | (c[1] >>> 16);
    c[6] = (c[2] << 16) | (c[0] >>> 16);
    c[7] = (c[1] << 16) | (c[3] >>> 16);
  }

  for (let i = 0; i < BOX_SIZE; i++) {
    s[i] = x[i] ^ c[i];
  }

  for (let i = 0; i < 4; i++) {
    nextCounter(c);
    for (let j = 0; j < BOX_SIZE; j++) {
      x[j] = add32(x[j], gFunction(add32(s[j], c[j])));
    }
    s[0] = x[0]; s[1] = x[6]; s[2] = x[4];
    s[3] = x[2]; s[4] = x[7]; s[5] = x[3];
    s[6] = x[5]; s[7] = x[1];
  }

  return { x: s, c };
}

function process(x: Uint32Array, c: Uint32Array, data: Uint8Array): Uint8Array {
  const result = new Uint8Array(data.length);
  const keystream = new Uint8Array(16);

  for (let offset = 0; offset < data.length; offset += 16) {
    const b = new Uint32Array(BOX_SIZE);
    for (let i = 0; i < BOX_SIZE; i++) b[i] = x[i];
    nextCounter(c);
    for (let i = 0; i < BOX_SIZE; i++) {
      x[i] = add32(x[i], gFunction(add32(b[i], c[i])));
    }
    const s = new Uint32Array(BOX_SIZE);
    s[0] = x[0] ^ c[5]; s[1] = x[1] ^ c[4];
    s[2] = x[2] ^ c[7]; s[3] = x[3] ^ c[6];
    s[4] = x[4] ^ c[1]; s[5] = x[5] ^ c[0];
    s[6] = x[6] ^ c[3]; s[7] = x[7] ^ c[2];
    for (let i = 0; i < 8; i++) {
      keystream[i * 2] = s[i] & 0xff;
      keystream[i * 2 + 1] = (s[i] >>> 8) & 0xff;
    }
    const len = Math.min(16, data.length - offset);
    for (let i = 0; i < len; i++) {
      result[offset + i] = data[offset + i] ^ keystream[i];
    }
  }
  return result;
}

function rabbitProcess(key: Uint8Array, data: Uint8Array, iv?: Uint8Array, legacy = false): Uint8Array {
  if (data.length === 0) return new Uint8Array(0);
  const { x, c } = keySetup(key, iv, legacy);
  return process(x, c, data);
}

export function rabbitEncrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  return rabbitProcess(key, data, iv);
}

export function rabbitDecrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  return rabbitProcess(key, data, iv);
}

export function rabbitLegacyEncrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  return rabbitProcess(key, data, iv, true);
}

export function rabbitLegacyDecrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  return rabbitProcess(key, data, iv, true);
}
