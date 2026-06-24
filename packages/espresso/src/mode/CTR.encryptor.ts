import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CTREncryptor extends BlockCipherModeAlgorithm {
  private counter!: number[];

  public processBlock(words: number[], offset: number): void {
    // Shortcuts
    const cipher = this.cipher;
    const blockSize = cipher.blockSize;
    if (blockSize === undefined) {
      throw new Error("block size is undefined");
    }
    const iv = this.iv;
    let counter = this.counter;
    if (iv) {
      counter = this.counter = [...iv];

      // Remove IV for subsequent blocks
      this.iv = undefined;
    }
    const keystream = [...counter];
    cipher.encryptBlock(keystream, 0);

    // Increment counter
    // eslint-disable-next-line unicorn/prefer-math-trunc
    counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

    // Encrypt
    for (let i = 0; i < blockSize; i++) {
      words[offset + i] ^= keystream[i];
    }
  }
}
