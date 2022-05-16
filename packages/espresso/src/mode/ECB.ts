import { BlockCipherMode } from "./block-cipher-mode";
import { ECBDecryptor } from "./ECB.decryptor";
import { ECBEncryptor } from "./ECB.encryptor";

export abstract class ECB extends BlockCipherMode {
  public static Encryptor = ECBEncryptor;

  public static Decryptor = ECBDecryptor;
}
