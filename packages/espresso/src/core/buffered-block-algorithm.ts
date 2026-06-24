import { Utf8 } from "../enc/utf8";
import { BufferedBlockAlgorithmConfig } from "../typings/core/buffered-block-algorithm.typing";

import { WordArray } from "./word-array";

/**
 * BufferedBlock算法模板 抽象�? *
 * @author rikka
 * @exports
 * @abstract
 * @class BufferedBlockAlgorithm
 */
export abstract class BufferedBlockAlgorithm {
  public cfg: BufferedBlockAlgorithmConfig;
  protected data: WordArray;

  protected nDataBytes: number;
  protected minBufferSize: number = 0;
  abstract blockSize: number;

  constructor(cfg?: BufferedBlockAlgorithmConfig) {
    this.data = new WordArray();
    this.nDataBytes = 0;
    this.cfg = Object.assign({}, cfg);
  }
  reset(): void {
    this.data = new WordArray();
    this.nDataBytes = 0;
  }
  clone(): BufferedBlockAlgorithm {
    const clone = this.constructor();
    for (const attr in this) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(attr)) {
        clone[attr] = this[attr];
      }
    }
    clone.data = this.data.clone();
    return clone;
  }
  abstract doProcessBlock(_wordArray: number[], _offset: number): void;

  append(data: string | WordArray): void {
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }
    // eslint-disable-next-line unicorn/prefer-spread
    this.data.concat(data as WordArray);
    this.nDataBytes += (data as WordArray).sigBytes;
  }

  processBlocks(doFlush?: boolean): WordArray {
    if (!this.blockSize) {
      throw new Error("missing blockSize in config");
    }

    // Shortcuts
    const blockSizeBytes = this.blockSize * 4;

    // Count blocks ready
    let nBlocksReady = this.data.sigBytes / blockSizeBytes;
    nBlocksReady = doFlush
      ? Math.ceil(nBlocksReady)
      : // eslint-disable-next-line unicorn/prefer-math-trunc
        Math.max((nBlocksReady | 0) - this.minBufferSize, 0);

    // Count words ready
    const nWordsReady = nBlocksReady * this.blockSize;

    // Count bytes ready
    const nBytesReady = Math.min(nWordsReady * 4, this.data.sigBytes);

    // Process blocks
    let processedWords;
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        // Perform concrete-algorithm logic
        this.doProcessBlock(this.data.words, offset);
      }

      // Remove processed words
      processedWords = this.data.words.splice(0, nWordsReady);
      this.data.sigBytes -= nBytesReady;
    }

    // Return processed words
    return new WordArray(processedWords, nBytesReady);
  }
}
