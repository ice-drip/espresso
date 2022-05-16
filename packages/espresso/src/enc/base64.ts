import { WordArray } from "../core/word-array";
import { Encoding } from "../typings/core/encoding.typing";

// eslint-disable-next-line jsdoc/require-jsdoc
function parseLoop(
  base64Str: string,
  base64StrLength: number,
  reverseMap: Array<number>
): WordArray {
  const words: number[] = [];
  let nBytes = 0;
  for (let i = 0; i < base64StrLength; i++) {
    if (i % 4) {
      const bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
      const bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
      words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
      nBytes++;
    }
  }

  return new WordArray(words, nBytes);
}
/**
 * Base64编码策略
 */
export const Base64: Encoding & { _reverseMap?: number[]; _map: string } = {
  _reverseMap: undefined,
  _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  parse(base64Str: string): WordArray {
    // Shortcuts
    let base64StrLength = base64Str.length;
    const map = this._map;
    let reverseMap = this._reverseMap;
    if (reverseMap === undefined) {
      reverseMap = [];
      for (let j = 0; j < map.length; j++) {
        reverseMap[map.charCodeAt(j)] = j;
      }
    }

    // Ignore padding
    const paddingChar = map.charAt(64);
    if (paddingChar) {
      const paddingIndex = base64Str.indexOf(paddingChar);
      if (paddingIndex !== -1) {
        base64StrLength = paddingIndex;
      }
    }

    // Convert
    return parseLoop(base64Str, base64StrLength, reverseMap);
  },
  stringify(wordArray: WordArray): string {
    wordArray.clamp();
    const base64Chars = [];
    for (let i = 0; i < wordArray.sigBytes; i += 3) {
      const byte1 = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      const byte2 =
        (wordArray.words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
      const byte3 =
        (wordArray.words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
      const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

      for (let j = 0; j < 4 && i + j * 0.75 < wordArray.sigBytes; j++) {
        base64Chars.push(this._map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
      }
    }
    const paddingChar = this._map.charAt(64);
    if (paddingChar) {
      while (base64Chars.length % 4) {
        base64Chars.push(paddingChar);
      }
    }

    return base64Chars.join("");
  }
};
