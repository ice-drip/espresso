import { RIPEMD320Algo } from "../../algo/hash/ripemd320.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacRIPEMD320 = Hasher._createHmacHelper(RIPEMD320Algo);
export { HmacRIPEMD320 };
