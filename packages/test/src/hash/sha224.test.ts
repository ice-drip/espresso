import cryptojs from "crypto-js";
import { SHA224 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("sha224 testing", () => {
  expect(SHA224(TestConfig.word).toString()).toBe(
    cryptojs.SHA224(TestConfig.word).toString()
  );
});
