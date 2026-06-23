import cryptojs from "crypto-js";
import { hash } from "@ice-drip/espresso";
import { TestConfig } from "../config";
test("sha224 testing", () => {
  expect(hash('sha224', TestConfig.word)).toBe(
    cryptojs.SHA224(TestConfig.word).toString()
  );
});
