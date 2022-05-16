import { AES, enc } from "../../src";
import { TestConfig } from "../config";
import cryptojs from "crypto-js";
test("AES encrypt testing", () => {
  const result = AES.encrypt(TestConfig.word, TestConfig.key).toString();
  const originWord = cryptojs.AES.decrypt(result, TestConfig.key).toString(
    cryptojs.enc.Utf8
  );
  expect(TestConfig.word).toBe(originWord);
});
test("AES decrypt testing", () => {
  const result = cryptojs.AES.encrypt(
    TestConfig.word,
    TestConfig.key
  ).toString();
  const originWord = AES.decrypt(result, TestConfig.key).toString(enc.Utf8);
  expect(TestConfig.word).toBe(originWord);
});
