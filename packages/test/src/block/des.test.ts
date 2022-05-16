import { DES, enc } from "@kaffee/espresso";
import { TestConfig } from "../config";
import cryptojs from "crypto-js";
test("DES encrypt testing", () => {
  const result = DES.encrypt(TestConfig.word, TestConfig.key).toString();
  const originWord = cryptojs.DES.decrypt(result, TestConfig.key).toString(
    cryptojs.enc.Utf8
  );

  expect(TestConfig.word).toBe(originWord);
});
test("DES decrypt testing", () => {
  const result = cryptojs.DES.encrypt(
    TestConfig.word,
    TestConfig.key
  ).toString();
  const originWord = DES.decrypt(result, TestConfig.key).toString(enc.Utf8);

  expect(TestConfig.word).toBe(originWord);
});
