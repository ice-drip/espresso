import { encrypt, decrypt } from '@kaffee/espresso';

describe('RC4', () => {
  it('encrypts and decrypts', () => {
    const key = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]);
    const plaintext = 'RC4 test';
    const ciphertext = encrypt('rc4', plaintext, key, { outputEncoding: 'hex' });
    const decrypted = decrypt('rc4', ciphertext as string, key, { outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });

  it('encrypts and decrypts empty string', () => {
    const key = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]);
    const plaintext = '';
    const ciphertext = encrypt('rc4', plaintext, key, { outputEncoding: 'hex' });
    expect(ciphertext).toBe('');
  });

  it('encrypts and decrypts with string key', () => {
    const plaintext = 'Hello World';
    const ciphertext = encrypt('rc4', plaintext, 'secret', { outputEncoding: 'hex' });
    const decrypted = decrypt('rc4', ciphertext as string, 'secret', { outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });
});
