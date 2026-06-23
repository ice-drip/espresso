import { BlockMode, BlockEncryptFn, BlockDecryptFn } from './types';

function xorBlocks(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export const CBC: BlockMode = {
  encrypt(
    data: Uint8Array,
    _key: Uint8Array,
    iv: Uint8Array,
    encryptBlock: BlockEncryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    let prev = iv;

    for (let i = 0; i < data.length; i += blockSize) {
      const block = xorBlocks(data.slice(i, i + blockSize), prev);
      const encrypted = encryptBlock(block);
      result.set(encrypted, i);
      prev = encrypted;
    }

    return result;
  },

  decrypt(
    data: Uint8Array,
    _key: Uint8Array,
    iv: Uint8Array,
    decryptBlock: BlockDecryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    let prev = iv;

    for (let i = 0; i < data.length; i += blockSize) {
      const block = data.slice(i, i + blockSize);
      const decrypted = decryptBlock(block);
      result.set(xorBlocks(decrypted, prev), i);
      prev = block;
    }

    return result;
  },
};
