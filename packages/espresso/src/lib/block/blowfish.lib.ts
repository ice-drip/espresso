import { BlowfishAlgo } from "../../algo/cipher/blowfish.algo";
import { BlockCipher } from "../../core/cipher/block-cipher";

const BlowFish = BlockCipher.createHelper(BlowfishAlgo);

export { BlowFish };
