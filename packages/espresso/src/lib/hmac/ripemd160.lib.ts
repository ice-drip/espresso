import { RIPEMD160Algo } from "../../algo/hash/ripemd160.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160Algo);
export { HmacRIPEMD160 };
