import { OpenSSL } from "../../format/openSSL";
import { OpenSSLKdf } from "../../kdf/openSSL-kdf";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";
import { Formatter } from "../../typings/format/format.typing";

import { WordArray } from "../word-array";
import { Cipher } from "./cipher";
import { CipherParams } from "./cipher-params";
import { SerializableCipher } from "./serializable-cipher";

/**
 * 可序列化的密码包装器，从密码中导出密钥。并作为可序列化的密码参数对象返回密码文本
 */
export class PasswordBasedCipher {
  public static cfg = {
    // blockSize: 4,
    iv: new WordArray([]),
    format: OpenSSL,
    kdf: OpenSSLKdf
  } as BufferedBlockAlgorithmConfig;
  public static encrypt(
    cipher: typeof Cipher,
    message: WordArray | string,
    password: string,
    cfg?: BufferedBlockAlgorithmConfig
  ): CipherParams {
    // Apply config defaults
    const config = Object.assign({}, this.cfg, cfg);
    // Check if we have a kdf
    if (config.kdf === undefined) {
      throw new Error("missing kdf in config");
    }

    // Derive key and other params
    const derivedParams: CipherParams = config.kdf.execute(
      password,
      cipher.keySize,
      cipher.ivSize
    );

    // Check if we have an IV
    if (derivedParams.iv !== undefined) {
      // Add IV to config
      config.iv = derivedParams.iv;
    }

    // Encrypt
    const ciphertext: CipherParams = SerializableCipher.encrypt.call(
      this,
      cipher,
      message,
      derivedParams.key as WordArray,
      config
    );

    // Mix in derived params
    return ciphertext.extend(derivedParams);
  }

  public static decrypt(
    cipher: typeof Cipher,
    ciphertext: CipherParams | string,
    password: string,
    cfg?: BufferedBlockAlgorithmConfig
  ): WordArray {
    // Apply config defaults
    const config = Object.assign({}, this.cfg, cfg);

    // Check if we have a kdf
    if (config.format === undefined) {
      throw new Error("missing format in config");
    }

    // Convert string to CipherParams
    ciphertext = this._parse(ciphertext, config.format);

    // Check if we have a kdf
    if (config.kdf === undefined) {
      throw new Error("the key derivation function must be set");
    }

    // Derive key and other params
    const derivedParams = config.kdf.execute(
      password,
      cipher.keySize,
      cipher.ivSize,
      ciphertext.salt
    );

    // Check if we have an IV
    if (derivedParams.iv !== undefined) {
      // Add IV to config
      config.iv = derivedParams.iv;
    }

    // Decrypt
    const plaintext = SerializableCipher.decrypt.call(
      this,
      cipher,
      ciphertext,
      derivedParams.key as WordArray,
      config
    );

    return plaintext;
  }

  public static _parse(
    ciphertext: CipherParams | string,
    format: Formatter
  ): CipherParams {
    return typeof ciphertext === "string"
      ? format.parse(ciphertext)
      : ciphertext;
  }
}
