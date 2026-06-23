import { hash } from "@kaffee/espresso";

test("ripemd128 consistency", () => {
  expect(hash('ripemd128', 'hello')).toBe('789d569f08ed7055e94b4289a4195012');
});

test("ripemd128 empty string", () => {
  expect(hash('ripemd128', '')).toBe('cdf26213a150dc3ecb610f18f6b38b46');
});

test("ripemd128 long input", () => {
  const longStr = 'a'.repeat(10000);
  expect(typeof hash('ripemd128', longStr)).toBe('string');
  expect(hash('ripemd128', longStr).length).toBe(32);
});

test("ripemd128 performance: 1000 iterations", () => {
  const start = Date.now();
  for (let i = 0; i < 1000; i++) {
    hash('ripemd128', 'test');
  }
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(1000);
});
