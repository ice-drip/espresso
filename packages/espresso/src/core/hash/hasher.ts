// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-math-trunc,jsdoc/require-jsdoc */
import { Type } from "../../typings/common.typing";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

import { BufferedBlockAlgorithm } from "../buffered-block-algorithm";
import { WordArray } from "../word-array";
import { HmacHasher } from "./hmac-hasher";

/**
 * Hasher模板抽象�? *
 * @author rikka
 * @exports
 * @abstract
 * @class Hasher
 * @augments {BufferedBlockAlgorithm}
 */
export abstract class Hasher extends BufferedBlockAlgorithm {
  blockSize = 512 / 32;
  public constructor(cfg?: BufferedBlockAlgorithmConfig) {
    super(cfg);
    this.reset();
  }
  reset(): void {
    this.data = new WordArray();
    this.nDataBytes = 0;
  }
  update(messageUpdate: string | WordArray): Hasher {
    this.append(messageUpdate);
    this.processBlocks();
    return this;
  }
  finalize(messageUpdate?: string | WordArray): WordArray {
    if (messageUpdate) {
      this.append(messageUpdate);
    }
    const hash = this.doFinalize();
    return hash;
  }
  public static createHelper(hasher: Type<Hasher>): CreateHelperType {
    return function (message: WordArray | string, cfg?: BufferedBlockAlgorithmConfig): WordArray {
      const hasherClass: Type<Hasher> = hasher;
      const hasherInstance: Hasher = new hasherClass(cfg);
      return hasherInstance.finalize(message);
    };
  }

  public static createHmacHelper(hasher: Type<Hasher>) {
    return function (message: WordArray | string, key: string): WordArray {
      const hmacInstance = new HmacHasher(hasher, key);
      return hmacInstance.finalize(message);
    };
  }

  public abstract doFinalize(): WordArray;
}

export type CreateHelperType = (
  _message: WordArray | string,
  _cfg?: BufferedBlockAlgorithmConfig,
) => WordArray;
