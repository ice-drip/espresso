import cryptojs from "crypto-js";
import { pbkdf2, hexEncode } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";

test("pbkdf2 consistency with crypto-js", () => {
  const iterations = 1;
  const keySize = 16;
  const espresso = pbkdf2(TestConfig.word, TestConfig.salt, {
    keySize,
    iterations,
    hasher: "sha1",
  });
  const reference = cryptojs.PBKDF2(TestConfig.word, TestConfig.salt, {
    keySize: keySize / 4,
    iterations,
    hasher: cryptojs.algo.SHA1,
  });
  expect(hexEncode(espresso)).toBe(reference.toString());
});

test("pbkdf2 empty password", () => {
  const iterations = 1;
  const keySize = 16;
  const espresso = pbkdf2("", TestConfig.salt, {
    keySize,
    iterations,
    hasher: "sha1",
  });
  const reference = cryptojs.PBKDF2("", TestConfig.salt, {
    keySize: keySize / 4,
    iterations,
    hasher: cryptojs.algo.SHA1,
  });
  expect(hexEncode(espresso)).toBe(reference.toString());
});

test("pbkdf2 different iterations", () => {
  const keySize = 16;
  for (const iterations of [1, 10, 100]) {
    const espresso = pbkdf2(TestConfig.word, TestConfig.salt, {
      keySize,
      iterations,
      hasher: "sha1",
    });
    const reference = cryptojs.PBKDF2(TestConfig.word, TestConfig.salt, {
      keySize: keySize / 4,
      iterations,
      hasher: cryptojs.algo.SHA1,
    });
    expect(hexEncode(espresso)).toBe(reference.toString());
  }
});

test("pbkdf2 performance", () => {
  const iterations = 100;
  const keySize = 16;
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    pbkdf2(TestConfig.word, TestConfig.salt, {
      keySize,
      iterations: 1,
      hasher: "sha1",
    });
  }
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(10000);
});
