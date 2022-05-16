import { Hex } from "../enc/hex";
import { Encoding } from "../typings/core/encoding.typing";

/**
 * 一个由32位字组成的数组
 *
 * @author rikka
 * @exports
 * @class WordArray
 */
export class WordArray {
  public static random(nBytes: number): WordArray {
    const words = [];

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const r = function (m_w: number) {
      let m_z = 0x3a_de_68_b1;

      const mask = 0xff_ff_ff_ff;

      return function () {
        m_z = (0x90_69 * (m_z & 0xff_ff) + (m_z >> 0x10)) & mask;
        m_w = (0x46_50 * (m_w & 0xff_ff) + (m_w >> 0x10)) & mask;
        let result = ((m_z << 0x10) + m_w) & mask;
        result /= 0x1_00_00_00_00;
        result += 0.5;
        return result * (Math.random() > 0.5 ? 1 : -1);
      };
    };

    for (let i = 0, rcache; i < nBytes; i += 4) {
      const _r = r((rcache || Math.random()) * 0x1_00_00_00_00);

      rcache = _r() * 0x3a_de_67_b7;
      // eslint-disable-next-line unicorn/prefer-math-trunc
      words.push((_r() * 0x1_00_00_00_00) | 0);
    }

    return new WordArray(words, nBytes);
  }
  public words: number[];
  public sigBytes: number;

  constructor(words?: number[], sigBytes?: number) {
    this.words = words || [];

    this.sigBytes = sigBytes !== undefined ? sigBytes : this.words.length * 4;
  }

  toString(encoder?: Encoding): string {
    return (encoder || Hex).stringify(this);
  }

  concat(wordArray: WordArray): WordArray {
    // Clamp excess bits
    this.clamp();

    // Concat
    if (this.sigBytes % 4) {
      // Copy one byte at a time
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte =
          (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        this.words[(this.sigBytes + i) >>> 2] |=
          thatByte << (24 - ((this.sigBytes + i) % 4) * 8);
      }
    } else {
      // Copy one word at a time
      for (let i = 0; i < wordArray.sigBytes; i += 4) {
        this.words[(this.sigBytes + i) >>> 2] = wordArray.words[i >>> 2];
      }
    }
    this.sigBytes += wordArray.sigBytes;

    // Chainable
    return this;
  }

  clamp(): void {
    // Clamp
    this.words[this.sigBytes >>> 2] &=
      0xff_ff_ff_ff << (32 - (this.sigBytes % 4) * 8);
    this.words.length = Math.ceil(this.sigBytes / 4);
  }

  clone(): WordArray {
    return new WordArray([...this.words], this.sigBytes);
  }
}
