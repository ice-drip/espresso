export function rc4Encrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (data.length === 0) return new Uint8Array(0);
  return rc4(data, key);
}

export function rc4Decrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (data.length === 0) return new Uint8Array(0);
  return rc4(data, key);
}

export function rc4DropEncrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (data.length === 0) return new Uint8Array(0);
  return rc4(data, key, 192);
}

export function rc4DropDecrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (data.length === 0) return new Uint8Array(0);
  return rc4(data, key, 192);
}

function rc4(data: Uint8Array, key: Uint8Array, drop = 0): Uint8Array {
  const s = new Uint8Array(256);
  for (let i = 0; i < 256; i++) s[i] = i;

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key[i % key.length]) & 0xff;
    const tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
  }

  let i = 0;
  j = 0;
  for (let d = 0; d < drop; d++) {
    i = (i + 1) & 0xff;
    j = (j + s[i]) & 0xff;
    const tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
  }

  const result = new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) & 0xff;
    j = (j + s[i]) & 0xff;
    const tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
    result[k] = data[k] ^ s[(s[i] + s[j]) & 0xff];
  }

  return result;
}
