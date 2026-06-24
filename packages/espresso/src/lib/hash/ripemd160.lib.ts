import { RIPEMD160Algo } from "../../algo/hash/ripemd160.algo";
import { Hasher } from "../../core/hash/hasher";

const RIPEMD160 = Hasher.createHelper(RIPEMD160Algo);
export { RIPEMD160 };
