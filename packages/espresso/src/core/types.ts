export type Algorithm =
  | 'aes' | 'des' | 'triple-des' | 'blowfish'
  | 'rc4' | 'rc4-drop' | 'rabbit' | 'rabbit-legacy' | 'seed';

export type HashAlgorithm =
  | 'md4' | 'md5'
  | 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512'
  | 'sha3'
  | 'ripemd128' | 'ripemd160' | 'ripemd256' | 'ripemd320';

export type BlockMode = 'cbc' | 'cfb' | 'ctr' | 'ecb' | 'ofb';

export type Padding = 'pkcs7' | 'zero' | 'ansi-x923' | 'iso-9797-1' | 'iso-10126' | 'no-padding';

export type Encoding = 'hex' | 'base64' | 'utf8' | 'latin1' | 'utf16';

export interface CipherOptions {
  mode?: BlockMode;
  padding?: Padding;
  iv?: Uint8Array | string;
  outputEncoding?: Encoding;
}

export interface HashOptions {
  outputEncoding?: Encoding;
}

export interface PBKDF2Options {
  iterations: number;
  keySize: number;
  hasher?: HashAlgorithm;
}

export type CipherInput = string | Uint8Array;
