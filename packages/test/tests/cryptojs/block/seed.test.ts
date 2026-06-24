import { encrypt, decrypt } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";

const iv = "1234567890abcdef";

test("seed ecb consistency", () => {
  const encrypted = encrypt("seed", TestConfig.word, TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("seed", encrypted, TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("seed cbc consistency", () => {
  const encrypted = encrypt("seed", TestConfig.word, TestConfig.key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("seed", encrypted, TestConfig.key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("seed empty string", () => {
  const encrypted = encrypt("seed", "", TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("seed", encrypted, TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe("");
});

test("seed long input", () => {
  const longInput = "A".repeat(1000);
  const encrypted = encrypt("seed", longInput, TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("seed", encrypted, TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(longInput);
});

test("seed ecb roundtrip", () => {
  const plaintext = "Hello, SEED!";
  const encrypted = encrypt("seed", plaintext, TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("seed", encrypted, TestConfig.key, {
    mode: "ecb",
    padding: "pkcs7",
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(plaintext);
});

test("seed cbc roundtrip", () => {
  const plaintext = "Hello, SEED CBC!";
  const encrypted = encrypt("seed", plaintext, TestConfig.key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("seed", encrypted, TestConfig.key, {
    mode: "cbc",
    padding: "pkcs7",
    iv,
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(plaintext);
});

test("seed performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt("seed", TestConfig.word, TestConfig.key, {
      mode: "ecb",
      padding: "pkcs7",
      outputEncoding: "hex",
    }) as string;
    decrypt("seed", encrypted, TestConfig.key, {
      mode: "ecb",
      padding: "pkcs7",
      outputEncoding: "utf8",
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});
