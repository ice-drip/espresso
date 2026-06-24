import { xorBytes, int32ToBytes, bytesToInt32, rotateLeft } from "@kaffee/espresso";

describe("utils", () => {
  it("xorBytes XORs two byte arrays", () => {
    const a = new Uint8Array([0xff, 0x00, 0xaa]);
    const b = new Uint8Array([0x0f, 0x0f, 0x55]);
    expect(xorBytes(a, b)).toEqual(new Uint8Array([0xf0, 0x0f, 0xff]));
  });

  it("int32ToBytes converts 32-bit int to 4 bytes big-endian", () => {
    expect(int32ToBytes(0x01020304)).toEqual(new Uint8Array([1, 2, 3, 4]));
  });

  it("bytesToInt32 converts 4 bytes to 32-bit int big-endian", () => {
    expect(bytesToInt32(new Uint8Array([1, 2, 3, 4]))).toBe(0x01020304);
  });

  it("rotateLeft rotates bits", () => {
    expect(rotateLeft(0x80000000, 1)).toBe(0x00000001);
    expect(rotateLeft(0x00000001, 1)).toBe(0x00000002);
  });
});
