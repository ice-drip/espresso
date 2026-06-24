import cryptojs from "crypto-js";
import { hmac } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";
test("hmac sha256 testing", () => {
  expect(hmac("sha256", TestConfig.word, TestConfig.key)).toBe(
    cryptojs.HmacSHA256(TestConfig.word, TestConfig.key).toString(),
  );
});
