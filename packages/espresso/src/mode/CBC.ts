import { BlockCipherMode } from "./block-cipher-mode";
import { CBCDecryptor } from "./CBC.decryptor";
import { CBCEncryptor } from "./CBC.encryptor";

export abstract class CBC extends BlockCipherMode {
  public static Encryptor = CBCEncryptor;

  public static Decryptor = CBCDecryptor;
}
