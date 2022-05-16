import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CBCDecryptor extends BlockCipherModeAlgorithm {
  public _prevBlock?: number[];

  public processBlock(words: number[], offset: number): void {
    if (this._cipher.blockSize === undefined) {
      throw new Error("missing blockSize in cipher config");
    }
    const thisBlock = words.slice(offset, offset + this._cipher.blockSize);

    this._cipher.decryptBlock(words, offset);

    this.xorBlock(words, offset, this._cipher.blockSize);

    this._prevBlock = thisBlock;
  }

  public xorBlock(words: number[], offset: number, blockSize: number): void {
    let block: number[] | undefined;

    if (this._iv) {
      block = this._iv;
      this._iv = undefined;
    } else {
      block = this._prevBlock;
    }
    if (block !== undefined) {
      for (let i = 0; i < blockSize; i++) {
        words[offset + i] ^= block[i];
      }
    }
  }
}
