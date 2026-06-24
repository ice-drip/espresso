import cryptojs from "crypto-js";
import { hmac } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";
test("hmac sha512 testing", () => {
  expect(hmac("sha512", TestConfig.word, TestConfig.key)).toBe(
    cryptojs.HmacSHA512(TestConfig.word, TestConfig.key).toString(),
  );
});
