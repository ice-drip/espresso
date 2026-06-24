import { RIPEMD128Algo } from "../../algo/hash/ripemd128.algo";
import { Hasher } from "../../core/hash/hasher";

const RIPEMD128 = Hasher.createHelper(RIPEMD128Algo);
export { RIPEMD128 };
