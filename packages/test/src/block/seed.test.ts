import { encrypt, decrypt } from '@kaffee/espresso';

describe('SEED', () => {
  const key = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10]);
  const iv = new Uint8Array(16).fill(0x00);

  it('encrypts and decrypts with CBC mode', () => {
    const plaintext = 'Hello, World!';
    const ciphertext = encrypt('seed', plaintext, key, { mode: 'cbc', iv, outputEncoding: 'hex' });
    expect(typeof ciphertext).toBe('string');
    expect(ciphertext).not.toBe('');
    const decrypted = decrypt('seed', ciphertext as string, key, { mode: 'cbc', iv, outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });
});
