import cryptojs from "crypto-js";
import { HmacSHA224 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("hmac sha224 testing", () => {
  expect(HmacSHA224(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacSHA224(TestConfig.word, TestConfig.key).toString()
  );
});
