import { BlockCipherMode } from "./block-cipher-mode";
import { CTREncryptor } from "./CTR.encryptor";

export abstract class CTR extends BlockCipherMode {
  public static Encryptor = CTREncryptor;

  public static Decryptor = CTREncryptor;
}
