import cryptojs from "crypto-js";
import { RIPEMD160 } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("ripemd160 testing", () => {
  expect(RIPEMD160(TestConfig.word).toString()).toBe(
    cryptojs.RIPEMD160(TestConfig.word).toString()
  );
});
