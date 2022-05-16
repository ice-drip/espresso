import { CipherParams } from "../core/cipher/cipher-params";
import { Hex as EncHex } from "../enc/hex";
import { Formatter } from "../typings/format/format.typing";

export const Hex: Formatter = {
  stringify(cipherParams: CipherParams): string {
    if (cipherParams.ciphertext === undefined) {
      throw new Error("ciphertext is undefined");
    }
    return cipherParams.ciphertext.toString(EncHex);
  },
  parse(input: string): CipherParams {
    const ciphertext = EncHex.parse(input);
    return new CipherParams({ ciphertext });
  }
};
