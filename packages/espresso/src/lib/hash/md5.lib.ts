import { MD5Algo } from "../../algo/hash/md5.algo";
import { Hasher } from "../../core/hash/hasher";

const MD5 = Hasher._createHelper(MD5Algo);
export { MD5 };
