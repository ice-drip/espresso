import { encrypt, decrypt } from "@kaffee/espresso";
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
