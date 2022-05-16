import cryptojs from "crypto-js";
import { HmacRIPEMD160 } from "../../src";
import { TestConfig } from "../config";
test("hmac ripemd160 testing", () => {
  expect(HmacRIPEMD160(TestConfig.word, TestConfig.key).toString()).toBe(
    cryptojs.HmacRIPEMD160(TestConfig.word, TestConfig.key).toString()
  );
});
