import { hash } from '@kaffee/espresso';

describe('SHA-256', () => {
  it('hashes empty string', () => {
    expect(hash('sha256', '')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('hashes "hello"', () => {
    expect(hash('sha256', 'hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});
