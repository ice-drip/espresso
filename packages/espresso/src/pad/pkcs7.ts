import { WordArray } from "../core/word-array";
import { Padding } from "../typings/padding.typing";

export const PKCS7: Padding = {
  pad(data: WordArray, blockSize: number): void {
    // Shortcut
    const blockSizeBytes = blockSize * 4;

    // Count padding bytes
    const nPaddingBytes = blockSizeBytes - (data.sigBytes % blockSizeBytes);

    // Create padding word
    const paddingWord =
      (nPaddingBytes << 24) |
      (nPaddingBytes << 16) |
      (nPaddingBytes << 8) |
      nPaddingBytes;

    // Create padding
    const paddingWords = [];
    for (let i = 0; i < nPaddingBytes; i += 4) {
      paddingWords.push(paddingWord);
    }
    const padding = new WordArray(paddingWords, nPaddingBytes);

    // Add padding
    // eslint-disable-next-line unicorn/prefer-spread
    data.concat(padding);
  },
  unpad(data: WordArray): void {
    const nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
    data.sigBytes -= nPaddingBytes;
  }
};
