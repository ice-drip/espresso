import cryptojs from "crypto-js";
import { HmacSHA1 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("hmac sha1 testing", () => {
  expect(HmacSHA1(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacSHA1(TestConfig.word, TestConfig.key).toString()
  );
});
