import { Cipher } from "../../core/cipher/cipher";
import { CipherParams } from "../../core/cipher/cipher-params";
import { WordArray } from "../../core/word-array";

import { Formatter } from "../format/format.typing";
import { BufferedBlockAlgorithmConfig } from "./buffered-block-algorithm.typing";

export interface CipherStrategy {
  cfg?: BufferedBlockAlgorithmConfig;

  encrypt(
    _cipher: typeof Cipher,
    _message: WordArray | string,
    _key: WordArray | string,
    _cfg?: BufferedBlockAlgorithmConfig
  ): CipherParams;

  decrypt(
    _cipher: typeof Cipher,
    _ciphertext: CipherParams | string,
    _password: string | WordArray,
    _optionalCfg?: BufferedBlockAlgorithmConfig
  ): WordArray;

  _parse(_ciphertext: CipherParams | string, _format: Formatter): CipherParams;
}
