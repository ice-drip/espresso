import { WordArray } from "../core/word-array";
import { Padding } from "../typings/padding.typing";

export const ZeroPadding: Padding = {
  pad(data: WordArray, blockSize: number): void {
    const blockSizeBytes = blockSize * 4;

    // Pad
    data.clamp();
    data.sigBytes +=
      blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
  },
  unpad(data: WordArray): void {
    const dataWords = data.words;

    // Unpad
    for (let i = data.sigBytes - 1; i >= 0; i--) {
      if ((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff) {
        data.sigBytes = i + 1;
        break;
      }
    }
  }
};
