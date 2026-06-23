import { encrypt, decrypt } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";

const iv = "12345678";

test("des ecb consistency", () => {
  const encrypted = encrypt('des', TestConfig.word, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('des', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("des cbc consistency", () => {
  const encrypted = encrypt('des', TestConfig.word, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('des', encrypted, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("des empty string", () => {
  const encrypted = encrypt('des', '', TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('des', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe('');
});

test("des long input", () => {
  const longInput = 'A'.repeat(1000);
  const encrypted = encrypt('des', longInput, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('des', encrypted, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(longInput);
});

test("des performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt('des', TestConfig.word, TestConfig.key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'hex',
    }) as string;
    decrypt('des', encrypted, TestConfig.key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'utf8',
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});
