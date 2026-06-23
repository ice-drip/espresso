import { CipherOptions } from '../core/types';
import { pkcs7Pad, pkcs7Unpad } from './padding/pkcs7';

const PI_HEX = '243f6a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89452821e638d01377be5466cf34e90c6cc0ac29b7c97c50dd3f84d5b5b54709179216d5d98979f1111e1e6d22eb96cf1b';

function makeP(): number[] {
  const p: number[] = [];
  for (let i = 0; i < 18; i++) {
    p[i] = parseInt(PI_HEX.substring(i * 8, i * 8 + 8), 16);
  }
  return p;
}

function makeS(): number[][] {
  const s: number[][] = [[], [], [], []];
  for (let box = 0; box < 4; box++) {
    for (let i = 0; i < 256; i++) {
      const offset = ((box * 256 + i) * 8) % PI_HEX.length;
      s[box][i] = parseInt(PI_HEX.substring(offset, offset + 8), 16);
    }
  }
  return s;
}

function f(x: number, s: number[][]): number {
  const a = (x >>> 24) & 0xff;
  const b = (x >>> 16) & 0xff;
  const c = (x >>> 8) & 0xff;
  const d = x & 0xff;
  return (((s[0][a] + s[1][b]) ^ s[2][c]) + s[3][d]) >>> 0;
}

function encipher(xl: number, xr: number, p: number[], s: number[][]): [number, number] {
  let l = xl >>> 0;
  let r = xr >>> 0;
  for (let i = 0; i < 16; i += 2) {
    l ^= f(r, s);
    r ^= p[i + 1];
    r ^= f(l, s);
    l ^= p[i + 2];
  }
  r ^= p[17];
  l ^= p[18];
  return [r >>> 0, l >>> 0];
}

function initKey(key: Uint8Array): { p: number[]; s: number[][] } {
  const p = makeP();
  const s = makeS();

  let j = 0;
  for (let i = 0; i < 18; i++) {
    let data = 0;
    for (let k = 0; k < 4; k++) {
      data = ((data << 8) | key[j]) >>> 0;
      j = (j + 1) % key.length;
    }
    p[i] = (p[i] + data) >>> 0;
  }

  let l = 0, r = 0;
  for (let i = 0; i < 18; i += 2) {
    [l, r] = encipher(l, r, p, s);
    p[i] = l;
    p[i + 1] = r;
  }
  for (let box = 0; box < 4; box++) {
    for (let i = 0; i < 256; i += 2) {
      [l, r] = encipher(l, r, p, s);
      s[box][i] = l;
      s[box][i + 1] = r;
    }
  }

  return { p, s };
}

function blowfishBlock(data: Uint8Array, key: Uint8Array, doEncrypt: boolean): Uint8Array {
  const { p, s } = initKey(key);
  const result = new Uint8Array(data.length);
  for (let offset = 0; offset < data.length; offset += 8) {
    let xl = ((data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
    let xr = ((data[offset + 4] << 24) | (data[offset + 5] << 16) | (data[offset + 6] << 8) | data[offset + 7]) >>> 0;

    if (doEncrypt) {
      [xl, xr] = encipher(xl, xr, p, s);
    } else {
      for (let i = 16; i > 0; i -= 2) {
        xl ^= p[i + 1]; xr ^= f(xl, s);
        xl ^= p[i]; xr ^= p[i - 1];
        xr ^= f(xl, s); xl ^= p[i - 2];
      }
      xr ^= p[1]; xl ^= p[0];
    }

    result[offset] = (xl >>> 24) & 0xff;
    result[offset + 1] = (xl >>> 16) & 0xff;
    result[offset + 2] = (xl >>> 8) & 0xff;
    result[offset + 3] = xl & 0xff;
    result[offset + 4] = (xr >>> 24) & 0xff;
    result[offset + 5] = (xr >>> 16) & 0xff;
    result[offset + 6] = (xr >>> 8) & 0xff;
    result[offset + 7] = xr & 0xff;
  }
  return result;
}

export function blowfishEncrypt(data: Uint8Array, key: Uint8Array, opts: CipherOptions): Uint8Array {
  const padding = opts.padding ?? 'pkcs7';
  const padded = padding === 'pkcs7' ? pkcs7Pad(data, 8) : data;
  return blowfishBlock(padded, key, true);
}

export function blowfishDecrypt(data: Uint8Array, key: Uint8Array, opts: CipherOptions): Uint8Array {
  const result = blowfishBlock(data, key, false);
  const padding = opts.padding ?? 'pkcs7';
  if (padding === 'pkcs7') return pkcs7Unpad(result);
  return result;
}
