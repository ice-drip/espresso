import { hexFormat, hexParse } from '@kaffee/espresso';

describe('Hex format', () => {
  it('formats ciphertext to hex string', () => {
    const ciphertext = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);
    const result = hexFormat(ciphertext);
    expect(result).toBe('deadbeef');
  });

  it('parses hex to bytes', () => {
    const hex = 'cafebabe';
    const bytes = hexParse(hex);
    expect(bytes).toEqual(new Uint8Array([0xca, 0xfe, 0xba, 0xbe]));
  });

  it('roundtrips format then parse', () => {
    const input = new Uint8Array([0x01, 0x02, 0x03, 0xff, 0x00, 0x10]);
    const hex = hexFormat(input);
    const decoded = hexParse(hex);
    expect(decoded).toEqual(input);
  });

  it('roundtrips empty input', () => {
    const input = new Uint8Array([]);
    const hex = hexFormat(input);
    expect(hex).toBe('');
    const decoded = hexParse(hex);
    expect(decoded).toEqual(input);
  });

  it('roundtrips single byte', () => {
    const input = new Uint8Array([0xff]);
    const hex = hexFormat(input);
    expect(hex).toBe('ff');
    const decoded = hexParse(hex);
    expect(decoded).toEqual(input);
  });
});
