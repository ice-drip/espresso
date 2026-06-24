import { utf8Encode, utf8Decode } from "@kaffee/espresso";

describe("UTF-8 encoding", () => {
  it("encodes ASCII string to bytes", () => {
    const bytes = utf8Encode("abc");
    expect(bytes).toEqual(new Uint8Array([0x61, 0x62, 0x63]));
  });

  it("encodes multi-byte characters", () => {
    const bytes = utf8Encode("€");
    expect(bytes).toEqual(new Uint8Array([0xe2, 0x82, 0xac]));
  });

  it("decodes bytes to string", () => {
    const str = utf8Decode(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]));
    expect(str).toBe("Hello");
  });

  it("roundtrip encode then decode", () => {
    const input = "Hello, 世界!";
    const bytes = utf8Encode(input);
    const decoded = utf8Decode(bytes);
    expect(decoded).toBe(input);
  });
});
