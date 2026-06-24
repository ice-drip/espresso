import { SHA1Algo } from "../../algo/hash/sha1.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacSHA1 = Hasher.createHmacHelper(SHA1Algo);
export { HmacSHA1 };
