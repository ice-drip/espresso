import cryptojs from "crypto-js";
import { enc } from "@kaffee/espresso";

test("base64 encode consistency", () => {
  const word = "hello world";
  const espresso = enc.Base64.stringify(enc.Utf8.parse(word));
  const reference = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(word));
  expect(espresso).toBe(reference);
});

test("base64 decode consistency", () => {
  const b64 = "SGVsbG8gd29ybGQ=";
  const espresso = enc.Base64.parse(b64).toString(enc.Utf8);
  const reference = cryptojs.enc.Base64.parse(b64).toString(cryptojs.enc.Utf8);
  expect(espresso).toBe(reference);
});

test("base64 empty string", () => {
  const espresso = enc.Base64.stringify(enc.Utf8.parse(""));
  const reference = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(""));
  expect(espresso).toBe(reference);
});

test("base64 special characters / unicode", () => {
  const word = "你好世界🌍";
  const espresso = enc.Base64.stringify(enc.Utf8.parse(word));
  const reference = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(word));
  expect(espresso).toBe(reference);

  expect(enc.Base64.parse(espresso).toString(enc.Utf8)).toBe(word);
});
