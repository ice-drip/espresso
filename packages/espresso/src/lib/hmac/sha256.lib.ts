import { SHA256Algo } from "../../algo/hash/sha256.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacSHA256 = Hasher._createHmacHelper(SHA256Algo);
export { HmacSHA256 };
