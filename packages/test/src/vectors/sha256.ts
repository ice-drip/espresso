export const sha256Vectors = [
  {
    name: 'NIST SHA-256 - Empty string',
    input: '',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    name: 'NIST SHA-256 - "abc"',
    input: 'abc',
    hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  },
  {
    name: 'NIST SHA-256 - "hello"',
    input: 'hello',
    hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
  },
  {
    name: 'NIST SHA-256 - 448-bit message (abcdbcde...)',
    input: 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
    hash: '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
  },
];
