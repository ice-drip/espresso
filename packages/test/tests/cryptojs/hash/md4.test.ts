import { hash } from "@kaffee/espresso";

test("md4 consistency", () => {
  expect(hash("md4", "hello")).toBe("866437cb7a794bce2b727acc0362ee27");
});

test("md4 empty string", () => {
  expect(hash("md4", "")).toBe("31d6cfe0d16ae931b73c59d7e0c089c0");
});

test("md4 long input", () => {
  const longStr = "a".repeat(10000);
  expect(typeof hash("md4", longStr)).toBe("string");
  expect(hash("md4", longStr).length).toBe(32);
});

test("md4 performance: 1000 iterations", () => {
  const start = Date.now();
  for (let i = 0; i < 1000; i++) {
    hash("md4", "test");
  }
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(1000);
});
