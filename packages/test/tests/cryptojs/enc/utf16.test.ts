import cryptojs from "crypto-js";
import { enc } from "@kaffee/espresso";

test("utf16 encode consistency", () => {
  const word = "hello";
  const espresso = enc.Utf16.stringify(enc.Utf16.parse(word));
  const reference = cryptojs.enc.Utf16.stringify(cryptojs.enc.Utf16.parse(word));
  expect(espresso).toBe(reference);
});

test("utf16 decode consistency", () => {
  const word = "hello";
  const espresso = enc.Utf16.parse(word).toString(enc.Utf16);
  const reference = cryptojs.enc.Utf16.parse(word).toString(cryptojs.enc.Utf16);
  expect(espresso).toBe(reference);
});

test("utf16 empty string", () => {
  const espresso = enc.Utf16.stringify(enc.Utf16.parse(""));
  const reference = cryptojs.enc.Utf16.stringify(cryptojs.enc.Utf16.parse(""));
  expect(espresso).toBe(reference);
});

test("utf16 special characters / unicode", () => {
  const word = "你好🌍";
  const espresso = enc.Utf16.stringify(enc.Utf16.parse(word));
  const reference = cryptojs.enc.Utf16.stringify(cryptojs.enc.Utf16.parse(word));
  expect(espresso).toBe(reference);

  expect(enc.Utf16.parse(word).toString(enc.Utf16)).toBe(word);
});
