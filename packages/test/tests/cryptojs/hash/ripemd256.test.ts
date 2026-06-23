import { hash } from "@kaffee/espresso";

test("ripemd256 consistency", () => {
  expect(hash('ripemd256', 'hello')).toBe('cc1d2594aece0a064b7aed75a57283d9490fd5705ed3d66bf9adfe3a58b25de5');
});

test("ripemd256 empty string", () => {
  expect(hash('ripemd256', '')).toBe('02ba4c4e5f8ecd1877fc52d64d30e37a2d9774fb1e5d026380ae0168e3c5522d');
});

test("ripemd256 long input", () => {
  const longStr = 'a'.repeat(10000);
  expect(typeof hash('ripemd256', longStr)).toBe('string');
  expect(hash('ripemd256', longStr).length).toBe(64);
});

test("ripemd256 performance: 1000 iterations", () => {
  const start = Date.now();
  for (let i = 0; i < 1000; i++) {
    hash('ripemd256', 'test');
  }
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(1000);
});
