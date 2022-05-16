import { SHA224Algo } from "../../algo/hash/sha224.algo";
import { Hasher } from "../../core/hash/hasher";

const SHA224 = Hasher._createHelper(SHA224Algo);
export { SHA224 };
