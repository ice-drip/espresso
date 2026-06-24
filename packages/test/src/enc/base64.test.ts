import { base64Encode, base64Decode } from "@kaffee/espresso";

describe("Base64 encoding", () => {
  it("encodes bytes to base64 string", () => {
    expect(base64Encode(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]))).toBe("SGVsbG8=");
  });

  it("decodes base64 string to bytes", () => {
    const bytes = base64Decode("V29ybGQ=");
    expect(bytes).toEqual(new Uint8Array([0x57, 0x6f, 0x72, 0x6c, 0x64]));
  });

  it("roundtrip encode then decode", () => {
    const input = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0xff, 0xfe, 0xfd]);
    const b64 = base64Encode(input);
    const decoded = base64Decode(b64);
    expect(decoded).toEqual(input);
  });
});
