import { SHA1Algo } from "../../algo/hash/sha1.algo";
import { Hasher } from "../../core/hash/hasher";

const SHA1 = Hasher.createHelper(SHA1Algo);
export { SHA1 };
