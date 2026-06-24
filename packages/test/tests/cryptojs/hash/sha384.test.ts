import cryptojs from "crypto-js";
import { hash } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";
test("sha384 testing", () => {
  expect(hash("sha384", TestConfig.word)).toBe(cryptojs.SHA384(TestConfig.word).toString());
});
