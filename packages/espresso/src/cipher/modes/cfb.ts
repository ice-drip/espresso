import { BlockMode, BlockEncryptFn, BlockDecryptFn } from "./types";

function xorBlocks(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export const CFB: BlockMode = {
  encrypt(
    data: Uint8Array,
    _key: Uint8Array,
    iv: Uint8Array,
    encryptBlock: BlockEncryptFn,
  ): Uint8Array {
    const blockSize = 16;
    const result = new Uint8Array(data.length);
    let shiftReg = new Uint8Array(iv);

    for (let i = 0; i < data.length; i += blockSize) {
      const keystream = encryptBlock(shiftReg);
      const remaining = Math.min(blockSize, data.length - i);
      const block = data.slice(i, i + remaining);
      const encrypted = xorBlocks(keystream.slice(0, remaining), block);
      result.set(encrypted, i);
      shiftReg = new Uint8Array([...encrypted, ...shiftReg.slice(remaining)]);
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
    let shiftReg = new Uint8Array(iv);

    for (let i = 0; i < data.length; i += blockSize) {
      const keystream = decryptBlock(shiftReg);
      const remaining = Math.min(blockSize, data.length - i);
      const block = data.slice(i, i + remaining);
      const decrypted = xorBlocks(keystream.slice(0, remaining), block);
      result.set(decrypted, i);
      shiftReg = new Uint8Array([...block, ...shiftReg.slice(remaining)]);
    }

    return result;
  },
};
