export function isWebCryptoAvailable(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.subtle !== 'undefined'
  );
}

export async function webCryptoEncrypt(
  algorithm: string,
  key: Uint8Array,
  data: Uint8Array,
  iv?: Uint8Array
): Promise<Uint8Array> {
  const subtle = globalThis.crypto.subtle;
  const algo = mapToWebCryptoAlgo(algorithm, iv);

  const cryptoKey = await subtle.importKey(
    'raw',
    key as BufferSource,
    algo,
    false,
    ['encrypt']
  );

  const encrypted = await subtle.encrypt(algo, cryptoKey, data as BufferSource);
  return new Uint8Array(encrypted);
}

export async function webCryptoDecrypt(
  algorithm: string,
  key: Uint8Array,
  data: Uint8Array,
  iv?: Uint8Array
): Promise<Uint8Array> {
  const subtle = globalThis.crypto.subtle;
  const algo = mapToWebCryptoAlgo(algorithm, iv);

  const cryptoKey = await subtle.importKey(
    'raw',
    key as BufferSource,
    algo,
    false,
    ['decrypt']
  );

  const decrypted = await subtle.decrypt(algo, cryptoKey, data as BufferSource);
  return new Uint8Array(decrypted);
}

export async function webCryptoHash(
  algorithm: string,
  data: Uint8Array
): Promise<Uint8Array> {
  const subtle = globalThis.crypto.subtle;
  const algo = mapToWebCryptoHash(algorithm);

  const hash = await subtle.digest(algo, data as BufferSource);
  return new Uint8Array(hash);
}

function mapToWebCryptoAlgo(algorithm: string, iv?: Uint8Array) {
  switch (algorithm) {
    case 'aes-cbc':
      return { name: 'AES-CBC', iv: iv as BufferSource | undefined };
    case 'aes-ctr':
      return { name: 'AES-CTR', counter: (iv ?? new Uint8Array(16)) as BufferSource, length: 64 };
    case 'aes-gcm':
      return { name: 'AES-GCM', iv: iv as BufferSource | undefined };
    case 'aes-ecb':
      return { name: 'AES-ECB' };
    default:
      throw new Error(`Web Crypto does not support: ${algorithm}`);
  }
}

function mapToWebCryptoHash(algorithm: string): string {
  const map: Record<string, string> = {
    sha1: 'SHA-1',
    sha256: 'SHA-256',
    sha384: 'SHA-384',
    sha512: 'SHA-512',
  };
  const result = map[algorithm];
  if (!result) throw new Error(`Web Crypto does not support hash: ${algorithm}`);
  return result;
}
