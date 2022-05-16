import { RC4DropAlgo } from "../../algo/cipher/rc4.algo";
import { StreamCipher } from "../../core/cipher/stream-cipher";

const RC4Drop = StreamCipher._createHelper(RC4DropAlgo);
export { RC4Drop };
