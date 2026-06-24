import { encrypt, decrypt } from "@kaffee/espresso";
import cryptojs from "crypto-js";
import { TestConfig } from "../../../src/config";

test("rc4 consistency", () => {
  const encrypted = encrypt("rc4", TestConfig.word, TestConfig.key, {
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("rc4", encrypted, TestConfig.key, {
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("rc4 empty string", () => {
  const encrypted = encrypt("rc4", "", TestConfig.key, {
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("rc4", encrypted, TestConfig.key, {
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe("");
});

test("rc4 long input", () => {
  const longInput = "A".repeat(1000);
  const encrypted = encrypt("rc4", longInput, TestConfig.key, {
    outputEncoding: "hex",
  }) as string;
  const decrypted = decrypt("rc4", encrypted, TestConfig.key, {
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(longInput);
});

test("rc4 performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt("rc4", TestConfig.word, TestConfig.key, {
      outputEncoding: "hex",
    }) as string;
    decrypt("rc4", encrypted, TestConfig.key, {
      outputEncoding: "utf8",
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});

test("rc4 decrypt cross-library", () => {
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const encrypted = cryptojs.RC4.encrypt(TestConfig.word, key);
  const ciphertext = encrypted.ciphertext.toString();
  const decrypted = decrypt("rc4", ciphertext, TestConfig.key, {
    outputEncoding: "utf8",
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("rc4 encrypt cross-library", () => {
  const encrypted = encrypt("rc4", TestConfig.word, TestConfig.key, {
    outputEncoding: "hex",
  }) as string;
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const ciphertext = cryptojs.enc.Hex.parse(encrypted);
  const decrypted = cryptojs.RC4.decrypt({ ciphertext } as any, key);
  expect(decrypted.toString(cryptojs.enc.Utf8)).toBe(TestConfig.word);
});
