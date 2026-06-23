import { hash } from '@kaffee/espresso';

describe('SHA-256', () => {
  it('hashes empty string', () => {
    expect(hash('sha256', '')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('hashes "hello"', () => {
    expect(hash('sha256', 'hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('hashes "abc" (NIST)', () => {
    expect(hash('sha256', 'abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('hashes "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq" (NIST)', () => {
    expect(hash('sha256', 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'))
      .toBe('248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
  });
});
