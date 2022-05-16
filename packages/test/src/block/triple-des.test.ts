import { TripleDES, enc } from "@kaffee/espresso";
import { TestConfig } from "../config";
import cryptojs from "crypto-js";
test("DES encrypt testing", () => {
  const result = TripleDES.encrypt(TestConfig.word, TestConfig.key).toString();
  const originWord = cryptojs.TripleDES.decrypt(
    result,
    TestConfig.key
  ).toString(cryptojs.enc.Utf8);

  expect(TestConfig.word).toBe(originWord);
});
test("DES decrypt testing", () => {
  const result = cryptojs.TripleDES.encrypt(
    TestConfig.word,
    TestConfig.key
  ).toString();
  const originWord = TripleDES.decrypt(result, TestConfig.key).toString(
    enc.Utf8
  );

  expect(TestConfig.word).toBe(originWord);
});
