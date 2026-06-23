import { HashAlgorithm, PBKDF2Options } from '../core/types';
import { hmac } from '../hmac';
import { hexDecode } from '../enc/hex';
import { xorBytes } from '../core/utils';

export function pbkdf2(
  password: string | Uint8Array,
  salt: string | Uint8Array,
  options: PBKDF2Options
): Uint8Array {
  const { iterations, keySize, hasher = 'sha256' } = options;
  const passwordBytes = typeof password === 'string' ? new TextEncoder().encode(password) : password;
  const saltBytes = typeof salt === 'string' ? new TextEncoder().encode(salt) : salt;

  const hashLen = 32;
  const blocks = Math.ceil(keySize / hashLen);
  const result = new Uint8Array(blocks * hashLen);

  for (let i = 1; i <= blocks; i++) {
    const saltI = new Uint8Array(saltBytes.length + 4);
    saltI.set(saltBytes);
    saltI[saltBytes.length] = (i >>> 24) & 0xff;
    saltI[saltBytes.length + 1] = (i >>> 16) & 0xff;
    saltI[saltBytes.length + 2] = (i >>> 8) & 0xff;
    saltI[saltBytes.length + 3] = i & 0xff;

    let u = hexDecode(hmac(hasher, saltI, passwordBytes) as string);
    let t = new Uint8Array(u);

    for (let j = 1; j < iterations; j++) {
      u = hexDecode(hmac(hasher, u, passwordBytes) as string);
      t = new Uint8Array(xorBytes(t, u));
    }

    result.set(t, (i - 1) * hashLen);
  }

  return result.slice(0, keySize);
}
