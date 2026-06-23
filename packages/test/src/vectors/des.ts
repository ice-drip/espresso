export const desCbcVectors = [
  {
    name: 'DES CBC - NIST SP 800-20',
    key: '0123456789abcdef',
    iv: '1234567890abcdef',
    plaintext: '4e6f77206973207468652074696d6520666f7220616c6c20',
    ciphertext: 'c09993ddb88c17245187bbece1612994a529f7446a34e17867678e44209ae26f',
  },
  {
    name: 'DES CBC - Single Block',
    key: '0123456789abcdef',
    iv: '0000000000000000',
    plaintext: '0000000000000000',
    ciphertext: 'd5d44ff720683d0d1291584b094190ef',
  },
  {
    name: 'DES CBC - Known Answer Test',
    key: '0123456789abcdef',
    iv: '1234567890abcdef',
    plaintext: '4e6f772069732074',
    ciphertext: 'c09993ddb88c1724',
  },
];

export const desEcbVectors = [
  {
    name: 'DES ECB - NIST SP 800-20',
    key: '0123456789abcdef',
    plaintext: '4e6f77206973207468652074696d6520666f7220616c6c20',
    ciphertext: '88d55e5466de4a4a50d505ac45ecf4f0',
  },
  {
    name: 'DES ECB - Single Block',
    key: '0123456789abcdef',
    plaintext: '0000000000000000',
    ciphertext: '8ca64de9c1b123a7',
  },
  {
    name: 'DES ECB - Known Answer Test',
    key: '0123456789abcdef',
    plaintext: '4e6f772069732074',
    ciphertext: '3fa40e8a984d4815',
  },
];
