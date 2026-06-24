import { DESAlgo } from "../../algo/cipher/tripledes.algo";
import { BlockCipher } from "../../core/cipher/block-cipher";

const DES = BlockCipher.createHelper(DESAlgo);

export { DES };
