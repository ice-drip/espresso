import cryptojs from "crypto-js";
import { enc } from "@kaffee/espresso";

test("latin1 encode consistency", () => {
  const word = "hello world";
  const espresso = enc.Latin1.stringify(enc.Utf8.parse(word));
  const reference = cryptojs.enc.Latin1.stringify(cryptojs.enc.Utf8.parse(word));
  expect(espresso).toBe(reference);
});

test("latin1 decode consistency", () => {
  const latin1Str = "hello world";
  const espresso = enc.Latin1.parse(latin1Str).toString(enc.Utf8);
  const reference = cryptojs.enc.Latin1.parse(latin1Str).toString(cryptojs.enc.Utf8);
  expect(espresso).toBe(reference);
});

test("latin1 empty string", () => {
  const espresso = enc.Latin1.stringify(enc.Utf8.parse(""));
  const reference = cryptojs.enc.Latin1.stringify(cryptojs.enc.Utf8.parse(""));
  expect(espresso).toBe(reference);
});

test("latin1 high bytes", () => {
  const word = "\xff\xfe\xfd";
  const espresso = enc.Latin1.stringify(enc.Latin1.parse(word));
  const reference = cryptojs.enc.Latin1.stringify(cryptojs.enc.Latin1.parse(word));
  expect(espresso).toBe(reference);
  expect(espresso).toBe(word);
});
