import { RIPEMD256Algo } from "../algo/hash/ripemd256.algo";

export function ripemd256(data: Uint8Array): Uint8Array {
  const hasher = new RIPEMD256Algo();
  const latin1 = Array.from(data)
    .map((b) => String.fromCharCode(b))
    .join("");
  const result = hasher.finalize(latin1);
  const bytes = new Uint8Array(result.sigBytes);
  for (let i = 0; i < result.sigBytes; i++) {
    bytes[i] = (result.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return bytes;
}
