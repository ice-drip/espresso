import { Base64 } from "./base64";
import { Hex } from "./hex";
import { Latin1 } from "./latin1";
import { Utf8 } from "./utf8";
import { Utf16, Utf16LE } from "./utf16";
export const enc = { Base64, Hex, Latin1, Utf8, Utf16, Utf16LE };

export { Base64, Hex, Latin1, Utf8, Utf16, Utf16LE };
export { hexEncode, hexDecode } from "./hex";
export { base64Encode, base64Decode } from "./base64";
export { utf8Encode, utf8Decode } from "./utf8";
export { latin1Encode, latin1Decode } from "./latin1";
export { utf16Encode, utf16Decode } from "./utf16";
