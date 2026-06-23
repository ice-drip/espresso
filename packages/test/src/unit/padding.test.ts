import { describe, it, expect } from 'vitest';
import { pkcs7Pad, pkcs7Unpad } from '@ice-drip/espresso';
import { zeroPad } from '@ice-drip/espresso';
import { noPad } from '@ice-drip/espresso';

describe('Padding', () => {
  describe('PKCS7', () => {
    it('pads to block size', () => {
      const data = new Uint8Array([1, 2, 3]);
      const padded = pkcs7Pad(data, 16);
      expect(padded.length).toBe(16);
      expect(padded[15]).toBe(13);
    });

    it('adds full block when already aligned', () => {
      const data = new Uint8Array(16);
      const padded = pkcs7Pad(data, 16);
      expect(padded.length).toBe(32);
    });

    it('unpads correctly', () => {
      const data = new Uint8Array([1, 2, 3]);
      const padded = pkcs7Pad(data, 16);
      const unpadded = pkcs7Unpad(padded);
      expect(unpadded).toEqual(data);
    });
  });

  describe('Zero', () => {
    it('pads with zeros', () => {
      const data = new Uint8Array([1, 2, 3]);
      const padded = zeroPad(data, 16);
      expect(padded.length).toBe(16);
      expect(padded[3]).toBe(0);
    });
  });

  describe('No Padding', () => {
    it('throws if not aligned', () => {
      const data = new Uint8Array([1, 2, 3]);
      expect(() => noPad(data, 16)).toThrow();
    });

    it('passes through if aligned', () => {
      const data = new Uint8Array(16);
      const result = noPad(data, 16);
      expect(result.length).toBe(16);
    });
  });
});
