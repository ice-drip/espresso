import { Utf8 } from "../../enc/utf8";
import { Type } from "../../typings/common.typing";

import { WordArray } from "../word-array";
import { Hasher } from "./hasher";

/**
 * hmac hash算法
 *
 * @author rikka
 * @exports
 * @class HmacHasher
 */
export class HmacHasher {
  private _hasher: Hasher;

  private _oKey: WordArray;
  private _iKey: WordArray;

  constructor(hasher: Type<Hasher>, key: string | WordArray) {
    const hasher_t = (this._hasher = new hasher());
    if (typeof key === "string") {
      key = Utf8.parse(key);
    }

    const hasherBlockSize: number = hasher_t.blockSize as number;
    const hasherBlockSizeBytes = hasherBlockSize * 4;

    if ((key as WordArray).sigBytes > hasherBlockSizeBytes) {
      key = hasher_t.finalize(key);
    }

    (key as WordArray).clamp();

    const oKey = (this._oKey = (key as WordArray).clone());
    const iKey = (this._iKey = (key as WordArray).clone());

    const oKeyWords = oKey.words;
    const iKeyWords = iKey.words;

    for (let i = 0; i < hasherBlockSize; i++) {
      oKeyWords[i] ^= 0x5c_5c_5c_5c;
      iKeyWords[i] ^= 0x36_36_36_36;
    }

    oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

    this.reset();
  }

  public reset(): void {
    const hasher = this._hasher;
    hasher.reset();
    hasher.update(this._iKey);
  }

  update(messageUpdate: string | WordArray): HmacHasher {
    this._hasher.update(messageUpdate);
    return this;
  }

  finalize(messageUpdate: string | WordArray): WordArray {
    const hasher = this._hasher;
    const innerHash = hasher.finalize(messageUpdate);

    hasher.reset();

    // eslint-disable-next-line unicorn/prefer-spread
    const hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
    return hmac;
  }
}
