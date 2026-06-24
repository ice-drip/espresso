import { utf16Encode, utf16Decode } from "@kaffee/espresso";

describe("UTF-16 encoding", () => {
  it("decodes UTF-16BE bytes", () => {
    const bytes = utf16Decode("A", false);
    expect(bytes).toEqual(new Uint8Array([0x00, 0x41]));
  });

  it("decodes UTF-16LE bytes", () => {
    const bytes = utf16Decode("A", true);
    expect(bytes).toEqual(new Uint8Array([0x41, 0x00]));
  });
});
