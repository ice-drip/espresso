import { WordArray } from "../core/word-array";
import { Encoding } from "../typings/core/encoding.typing";

import { Latin1 } from "./latin1";

/**
 * UTF-8编码策略
 */
export const Utf8: Encoding = {
  stringify(wordArray: WordArray) {
    try {
      return decodeURIComponent(escape(Latin1.stringify(wordArray)));
    } catch {
      throw new Error("Malformed UTF-8 data");
    }
  },
  parse(utf8Str: string) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function utf8Encode(str: string): Uint8Array {
  return encoder.encode(str);
}

export function utf8Decode(bytes: Uint8Array): string {
  return decoder.decode(bytes);
}
