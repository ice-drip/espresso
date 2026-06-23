import { encrypt, decrypt } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";

const iv = "1234567890abcdef";

test("rabbit-legacy consistency", () => {
  const encrypted = encrypt('rabbit-legacy', TestConfig.word, TestConfig.key, {
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('rabbit-legacy', encrypted, TestConfig.key, {
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("rabbit-legacy empty string", () => {
  const encrypted = encrypt('rabbit-legacy', '', TestConfig.key, {
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('rabbit-legacy', encrypted, TestConfig.key, {
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe('');
});

test("rabbit-legacy long input", () => {
  const longInput = 'A'.repeat(1000);
  const encrypted = encrypt('rabbit-legacy', longInput, TestConfig.key, {
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('rabbit-legacy', encrypted, TestConfig.key, {
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(longInput);
});

test("rabbit-legacy performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt('rabbit-legacy', TestConfig.word, TestConfig.key, {
      iv,
      outputEncoding: 'hex',
    }) as string;
    decrypt('rabbit-legacy', encrypted, TestConfig.key, {
      iv,
      outputEncoding: 'utf8',
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});
