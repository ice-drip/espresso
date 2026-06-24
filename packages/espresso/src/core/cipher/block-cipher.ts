import { CBC } from "../../mode";
import { BlockCipherModeAlgorithm } from "../../mode/block-cipher-mode-algorithm";
import { PKCS7 } from "../../pad";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

import { WordArray } from "../word-array";
import { Cipher } from "./cipher";

/**
 * 基本块密码模�?抽象�? *
 * @author rikka
 * @exports
 * @abstract
 * @class BlockCipher
 * @augments {Cipher}
 */
export abstract class BlockCipher extends Cipher {
  private mode!: BlockCipherModeAlgorithm;
  blockSize = 128 / 32;

  constructor(xformMode: number, key: WordArray, cfg?: BufferedBlockAlgorithmConfig) {
    super(
      xformMode,
      key,
      Object.assign(
        {
          mode: CBC,
          padding: PKCS7,
        },
        cfg,
      ),
    );
  }

  public reset(): void {
    super.reset();
    if (this.cfg.mode === undefined) {
      throw new Error("missing mode in config");
    }
    let modeCreator: (_cipher: BlockCipher, _iv: number[]) => BlockCipherModeAlgorithm;
    if (this.xformMode === (<typeof BlockCipher>this.constructor).ENC_XFORM_MODE) {
      modeCreator = this.cfg.mode.createEncryptor;
    } else {
      modeCreator = this.cfg.mode.createDecryptor;
      this.minBufferSize = 1;
    }
    const words: number[] = (this.cfg.iv && this.cfg.iv.words) as number[];
    if (this.mode && this.mode.creator === modeCreator) {
      this.mode.init(this, words);
    } else {
      this.mode = modeCreator.call(this.cfg.mode, this, words);
      this.mode.creator = modeCreator;
    }
  }

  public abstract encryptBlock(_M: number[], _offset: number): void;
  public abstract decryptBlock(_M: number[], _offset: number): void;
  public doProcessBlock(words: number[], offset: number): void {
    this.mode.processBlock(words, offset);
  }

  public doFinalize(): WordArray {
    if (this.cfg.padding === undefined) {
      throw new Error("missing padding in config");
    }

    let finalProcessedBlocks: WordArray;
    if (this.xformMode === (<typeof BlockCipher>this.constructor).ENC_XFORM_MODE) {
      if (this.blockSize === undefined) {
        throw new Error("missing blockSize in config");
      }

      this.cfg.padding.pad(this.data, this.blockSize);
      finalProcessedBlocks = this.processBlocks(true);
    } else {
      finalProcessedBlocks = this.processBlocks(true);
      this.cfg.padding.unpad(finalProcessedBlocks);
    }
    return finalProcessedBlocks;
  }
}
