import { hash } from "@kaffee/espresso";

describe("MD5", () => {
  it("hashes empty string", () => {
    expect(hash("md5", "")).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });

  it('hashes "hello"', () => {
    expect(hash("md5", "hello")).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it('hashes "The quick brown fox jumps over the lazy dog"', () => {
    expect(hash("md5", "The quick brown fox jumps over the lazy dog")).toBe(
      "9e107d9d372bb6826bd81d3542a419d6",
    );
  });

  it('hashes "a" (NIST)', () => {
    expect(hash("md5", "a")).toBe("0cc175b9c0f1b6a831c399e269772661");
  });

  it('hashes "message digest" (NIST)', () => {
    expect(hash("md5", "message digest")).toBe("f96b697d7cb7938d525a2f31aaf161d0");
  });

  it('hashes "abcdefghijklmnopqrstuvwxyz" (NIST)', () => {
    expect(hash("md5", "abcdefghijklmnopqrstuvwxyz")).toBe("c3fcd3d76192e4007dfb496cca67e13b");
  });
});
