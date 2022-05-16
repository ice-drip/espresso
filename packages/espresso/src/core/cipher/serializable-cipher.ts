import { OpenSSL } from "../../format/openSSL";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";
import { Formatter } from "../../typings/format/format.typing";

import { WordArray } from "../word-array";
import { Cipher } from "./cipher";
import { CipherParams } from "./cipher-params";

/**
 * 密码包装器，将密码文本作为可序列化的密码参数对象返回
 */
export class SerializableCipher {
  public static cfg = {} as BufferedBlockAlgorithmConfig;
  static encrypt(
    cipher: typeof Cipher,
    message: WordArray | string,
    key: WordArray,
    cfg?: BufferedBlockAlgorithmConfig
  ): CipherParams {
    // Apply config defaults
    const config = Object.assign({}, this.cfg, cfg);
    // Encrypt
    const encryptor = cipher.createEncryptor(key, config);
    const ciphertext = encryptor.finalize(message);

    // Create and return serializable cipher params
    return new CipherParams({
      ciphertext: ciphertext,
      key: key,
      iv: encryptor.cfg.iv,
      algorithm: cipher,
      mode: encryptor.cfg.mode,
      padding: encryptor.cfg.padding,
      blockSize: encryptor.blockSize,
      formatter: config.format
    });
  }

  static decrypt(
    cipher: typeof Cipher,
    ciphertext: CipherParams | string,
    key: WordArray,
    optionalCfg?: BufferedBlockAlgorithmConfig
  ): WordArray {
    // Apply config defaults
    const cfg = Object.assign({}, this.cfg, optionalCfg);
    if (!cfg.format) {
      throw new Error("could not determine format");
    }

    // Convert string to CipherParams
    ciphertext = this._parse(ciphertext, cfg.format);

    if (!ciphertext.ciphertext) {
      throw new Error("could not determine ciphertext");
    }

    // Decrypt
    const plaintext = cipher
      .createDecryptor(key, cfg)
      .finalize(ciphertext.ciphertext);

    return plaintext;
  }

  static _parse(
    ciphertext: CipherParams | string,
    format: Formatter
  ): CipherParams {
    return typeof ciphertext === "string"
      ? format.parse(ciphertext)
      : ciphertext;
  }
}

SerializableCipher.cfg = {
  format: OpenSSL
};
