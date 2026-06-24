import cryptojs from "crypto-js";
import { enc } from "@kaffee/espresso";

test("hex encode consistency", () => {
  const word = "hello world";
  const espresso = enc.Hex.stringify(enc.Utf8.parse(word));
  const reference = cryptojs.enc.Hex.stringify(cryptojs.enc.Utf8.parse(word));
  expect(espresso).toBe(reference);
});

test("hex decode consistency", () => {
  const hex = "48656c6c6f20776f726c64";
  const espresso = enc.Hex.parse(hex).toString(enc.Utf8);
  const reference = cryptojs.enc.Hex.parse(hex).toString(cryptojs.enc.Utf8);
  expect(espresso).toBe(reference);
});

test("hex empty string", () => {
  const espresso = enc.Hex.stringify(enc.Utf8.parse(""));
  const reference = cryptojs.enc.Hex.stringify(cryptojs.enc.Utf8.parse(""));
  expect(espresso).toBe(reference);
});

test("hex special characters / unicode", () => {
  const word = "你好世界🌍";
  const espresso = enc.Hex.stringify(enc.Utf8.parse(word));
  const reference = cryptojs.enc.Hex.stringify(cryptojs.enc.Utf8.parse(word));
  expect(espresso).toBe(reference);

  expect(enc.Hex.parse(espresso).toString(enc.Utf8)).toBe(word);
});
