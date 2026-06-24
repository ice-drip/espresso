import { SHA256Algo } from "../../algo/hash/sha256.algo";
import { Hasher } from "../../core/hash/hasher";

const SHA256 = Hasher.createHelper(SHA256Algo);
export { SHA256 };
