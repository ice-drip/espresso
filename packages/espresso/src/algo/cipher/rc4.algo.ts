import { StreamCipher } from "../../core/cipher/stream-cipher";
import { WordArray } from "../../core/word-array";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

export class RC4Algo extends StreamCipher {
  public static keySize = 256 / 32;
  public static ivSize = 0;
  blockSize = 1;
  private _S: number[] = [];
  private _i!: number;
  private _j!: number;
  constructor(
    xformMode: number,
    key: WordArray,
    cfg?: BufferedBlockAlgorithmConfig
  ) {
    super(xformMode, key, cfg);
  }
  reset(): void {
    super.reset();
    const key = this._key;
    const keyWords = key.words;
    const keySigBytes = key.sigBytes;

    // Init sbox
    this._S = [];
    const S: number[] = this._S;
    for (let i = 0; i < 256; i++) {
      S[i] = i;
    }

    // Key setup
    for (let i = 0, j = 0; i < 256; i++) {
      const keyByteIndex = i % keySigBytes;
      const keyByte =
        (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

      j = (j + S[i] + keyByte) % 256;

      // Swap
      const t = S[i];
      S[i] = S[j];
      S[j] = t;
    }

    // Counters
    this._j = 0;
    this._i = this._j;
  }

  public generateKeystreamWord(): number {
    // Shortcuts
    const S = this._S;
    const i = this._i;
    let j = this._j;

    // Generate keystream word
    let keystreamWord = 0;
    for (let n = 0; n < 4; n++) {
      this._i = (i + 1) % 256;
      j = (j + S[i]) % 256;

      // Swap
      const t = S[i];
      S[i] = S[j];
      S[j] = t;

      keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
    }

    // Update counters
    this._i = i;
    this._j = j;

    return keystreamWord;
  }

  _doProcessBlock(M: number[], offset: number): void {
    M[offset] ^= this.generateKeystreamWord();
  }
}

export class RC4DropAlgo extends RC4Algo {
  constructor(
    xformMode: number,
    key: WordArray,
    cfg?: BufferedBlockAlgorithmConfig
  ) {
    super(xformMode, key, Object.assign({ drop: 192 }, cfg));
  }

  reset(): void {
    super.reset();
    if (this.cfg.drop === undefined) {
      throw new Error("drop is undefined");
    }
    for (let i = this.cfg.drop; i > 0; i--) {
      this.generateKeystreamWord();
    }
  }
}
