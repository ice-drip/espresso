import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class CTRGladmanEncryptor extends BlockCipherModeAlgorithm {
  public _counter!: number[];
  public processBlock(words: number[], offset: number): void {
    const cipher = this._cipher;
    const blockSize = cipher.blockSize;
    if (blockSize === undefined) {
      throw new Error("block size is undefined");
    }
    const iv = this._iv;
    let counter = this._counter;
    if (iv) {
      counter = this._counter = [...iv];

      // Remove IV for subsequent blocks
      this._iv = undefined;
    }
    this.incCounter(counter);
    const keystream = [...counter];
    cipher.encryptBlock(keystream, 0);

    for (let i = 0; i < blockSize; i++) {
      words[offset + i] ^= keystream[i];
    }
  }

  private incCounter(counter: number[]) {
    if ((counter[0] = this.incWord(counter[0])) === 0) {
      // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
      counter[1] = this.incWord(counter[1]);
    }
    return counter;
  }

  private incWord(word: number) {
    if (((word >> 24) & 0xff) === 0xff) {
      //overflow
      let b1 = (word >> 16) & 0xff;
      let b2 = (word >> 8) & 0xff;
      let b3 = word & 0xff;

      if (b1 === 0xff) {
        // overflow b1
        b1 = 0;
        if (b2 === 0xff) {
          b2 = 0;
          if (b3 === 0xff) {
            b3 = 0;
          } else {
            ++b3;
          }
        } else {
          ++b2;
        }
      } else {
        ++b1;
      }

      word = 0;
      word += b1 << 16;
      word += b2 << 8;
      word += b3;
    } else {
      word += 0x01 << 24;
    }
    return word;
  }
}
