export const aesCbcVectors = [
  {
    name: 'NIST AES CBC 128-bit',
    key: '2b7e151628aed2a6abf7158809cf4f3c',
    iv: '000102030405060708090a0b0c0d0e0f',
    plaintext: '6bc1bee22e409f96e93d7e117393172a',
    ciphertext: '7649abac8119b246cee98e9b12e9197d',
  },
  {
    name: 'NIST AES CBC 128-bit Chained Block 2',
    key: '2b7e151628aed2a6abf7158809cf4f3c',
    iv: '7649abac8119b246cee98e9b12e9197d',
    plaintext: 'ae2d8a571e03ac9c9eb76fac45af8e51',
    ciphertext: '5086cb9b507219ee95db113a917678b2',
  },
  {
    name: 'NIST AES CBC 128-bit Multi-block',
    key: '2b7e151628aed2a6abf7158809cf4f3c',
    iv: '000102030405060708090a0b0c0d0e0f',
    plaintext: '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51',
    ciphertext: '7649abac8119b246cee98e9b12e9197d5086cb9b507219ee95db113a917678b2',
  },
];

export const aesEcbVectors = [
  {
    name: 'NIST AES ECB 128-bit',
    key: '2b7e151628aed2a6abf7158809cf4f3c',
    plaintext: '6bc1bee22e409f96e93d7e117393172a',
    ciphertext: '3ad77bb40d7a3660a89ecaf32466ef97',
  },
];
