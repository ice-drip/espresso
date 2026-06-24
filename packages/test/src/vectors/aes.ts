export const aesCbcVectors = [
  {
    name: "NIST AES CBC 128-bit",
    key: "2b7e151628aed2a6abf7158809cf4f3c",
    iv: "000102030405060708090a0b0c0d0e0f",
    plaintext: "6bc1bee22e409f96e93d7e117393172a",
    ciphertext: "7649abac8119b246cee98e9b12e9197d",
  },
  {
    name: "NIST AES CBC 128-bit Chained Block 2",
    key: "2b7e151628aed2a6abf7158809cf4f3c",
    iv: "7649abac8119b246cee98e9b12e9197d",
    plaintext: "ae2d8a571e03ac9c9eb76fac45af8e51",
    ciphertext: "5086cb9b507219ee95db113a917678b2",
  },
  {
    name: "NIST AES CBC 128-bit Multi-block",
    key: "2b7e151628aed2a6abf7158809cf4f3c",
    iv: "000102030405060708090a0b0c0d0e0f",
    plaintext: "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51",
    ciphertext: "7649abac8119b246cee98e9b12e9197d5086cb9b507219ee95db113a917678b2",
  },
  {
    name: "AES CBC 192-bit",
    key: "8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b",
    iv: "000102030405060708090a0b0c0d0e0f",
    plaintext: "6bc1bee22e409f96e93d7e117393172a",
    ciphertext: "4f021db243bc633d7178183a9fa071e8",
  },
  {
    name: "AES CBC 192-bit Multi-block",
    key: "8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b",
    iv: "000102030405060708090a0b0c0d0e0f",
    plaintext: "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51",
    ciphertext: "4f021db243bc633d7178183a9fa071e8b4d9ada9ad7dedf4e5e738763f69145a",
  },
  {
    name: "AES CBC 256-bit",
    key: "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    iv: "000102030405060708090a0b0c0d0e0f",
    plaintext: "6bc1bee22e409f96e93d7e117393172a",
    ciphertext: "f58c4c04d6e5f1ba779eabfb5f7bfbd6",
  },
  {
    name: "AES CBC 256-bit Multi-block",
    key: "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    iv: "000102030405060708090a0b0c0d0e0f",
    plaintext: "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51",
    ciphertext: "f58c4c04d6e5f1ba779eabfb5f7bfbd69cfc4e967edb808d679f777bc6702c7d",
  },
];

export const aesEcbVectors = [
  {
    name: "NIST AES ECB 128-bit",
    key: "2b7e151628aed2a6abf7158809cf4f3c",
    plaintext: "6bc1bee22e409f96e93d7e117393172a",
    ciphertext: "3ad77bb40d7a3660a89ecaf32466ef97",
  },
  {
    name: "AES ECB 192-bit",
    key: "8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b",
    plaintext: "6bc1bee22e409f96e93d7e117393172a",
    ciphertext: "bd334f1d6e45f25ff712a214571fa5cc",
  },
  {
    name: "AES ECB 256-bit",
    key: "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    plaintext: "6bc1bee22e409f96e93d7e117393172a",
    ciphertext: "f3eed1bdb5d2a03c064b5a7e3db181f8",
  },
];
