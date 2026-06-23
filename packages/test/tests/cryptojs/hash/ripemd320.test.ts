import { hash } from "@kaffee/espresso";

test("ripemd320 consistency", () => {
  expect(hash('ripemd320', 'hello')).toBe('eb0cf45114c56a8421fbcb33430fa22e0cd607560a88bbe14ce70bdf59bf55b11a3906987c487992');
});

test("ripemd320 empty string", () => {
  expect(hash('ripemd320', '')).toBe('22d65d5661536cdc75c1fdf5c6de7b41b9f27325ebc61e8557177d705a0ec880151c3a32a00899b8');
});

test("ripemd320 long input", () => {
  const longStr = 'a'.repeat(10000);
  expect(typeof hash('ripemd320', longStr)).toBe('string');
  expect(hash('ripemd320', longStr).length).toBe(80);
});

test("ripemd320 performance: 1000 iterations", () => {
  const start = Date.now();
  for (let i = 0; i < 1000; i++) {
    hash('ripemd320', 'test');
  }
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(1000);
});
