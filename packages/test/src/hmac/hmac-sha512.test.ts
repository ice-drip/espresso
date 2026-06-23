import cryptojs from "crypto-js";
import { hmac } from "@ice-drip/espresso";
import { TestConfig } from "../config";
test("hmac sha512 testing", () => {
  expect(hmac('sha512', TestConfig.word, TestConfig.key)).toBe(
    cryptojs.HmacSHA512(TestConfig.word, TestConfig.key).toString()
  );
});
