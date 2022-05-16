import { DESAlgo } from "../../algo/cipher/tripledes.algo";
import { BlockCipher } from "../../core/cipher/block-cipher";

const DES = BlockCipher._createHelper(DESAlgo);

export { DES };
