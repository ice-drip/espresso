import { encrypt, decrypt } from "@kaffee/espresso";
import cryptojs from "crypto-js";
import { TestConfig } from "../../../src/config";

const iv = "1234567890abcdef";

test("rabbit consistency", () => {
  const encrypted = encrypt('rabbit', TestConfig.word, TestConfig.key, {
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('rabbit', encrypted, TestConfig.key, {
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("rabbit empty string", () => {
  const encrypted = encrypt('rabbit', '', TestConfig.key, {
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('rabbit', encrypted, TestConfig.key, {
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe('');
});

test("rabbit long input", () => {
  const longInput = 'A'.repeat(1000);
  const encrypted = encrypt('rabbit', longInput, TestConfig.key, {
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('rabbit', encrypted, TestConfig.key, {
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(longInput);
});

test("rabbit performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt('rabbit', TestConfig.word, TestConfig.key, {
      iv,
      outputEncoding: 'hex',
    }) as string;
    decrypt('rabbit', encrypted, TestConfig.key, {
      iv,
      outputEncoding: 'utf8',
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});

test("rabbit decrypt cross-library", () => {
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const ivWordArray = cryptojs.enc.Hex.parse(iv);
  const encrypted = cryptojs.Rabbit.encrypt(TestConfig.word, key, { iv: ivWordArray });
  const ciphertext = encrypted.ciphertext.toString();
  const decrypted = decrypt('rabbit', ciphertext, TestConfig.key, {
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("rabbit encrypt cross-library", () => {
  const encrypted = encrypt('rabbit', TestConfig.word, TestConfig.key, {
    iv,
    outputEncoding: 'hex',
  }) as string;
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const ivWordArray = cryptojs.enc.Hex.parse(iv);
  const ciphertext = cryptojs.enc.Hex.parse(encrypted);
  const decrypted = cryptojs.Rabbit.decrypt({ ciphertext } as any, key, { iv: ivWordArray });
  expect(decrypted.toString(cryptojs.enc.Utf8)).toBe(TestConfig.word);
});
