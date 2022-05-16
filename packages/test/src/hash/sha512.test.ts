import cryptojs from "crypto-js";
import { SHA512 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("sha512 testing", () => {
  expect(SHA512(TestConfig.word).toString()).toBe(
    cryptojs.SHA512(TestConfig.word).toString()
  );
});
