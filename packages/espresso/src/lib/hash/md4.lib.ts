import { MD4Algo } from "../../algo/hash/md4.algo";
import { Hasher } from "../../core/hash/hasher";

const MD4 = Hasher.createHelper(MD4Algo);

export { MD4 };
