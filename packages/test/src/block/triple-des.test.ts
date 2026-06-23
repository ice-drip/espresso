import { encrypt, decrypt } from "@ice-drip/espresso";
import { TestConfig } from "../config";
test("TripleDES encrypt/decrypt round-trip", () => {
  const key = new Uint8Array(24).fill(0x01);
  const plaintext = TestConfig.word;
  const ciphertext = encrypt('triple-des', plaintext, key, { outputEncoding: 'hex' });
  const decrypted = decrypt('triple-des', ciphertext as string, key, { outputEncoding: 'utf8' });
  expect(decrypted).toBe(plaintext);
});
test("TripleDES encrypt/decrypt with ECB", () => {
  const key = new Uint8Array(24).fill(0x01);
  const plaintext = TestConfig.word;
  const ciphertext = encrypt('triple-des', plaintext, key, { mode: 'ecb', outputEncoding: 'hex' });
  const decrypted = decrypt('triple-des', ciphertext as string, key, { mode: 'ecb', outputEncoding: 'utf8' });
  expect(decrypted).toBe(plaintext);
});
