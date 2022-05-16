import { SHA512Algo } from "../../algo/hash/sha512.algo";
import { Hasher } from "../../core/hash/hasher";

const SHA512 = Hasher._createHelper(SHA512Algo);
export { SHA512 };
