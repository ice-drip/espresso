import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class OFBEncryptor extends BlockCipherModeAlgorithm {
  public _keystream!: number[];
  public processBlock(words: number[], offset: number): void {
    const cipher = this._cipher;
    const blockSize = cipher.blockSize;
    if (blockSize === undefined) {
      throw new Error("block size is undefined");
    }
    const iv = this._iv;
    let keystream = this._keystream;

    // Generate keystream
    if (iv) {
      keystream = this._keystream = [...iv];

      // Remove IV for subsequent blocks
      this._iv = undefined;
    }
    cipher.encryptBlock(keystream, 0);

    // Encrypt
    for (let i = 0; i < blockSize; i++) {
      words[offset + i] ^= keystream[i];
    }
  }
}
