import { encrypt, decrypt } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";

const iv = "1234567890abcdef";

test("openssl kdf key derivation via aes cbc", () => {
  const encrypted = encrypt("aes", TestConfig.word, TestConfig.key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("aes", encrypted, TestConfig.key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("openssl kdf different key sizes", () => {
  const key16 = "1234567890abcdef";
  const encrypted16 = encrypt("aes", TestConfig.word, key16, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "hex",
  }) as string;
  const decrypted16 = decrypt("aes", encrypted16, key16, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "utf8",
  });
  expect(decrypted16).toBe(TestConfig.word);

  const key8 = "12345678";
  const encrypted8 = encrypt("des", TestConfig.word, key8, {
    mode: "cbc",
    padding: "pkcs7",
    iv: "12345678",
    outputEncoding: "hex",
  }) as string;
  const decrypted8 = decrypt("des", encrypted8, key8, {
    mode: "cbc",
    padding: "pkcs7",
    iv: "12345678",
    outputEncoding: "utf8",
  });
  expect(decrypted8).toBe(TestConfig.word);
});

test("openssl kdf empty key roundtrip", () => {
  const emptyKey = "";
  const encrypted = encrypt("aes", TestConfig.word, emptyKey, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("aes", encrypted, emptyKey, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(TestConfig.word);
});
