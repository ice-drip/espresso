export type BlockEncryptFn = (block: Uint8Array) => Uint8Array;
export type BlockDecryptFn = (block: Uint8Array) => Uint8Array;

export interface BlockMode {
  encrypt(
    data: Uint8Array,
    key: Uint8Array,
    iv: Uint8Array,
    encryptBlock: BlockEncryptFn,
  ): Uint8Array;
  decrypt(
    data: Uint8Array,
    key: Uint8Array,
    iv: Uint8Array,
    decryptBlock: BlockDecryptFn,
  ): Uint8Array;
}
