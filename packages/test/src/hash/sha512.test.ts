import cryptojs from "crypto-js";
import { hash } from "@kaffee/espresso";
import { TestConfig } from "../config";
test("sha512 testing", () => {
  expect(hash('sha512', TestConfig.word)).toBe(
    cryptojs.SHA512(TestConfig.word).toString()
  );
});
