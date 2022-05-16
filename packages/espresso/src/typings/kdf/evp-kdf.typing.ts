import { Hasher } from "../../core/hash/hasher";

import { Type } from "../common.typing";

export interface OptionalEvpKDFConfig {
  keySize?: number;

  hasher?: Type<Hasher>;

  iterations?: number;
}

export type EvpKDFConfig = Required<OptionalEvpKDFConfig>;
