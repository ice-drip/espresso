import { hmac } from '@kaffee/espresso';

describe('HMAC', () => {
  it('computes HMAC-SHA256', () => {
    const result = hmac('sha256', 'hello', 'secret');
    expect(typeof result).toBe('string');
    expect(result.length).toBe(64); // 32 bytes hex
  });

  it('produces consistent results', () => {
    const r1 = hmac('sha256', 'test', 'key');
    const r2 = hmac('sha256', 'test', 'key');
    expect(r1).toBe(r2);
  });
});
