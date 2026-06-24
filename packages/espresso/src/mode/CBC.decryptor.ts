import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CBCDecryptor extends BlockCipherModeAlgorithm {
  private prevBlock?: number[];

  public processBlock(words: number[], offset: number): void {
    if (this.cipher.blockSize === undefined) {
      throw new Error("missing blockSize in cipher config");
    }
    const thisBlock = words.slice(offset, offset + this.cipher.blockSize);

    this.cipher.decryptBlock(words, offset);

    this.xorBlock(words, offset, this.cipher.blockSize);

    this.prevBlock = thisBlock;
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
