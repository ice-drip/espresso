import { encrypt, decrypt } from "@kaffee/espresso";

describe("Invalid key handling", () => {
  const iv = new Uint8Array(16).fill(0x02);

  it("AES with wrong key length (10 bytes) does not throw", () => {
    const key10 = new Uint8Array(10).fill(0x01);
    const ciphertext = encrypt("aes", "Hello, World!", key10, {
      mode: "cbc",
      iv,
      outputEncoding: "hex",
    });
    expect(typeof ciphertext).toBe("string");
    expect((ciphertext as string).length).toBeGreaterThan(0);
  });

  it("decrypts with wrong key throws Invalid PKCS7 padding", () => {
    const key16 = new Uint8Array(16).fill(0x01);
    const wrongKey = new Uint8Array(16).fill(0xff);
    const plaintext = "Hello, World!";

    const ciphertext = encrypt("aes", plaintext, key16, {
      mode: "cbc",
      iv,
      outputEncoding: "hex",
    }) as string;
    expect(() =>
      decrypt("aes", ciphertext, wrongKey, { mode: "cbc", iv, outputEncoding: "utf8" }),
    ).toThrow("Invalid PKCS7 padding");
  });
});
