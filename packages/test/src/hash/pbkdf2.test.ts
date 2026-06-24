import { pbkdf2 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("pbkdf2 testing", () => {
  const result = pbkdf2(TestConfig.word, TestConfig.salt, {
    iterations: 1,
    keySize: 32,
    hasher: "sha1",
  });
  expect(result).toBeInstanceOf(Uint8Array);
  expect(result.length).toBe(32);
});
