import cryptojs from "crypto-js";
import { PBKDF2 } from "../../src";
import { TestConfig } from "../config";
test("pbkdf2 testing", () => {
  expect(PBKDF2(TestConfig.word, TestConfig.salt).toString()).toBe(
    cryptojs.PBKDF2(TestConfig.word, TestConfig.salt).toString()
  );
});
