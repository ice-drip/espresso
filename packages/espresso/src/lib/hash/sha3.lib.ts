import { SHA3Algo } from "../../algo/hash/sha3.algo";
import { Hasher } from "../../core/hash/hasher";

const SHA3 = Hasher._createHelper(SHA3Algo);
export { SHA3 };
