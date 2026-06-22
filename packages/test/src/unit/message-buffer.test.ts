import { describe, it, expect } from 'vitest';
import { MessageBuffer } from '@ice-drip/espresso';

describe('MessageBuffer', () => {
  it('creates from string with utf8 encoding', () => {
    const buf = MessageBuffer.fromString('hello');
    expect(buf.toBytes()).toEqual(new Uint8Array([104, 101, 108, 108, 111]));
  });

  it('creates from Uint8Array', () => {
    const input = new Uint8Array([1, 2, 3]);
    const buf = MessageBuffer.fromBytes(input);
    expect(buf.toBytes()).toEqual(input);
  });

  it('converts to hex string', () => {
    const buf = MessageBuffer.fromBytes(new Uint8Array([0xca, 0xfe]));
    expect(buf.toHexString()).toBe('cafe');
  });

  it('creates from hex string', () => {
    const buf = MessageBuffer.fromHex('cafe');
    expect(buf.toBytes()).toEqual(new Uint8Array([0xca, 0xfe]));
  });

  it('concatenates buffers', () => {
    const a = MessageBuffer.fromBytes(new Uint8Array([1, 2]));
    const b = MessageBuffer.fromBytes(new Uint8Array([3, 4]));
    const result = a.concat(b);
    expect(result.toBytes()).toEqual(new Uint8Array([1, 2, 3, 4]));
  });

  it('clones independently', () => {
    const original = MessageBuffer.fromBytes(new Uint8Array([1, 2]));
    const clone = original.clone();
    expect(clone.toBytes()).toEqual(original.toBytes());
  });
});
