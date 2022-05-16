import cryptojs from "crypto-js";
import { HmacSHA3 } from "../../src";
import { TestConfig } from "../config";
test("hmac sha3 testing", () => {
  expect(HmacSHA3(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacSHA3(TestConfig.word, TestConfig.key).toString()
  );
});
