import { latin1Encode, latin1Decode } from "@kaffee/espresso";

describe("Latin1 encoding", () => {
  it("encodes bytes to string", () => {
    expect(latin1Encode(new Uint8Array([0x41, 0x42, 0x43]))).toBe("ABC");
  });

  it("decodes string to bytes", () => {
    const bytes = latin1Decode("\x00\x01\x02");
    expect(bytes).toEqual(new Uint8Array([0x00, 0x01, 0x02]));
  });

  it("roundtrip encode then decode", () => {
    const input = new Uint8Array([0x00, 0x7f, 0x80, 0xff]);
    const str = latin1Encode(input);
    const decoded = latin1Decode(str);
    expect(decoded).toEqual(input);
  });
});
