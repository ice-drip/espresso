// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-spread */
import { CipherParams } from "../core/cipher/cipher-params";
import { WordArray } from "../core/word-array";
import { Base64 } from "../enc/base64";

/**
 * OpenSSL 格式化策略
 */
export const OpenSSL = {
  stringify(cipherParams: CipherParams): string {
    if (!cipherParams.ciphertext) {
      throw new Error("missing ciphertext in params");
    }
    const { ciphertext, salt } = cipherParams;
    let wordArray: WordArray;
    if (salt) {
      if (typeof salt === "string") {
        throw new TypeError("salt is expected to be a WordArray");
      }

      wordArray = new WordArray([0x53_61_6c_74, 0x65_64_5f_5f])
        .concat(salt)
        .concat(ciphertext);
    } else {
      wordArray = ciphertext;
    }

    return wordArray.toString(Base64);
  },
  parse(openSSlStr: string): CipherParams {
    const ciphertext = Base64.parse(openSSlStr);

    let salt: WordArray | undefined;
    if (
      ciphertext.words[0] === 0x53_61_6c_74 &&
      ciphertext.words[1] === 0x65_64_5f_5f
    ) {
      salt = new WordArray(ciphertext.words.slice(2, 4));
      ciphertext.words.splice(0, 4);
      ciphertext.sigBytes -= 16;
    }
    return new CipherParams({ ciphertext, salt });
  }
};
