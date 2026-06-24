import { SHA384Algo } from "../../algo/hash/sha384.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacSHA384 = Hasher.createHmacHelper(SHA384Algo);
export { HmacSHA384 };
