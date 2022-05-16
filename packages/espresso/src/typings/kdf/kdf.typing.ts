import { CipherParams } from "../../core/cipher/cipher-params";
import { WordArray } from "../../core/word-array";

export interface KDF {
  execute: (
    _password: string,
    _keySize: number,
    _ivSize: number,
    _salt?: WordArray | string
  ) => CipherParams;
}
