import { describe, it, expect } from 'vitest';
import { hash } from '@ice-drip/espresso';

describe('MD5', () => {
  it('hashes empty string', () => {
    expect(hash('md5', '')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('hashes "hello"', () => {
    expect(hash('md5', 'hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('hashes "The quick brown fox jumps over the lazy dog"', () => {
    expect(hash('md5', 'The quick brown fox jumps over the lazy dog'))
      .toBe('9e107d9d372bb6826bd81d3542a419d6');
  });
});
