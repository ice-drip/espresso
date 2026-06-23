import { encrypt, decrypt } from '@kaffee/espresso';
import { aesCbcVectors, aesEcbVectors } from '../vectors/aes';

describe('AES NIST Vectors', () => {
  aesCbcVectors.forEach(vec => {
    it(`CBC: ${vec.name}`, () => {
      const key = Buffer.from(vec.key, 'hex');
      const iv = Buffer.from(vec.iv, 'hex');
      const plaintext = Buffer.from(vec.plaintext, 'hex');
      const expected = Buffer.from(vec.ciphertext, 'hex');

      const ciphertext = encrypt('aes', plaintext, key, {
        mode: 'cbc',
        iv,
        padding: 'no-padding',
        outputEncoding: 'hex',
      }) as string;

      expect(ciphertext).toBe(expected.toString('hex'));
    });
  });

  aesEcbVectors.forEach(vec => {
    it(`ECB: ${vec.name}`, () => {
      const key = Buffer.from(vec.key, 'hex');
      const plaintext = Buffer.from(vec.plaintext, 'hex');
      const expected = Buffer.from(vec.ciphertext, 'hex');

      const ciphertext = encrypt('aes', plaintext, key, {
        mode: 'ecb',
        padding: 'no-padding',
        outputEncoding: 'hex',
      }) as string;

      expect(ciphertext).toBe(expected.toString('hex'));
    });
  });
});
