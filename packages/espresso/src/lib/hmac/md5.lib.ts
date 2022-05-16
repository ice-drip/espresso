import { MD5Algo } from "../../algo/hash/md5.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacMD5 = Hasher._createHmacHelper(MD5Algo);

export { HmacMD5 };
