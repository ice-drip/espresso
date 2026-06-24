import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CBCEncryptor extends BlockCipherModeAlgorithm {
  private prevBlock?: number[];
  public processBlock(_words: number[], _offset: number): void {
    if (this.cipher.blockSize === undefined) {
      throw new Error("missing blockSize in cipher config");
    }
    this.xorBlock(_words, _offset, this.cipher.blockSize);
    this.cipher.encryptBlock(_words, _offset);

    this.prevBlock = _words.slice(_offset, _offset + this.cipher.blockSize);
  }

  public xorBlock(words: number[], offset: number, blockSize: number): void {
    let block: number[] | undefined;
    if (this.iv) {
      block = this.iv;
      this.iv = undefined;
    } else {
      block = this.prevBlock;
    }
    if (block !== undefined) {
      for (let i = 0; i < blockSize; i++) {
        words[offset + i] ^= block[i];
      }
    }
  }
}
