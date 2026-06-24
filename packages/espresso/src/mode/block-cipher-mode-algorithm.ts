import { BlockCipher } from "../core/cipher/block-cipher";

import { BlockCipherMode } from "./block-cipher-mode";

export abstract class BlockCipherModeAlgorithm {
  protected cipher!: BlockCipher;

  protected iv: number[] | undefined;

  public creator: ((_cipher: BlockCipher, _iv: number[]) => BlockCipherMode) | undefined;

  constructor(cipher: BlockCipher, iv: number[]) {
    this.init(cipher, iv);
  }

  public init(cipher: BlockCipher, iv?: number[]): void {
    this.cipher = cipher;
    this.iv = iv;
  }

  public abstract processBlock(_words: number[], _offset: number): void;
}
