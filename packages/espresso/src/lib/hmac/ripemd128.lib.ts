import { RIPEMD128Algo } from "../../algo/hash/ripemd128.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacRIPEMD128 = Hasher._createHmacHelper(RIPEMD128Algo);
export { HmacRIPEMD128 };
