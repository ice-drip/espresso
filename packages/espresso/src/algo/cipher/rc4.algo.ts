import { StreamCipher } from "../../core/cipher/stream-cipher";
import { WordArray } from "../../core/word-array";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

export class RC4Algo extends StreamCipher {
  public static keySize = 256 / 32;
  public static ivSize = 0;
  blockSize = 1;
  private S: number[] = [];
  private i!: number;
  private j!: number;
  constructor(xformMode: number, key: WordArray, cfg?: BufferedBlockAlgorithmConfig) {
    super(xformMode, key, cfg);
  }
  reset(): void {
    super.reset();
    const key = this.key;
    const keyWords = key.words;
    const keySigBytes = key.sigBytes;

    // Init sbox
    this.S = [];
    const S: number[] = this.S;
    for (let i = 0; i < 256; i++) {
      S[i] = i;
    }

    // Key setup
    for (let i = 0, j = 0; i < 256; i++) {
      const keyByteIndex = i % keySigBytes;
      const keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

      j = (j + S[i] + keyByte) % 256;

      // Swap
      const t = S[i];
      S[i] = S[j];
      S[j] = t;
    }

    // Counters
    this.j = 0;
    this.i = this.j;
  }

  public generateKeystreamWord(): number {
    // Shortcuts
    const S = this.S;
    const i = this.i;
    let j = this.j;

    // Generate keystream word
    let keystreamWord = 0;
    for (let n = 0; n < 4; n++) {
      this.i = (i + 1) % 256;
      j = (j + S[i]) % 256;

      // Swap
      const t = S[i];
      S[i] = S[j];
      S[j] = t;

      keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
    }

    // Update counters
    this.i = i;
    this.j = j;

    return keystreamWord;
  }

  doProcessBlock(M: number[], offset: number): void {
    M[offset] ^= this.generateKeystreamWord();
  }
}

export class RC4DropAlgo extends RC4Algo {
  constructor(xformMode: number, key: WordArray, cfg?: BufferedBlockAlgorithmConfig) {
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
