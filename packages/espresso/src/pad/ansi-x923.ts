import { WordArray } from "../core/word-array";
import { Padding } from "../typings/padding.typing";

export const AnsiX923: Padding = {
  pad(data: WordArray, blockSize: number) {
    // Shortcuts
    const dataSigBytes = data.sigBytes;
    const blockSizeBytes = blockSize * 4;

    // Count padding bytes
    const nPaddingBytes = blockSizeBytes - (dataSigBytes % blockSizeBytes);

    // Compute last byte position
    const lastBytePos = dataSigBytes + nPaddingBytes - 1;

    // Pad
    data.clamp();
    data.words[lastBytePos >>> 2] |=
      nPaddingBytes << (24 - (lastBytePos % 4) * 8);
    data.sigBytes += nPaddingBytes;
  },

  unpad(data: WordArray) {
    // Get number of padding bytes from last byte
    const nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

    // Remove padding
    data.sigBytes -= nPaddingBytes;
  }
};
