import { RabbitAlgo } from "../../algo/cipher/rabbit.algo";
import { StreamCipher } from "../../core/cipher/stream-cipher";

const Rabbit = StreamCipher._createHelper(RabbitAlgo);
export { Rabbit };
