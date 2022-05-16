// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-math-trunc */
import { StreamCipher } from "../../core/cipher/stream-cipher";
import { WordArray } from "../../core/word-array";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";
const S: number[] = [];
const C_: number[] = [];
const G: number[] = [];

export class RabbitLegacyAlgo extends StreamCipher {
  public static ivSize = 64 / 32;
  blockSize = 128 / 32;
  private _X: number[] = [];
  private _C: number[] = [];
  private _b = 0;
  constructor(
    xformMode: number,
    key: WordArray,
    cfg?: BufferedBlockAlgorithmConfig
  ) {
    super(xformMode, key, cfg);
  }

  reset(): void {
    super.reset();
    const K = this._key.words;
    const iv = this.cfg.iv;

    const X = (this._X = [
      K[0],
      (K[3] << 16) | (K[2] >>> 16),
      K[1],
      (K[0] << 16) | (K[3] >>> 16),
      K[2],
      (K[1] << 16) | (K[0] >>> 16),
      K[3],
      (K[2] << 16) | (K[1] >>> 16)
    ]);
    const C = (this._C = [
      (K[2] << 16) | (K[2] >>> 16),
      (K[0] & 0xff_ff_00_00) | (K[1] & 0x00_00_ff_ff),
      (K[3] << 16) | (K[3] >>> 16),
      (K[1] & 0xff_ff_00_00) | (K[2] & 0x00_00_ff_ff),
      (K[0] << 16) | (K[0] >>> 16),
      (K[2] & 0xff_ff_00_00) | (K[3] & 0x00_00_ff_ff),
      (K[1] << 16) | (K[1] >>> 16),
      (K[3] & 0xff_ff_00_00) | (K[0] & 0x00_00_ff_ff)
    ]);

    this._b = 0;

    // Iterate the system four times
    for (let i = 0; i < 4; i++) {
      this.nextState();
    }

    // Modify the counters
    for (let i = 0; i < 8; i++) {
      C[i] ^= X[(i + 4) & 7];
    }

    // IV setup
    if (iv) {
      // Shortcuts
      const IV = iv.words;
      const IV_0 = IV[0];
      const IV_1 = IV[1];

      // Generate four subvectors
      const i0 =
        (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00_ff_00_ff) |
        (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff_00_ff_00);
      const i2 =
        (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00_ff_00_ff) |
        (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff_00_ff_00);
      const i1 = (i0 >>> 16) | (i2 & 0xff_ff_00_00);
      const i3 = (i2 << 16) | (i0 & 0x00_00_ff_ff);

      // Modify counter values
      C[0] ^= i0;
      C[1] ^= i1;
      C[2] ^= i2;
      C[3] ^= i3;
      C[4] ^= i0;
      C[5] ^= i1;
      C[6] ^= i2;
      C[7] ^= i3;

      // Iterate the system four times
      for (let i = 0; i < 4; i++) {
        this.nextState();
      }
    }
  }
  private nextState() {
    // Shortcuts
    const X = this._X;
    const C = this._C;

    // Save old counter values
    for (let i = 0; i < 8; i++) {
      C_[i] = C[i];
    }

    // Calculate new counter values
    C[0] = (C[0] + 0x4d_34_d3_4d + this._b) | 0;
    C[1] = (C[1] + 0xd3_4d_34_d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0)) | 0;
    C[2] = (C[2] + 0x34_d3_4d_34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0)) | 0;
    C[3] = (C[3] + 0x4d_34_d3_4d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0)) | 0;
    C[4] = (C[4] + 0xd3_4d_34_d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0)) | 0;
    C[5] = (C[5] + 0x34_d3_4d_34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0)) | 0;
    C[6] = (C[6] + 0x4d_34_d3_4d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0)) | 0;
    C[7] = (C[7] + 0xd3_4d_34_d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0)) | 0;
    this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;

    // Calculate the g-values
    for (let i = 0; i < 8; i++) {
      const gx = X[i] + C[i];

      // Construct high and low argument for squaring
      const ga = gx & 0xff_ff;
      const gb = gx >>> 16;

      // Calculate high and low result of squaring
      const gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
      const gl =
        (((gx & 0xff_ff_00_00) * gx) | 0) + (((gx & 0x00_00_ff_ff) * gx) | 0);

      // High XOR low
      G[i] = gh ^ gl;
    }

    // Calculate new state values
    X[0] =
      (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) |
      0;
    X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
    X[2] =
      (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) |
      0;
    X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
    X[4] =
      (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) |
      0;
    X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
    X[6] =
      (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) |
      0;
    X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
  }
  _doProcessBlock(M: number[], offset: number): void {
    const X = this._X;
    this.nextState();

    // Generate four keystream words
    S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
    S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
    S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
    S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

    for (let i = 0; i < 4; i++) {
      // Swap endian
      S[i] =
        (((S[i] << 8) | (S[i] >>> 24)) & 0x00_ff_00_ff) |
        (((S[i] << 24) | (S[i] >>> 8)) & 0xff_00_ff_00);

      // Encrypt
      M[offset + i] ^= S[i];
    }
  }
}
