import { CipherParams } from "../../core/cipher/cipher-params";

export interface Formatter {
  stringify: (_cipherParams: CipherParams) => string;

  parse: (_paramsStr: string) => CipherParams;
}
