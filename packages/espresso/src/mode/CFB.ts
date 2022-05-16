import { BlockCipherMode } from "./block-cipher-mode";
import { CFBDecryptor } from "./CFB.decryptor";
import { CFBEncryptor } from "./CFB.encryptor";

export abstract class CFB extends BlockCipherMode {
  public static Encryptor = CFBEncryptor;

  public static Decryptor = CFBDecryptor;
}
