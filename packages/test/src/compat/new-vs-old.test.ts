import { hash, MD5, SHA256 } from "@kaffee/espresso";

describe("New vs Old API Consistency", () => {
  const testCases = [
    "",
    "hello",
    "The quick brown fox jumps over the lazy dog",
    "abc",
    "abcdefghijklmnopqrstuvwxyz",
    "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
  ];

  describe("MD5", () => {
    testCases.forEach((input) => {
      it(`hash('md5', ${JSON.stringify(input)}) === MD5(${JSON.stringify(input)}).toString()`, () => {
        const newResult = hash("md5", input);
        const oldResult = MD5(input).toString();
        expect(newResult).toBe(oldResult);
      });
    });
  });

  describe("SHA256", () => {
    testCases.forEach((input) => {
      it(`hash('sha256', ${JSON.stringify(input)}) === SHA256(${JSON.stringify(input)}).toString()`, () => {
        const newResult = hash("sha256", input);
        const oldResult = SHA256(input).toString();
        expect(newResult).toBe(oldResult);
      });
    });
  });
});
