import { HashAlgorithm, HashOptions } from "../core/types";
import { hash } from "../hash";
import { hexDecode } from "../enc/hex";

export function hmac(
  algorithm: HashAlgorithm,
  data: string | Uint8Array,
  key: string | Uint8Array,
  _options?: HashOptions,
): string | Uint8Array {
  const keyBytes = typeof key === "string" ? new TextEncoder().encode(key) : key;
  const dataBytes = typeof data === "string" ? new TextEncoder().encode(data) : data;

  const blockSize = ["sha384", "sha512"].includes(algorithm) ? 128 : 64;

  let k = keyBytes;
  if (k.length > blockSize) {
    const hashed = hash(algorithm, k) as string;
    k = hexDecode(hashed);
  }

  const kPadded = new Uint8Array(blockSize);
  kPadded.set(k);

  const iKey = new Uint8Array(blockSize);
  const oKey = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    iKey[i] = kPadded[i] ^ 0x36;
    oKey[i] = kPadded[i] ^ 0x5c;
  }

  const innerData = new Uint8Array(iKey.length + dataBytes.length);
  innerData.set(iKey);
  innerData.set(dataBytes, iKey.length);
  const innerHash = hash(algorithm, innerData) as string;
  const innerHashBytes = hexDecode(innerHash);

  const outerData = new Uint8Array(oKey.length + innerHashBytes.length);
  outerData.set(oKey);
  outerData.set(innerHashBytes, oKey.length);
  const result = hash(algorithm, outerData);

  return result;
}
