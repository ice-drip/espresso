import { Algorithm, CipherOptions, CipherInput } from "../core/types";
import { utf8Encode, utf8Decode } from "../enc/utf8";
import { hexEncode, hexDecode } from "../enc/hex";
import { aesEncrypt, aesDecrypt } from "./aes";
import { desEncrypt, desDecrypt } from "./des";
import { tripleDesEncrypt, tripleDesDecrypt } from "./triple-des";
import { blowfishEncrypt, blowfishDecrypt } from "./blowfish";
import { rc4Encrypt, rc4Decrypt, rc4DropEncrypt, rc4DropDecrypt } from "./rc4";
import { seedEncrypt, seedDecrypt } from "./seed";
import { RabbitAlgo } from "../algo/cipher/rabbit.algo";
import { RabbitLegacyAlgo } from "../algo/cipher/rabbit-legacy.algo";
import { WordArray } from "../core/word-array";
import { SerializableCipher } from "../core/cipher/serializable-cipher";
import { Hex as HexFormat } from "../format/hex";

export function encrypt(
  algorithm: Algorithm,
  message: CipherInput,
  key: CipherInput,
  options?: CipherOptions,
): string | Uint8Array {
  const msgBytes = typeof message === "string" ? utf8Encode(message) : message;
  const keyBytes = typeof key === "string" ? utf8Encode(key) : key;
  const opts = { mode: "cbc" as const, padding: "pkcs7" as const, ...options };

  let result: Uint8Array;
  switch (algorithm) {
    case "aes":
      result = aesEncrypt(msgBytes, keyBytes, opts);
      break;
    case "des":
      result = desEncrypt(msgBytes, keyBytes, opts);
      break;
    case "triple-des":
      result = tripleDesEncrypt(msgBytes, keyBytes, opts);
      break;
    case "blowfish":
      result = blowfishEncrypt(msgBytes, keyBytes, opts);
      break;
    case "rc4":
      result = rc4Encrypt(msgBytes, keyBytes);
      break;
    case "rc4-drop":
      result = rc4DropEncrypt(msgBytes, keyBytes);
      break;
    case "rabbit": {
      const rabbitIv = opts.iv
        ? typeof opts.iv === "string"
          ? hexDecode(opts.iv)
          : opts.iv
        : undefined;
      result = rabbitAlgoEncrypt(msgBytes, keyBytes, rabbitIv);
      break;
    }
    case "rabbit-legacy": {
      const rabbitLegacyIv = opts.iv
        ? typeof opts.iv === "string"
          ? hexDecode(opts.iv)
          : opts.iv
        : undefined;
      result = rabbitLegacyAlgoEncrypt(msgBytes, keyBytes, rabbitLegacyIv);
      break;
    }
    case "seed":
      result = seedEncrypt(msgBytes, keyBytes, opts);
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  if (opts.outputEncoding) {
    return encodeOutput(result, opts.outputEncoding);
  }
  return result;
}

export function decrypt(
  algorithm: Algorithm,
  ciphertext: CipherInput,
  key: CipherInput,
  options?: CipherOptions,
): string | Uint8Array {
  const ctBytes = typeof ciphertext === "string" ? hexDecode(ciphertext) : ciphertext;
  const keyBytes = typeof key === "string" ? utf8Encode(key) : key;
  const opts = { mode: "cbc" as const, padding: "pkcs7" as const, ...options };

  let result: Uint8Array;
  switch (algorithm) {
    case "aes":
      result = aesDecrypt(ctBytes, keyBytes, opts);
      break;
    case "des":
      result = desDecrypt(ctBytes, keyBytes, opts);
      break;
    case "triple-des":
      result = tripleDesDecrypt(ctBytes, keyBytes, opts);
      break;
    case "blowfish":
      result = blowfishDecrypt(ctBytes, keyBytes, opts);
      break;
    case "rc4":
      result = rc4Decrypt(ctBytes, keyBytes);
      break;
    case "rc4-drop":
      result = rc4DropDecrypt(ctBytes, keyBytes);
      break;
    case "rabbit": {
      const rabbitIv = opts.iv
        ? typeof opts.iv === "string"
          ? hexDecode(opts.iv)
          : opts.iv
        : undefined;
      result = rabbitAlgoDecrypt(ctBytes, keyBytes, rabbitIv);
      break;
    }
    case "rabbit-legacy": {
      const rabbitLegacyIv = opts.iv
        ? typeof opts.iv === "string"
          ? hexDecode(opts.iv)
          : opts.iv
        : undefined;
      result = rabbitLegacyAlgoDecrypt(ctBytes, keyBytes, rabbitLegacyIv);
      break;
    }
    case "seed":
      result = seedDecrypt(ctBytes, keyBytes, opts);
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  if (opts.outputEncoding === "utf8") {
    return utf8Decode(result);
  }
  return encodeOutput(result, opts.outputEncoding ?? "hex");
}

function uint8ArrayToWordArray(u8arr: Uint8Array): WordArray {
  const words: number[] = [];
  for (let i = 0; i < u8arr.length; i += 4) {
    words.push(
      ((u8arr[i] << 24) | (u8arr[i + 1] << 16) | (u8arr[i + 2] << 8) | u8arr[i + 3]) >>> 0,
    );
  }
  return new WordArray(words, u8arr.length);
}

function wordArrayToUint8Array(wordArray: WordArray): Uint8Array {
  const { words, sigBytes } = wordArray;
  const result = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    result[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return result;
}

function rabbitAlgoEncrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  const keyWordArray = uint8ArrayToWordArray(key);
  const dataWordArray = uint8ArrayToWordArray(data);
  const cfg: any = { format: HexFormat };
  if (iv) {
    cfg.iv = uint8ArrayToWordArray(iv);
  }
  const encrypted = SerializableCipher.encrypt(RabbitAlgo, dataWordArray, keyWordArray, cfg);
  return wordArrayToUint8Array(encrypted.ciphertext!);
}

function rabbitAlgoDecrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  const keyWordArray = uint8ArrayToWordArray(key);
  const dataWordArray = uint8ArrayToWordArray(data);
  const cfg: any = { format: HexFormat };
  if (iv) {
    cfg.iv = uint8ArrayToWordArray(iv);
  }
  const decrypted = SerializableCipher.decrypt(
    RabbitAlgo,
    { ciphertext: dataWordArray } as any,
    keyWordArray,
    cfg,
  );
  return wordArrayToUint8Array(decrypted);
}

function rabbitLegacyAlgoEncrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  const keyWordArray = uint8ArrayToWordArray(key);
  const dataWordArray = uint8ArrayToWordArray(data);
  const cfg: any = { format: HexFormat };
  if (iv) {
    cfg.iv = uint8ArrayToWordArray(iv);
  }
  const encrypted = SerializableCipher.encrypt(RabbitLegacyAlgo, dataWordArray, keyWordArray, cfg);
  return wordArrayToUint8Array(encrypted.ciphertext!);
}

function rabbitLegacyAlgoDecrypt(data: Uint8Array, key: Uint8Array, iv?: Uint8Array): Uint8Array {
  const keyWordArray = uint8ArrayToWordArray(key);
  const dataWordArray = uint8ArrayToWordArray(data);
  const cfg: any = { format: HexFormat };
  if (iv) {
    cfg.iv = uint8ArrayToWordArray(iv);
  }
  const decrypted = SerializableCipher.decrypt(
    RabbitLegacyAlgo,
    { ciphertext: dataWordArray } as any,
    keyWordArray,
    cfg,
  );
  return wordArrayToUint8Array(decrypted);
}

function encodeOutput(bytes: Uint8Array, encoding: string): string {
  switch (encoding) {
    case "hex":
      return hexEncode(bytes);
    case "base64": {
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }
    case "utf8":
      return utf8Decode(bytes);
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }
}
