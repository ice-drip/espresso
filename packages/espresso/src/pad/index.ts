import { AnsiX923 } from "./ansi-x923";
import { ISO10126 } from "./iso-10126";
import { ISO97971 } from "./iso-97971";
import { NoPadding } from "./no-padding";
import { PKCS7 } from "./pkcs7";
import { ZeroPadding } from "./zero-padding";

export { AnsiX923, ISO10126, ISO97971, NoPadding, PKCS7, ZeroPadding };
export const pad = {
  AnsiX923,
  ISO10126,
  ISO97971,
  NoPadding,
  PKCS7,
  ZeroPadding
};
