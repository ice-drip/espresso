import cryptojs from "crypto-js";
import { hmac } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("hmac sha224 testing", () => {
  expect(hmac('sha224', TestConfig.word, TestConfig.key)).toBe(
    cryptojs.HmacSHA224(TestConfig.word, TestConfig.key).toString()
  );
});
