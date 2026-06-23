import cryptojs from "crypto-js";
import { hash } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";
test("sha1 testing", () => {
  expect(hash('sha1', TestConfig.word)).toBe(
    cryptojs.SHA1(TestConfig.word).toString()
  );
});
