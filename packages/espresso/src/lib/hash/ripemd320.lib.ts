import { RIPEMD320Algo } from "../../algo/hash/ripemd320.algo";
import { Hasher } from "../../core/hash/hasher";

const RIPEMD320 = Hasher._createHelper(RIPEMD320Algo);
export { RIPEMD320 };
