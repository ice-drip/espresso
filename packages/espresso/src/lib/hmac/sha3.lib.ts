import { SHA3Algo } from "../../algo/hash/sha3.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacSHA3 = Hasher.createHmacHelper(SHA3Algo);
export { HmacSHA3 };
