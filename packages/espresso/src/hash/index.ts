import { HashAlgorithm, HashOptions } from '../core/types';
import { md5 } from './md5';

const hashImpls: Record<string, (data: Uint8Array) => Uint8Array> = {
  md5,
};

export function hash(
  algorithm: HashAlgorithm,
  data: string | Uint8Array,
  options?: HashOptions
): string | Uint8Array {
  const impl = hashImpls[algorithm];
  if (!impl) throw new Error(`Unsupported hash algorithm: ${algorithm}`);

  const input = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const result = impl(input);

  if (options?.outputEncoding) {
    return encodeOutput(result, options.outputEncoding);
  }
  return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join('');
}

function encodeOutput(bytes: Uint8Array, encoding: string): string {
  switch (encoding) {
    case 'hex':
      return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    case 'base64': {
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }
    case 'utf8':
      return new TextDecoder().decode(bytes);
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }
}
