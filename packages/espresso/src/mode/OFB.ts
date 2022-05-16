import { BlockCipherMode } from "./block-cipher-mode";
import { OFBEncryptor } from "./OFB.encryptor";

export abstract class OFB extends BlockCipherMode {
  public static Encryptor = OFBEncryptor;

  public static Decryptor = OFBEncryptor;
}
