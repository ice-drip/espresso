import { AESAlgo } from "../../algo/cipher/aes.algo";
import { BlockCipher } from "../../core/cipher/block-cipher";

const AES = BlockCipher._createHelper(AESAlgo);
export { AES };
