import cryptojs from "crypto-js";
import { hmac } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("hmac md5 testing", () => {
  expect(hmac('md5', TestConfig.word, TestConfig.key)).toBe(
    cryptojs.HmacMD5(TestConfig.word, TestConfig.key).toString()
  );
});
