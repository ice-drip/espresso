import { BlockMode, BlockEncryptFn } from "./types";

export const OFB: BlockMode = {
  encrypt(
    data: Uint8Array,
    _key: Uint8Array,
    iv: Uint8Array,
    encryptBlock: BlockEncryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    const output = new Uint8Array(iv);

    for (let i = 0; i < data.length; i += blockSize) {
      const keystream = encryptBlock(output);
      const remaining = Math.min(blockSize, data.length - i);
      for (let j = 0; j < remaining; j++) {
        result[i + j] = data[i + j] ^ keystream[j];
      }
      output.set(keystream);
    }

    return result;
  },

  decrypt(
    data: Uint8Array,
    _key: Uint8Array,
    iv: Uint8Array,
    encryptBlock: BlockEncryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    const output = new Uint8Array(iv);

    for (let i = 0; i < data.length; i += blockSize) {
      const keystream = encryptBlock(output);
      const remaining = Math.min(blockSize, data.length - i);
      for (let j = 0; j < remaining; j++) {
        result[i + j] = data[i + j] ^ keystream[j];
      }
      output.set(keystream);
    }

    return result;
  },
};
