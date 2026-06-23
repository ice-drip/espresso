export function pkcs7Pad(data: Uint8Array, blockSize: number): Uint8Array {
  const padLen = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  for (let i = data.length; i < padded.length; i++) {
    padded[i] = padLen;
  }
  return padded;
}

export function pkcs7Unpad(data: Uint8Array, blockSize = 16): Uint8Array {
  const padLen = data[data.length - 1];
  if (padLen < 1 || padLen > blockSize) throw new Error('Invalid PKCS7 padding');
  for (let i = data.length - padLen; i < data.length; i++) {
    if (data[i] !== padLen) throw new Error('Invalid PKCS7 padding');
  }
  return data.slice(0, data.length - padLen);
}
