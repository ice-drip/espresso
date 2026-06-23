import { Algorithm, CipherOptions, CipherInput } from '../core/types';
import { utf8Encode, utf8Decode } from '../enc/utf8';
import { hexEncode, hexDecode } from '../enc/hex';
import { aesEncrypt, aesDecrypt } from './aes';

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