export function iso97971Pad(data: Uint8Array, blockSize: number): Uint8Array {
  const padLen = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded[data.length] = 0x80;
  return padded;
}

export function iso97971Unpad(data: Uint8Array): Uint8Array {
  let len = data.length;
  while (len > 0 && data[len - 1] === 0) len--;
  if (len === 0 || data[len - 1] !== 0x80) {
    throw new Error("Invalid ISO 9797-1 padding");
  }
  return data.slice(0, len - 1);
}
