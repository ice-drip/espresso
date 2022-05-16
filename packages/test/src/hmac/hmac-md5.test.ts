import cryptojs from "crypto-js";
import { HmacMD5 } from "../../src";
import { TestConfig } from "../config";
test("hmac md5 testing", () => {
  expect(HmacMD5(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacMD5(TestConfig.word, TestConfig.key).toString()
  );
});
