import cryptojs from "crypto-js";
import { enc } from "@kaffee/espresso";

test("utf8 encode consistency", () => {
  const word = "hello world";
  const espresso = enc.Utf8.stringify(enc.Utf8.parse(word));
  const reference = cryptojs.enc.Utf8.stringify(cryptojs.enc.Utf8.parse(word));
  expect(espresso).toBe(reference);
});

test("utf8 decode consistency", () => {
  const word = "hello world";
  const espresso = enc.Utf8.parse(word).toString(enc.Utf8);
  const reference = cryptojs.enc.Utf8.parse(word).toString(cryptojs.enc.Utf8);
  expect(espresso).toBe(reference);
});

test("utf8 empty string", () => {
  const espresso = enc.Utf8.stringify(enc.Utf8.parse(""));
  const reference = cryptojs.enc.Utf8.stringify(cryptojs.enc.Utf8.parse(""));
  expect(espresso).toBe(reference);
});

test("utf8 unicode round trip", () => {
  const word = "你好世界🌍🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  const espresso = enc.Utf8.parse(word).toString(enc.Utf8);
  const reference = cryptojs.enc.Utf8.parse(word).toString(cryptojs.enc.Utf8);
  expect(espresso).toBe(reference);
  expect(espresso).toBe(word);
});
