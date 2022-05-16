import { BlockCipherMode } from "../../mode/block-cipher-mode";
import { CipherParamsInterface } from "../../typings/core/cipher-params.typing";
import { Formatter } from "../../typings/format/format.typing";
import { Padding } from "../../typings/padding.typing";

import { WordArray } from "../word-array";
import { Cipher } from "./cipher";

/**
 * CipherParams
 * 密码参数的集合
 *
 * @author rikka
 * @exports
 * @class CipherParams
 * @implements {CipherParamsInterface}
 */
export class CipherParams implements CipherParamsInterface {
  ciphertext?: WordArray;

  key?: WordArray | string;
  iv?: WordArray;
  salt?: WordArray | string;

  algorithm?: typeof Cipher;
  mode?: typeof BlockCipherMode;

  padding?: Padding;
  blockSize?: number;

  formatter?: Formatter;

  constructor(cipherParams: CipherParamsInterface) {
    this.ciphertext = cipherParams.ciphertext;
    this.key = cipherParams.key;
    this.iv = cipherParams.iv;
    this.salt = cipherParams.salt;
    this.algorithm = cipherParams.algorithm;
    this.mode = cipherParams.mode;
    this.padding = cipherParams.padding;
    this.blockSize = cipherParams.blockSize;
    this.formatter = cipherParams.formatter;
  }

  public extend(additionalParams: CipherParams): CipherParams {
    if (additionalParams.ciphertext !== undefined) {
      this.ciphertext = additionalParams.ciphertext;
    }
    if (additionalParams.key !== undefined) {
      this.key = additionalParams.key;
    }
    if (additionalParams.iv !== undefined) {
      this.iv = additionalParams.iv;
    }

    if (additionalParams.salt !== undefined) {
      this.salt = additionalParams.salt;
    }

    if (additionalParams.algorithm !== undefined) {
      this.algorithm = additionalParams.algorithm;
    }

    if (additionalParams.mode !== undefined) {
      this.mode = additionalParams.mode;
    }

    if (additionalParams.padding !== undefined) {
      this.padding = additionalParams.padding;
    }

    if (additionalParams.blockSize !== undefined) {
      this.blockSize = additionalParams.blockSize;
    }

    if (additionalParams.formatter !== undefined) {
      this.formatter = additionalParams.formatter;
    }
    return this;
  }

  public toString(formatter?: Formatter): string {
    if (formatter) {
      return formatter.stringify(this);
    } else if (this.formatter) {
      return this.formatter.stringify(this);
    } else {
      throw new Error(
        "cipher needs a formatter to be able to convert the result into a string"
      );
    }
  }
}
