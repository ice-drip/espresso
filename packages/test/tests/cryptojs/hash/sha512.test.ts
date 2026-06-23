import cryptojs from "crypto-js";
import { hash } from "@kaffee/espresso";
import { TestConfig } from "../../../src/config";
test("sha512 testing", () => {
  expect(hash('sha512', TestConfig.word)).toBe(
    cryptojs.SHA512(TestConfig.word).toString()
  );
});

test("sha512 'abc' (NIST)", () => {
  expect(hash('sha512', 'abc')).toBe(
    'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
  );
});
