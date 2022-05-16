import { SHA512Algo } from "../../algo/hash/sha512.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacSHA512 = Hasher._createHmacHelper(SHA512Algo);
export { HmacSHA512 };
