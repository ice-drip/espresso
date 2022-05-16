import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export class ECBEncryptor extends BlockCipherModeAlgorithm {
  public processBlock(_words: number[], _offset: number): void {
    this._cipher.encryptBlock(_words, _offset);
  }
}
