import { encrypt, decrypt } from "@ice-drip/espresso";
import { TestConfig } from "../config";
test("Rabbit encrypt testing", () => {
  const result = encrypt('rabbit', TestConfig.word, TestConfig.key, { outputEncoding: 'hex' });
  const originWord = decrypt('rabbit', result as string, TestConfig.key, { outputEncoding: 'utf8' });

  expect(TestConfig.word).toBe(originWord);
});
test("Rabbit decrypt testing", () => {
  const result = encrypt('rabbit', TestConfig.word, TestConfig.key, { outputEncoding: 'hex' });
  const originWord = decrypt('rabbit', result as string, TestConfig.key, { outputEncoding: 'utf8' });

  expect(TestConfig.word).toBe(originWord);
});
