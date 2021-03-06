import cryptojs from "crypto-js";
import { SHA3 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("sha3 testing", () => {
  expect(SHA3(TestConfig.word).toString()).toBe(
    cryptojs.SHA3(TestConfig.word).toString()
  );
});
