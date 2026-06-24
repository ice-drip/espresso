import { CipherParams } from "../core/cipher/cipher-params";
import { Hex as EncHex, hexDecode, hexEncode } from "../enc/hex";
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
  },
};

export function hexFormat(ciphertext: Uint8Array): string {
  return hexEncode(ciphertext);
}

export function hexParse(str: string): Uint8Array {
  return hexDecode(str);
}
