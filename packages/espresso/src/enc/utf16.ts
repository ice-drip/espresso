import { WordArray } from "../core/word-array";
import { Encoding } from "../typings/core/encoding.typing";

export const Utf16: Encoding = {
  stringify(wordArray: WordArray) {
    // Shortcuts
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;

    // Convert
    const utf16Chars = [];
    for (let i = 0; i < sigBytes; i += 2) {
      const codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xff_ff;
      utf16Chars.push(String.fromCharCode(codePoint));
    }

    return utf16Chars.join("");
  },
  parse: function (utf16Str: string) {
    // Shortcut
    const utf16StrLength = utf16Str.length;

    // Convert
    const words: number[] = [];
    for (let i = 0; i < utf16StrLength; i++) {
      words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
    }

    return new WordArray(words, utf16StrLength * 2);
  }
};

export const Utf16LE: Encoding = {
  stringify(wordArray: WordArray) {
    // Shortcuts
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;

    // Convert
    const utf16Chars = [];
    for (let i = 0; i < sigBytes; i += 2) {
      const codePoint = swapEndian(
        (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xff_ff
      );
      utf16Chars.push(String.fromCharCode(codePoint));
    }

    return utf16Chars.join("");
  },
  parse: function (utf16Str: string) {
    // Shortcut
    const utf16StrLength = utf16Str.length;

    // Convert
    const words: number[] = [];
    for (let i = 0; i < utf16StrLength; i++) {
      words[i >>> 1] |= swapEndian(
        utf16Str.charCodeAt(i) << (16 - (i % 2) * 16)
      );
    }

    return new WordArray(words, utf16StrLength * 2);
  }
};
/**
 * swapEndian
 *
 * @author rikka
 * @param {number} word word
 * @returns {*} {number}
 */
function swapEndian(word: number): number {
  return ((word << 8) & 0xff_00_ff_00) | ((word >>> 8) & 0x00_ff_00_ff);
}
