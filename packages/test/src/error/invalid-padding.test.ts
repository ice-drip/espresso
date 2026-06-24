import { pkcs7Unpad } from "@kaffee/espresso";

describe("Invalid padding handling", () => {
  it("throws on invalid PKCS7 padding (padding byte > block size)", () => {
    const data = new Uint8Array(16);
    data[15] = 17; // 17 > 16 (block size)
    expect(() => pkcs7Unpad(data)).toThrow("Invalid PKCS7 padding");
  });

  it("throws on inconsistent padding bytes", () => {
    const data = new Uint8Array(16);
    data[15] = 3; // valid pad length
    data[14] = 1; // should be 3
    data[13] = 0; // should be 3
    expect(() => pkcs7Unpad(data)).toThrow("Invalid PKCS7 padding");
  });
});
