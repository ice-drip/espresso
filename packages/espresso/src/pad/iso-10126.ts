import { WordArray } from "../core/word-array";
import { Padding } from "../typings/padding.typing";

export const ISO10126: Padding = {
  pad(data: WordArray, blockSize: number): void {
    const blockSizeBytes = blockSize * 4;

    // Count padding bytes
    const nPaddingBytes = blockSizeBytes - (data.sigBytes % blockSizeBytes);

    // Pad
    data
      // eslint-disable-next-line unicorn/prefer-spread
      .concat(WordArray.random(nPaddingBytes - 1))
      // eslint-disable-next-line unicorn/prefer-spread
      .concat(new WordArray([nPaddingBytes << 24], 1));
  },
  unpad(data: WordArray) {
    // Get number of padding bytes from last byte
    const nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

    // Remove padding
    data.sigBytes -= nPaddingBytes;
  }
};
