import { Algorithm, CipherOptions, CipherInput } from '../core/types';
import { utf8Encode, utf8Decode } from '../enc/utf8';
import { hexEncode, hexDecode } from '../enc/hex';
import { aesEncrypt, aesDecrypt } from './aes';
import { desEncrypt, desDecrypt } from './des';
import { tripleDesEncrypt, tripleDesDecrypt } from './triple-des';
import { blowfishEncrypt, blowfishDecrypt } from './blowfish';
import { rc4Encrypt, rc4Decrypt, rc4DropEncrypt, rc4DropDecrypt } from './rc4';
import { rabbitEncrypt, rabbitDecrypt, rabbitLegacyEncrypt, rabbitLegacyDecrypt } from './rabbit';
import { seedEncrypt, seedDecrypt } from './seed';

export function encrypt(
  algorithm: Algorithm,
  message: CipherInput,
  key: CipherInput,
  options?: CipherOptions
): string | Uint8Array {
  const msgBytes = typeof message === 'string' ? utf8Encode(message) : message;
  const keyBytes = typeof key === 'string' ? utf8Encode(key) : key;
  const opts = { mode: 'cbc' as const, padding: 'pkcs7' as const, ...options };

  let result: Uint8Array;
  switch (algorithm) {
    case 'aes':
      result = aesEncrypt(msgBytes, keyBytes, opts);
      break;
    case 'des':
      result = desEncrypt(msgBytes, keyBytes, opts);
      break;
    case 'triple-des':
      result = tripleDesEncrypt(msgBytes, keyBytes, opts);
      break;
    case 'blowfish':
      result = blowfishEncrypt(msgBytes, keyBytes, opts);
      break;
    case 'rc4':
      result = rc4Encrypt(msgBytes, keyBytes);
      break;
    case 'rc4-drop':
      result = rc4DropEncrypt(msgBytes, keyBytes);
      break;
    case 'rabbit': {
      const rabbitIv = opts.iv
        ? (typeof opts.iv === 'string' ? utf8Encode(opts.iv) : opts.iv)
        : undefined;
      result = rabbitEncrypt(msgBytes, keyBytes, rabbitIv);
      break;
    }
    case 'rabbit-legacy': {
      const rabbitLegacyIv = opts.iv
        ? (typeof opts.iv === 'string' ? utf8Encode(opts.iv) : opts.iv)
        : undefined;
      result = rabbitLegacyEncrypt(msgBytes, keyBytes, rabbitLegacyIv);
      break;
    }
    case 'seed':
      result = seedEncrypt(msgBytes, keyBytes, opts);
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  if (opts.outputEncoding) {
    return encodeOutput(result, opts.outputEncoding);
  }
  return result;
}

export function decrypt(
  algorithm: Algorithm,
  ciphertext: CipherInput,
  key: CipherInput,
  options?: CipherOptions
): string | Uint8Array {
  const ctBytes = typeof ciphertext === 'string' ? hexDecode(ciphertext) : ciphertext;
  const keyBytes = typeof key === 'string' ? utf8Encode(key) : key;
  const opts = { mode: 'cbc' as const, padding: 'pkcs7' as const, ...options };

  let result: Uint8Array;
  switch (algorithm) {
    case 'aes':
      result = aesDecrypt(ctBytes, keyBytes, opts);
      break;
    case 'des':
      result = desDecrypt(ctBytes, keyBytes, opts);
      break;
    case 'triple-des':
      result = tripleDesDecrypt(ctBytes, keyBytes, opts);
      break;
    case 'blowfish':
      result = blowfishDecrypt(ctBytes, keyBytes, opts);
      break;
    case 'rc4':
      result = rc4Decrypt(ctBytes, keyBytes);
      break;
    case 'rc4-drop':
      result = rc4DropDecrypt(ctBytes, keyBytes);
      break;
    case 'rabbit': {
      const rabbitIv = opts.iv
        ? (typeof opts.iv === 'string' ? utf8Encode(opts.iv) : opts.iv)
        : undefined;
      result = rabbitDecrypt(ctBytes, keyBytes, rabbitIv);
      break;
    }
    case 'rabbit-legacy': {
      const rabbitLegacyIv = opts.iv
        ? (typeof opts.iv === 'string' ? utf8Encode(opts.iv) : opts.iv)
        : undefined;
      result = rabbitLegacyDecrypt(ctBytes, keyBytes, rabbitLegacyIv);
      break;
    }
    case 'seed':
      result = seedDecrypt(ctBytes, keyBytes, opts);
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  if (opts.outputEncoding === 'utf8') {
    return utf8Decode(result);
  }
  return encodeOutput(result, opts.outputEncoding ?? 'hex');
}

function encodeOutput(bytes: Uint8Array, encoding: string): string {
  switch (encoding) {
    case 'hex':
      return hexEncode(bytes);
    case 'base64': {
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }
    case 'utf8':
      return utf8Decode(bytes);
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }
}