import { Hasher } from "../../core/hash/hasher";
import { WordArray } from "../../core/word-array";
import { BlockCipherMode } from "../../mode/block-cipher-mode";

import { Type } from "../common.typing";
import { Formatter } from "../format/format.typing";
import { KDF } from "../kdf/kdf.typing";
import { Padding } from "../padding.typing";

export interface BufferedBlockAlgorithmConfig {
  iv?: WordArray;

  outputLength?: number;

  format?: Formatter;

  kdf?: KDF;

  mode?: typeof BlockCipherMode;

  padding?: Padding;

  hasher?: Type<Hasher>;

  keySize?: number;

  iterations?: number;

  drop?: number;
}
