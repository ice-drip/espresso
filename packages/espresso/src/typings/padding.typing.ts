import { WordArray } from "../core/word-array";

export interface Padding {
  pad: (_data: WordArray, _blockSize: number) => void;

  unpad: (_data: WordArray) => void;
}
