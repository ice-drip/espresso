import cryptojs from "crypto-js";
import { hmac } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";
test("hmac sha384 testing", () => {
  expect(hmac('sha384', TestConfig.word, TestConfig.key)).toBe(
    cryptojs.HmacSHA384(TestConfig.word, TestConfig.key).toString()
  );
});
