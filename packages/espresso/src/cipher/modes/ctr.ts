import { BlockMode, BlockEncryptFn, BlockDecryptFn } from './types';

function incrementCounter(counter: Uint8Array): void {
  for (let i = counter.length - 1; i >= 0; i--) {
    counter[i]++;
    if (counter[i] !== 0) break;
  }
}

function xorBlocks(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export const CTR: BlockMode = {
  encrypt(
    data: Uint8Array,
    _key: Uint8Array,
    iv: Uint8Array,
    encryptBlock: BlockEncryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    const counter = new Uint8Array(iv);

    for (let i = 0; i < data.length; i += blockSize) {
      const keystream = encryptBlock(counter);
      const remaining = Math.min(blockSize, data.length - i);
      for (let j = 0; j < remaining; j++) {
        result[i + j] = data[i + j] ^ keystream[j];
      }
      incrementCounter(counter);
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
    const counter = new Uint8Array(iv);

    for (let i = 0; i < data.length; i += blockSize) {
      const keystream = decryptBlock(counter);
      const remaining = Math.min(blockSize, data.length - i);
      for (let j = 0; j < remaining; j++) {
        result[i + j] = data[i + j] ^ keystream[j];
      }
      incrementCounter(counter);
    }

    return result;
  },
};
