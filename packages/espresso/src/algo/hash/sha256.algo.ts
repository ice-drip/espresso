// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-math-trunc,jsdoc/require-jsdoc */
import { Hasher } from "../../core/hash/hasher";
import { WordArray } from "../../core/word-array";

const H: number[] = [];
const K: number[] = [];

(function () {
  function isPrime(n: number): boolean {
    const sqrtN = Math.sqrt(n);
    for (let factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) {
        return false;
      }
    }
    return true;
  }

  function getFractionalBits(n: number): number {
    return ((n - (n | 0)) * 0x1_00_00_00_00) | 0;
  }

  let n = 2;
  let nPrime = 0;
  while (nPrime < 64) {
    if (isPrime(n)) {
      if (nPrime < 8) {
        H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
      }
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
      nPrime++;
    }
    n++;
  }
})();

const W: number[] = [];

/**
 * SHA256算法
 *
 * @author rikka
 * @exports
 * @class SHA256Algo
 * @augments {Hasher}
 */
export class SHA256Algo extends Hasher {
  public _hash!: WordArray;

  reset(): void {
    super.reset();
    // eslint-disable-next-line unicorn/prefer-spread
    this._hash = new WordArray(H.slice(0));
  }

  public _doFinalize(): WordArray {
    const data = this._data;
    const dataWords = data.words;
    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = data.sigBytes * 8;

    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
      nBitsTotal / 0x1_00_00_00_00
    );
    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
    data.sigBytes = dataWords.length * 4;
    this._process();
    return this._hash;
  }
  _doProcessBlock(M: number[], offset: number): void {
    const Hm = this._hash.words;

    let a = Hm[0];
    let b = Hm[1];
    let c = Hm[2];
    let d = Hm[3];
    let e = Hm[4];
    let f = Hm[5];
    let g = Hm[6];
    let h = Hm[7];

    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const gamma0x = W[i - 15];
        const gamma0 =
          ((gamma0x << 25) | (gamma0x >>> 7)) ^
          ((gamma0x << 14) | (gamma0x >>> 18)) ^
          (gamma0x >>> 3);

        const gamma1x = W[i - 2];
        const gamma1 =
          ((gamma1x << 15) | (gamma1x >>> 17)) ^
          ((gamma1x << 13) | (gamma1x >>> 19)) ^
          (gamma1x >>> 10);

        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
      }

      const ch = (e & f) ^ (~e & g);
      const maj = (a & b) ^ (a & c) ^ (b & c);

      const sigma0 =
        ((a << 30) | (a >>> 2)) ^
        ((a << 19) | (a >>> 13)) ^
        ((a << 10) | (a >>> 22));
      const sigma1 =
        ((e << 26) | (e >>> 6)) ^
        ((e << 21) | (e >>> 11)) ^
        ((e << 7) | (e >>> 25));

      const t1 = h + sigma1 + ch + K[i] + W[i];
      const t2 = sigma0 + maj;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    Hm[0] = (Hm[0] + a) | 0;
    Hm[1] = (Hm[1] + b) | 0;
    Hm[2] = (Hm[2] + c) | 0;
    Hm[3] = (Hm[3] + d) | 0;
    Hm[4] = (Hm[4] + e) | 0;
    Hm[5] = (Hm[5] + f) | 0;
    Hm[6] = (Hm[6] + g) | 0;
    Hm[7] = (Hm[7] + h) | 0;
  }
}
