import { BlockCipher } from "../core/cipher/block-cipher";

import { BlockCipherModeAlgorithm } from "./block-cipher-mode-algorithm";

export abstract class BlockCipherMode {
  public static Encryptor = BlockCipherModeAlgorithm;

  public static Decryptor = BlockCipherModeAlgorithm;

  public static createEncryptor(
    cipher: BlockCipher,
    iv: number[]
  ): BlockCipherModeAlgorithm {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,unicorn/no-this-assignment,@typescript-eslint/no-this-alias
    const encryptorClass: any = this.Encryptor;
    return new encryptorClass(cipher, iv);
  }

  public static createDecryptor(
    cipher: BlockCipher,
    iv: number[]
  ): BlockCipherModeAlgorithm {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,unicorn/no-this-assignment,@typescript-eslint/no-this-alias
    const decryptorClass: any = this.Decryptor;
    return new decryptorClass(cipher, iv);
  }
}
