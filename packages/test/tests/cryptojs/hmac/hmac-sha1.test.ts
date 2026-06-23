import cryptojs from "crypto-js";
import { hmac } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("hmac sha1 testing", () => {
  expect(hmac('sha1', TestConfig.word, TestConfig.key)).toBe(
    cryptojs.HmacSHA1(TestConfig.word, TestConfig.key).toString()
  );
});
