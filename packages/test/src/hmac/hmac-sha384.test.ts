import cryptojs from "crypto-js";
import { HmacSHA384 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("hmac sha384 testing", () => {
  expect(HmacSHA384(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacSHA384(TestConfig.word, TestConfig.key).toString()
  );
});
