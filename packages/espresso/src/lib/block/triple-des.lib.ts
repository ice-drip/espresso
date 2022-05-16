import { TripleDESAlgo } from "../../algo/cipher/tripledes.algo";
import { BlockCipher } from "../../core/cipher/block-cipher";

const TripleDES = BlockCipher._createHelper(TripleDESAlgo);
export { TripleDES };
