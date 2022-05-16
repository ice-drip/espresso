import cryptojs from "crypto-js";
import { SHA224 } from "../../src";
import { TestConfig } from "../config";
test("sha224 testing", () => {
  expect(SHA224(TestConfig.word).toString()).toBe(
    cryptojs.SHA224(TestConfig.word).toString()
  );
});
