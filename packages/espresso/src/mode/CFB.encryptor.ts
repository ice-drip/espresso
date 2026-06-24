import { BlockCipher } from "../core/cipher/block-cipher";

import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CFBEncryptor extends BlockCipherModeAlgorithm {
  private prevBlock!: number[];
  public processBlock(words: number[], offset: number): void {
    // Shortcuts
    const cipher = this.cipher;
    const blockSize = cipher.blockSize;

    if (blockSize === undefined) {
      throw new Error("block size is undefined");
    }

    this.generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

    // Remember this block to use with next block
    this.prevBlock = words.slice(offset, offset + blockSize);
  }

  generateKeystreamAndEncrypt(
    words: number[],
    offset: number,
    blockSize: number,
    cipher: BlockCipher,
  ): void {
    let keystream: number[];

    // Shortcut
    const iv = this.iv;

    // Generate keystream
    if (iv) {
      keystream = [...iv];

      // Remove IV for subsequent blocks
      this.iv = undefined;
    } else {
      keystream = this.prevBlock;
    }
    cipher.encryptBlock(keystream, 0);

    // Encrypt
    for (let i = 0; i < blockSize; i++) {
      words[offset + i] ^= keystream[i];
    }
  }
}
