import { encrypt, decrypt } from '@ice-drip/espresso';

describe('DES', () => {
  const key = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]);
  const iv = new Uint8Array(8).fill(0x00);

  it('encrypts and decrypts with CBC', () => {
    const plaintext = 'Testing!';
    const ciphertext = encrypt('des', plaintext, key, { mode: 'cbc', iv, outputEncoding: 'hex' });
    const decrypted = decrypt('des', ciphertext as string, key, { mode: 'cbc', iv, outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });

  it('encrypts and decrypts with ECB', () => {
    const plaintext = 'Testing!';
    const ciphertext = encrypt('des', plaintext, key, { mode: 'ecb', outputEncoding: 'hex' });
    const decrypted = decrypt('des', ciphertext as string, key, { mode: 'ecb', outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });
});

describe('Triple DES', () => {
  const key = new Uint8Array(24).fill(0x01);
  const iv = new Uint8Array(8).fill(0x00);

  it('encrypts and decrypts with CBC', () => {
    const plaintext = 'Triple DES test!';
    const ciphertext = encrypt('triple-des', plaintext, key, { mode: 'cbc', iv, outputEncoding: 'hex' });
    const decrypted = decrypt('triple-des', ciphertext as string, key, { mode: 'cbc', iv, outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });

  it('encrypts and decrypts with ECB', () => {
    const plaintext = 'Triple DES test!';
    const ciphertext = encrypt('triple-des', plaintext, key, { mode: 'ecb', outputEncoding: 'hex' });
    const decrypted = decrypt('triple-des', ciphertext as string, key, { mode: 'ecb', outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });
});
