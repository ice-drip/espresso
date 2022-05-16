import cryptojs from "crypto-js";
import { HmacSHA256 } from "../../src";
import { TestConfig } from "../config";
test("hmac sha256 testing", () => {
  expect(HmacSHA256(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacSHA256(TestConfig.word, TestConfig.key).toString()
  );
});
