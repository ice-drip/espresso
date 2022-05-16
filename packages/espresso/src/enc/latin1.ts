import { WordArray } from "../core/word-array";
import { Encoding } from "../typings/core/encoding.typing";

/**
 * Latin1编码策略
 */
export const Latin1: Encoding = {
  stringify(wordArray: WordArray) {
    const { words, sigBytes } = wordArray;
    const latin1Chars = [];
    for (let i = 0; i < sigBytes; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      latin1Chars.push(String.fromCharCode(bite));
    }
    return latin1Chars.join("");
  },
  parse(latin1Str): WordArray {
    const latin1StrLength = latin1Str.length;
    const words: number[] = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    }
    return new WordArray(words, latin1StrLength);
  }
};
