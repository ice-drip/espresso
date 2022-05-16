import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class ECBDecryptor extends BlockCipherModeAlgorithm {
  public processBlock(_words: number[], _offset: number): void {
    this._cipher.decryptBlock(_words, _offset);
  }
}
