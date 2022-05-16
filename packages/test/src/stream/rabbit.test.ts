import { Rabbit, enc } from "../../src";
import { TestConfig } from "../config";
import cryptojs from "crypto-js";
test("Rabbit encrypt testing", () => {
  const result = Rabbit.encrypt(TestConfig.word, TestConfig.key).toString();
  const originWord = cryptojs.Rabbit.decrypt(result, TestConfig.key).toString(
    cryptojs.enc.Utf8
  );

  expect(TestConfig.word).toBe(originWord);
});
test("Rabbit decrypt testing", () => {
  const result = cryptojs.Rabbit.encrypt(
    TestConfig.word,
    TestConfig.key
  ).toString();
  const originWord = Rabbit.decrypt(result, TestConfig.key).toString(enc.Utf8);

  expect(TestConfig.word).toBe(originWord);
});
