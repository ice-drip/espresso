import { RIPEMD256Algo } from "../../algo/hash/ripemd256.algo";
import { Hasher } from "../../core/hash/hasher";

const RIPEMD256 = Hasher._createHelper(RIPEMD256Algo);
export { RIPEMD256 };
