import { SHA384Algo } from "../../algo/hash/sha384.algo";
import { Hasher } from "../../core/hash/hasher";

const SHA384 = Hasher._createHelper(SHA384Algo);
export { SHA384 };
