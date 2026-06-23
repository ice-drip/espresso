export function noPad(data: Uint8Array, blockSize: number): Uint8Array {
  if (data.length % blockSize !== 0) {
    throw new Error('Data must be multiple of block size when using no padding');
  }
  return data;
}
