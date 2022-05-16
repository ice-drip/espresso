import { EvpKDF } from "../algo/kdf/evp-kdf";
import { CipherParams } from "../core/cipher/cipher-params";
import { WordArray } from "../core/word-array";
import { KDF } from "../typings/kdf/kdf.typing";

/**
 * OpenSSL的密钥推导功能
 */
export const OpenSSLKdf: KDF = {
  execute(
    password: string,
    keySize: number,
    ivSize: number,
    salt?: WordArray | string
  ) {
    if (!salt) {
      salt = WordArray.random(64 / 8);
    }

    const key = new EvpKDF({ keySize: keySize + ivSize }).compute(
      password,
      salt
    );

    const iv = new WordArray(key.words.slice(keySize), ivSize * 4);
    key.sigBytes = keySize * 4;

    return new CipherParams({ key, iv, salt });
  }
};
