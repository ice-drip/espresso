import cryptojs from "crypto-js";
import { hash } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";
test("ripemd160 testing", () => {
  const expected = cryptojs.RIPEMD160(TestConfig.word).toString();
  expect(expected).toMatch(/^[0-9a-f]{40}$/);
});
