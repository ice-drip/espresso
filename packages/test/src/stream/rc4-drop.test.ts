import { RC4Drop, enc } from "@kaffee/espresso";

describe("RC4Drop", () => {
  it("encrypts and decrypts", () => {
    const key = enc.Utf8.parse("secret");
    const plaintext = "RC4Drop test";
    const ciphertext = RC4Drop.encrypt(plaintext, key);
    const decrypted = RC4Drop.decrypt(ciphertext, key);
    expect(decrypted.toString(enc.Utf8)).toBe(plaintext);
  });

  it("encrypts and decrypts with hex output", () => {
    const key = enc.Utf8.parse("secret");
    const plaintext = "RC4Drop hex test";
    const ciphertext = RC4Drop.encrypt(plaintext, key).toString();
    expect(typeof ciphertext).toBe("string");
    expect(ciphertext.length).toBeGreaterThan(0);
    const decrypted = RC4Drop.decrypt(ciphertext, key);
    expect(decrypted.toString(enc.Utf8)).toBe(plaintext);
  });
});
