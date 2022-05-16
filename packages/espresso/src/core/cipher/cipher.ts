import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";
import { CipherHelper } from "../../typings/core/cipher.typing";

import { BufferedBlockAlgorithm } from "../buffered-block-algorithm";
import { WordArray } from "../word-array";
import { CipherParams } from "./cipher-params";
import { PasswordBasedCipher } from "./password-based-cipher";
import { SerializableCipher } from "./serializable-cipher";

/**
 * 基础密码模板抽象类
 *
 * @author rikka
 * @exports
 * @abstract
 * @class Cipher
 * @augments {BufferedBlockAlgorithm}
 */
export abstract class Cipher extends BufferedBlockAlgorithm {
  public static keySize = 128 / 32;
  public static ivSize = 128 / 32;
  public static createEncryptor(
    key: WordArray,
    cfg: BufferedBlockAlgorithmConfig
  ): Cipher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,unicorn/no-this-assignment,@typescript-eslint/no-this-alias
    const thisClass: any = this;
    return new thisClass(this._ENC_XFORM_MODE, key, cfg);
  }

  public static createDecryptor(
    key: WordArray,
    cfg: BufferedBlockAlgorithmConfig
  ): Cipher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,unicorn/no-this-assignment,@typescript-eslint/no-this-alias
    const thisClass: any = this;
    return new thisClass(this._DEC_XFORM_MODE, key, cfg);
  }

  public _xformMode: number;
  public _key: WordArray;
  public static _ENC_XFORM_MODE = 1;
  public static _DEC_XFORM_MODE = 2;
  constructor(
    xformMode: number,
    key: WordArray,
    cfg?: BufferedBlockAlgorithmConfig
  ) {
    super(cfg);

    this._xformMode = xformMode;
    this._key = key;

    this.reset();
  }

  public process(dataUpdate: WordArray | string): WordArray {
    this._append(dataUpdate);
    return this._process();
  }
  public finalize(dataUpdate?: WordArray | string): WordArray {
    if (dataUpdate) {
      this._append(dataUpdate);
    }
    const finalProcessedData = this._doFinalize();
    return finalProcessedData;
  }

  public static _createHelper(cipher: typeof Cipher): CipherHelper {
    /**
     * encrypt
     *
     * @author rikka
     * @param {(WordArray | string)} message message
     * @param {(WordArray | string)} key key
     * @param {BufferedBlockAlgorithmConfig} [cfg] cfg
     * @returns {*}  {CipherParams}
     */
    function encrypt(
      message: WordArray | string,
      key: WordArray | string,
      cfg?: BufferedBlockAlgorithmConfig
    ): CipherParams {
      return typeof key === "string"
        ? PasswordBasedCipher.encrypt(cipher, message, key, cfg)
        : SerializableCipher.encrypt(cipher, message, key, cfg);
    }

    /**
     * decrypt
     *
     * @author rikka
     * @param {(CipherParams | string)} ciphertext ciphertext
     * @param {(WordArray | string)} key key
     * @param {BufferedBlockAlgorithmConfig} [cfg] cfg
     * @returns {*} {WordArray}
     */
    function decrypt(
      ciphertext: CipherParams | string,
      key: WordArray | string,
      cfg?: BufferedBlockAlgorithmConfig
    ): WordArray {
      return typeof key === "string"
        ? PasswordBasedCipher.decrypt(cipher, ciphertext, key, cfg)
        : SerializableCipher.decrypt(cipher, ciphertext, key, cfg);
    }

    return {
      encrypt: encrypt,
      decrypt: decrypt
    };
  }

  public abstract _doFinalize(): WordArray;
}
