import { encrypt, decrypt } from "@kaffee/espresso";
import cryptojs from "crypto-js";

const key = new Uint8Array(24).fill(0x01);
const keyHex = "01".repeat(24);
const iv = "12345678";
const ivHex = iv + "00000000";
const word = "LIBAOBAO";

test("triple-des ecb consistency", () => {
  const encrypted = encrypt("triple-des", word, key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("triple-des", encrypted, key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(word);
});

test("triple-des cbc consistency", () => {
  const encrypted = encrypt("triple-des", word, key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("triple-des", encrypted, key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(word);
});

test("triple-des empty string", () => {
  const encrypted = encrypt("triple-des", "", key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("triple-des", encrypted, key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe("");
});

test("triple-des long input", () => {
  const longInput = "A".repeat(1000);
  const encrypted = encrypt("triple-des", longInput, key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("triple-des", encrypted, key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(longInput);
});

test("triple-des performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt("triple-des", word, key, {
      mode: "ecb",
      padding: "pkcs7",
      outputEncoding: "hex",
    }) as string;
    decrypt("triple-des", encrypted, key, {
      mode: "ecb",
      padding: "pkcs7",
      outputEncoding: "utf8",
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});

test("triple-des ecb decrypt cross-library", () => {
  const keyWordArray = cryptojs.enc.Hex.parse(keyHex);
  const encrypted = cryptojs.TripleDES.encrypt(word, keyWordArray, {
    mode: cryptojs.mode.ECB,
    padding: cryptojs.pad.Pkcs7,
  });
  const ciphertext = encrypted.ciphertext.toString();
  const decrypted = decrypt("triple-des", ciphertext, key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(word);
});

test("triple-des ecb encrypt cross-library", () => {
  const keyWordArray = cryptojs.enc.Hex.parse(keyHex);
  const encrypted = encrypt("triple-des", word, key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const ciphertext = cryptojs.enc.Hex.parse(encrypted);
  const decrypted = cryptojs.TripleDES.decrypt({ ciphertext } as any, keyWordArray, {
    mode: cryptojs.mode.ECB,
    padding: cryptojs.pad.Pkcs7,
  });
  expect(decrypted.toString(cryptojs.enc.Utf8)).toBe(word);
});

test("triple-des cbc decrypt cross-library", () => {
  const keyWordArray = cryptojs.enc.Hex.parse(keyHex);
  const ivWordArray = cryptojs.enc.Hex.parse(ivHex);
  const encrypted = cryptojs.TripleDES.encrypt(word, keyWordArray, {
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7,
    iv: ivWordArray,
  });
  const ciphertext = encrypted.ciphertext.toString();
  const decrypted = decrypt("triple-des", ciphertext, key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(word);
});

test("triple-des cbc encrypt cross-library", () => {
  const keyWordArray = cryptojs.enc.Hex.parse(keyHex);
  const ivWordArray = cryptojs.enc.Hex.parse(ivHex);
  const encrypted = encrypt("triple-des", word, key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "hex",
  }) as string;
  const ciphertext = cryptojs.enc.Hex.parse(encrypted);
  const decrypted = cryptojs.TripleDES.decrypt({ ciphertext } as any, keyWordArray, {
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7,
    iv: ivWordArray,
  });
  expect(decrypted.toString(cryptojs.enc.Utf8)).toBe(word);
});
