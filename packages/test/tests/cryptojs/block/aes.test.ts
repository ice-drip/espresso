import { encrypt, decrypt } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";

const iv = "1234567890abcdef";

test("aes ecb consistency", () => {
  const encrypted = encrypt('aes', TestConfig.word, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('aes', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("aes cbc consistency", () => {
  const encrypted = encrypt('aes', TestConfig.word, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('aes', encrypted, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("aes empty string", () => {
  const encrypted = encrypt('aes', '', TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('aes', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe('');
});

test("aes long input", () => {
  const longInput = 'A'.repeat(1000);
  const encrypted = encrypt('aes', longInput, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('aes', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(longInput);
});

test("aes performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt('aes', TestConfig.word, TestConfig.key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'hex',
    }) as string;
    decrypt('aes', encrypted, TestConfig.key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'utf8',
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});
