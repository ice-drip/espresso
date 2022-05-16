import { RabbitLegacyAlgo } from "../../algo/cipher/rabbit-legacy.algo";
import { StreamCipher } from "../../core/cipher/stream-cipher";

const RabbitLegacy = StreamCipher._createHelper(RabbitLegacyAlgo);
export { RabbitLegacy };
