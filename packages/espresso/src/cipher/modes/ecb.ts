import { BlockMode, BlockEncryptFn, BlockDecryptFn } from "./types";

export const ECB: BlockMode = {
  encrypt(
    data: Uint8Array,
    _key: Uint8Array,
    _iv: Uint8Array,
    encryptBlock: BlockEncryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += blockSize) {
      result.set(encryptBlock(data.slice(i, i + blockSize)), i);
    }
    return result;
  },

  decrypt(
    data: Uint8Array,
    _key: Uint8Array,
    _iv: Uint8Array,
    decryptBlock: BlockDecryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += blockSize) {
      result.set(decryptBlock(data.slice(i, i + blockSize)), i);
    }
    return result;
  },
};
