import { Hasher } from "../../core/hash/hasher";
import { WordArray } from "../../core/word-array";
import { X64Word } from "../../core/x64-word";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

const RHO_OFFSETS: number[] = [];
const PI_INDEXES: number[] = [];
const ROUND_CONSTANT: X64Word[] = [];
let x = 1,
  y = 0;
for (let t = 0; t < 24; t++) {
  RHO_OFFSETS[x + 5 * y] = (((t + 1) * (t + 2)) / 2) % 64;

  const newX = y % 5;
  const newY = (2 * x + 3 * y) % 5;
  x = newX;
  y = newY;
}

// Compute pi index constants
for (let x = 0; x < 5; x++) {
  for (let y = 0; y < 5; y++) {
    PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
  }
}

// Compute round constants
let LFSR = 0x01;
for (let i = 0; i < 24; i++) {
  let roundConstantMsw = 0;
  let roundConstantLsw = 0;

  for (let j = 0; j < 7; j++) {
    if (LFSR & 0x01) {
      const bitPosition = (1 << j) - 1;
      if (bitPosition < 32) {
        roundConstantLsw ^= 1 << bitPosition;
      } /* if (bitPosition >= 32) */ else {
        roundConstantMsw ^= 1 << (bitPosition - 32);
      }
    }

    // Compute next LFSR
    if (LFSR & 0x80) {
      // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
      LFSR = (LFSR << 1) ^ 0x71;
    } else {
      LFSR <<= 1;
    }
  }

  ROUND_CONSTANT[i] = { high: roundConstantMsw, low: roundConstantLsw };
}

const T: X64Word[] = [];
for (let i = 0; i < 25; i += 1) {
  T[i] = {} as X64Word;
}

/**
 * SHA3算法
 *
 * @author rikka
 * @exports
 * @class SHA3Algo
 * @augments {Hasher}
 */
export class SHA3Algo extends Hasher {
  private _state!: X64Word[];
  blockSize = 512 / 32;

  constructor(cfg?: BufferedBlockAlgorithmConfig) {
    super(Object.assign({ outputLength: 512 }, cfg));
    this.reset();
  }

  reset(): void {
    super.reset();
    // eslint-disable-next-line prettier/prettier
    const state: X64Word[] = (this._state = []);
    for (let i = 0; i < 25; i++) {
      state[i] = {} as X64Word;
    }
    this.blockSize = (1600 - 2 * (this.cfg.outputLength as number)) / 32;
  }
  public _doFinalize(): WordArray {
    const data = this._data;
    const dataWords = data.words;
    const nBitsLeft = data.sigBytes * 8;
    const blockSizeBits = (this.blockSize as number) * 32;

    dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - (nBitsLeft % 32));
    dataWords[
      ((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1
    ] |= 0x80;
    data.sigBytes = dataWords.length * 4;

    this._process();

    const state = this._state;
    const outputLengthBytes = (this.cfg.outputLength as number) / 8;
    const outputLengthLanes = outputLengthBytes / 8;

    // Squeeze
    const hashWords = [];
    for (let i = 0; i < outputLengthLanes; i++) {
      // Shortcuts
      const lane = state[i];
      let laneMsw = lane.high;
      let laneLsw = lane.low;

      // Swap endian
      laneMsw =
        (((laneMsw << 8) | (laneMsw >>> 24)) & 0x00_ff_00_ff) |
        (((laneMsw << 24) | (laneMsw >>> 8)) & 0xff_00_ff_00);
      laneLsw =
        (((laneLsw << 8) | (laneLsw >>> 24)) & 0x00_ff_00_ff) |
        (((laneLsw << 24) | (laneLsw >>> 8)) & 0xff_00_ff_00);

      // Squeeze state to retrieve hash
      hashWords.push(laneLsw, laneMsw);
    }
    return new WordArray(hashWords, outputLengthBytes);
  }
  _doProcessBlock(M: number[], offset: number): void {
    const state: X64Word[] = this._state;
    const nBlockSizeLanes = (this.blockSize as number) / 2;
    for (let i = 0; i < nBlockSizeLanes; i++) {
      // Shortcuts
      let M2i = M[offset + 2 * i];
      let M2i1 = M[offset + 2 * i + 1];

      // Swap endian
      M2i =
        (((M2i << 8) | (M2i >>> 24)) & 0x00_ff_00_ff) |
        (((M2i << 24) | (M2i >>> 8)) & 0xff_00_ff_00);
      M2i1 =
        (((M2i1 << 8) | (M2i1 >>> 24)) & 0x00_ff_00_ff) |
        (((M2i1 << 24) | (M2i1 >>> 8)) & 0xff_00_ff_00);

      // Absorb message into state
      const lane = state[i];
      lane.high ^= M2i1;
      lane.low ^= M2i;
    }

    // Rounds
    for (let round = 0; round < 24; round++) {
      // Theta
      for (let _x = 0; _x < 5; _x++) {
        // Mix column lanes
        let tMsw = 0,
          tLsw = 0;
        for (let _y = 0; _y < 5; _y++) {
          const lane = state[_x + 5 * _y];
          tMsw ^= lane.high;
          tLsw ^= lane.low;
        }

        // Temporary values
        const Tx = T[_x];
        Tx.high = tMsw;
        Tx.low = tLsw;
      }
      for (let _x = 0; _x < 5; _x++) {
        // Shortcuts
        const Tx4 = T[(_x + 4) % 5];
        const Tx1 = T[(_x + 1) % 5];
        const Tx1Msw = Tx1.high;
        const Tx1Lsw = Tx1.low;

        // Mix surrounding columns
        const tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
        const tLsw = Tx4.low ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
        for (let _y = 0; _y < 5; _y++) {
          const lane = state[_x + 5 * _y];
          lane.high ^= tMsw;
          lane.low ^= tLsw;
        }
      }

      // Rho Pi
      for (let laneIndex = 1; laneIndex < 25; laneIndex++) {
        let tMsw;
        let tLsw;

        // Shortcuts
        const lane = state[laneIndex];
        const laneMsw = lane.high;
        const laneLsw = lane.low;
        const rhoOffset = RHO_OFFSETS[laneIndex];

        // Rotate lanes
        if (rhoOffset < 32) {
          tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
          tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
        } /* if (rhoOffset >= 32) */ else {
          tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
          tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
        }

        // Transpose lanes
        const TPiLane = T[PI_INDEXES[laneIndex]];
        TPiLane.high = tMsw;
        TPiLane.low = tLsw;
      }

      // Rho pi at x = y = 0
      const T0 = T[0];
      const state0 = state[0];
      T0.high = state0.high;
      T0.low = state0.low;

      // Chi
      for (let _x = 0; _x < 5; _x++) {
        for (let _y = 0; _y < 5; _y++) {
          // Shortcuts
          const laneIndex = _x + 5 * _y;
          const lane = state[laneIndex];
          const TLane = T[laneIndex];
          const Tx1Lane = T[((_x + 1) % 5) + 5 * _y];
          const Tx2Lane = T[((_x + 2) % 5) + 5 * _y];

          // Mix rows
          lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
          lane.low = TLane.low ^ (~Tx1Lane.low & Tx2Lane.low);
        }
      }

      // Iota
      const lane = state[0];
      const roundConstant = ROUND_CONSTANT[round];
      lane.high ^= roundConstant.high;
      lane.low ^= roundConstant.low;
    }
  }
}
