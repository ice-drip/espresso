import cryptojs from "crypto-js";
import { SHA384 } from "../../src";
import { TestConfig } from "../config";
test("sha384 testing", () => {
  expect(SHA384(TestConfig.word).toString()).toBe(
    cryptojs.SHA384(TestConfig.word).toString()
  );
});
