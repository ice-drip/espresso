import { HashAlgorithm, HashOptions } from "../core/types";
import { md4 } from "./md4-adapter";
import { md5 } from "./md5";
import { ripemd128 } from "./ripemd128-adapter";
import { ripemd256 } from "./ripemd256-adapter";
import { ripemd320 } from "./ripemd320-adapter";
import { sha1 } from "./sha1";
import { sha224 } from "./sha224";
import { sha256 } from "./sha256";
import { sha384 } from "./sha384";
import { sha512 } from "./sha512";

const hashImpls: Record<string, (data: Uint8Array) => Uint8Array> = {
  md4,
  md5,
  ripemd128,
  ripemd256,
  ripemd320,
  sha1,
  sha224,
  sha256,
  sha384,
  sha512,
};

export function hash(
  algorithm: HashAlgorithm,
  data: string | Uint8Array,
  options?: HashOptions,
): string | Uint8Array {
  const impl = hashImpls[algorithm];
  if (!impl) throw new Error(`Unsupported hash algorithm: ${algorithm}`);

  const input = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const result = impl(input);

  if (options?.outputEncoding) {
    return encodeOutput(result, options.outputEncoding);
  }
  return Array.from(result)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function encodeOutput(bytes: Uint8Array, encoding: string): string {
  switch (encoding) {
    case "hex":
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    case "base64": {
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }
    case "utf8":
      return new TextDecoder().decode(bytes);
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }
}
