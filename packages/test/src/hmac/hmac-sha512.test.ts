import cryptojs from "crypto-js";
import { HmacSHA512 } from "../../src";
import { TestConfig } from "../config";
test("hmac sha512 testing", () => {
  expect(HmacSHA512(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacSHA512(TestConfig.word, TestConfig.key).toString()
  );
});
