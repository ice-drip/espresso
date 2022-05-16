import { WordArray } from "../../core/word-array";

export interface Encoding {
  stringify: (_wordArray: WordArray) => string;

  parse: (_str: string) => WordArray;
}
