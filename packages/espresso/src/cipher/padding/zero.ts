export function zeroPad(data: Uint8Array, blockSize: number): Uint8Array {
  const padLen = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  return padded;
}

export function zeroUnpad(data: Uint8Array): Uint8Array {
  let len = data.length;
  while (len > 0 && data[len - 1] === 0) len--;
  return data.slice(0, len);
}
