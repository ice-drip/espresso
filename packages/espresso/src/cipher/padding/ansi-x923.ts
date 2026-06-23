export function ansiX923Pad(data: Uint8Array, blockSize: number): Uint8Array {
  const padLen = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded[padded.length - 1] = padLen;
  return padded;
}

export function ansiX923Unpad(data: Uint8Array): Uint8Array {
  const padLen = data[data.length - 1];
  if (padLen < 1 || padLen > 16) throw new Error('Invalid ANSI X.923 padding');
  return data.slice(0, data.length - padLen);
}
