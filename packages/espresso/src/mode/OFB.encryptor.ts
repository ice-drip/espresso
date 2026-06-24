import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class OFBEncryptor extends BlockCipherModeAlgorithm {
  private keystream!: number[];
  public processBlock(words: number[], offset: number): void {
    const cipher = this.cipher;
    const blockSize = cipher.blockSize;
    if (blockSize === undefined) {
      throw new Error("block size is undefined");
    }
    const iv = this.iv;
    let keystream = this.keystream;

    // Generate keystream
    if (iv) {
      keystream = this.keystream = [...iv];

      // Remove IV for subsequent blocks
      this.iv = undefined;
    }
    cipher.encryptBlock(keystream, 0);

    // Encrypt
    for (let i = 0; i < blockSize; i++) {
      words[offset + i] ^= keystream[i];
    }
  }
}
