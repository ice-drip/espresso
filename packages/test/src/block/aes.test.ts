import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '@ice-drip/espresso';

describe('AES', () => {
  const key = new Uint8Array(16).fill(0x01);
  const iv = new Uint8Array(16).fill(0x02);

  it('encrypts and decrypts with CBC mode', () => {
    const plaintext = 'Hello, World!';
    const ciphertext = encrypt('aes', plaintext, key, { mode: 'cbc', iv, outputEncoding: 'hex' });
    expect(typeof ciphertext).toBe('string');
    expect(ciphertext).not.toBe('');

    const decrypted = decrypt('aes', ciphertext as string, key, { mode: 'cbc', iv, outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });

  it('encrypts and decrypts with ECB mode', () => {
    const plaintext = 'Test message!!!'; // 16 bytes
    const ciphertext = encrypt('aes', plaintext, key, { mode: 'ecb', outputEncoding: 'hex' });
    const decrypted = decrypt('aes', ciphertext as string, key, { mode: 'ecb', outputEncoding: 'utf8' });
    expect(decrypted).toBe(plaintext);
  });
});