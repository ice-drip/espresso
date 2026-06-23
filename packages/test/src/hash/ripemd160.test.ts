import cryptojs from "crypto-js";
import { hash } from "@ice-drip/espresso";
import { TestConfig } from "../config";
test("ripemd160 testing", () => {
  const expected = cryptojs.RIPEMD160(TestConfig.word).toString();
  expect(expected).toMatch(/^[0-9a-f]{40}$/);
});
