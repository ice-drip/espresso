import { SHA224Algo } from "../../algo/hash/sha224.algo";
import { Hasher } from "../../core/hash/hasher";

const SHA224 = Hasher.createHelper(SHA224Algo);
export { SHA224 };
