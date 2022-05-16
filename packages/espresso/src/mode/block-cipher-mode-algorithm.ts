import { BlockCipher } from "../core/cipher/block-cipher";

import { BlockCipherMode } from "./block-cipher-mode";

export abstract class BlockCipherModeAlgorithm {
  public _cipher!: BlockCipher;

  public _iv: number[] | undefined;

  public __creator:
    | ((_cipher: BlockCipher, _iv: number[]) => BlockCipherMode)
    | undefined;

  constructor(cipher: BlockCipher, iv: number[]) {
    this.init(cipher, iv);
  }

  public init(cipher: BlockCipher, iv?: number[]): void {
    this._cipher = cipher;
    this._iv = iv;
  }

  public abstract processBlock(_words: number[], _offset: number): void;
}
