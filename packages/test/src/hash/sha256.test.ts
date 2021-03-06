import cryptojs from "crypto-js";
import { SHA256 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("sha256 testing", () => {
  expect(SHA256(TestConfig.word).toString()).toBe(
    cryptojs.SHA256(TestConfig.word).toString()
  );
});
