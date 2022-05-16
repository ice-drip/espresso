import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CTREncryptor extends BlockCipherModeAlgorithm {
  public _counter!: number[];

  public processBlock(words: number[], offset: number): void {
    // Shortcuts
    const cipher = this._cipher;
    const blockSize = cipher.blockSize;
    if (blockSize === undefined) {
      throw new Error("block size is undefined");
    }
    const iv = this._iv;
    let counter = this._counter;
    if (iv) {
      counter = this._counter = [...iv];

      // Remove IV for subsequent blocks
      this._iv = undefined;
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
