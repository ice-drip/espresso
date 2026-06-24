import { SEEDAlgo } from "../../algo/cipher/seed.algo";
import { StreamCipher } from "../../core/cipher/stream-cipher";

const SEED = StreamCipher.createHelper(SEEDAlgo);
export { SEED };
