import { hexEncode, hexDecode } from "@kaffee/espresso";

describe("Hex encoding", () => {
  it("encodes bytes to hex string", () => {
    expect(hexEncode(new Uint8Array([0xde, 0xad, 0xbe, 0xef]))).toBe("deadbeef");
  });

  it("decodes hex string to bytes", () => {
    const bytes = hexDecode("cafebabe");
    expect(bytes).toEqual(new Uint8Array([0xca, 0xfe, 0xba, 0xbe]));
  });

  it("roundtrip encode then decode", () => {
    const input = new Uint8Array([0x01, 0x02, 0x03, 0xff, 0x00, 0x10]);
    const hex = hexEncode(input);
    const decoded = hexDecode(hex);
    expect(decoded).toEqual(input);
  });

  it("throws on odd-length hex", () => {
    expect(() => hexDecode("abc")).toThrow();
  });
});
