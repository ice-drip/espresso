import { encrypt, decrypt } from "@kaffee/espresso";

const key = new Uint8Array(24).fill(0x01);
const iv = "12345678";
const word = "LIBAOBAO";

test("triple-des ecb consistency", () => {
  const encrypted = encrypt('triple-des', word, key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('triple-des', encrypted, key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(word);
});

test("triple-des cbc consistency", () => {
  const encrypted = encrypt('triple-des', word, key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('triple-des', encrypted, key, {
    mode: 'cbc',
    padding: 'pkcs7',
    iv,
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(word);
});

test("triple-des empty string", () => {
  const encrypted = encrypt('triple-des', '', key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('triple-des', encrypted, key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe('');
});

test("triple-des long input", () => {
  const longInput = 'A'.repeat(1000);
  const encrypted = encrypt('triple-des', longInput, key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'hex',
  }) as string;
  const decrypted = decrypt('triple-des', encrypted, key, {
    mode: 'ecb',
    padding: 'pkcs7',
    outputEncoding: 'utf8',
  });
  expect(decrypted).toBe(longInput);
});

test("triple-des performance", () => {
  const iterations = 1000;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    const encrypted = encrypt('triple-des', word, key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'hex',
    }) as string;
    decrypt('triple-des', encrypted, key, {
      mode: 'ecb',
      padding: 'pkcs7',
      outputEncoding: 'utf8',
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});
