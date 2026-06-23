import { RabbitLegacy, enc } from '@kaffee/espresso';

describe('RabbitLegacy', () => {
  const key = enc.Utf8.parse('0123456789abcdef');
  const iv = enc.Utf8.parse('0000000000000000');

  it('encrypts and decrypts with IV', () => {
    const plaintext = 'Hello, World!';
    const ciphertext = RabbitLegacy.encrypt(plaintext, key, { iv });
    const decrypted = RabbitLegacy.decrypt(ciphertext, key, { iv });
    expect(decrypted.toString(enc.Utf8)).toBe(plaintext);
  });

  it('encrypts and decrypts without IV', () => {
    const plaintext = 'No IV test';
    const ciphertext = RabbitLegacy.encrypt(plaintext, key);
    const decrypted = RabbitLegacy.decrypt(ciphertext, key);
    expect(decrypted.toString(enc.Utf8)).toBe(plaintext);
  });
});
