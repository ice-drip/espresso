import { BlockCipherMode } from "./block-cipher-mode";
import { CTRGladmanEncryptor } from "./CTR-GLADMAN.encryptor";

export abstract class CTRGladman extends BlockCipherMode {
  public static Encryptor = CTRGladmanEncryptor;

  public static Decryptor = CTRGladmanEncryptor;
}
