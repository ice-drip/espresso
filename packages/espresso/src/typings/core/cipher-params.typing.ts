import { Cipher } from "../../core/cipher/cipher";
import { WordArray } from "../../core/word-array";
import { BlockCipherMode } from "../../mode/block-cipher-mode";

import { Formatter } from "../format/format.typing";
import { Padding } from "../padding.typing";

export interface CipherParamsInterface {
  ciphertext?: WordArray;

  key?: WordArray | string;

  iv?: WordArray;

  salt?: WordArray | string;

  algorithm?: typeof Cipher;

  mode?: typeof BlockCipherMode;

  padding?: Padding;

  blockSize?: number;

  formatter?: Formatter;
}
