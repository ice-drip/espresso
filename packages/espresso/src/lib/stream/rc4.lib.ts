import { RC4Algo } from "../../algo/cipher/rc4.algo";
import { StreamCipher } from "../../core/cipher/stream-cipher";

const RC4 = StreamCipher.createHelper(RC4Algo);
export { RC4 };
