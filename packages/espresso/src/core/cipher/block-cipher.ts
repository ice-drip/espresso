import { CBC } from "../../mode";
import { BlockCipherModeAlgorithm } from "../../mode/block-cipher-mode-algorithm";
import { PKCS7 } from "../../pad";
import { BufferedBlockAlgorithmConfig } from "../../typings/core/buffered-block-algorithm.typing";

import { WordArray } from "../word-array";
import { Cipher } from "./cipher";

/**
 * 基本块密码模板 抽象类
 *
 * @author rikka
 * @exports
 * @abstract
 * @class BlockCipher
 * @augments {Cipher}
 */
export abstract class BlockCipher extends Cipher {
  public _mode!: BlockCipherModeAlgorithm;
  blockSize = 128 / 32;

  constructor(
    xformMode: number,
    key: WordArray,
    cfg?: BufferedBlockAlgorithmConfig
  ) {
    super(
      xformMode,
      key,
      Object.assign(
        {
          mode: CBC,
          padding: PKCS7
        },
        cfg
      )
    );
  }

  public reset(): void {
    super.reset();
    if (this.cfg.mode === undefined) {
      throw new Error("missing mode in config");
    }
    let modeCreator: (
      _cipher: BlockCipher,
      _iv: number[]
    ) => BlockCipherModeAlgorithm;
    if (
      this._xformMode === (<typeof BlockCipher>this.constructor)._ENC_XFORM_MODE
    ) {
      modeCreator = this.cfg.mode.createEncryptor;
    } else {
      modeCreator = this.cfg.mode.createDecryptor;
      this._minBufferSize = 1;
    }
    const words: number[] = (this.cfg.iv && this.cfg.iv.words) as number[];
    if (this._mode && this._mode.__creator === modeCreator) {
      this._mode.init(this, words);
    } else {
      this._mode = modeCreator.call(this.cfg.mode, this, words);
      this._mode.__creator = modeCreator;
    }
  }

  public abstract encryptBlock(_M: number[], _offset: number): void;
  public abstract decryptBlock(_M: number[], _offset: number): void;
  public _doProcessBlock(words: number[], offset: number): void {
    this._mode.processBlock(words, offset);
  }

  public _doFinalize(): WordArray {
    if (this.cfg.padding === undefined) {
      throw new Error("missing padding in config");
    }

    let finalProcessedBlocks: WordArray;
    if (
      this._xformMode === (<typeof BlockCipher>this.constructor)._ENC_XFORM_MODE
    ) {
      if (this.blockSize === undefined) {
        throw new Error("missing blockSize in config");
      }

      this.cfg.padding.pad(this._data, this.blockSize);
      finalProcessedBlocks = this._process(!!"flush");
    } else {
      finalProcessedBlocks = this._process(!!"flush");
      this.cfg.padding.unpad(finalProcessedBlocks);
    }
    return finalProcessedBlocks;
  }
}
