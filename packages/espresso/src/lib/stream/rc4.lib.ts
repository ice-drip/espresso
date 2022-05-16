import { RC4Algo } from "../../algo/cipher/rc4.algo";
import { StreamCipher } from "../../core/cipher/stream-cipher";

const RC4 = StreamCipher._createHelper(RC4Algo);
export { RC4 };
