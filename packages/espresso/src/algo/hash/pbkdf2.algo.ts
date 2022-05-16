import { HmacHasher } from "../../core/hash/hmac-hasher";
import { WordArray } from "../../core/word-array";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

import { SHA1Algo } from "./sha1.algo";

export class PBKDF2Algo {
  cfg!: BufferedBlockAlgorithmConfig;
  constructor(cfg?: BufferedBlockAlgorithmConfig) {
    this.cfg = Object.assign(
      {
        keySize: 128 / 32,
        hasher: SHA1Algo,
        iterations: 1
      },
      cfg
    );
  }

  compute(password: string | WordArray, salt: string | WordArray): WordArray {
    if (this.cfg.hasher === undefined) {
      throw new Error("Hasher is undefined");
    }

    // Init HMAC
    const hmac = new HmacHasher(this.cfg.hasher, password);

    // Initial values
    const derivedKey = new WordArray();
    const blockIndex = new WordArray([0x00_00_00_01]);

    // Shortcuts
    const derivedKeyWords = derivedKey.words;
    const blockIndexWords = blockIndex.words;
    const { keySize, iterations } = this.cfg;
    if (keySize === undefined || iterations === undefined) {
      throw new Error("key_size or iterations is undefined");
    }
    // Generate key
    while (derivedKeyWords.length < keySize) {
      const block = hmac.update(salt).finalize(blockIndex);
      hmac.reset();

      // Shortcuts
      const blockWords = block.words;
      const blockWordsLength = blockWords.length;

      // Iterations
      let intermediate = block;
      for (let i = 1; i < iterations; i += 1) {
        intermediate = hmac.finalize(intermediate);
        hmac.reset();

        // Shortcut
        const intermediateWords = intermediate.words;

        // XOR intermediate with block
        for (let j = 0; j < blockWordsLength; j += 1) {
          blockWords[j] ^= intermediateWords[j];
        }
      }

      // eslint-disable-next-line unicorn/prefer-spread
      derivedKey.concat(block);
      blockIndexWords[0] += 1;
    }
    derivedKey.sigBytes = keySize * 4;

    return derivedKey;
  }
}
export const PBKDF2: (
  _password: string | WordArray,
  _salt: string | WordArray,
  _cfg?: BufferedBlockAlgorithmConfig
) => WordArray = (
  password: string | WordArray,
  salt: string | WordArray,
  cfg?: BufferedBlockAlgorithmConfig
) => new PBKDF2Algo(cfg).compute(password, salt);
