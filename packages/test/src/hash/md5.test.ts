import cryptojs from "crypto-js";
import { MD5 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("MD5 testing", () => {
  expect(MD5(TestConfig.word).toString()).toBe(
    cryptojs.MD5(TestConfig.word).toString()
  );
});
