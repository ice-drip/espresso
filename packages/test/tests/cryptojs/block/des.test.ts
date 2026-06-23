import { encrypt, decrypt } from "@kaffee/espresso";
import cryptojs from "crypto-js";
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

test("des ecb decrypt cross-library", () => {
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const encrypted = cryptojs.DES.encrypt(TestConfig.word, key, {
    mode: cryptojs.mode.ECB,
    padding: cryptojs.pad.Pkcs7,
  });
  const ciphertext = encrypted.ciphertext.toString();
  const decrypted = decrypt('des', ciphertext, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("des ecb encrypt cross-library", () => {
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const encrypted = encrypt('des', TestConfig.word, TestConfig.key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const ciphertext = cryptojs.enc.Hex.parse(encrypted);
  const decrypted = cryptojs.DES.decrypt({ ciphertext } as any, key, {
    mode: cryptojs.mode.ECB,
    padding: cryptojs.pad.Pkcs7,
  });
  expect(decrypted.toString(cryptojs.enc.Utf8)).toBe(TestConfig.word);
});

test("des cbc decrypt cross-library", () => {
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const ivWordArray = cryptojs.enc.Hex.parse(iv + '00000000');
  const encrypted = cryptojs.DES.encrypt(TestConfig.word, key, {
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7,
    iv: ivWordArray,
  });
  const ciphertext = encrypted.ciphertext.toString();
  const decrypted = decrypt('des', ciphertext, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(TestConfig.word);
});

test("des cbc encrypt cross-library", () => {
  const key = cryptojs.enc.Utf8.parse(TestConfig.key);
  const ivWordArray = cryptojs.enc.Hex.parse(iv + '00000000');
  const encrypted = encrypt('des', TestConfig.word, TestConfig.key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'hex',
  }) as string;
  const ciphertext = cryptojs.enc.Hex.parse(encrypted);
  const decrypted = cryptojs.DES.decrypt({ ciphertext } as any, key, {
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7,
    iv: ivWordArray,
  });
  expect(decrypted.toString(cryptojs.enc.Utf8)).toBe(TestConfig.word);
});
