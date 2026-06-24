import { WordArray } from "../word-array";
import { Cipher } from "./cipher";

export abstract class StreamCipher extends Cipher {
  blockSize = 1;
  public doFinalize(): WordArray {
    const finalProcessedBlocks = this.processBlocks(true);
    return finalProcessedBlocks;
  }
}
