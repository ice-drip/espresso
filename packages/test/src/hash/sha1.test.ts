import cryptojs from "crypto-js";
import { SHA1 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("sha1 testing", () => {
  expect(SHA1(TestConfig.word).toString()).toBe(
    cryptojs.SHA1(TestConfig.word).toString()
  );
});
