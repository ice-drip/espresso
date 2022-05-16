import { MD4Algo } from "../../algo/hash/md4.algo";
import { Hasher } from "../../core/hash/hasher";

const HmacMD4 = Hasher._createHmacHelper(MD4Algo);

export { HmacMD4 };
