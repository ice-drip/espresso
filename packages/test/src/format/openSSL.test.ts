import { openSSLFormat, openSSLParse } from '@kaffee/espresso';

describe('OpenSSL format', () => {
  it('formats ciphertext with salt starting with Salted__', () => {
    const salt = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    const ciphertext = new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd]);
    const result = openSSLFormat({ ciphertext, salt });
    expect(result.startsWith('Salted__')).toBe(true);
  });

  it('parses formatted string to recover salt and ciphertext', () => {
    const salt = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    const ciphertext = new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd]);
    const formatted = openSSLFormat({ ciphertext, salt });
    const parsed = openSSLParse(formatted);
    expect(parsed.salt).toEqual(salt);
    expect(parsed.ciphertext).toEqual(ciphertext);
  });

  it('roundtrips format then parse', () => {
    const salt = new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0xca, 0xfe, 0xba, 0xbe]);
    const ciphertext = new Uint8Array([0x10, 0x20, 0x30, 0x40, 0x50]);
    const formatted = openSSLFormat({ ciphertext, salt });
    const parsed = openSSLParse(formatted);
    expect(parsed.salt).toEqual(salt);
    expect(parsed.ciphertext).toEqual(ciphertext);
  });

  it('throws on invalid format (missing prefix)', () => {
    expect(() => openSSLParse('notavalidstring')).toThrow('Invalid OpenSSL format');
  });

  it('throws on invalid format (too short after prefix)', () => {
    expect(() => openSSLParse('Salted__')).toThrow('Invalid OpenSSL format');
  });

  it('formats without salt still has prefix', () => {
    const ciphertext = new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x11, 0x22, 0x33]);
    const result = openSSLFormat({ ciphertext });
    expect(result.startsWith('Salted__')).toBe(true);
  });
});
