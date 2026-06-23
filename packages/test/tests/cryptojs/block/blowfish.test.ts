import { encrypt, decrypt } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";

const iv = "12345678";

test("blowfish ecb consistency", () => {
  const encrypted = encrypt('blowfish', TestConfig.word, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('blowfish', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("blowfish cbc consistency", () => {
  const encrypted = encrypt('blowfish', TestConfig.word, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('blowfish', encrypted, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("blowfish empty string", () => {
  const encrypted = encrypt('blowfish', '', TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('blowfish', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe('');
});

test("blowfish long input", () => {
  const longInput = 'A'.repeat(1000);
  const encrypted = encrypt('blowfish', longInput, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('blowfish', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(longInput);
});

test("blowfish performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt('blowfish', TestConfig.word, TestConfig.key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'hex',
    }) as string;
    decrypt('blowfish', encrypted, TestConfig.key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'utf8',
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});

test("blowfish ecb roundtrip", () => {
  const plaintext = "Roundtrip test data 123!@#$%";
  const encrypted = encrypt('blowfish', plaintext, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  expect(typeof encrypted).toBe('string');
  expect(encrypted.length).toBeGreaterThan(0);
  const decrypted = decrypt('blowfish', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(plaintext);
});

test("blowfish cbc roundtrip", () => {
  const plaintext = "CBC roundtrip test data 456!@#$%";
  const encrypted = encrypt('blowfish', plaintext, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'hex',
  }) as string;
  expect(typeof encrypted).toBe('string');
  expect(encrypted.length).toBeGreaterThan(0);
  const decrypted = decrypt('blowfish', encrypted, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(plaintext);
});
