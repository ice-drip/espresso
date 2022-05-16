import { CipherParams } from "../../core/cipher/cipher-params";
import { WordArray } from "../../core/word-array";

import { BufferedBlockAlgorithmConfig } from "./buffered-block-algorithm.typing";

export interface CipherHelper {
  encrypt(
    _message: string | WordArray,
    _key: string | WordArray,
    _cfg?: BufferedBlockAlgorithmConfig | undefined
  ): CipherParams;
  decrypt(
    _ciphertext: string | CipherParams,
    _key: string | WordArray,
    _cfg?: BufferedBlockAlgorithmConfig | undefined
  ): WordArray;
}
