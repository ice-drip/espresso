import { WordArray } from "./word-array";

/**
 *  一个由64位字组成的数组
 *
 * @author rikka
 * @exports
 * @class X64Word
 */
export class X64Word {
  public high!: number;
  public low!: number;

  constructor(high?: number, low?: number) {
    if (high !== undefined) this.high = high;
    if (low !== undefined) this.low = low;
  }
}

export class X64WordArray {
  public words: X64Word[];
  public sigBytes: number;

  constructor(words: X64Word[] = [], sigBytes: number = words.length * 8) {
    this.words = words;
    this.sigBytes = sigBytes;
  }

  toX32(): WordArray {
    const x64Words = this.words;
    const x64WordsLength = x64Words.length;

    const x32Words = [];
    for (let i = 0; i < x64WordsLength; i++) {
      const x64Word = x64Words[i];
      x32Words.push(x64Word.high, x64Word.low);
    }
    return new WordArray(x32Words, this.sigBytes);
  }
}
