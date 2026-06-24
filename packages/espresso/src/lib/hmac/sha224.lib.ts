import { SHA224Algo } from "../../algo/hash/sha224.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacSHA224 = Hasher.createHmacHelper(SHA224Algo);
export { HmacSHA224 };
