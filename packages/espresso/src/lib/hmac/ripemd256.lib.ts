import { RIPEMD256Algo } from "../../algo/hash/ripemd256.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacRIPEMD256 = Hasher._createHmacHelper(RIPEMD256Algo);
export { HmacRIPEMD256 };
