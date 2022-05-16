import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CBCEncryptor extends BlockCipherModeAlgorithm {
  public _prevBlock?: number[];
  public processBlock(_words: number[], _offset: number): void {
    if (this._cipher.blockSize === undefined) {
      throw new Error("missing blockSize in cipher config");
    }
    this.xorBlock(_words, _offset, this._cipher.blockSize);
    this._cipher.encryptBlock(_words, _offset);

    this._prevBlock = _words.slice(_offset, _offset + this._cipher.blockSize);
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
