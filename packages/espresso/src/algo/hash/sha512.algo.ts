// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-math-trunc */
import { Hasher } from "../../core/hash/hasher";
import { WordArray } from "../../core/word-array";
import { X64Word, X64WordArray } from "../../core/x64-word";

const K = [
  new X64Word(0x42_8a_2f_98, 0xd7_28_ae_22),
  new X64Word(0x71_37_44_91, 0x23_ef_65_cd),
  new X64Word(0xb5_c0_fb_cf, 0xec_4d_3b_2f),
  new X64Word(0xe9_b5_db_a5, 0x81_89_db_bc),
  new X64Word(0x39_56_c2_5b, 0xf3_48_b5_38),
  new X64Word(0x59_f1_11_f1, 0xb6_05_d0_19),
  new X64Word(0x92_3f_82_a4, 0xaf_19_4f_9b),
  new X64Word(0xab_1c_5e_d5, 0xda_6d_81_18),
  new X64Word(0xd8_07_aa_98, 0xa3_03_02_42),
  new X64Word(0x12_83_5b_01, 0x45_70_6f_be),
  new X64Word(0x24_31_85_be, 0x4e_e4_b2_8c),
  new X64Word(0x55_0c_7d_c3, 0xd5_ff_b4_e2),
  new X64Word(0x72_be_5d_74, 0xf2_7b_89_6f),
  new X64Word(0x80_de_b1_fe, 0x3b_16_96_b1),
  new X64Word(0x9b_dc_06_a7, 0x25_c7_12_35),
  new X64Word(0xc1_9b_f1_74, 0xcf_69_26_94),
  new X64Word(0xe4_9b_69_c1, 0x9e_f1_4a_d2),
  new X64Word(0xef_be_47_86, 0x38_4f_25_e3),
  new X64Word(0x0f_c1_9d_c6, 0x8b_8c_d5_b5),
  new X64Word(0x24_0c_a1_cc, 0x77_ac_9c_65),
  new X64Word(0x2d_e9_2c_6f, 0x59_2b_02_75),
  new X64Word(0x4a_74_84_aa, 0x6e_a6_e4_83),
  new X64Word(0x5c_b0_a9_dc, 0xbd_41_fb_d4),
  new X64Word(0x76_f9_88_da, 0x83_11_53_b5),
  new X64Word(0x98_3e_51_52, 0xee_66_df_ab),
  new X64Word(0xa8_31_c6_6d, 0x2d_b4_32_10),
  new X64Word(0xb0_03_27_c8, 0x98_fb_21_3f),
  new X64Word(0xbf_59_7f_c7, 0xbe_ef_0e_e4),
  new X64Word(0xc6_e0_0b_f3, 0x3d_a8_8f_c2),
  new X64Word(0xd5_a7_91_47, 0x93_0a_a7_25),
  new X64Word(0x06_ca_63_51, 0xe0_03_82_6f),
  new X64Word(0x14_29_29_67, 0x0a_0e_6e_70),
  new X64Word(0x27_b7_0a_85, 0x46_d2_2f_fc),
  new X64Word(0x2e_1b_21_38, 0x5c_26_c9_26),
  new X64Word(0x4d_2c_6d_fc, 0x5a_c4_2a_ed),
  new X64Word(0x53_38_0d_13, 0x9d_95_b3_df),
  new X64Word(0x65_0a_73_54, 0x8b_af_63_de),
  new X64Word(0x76_6a_0a_bb, 0x3c_77_b2_a8),
  new X64Word(0x81_c2_c9_2e, 0x47_ed_ae_e6),
  new X64Word(0x92_72_2c_85, 0x14_82_35_3b),
  new X64Word(0xa2_bf_e8_a1, 0x4c_f1_03_64),
  new X64Word(0xa8_1a_66_4b, 0xbc_42_30_01),
  new X64Word(0xc2_4b_8b_70, 0xd0_f8_97_91),
  new X64Word(0xc7_6c_51_a3, 0x06_54_be_30),
  new X64Word(0xd1_92_e8_19, 0xd6_ef_52_18),
  new X64Word(0xd6_99_06_24, 0x55_65_a9_10),
  new X64Word(0xf4_0e_35_85, 0x57_71_20_2a),
  new X64Word(0x10_6a_a0_70, 0x32_bb_d1_b8),
  new X64Word(0x19_a4_c1_16, 0xb8_d2_d0_c8),
  new X64Word(0x1e_37_6c_08, 0x51_41_ab_53),
  new X64Word(0x27_48_77_4c, 0xdf_8e_eb_99),
  new X64Word(0x34_b0_bc_b5, 0xe1_9b_48_a8),
  new X64Word(0x39_1c_0c_b3, 0xc5_c9_5a_63),
  new X64Word(0x4e_d8_aa_4a, 0xe3_41_8a_cb),
  new X64Word(0x5b_9c_ca_4f, 0x77_63_e3_73),
  new X64Word(0x68_2e_6f_f3, 0xd6_b2_b8_a3),
  new X64Word(0x74_8f_82_ee, 0x5d_ef_b2_fc),
  new X64Word(0x78_a5_63_6f, 0x43_17_2f_60),
  new X64Word(0x84_c8_78_14, 0xa1_f0_ab_72),
  new X64Word(0x8c_c7_02_08, 0x1a_64_39_ec),
  new X64Word(0x90_be_ff_fa, 0x23_63_1e_28),
  new X64Word(0xa4_50_6c_eb, 0xde_82_bd_e9),
  new X64Word(0xbe_f9_a3_f7, 0xb2_c6_79_15),
  new X64Word(0xc6_71_78_f2, 0xe3_72_53_2b),
  new X64Word(0xca_27_3e_ce, 0xea_26_61_9c),
  new X64Word(0xd1_86_b8_c7, 0x21_c0_c2_07),
  new X64Word(0xea_da_7d_d6, 0xcd_e0_eb_1e),
  new X64Word(0xf5_7d_4f_7f, 0xee_6e_d1_78),
  new X64Word(0x06_f0_67_aa, 0x72_17_6f_ba),
  new X64Word(0x0a_63_7d_c5, 0xa2_c8_98_a6),
  new X64Word(0x11_3f_98_04, 0xbe_f9_0d_ae),
  new X64Word(0x1b_71_0b_35, 0x13_1c_47_1b),
  new X64Word(0x28_db_77_f5, 0x23_04_7d_84),
  new X64Word(0x32_ca_ab_7b, 0x40_c7_24_93),
  new X64Word(0x3c_9e_be_0a, 0x15_c9_be_bc),
  new X64Word(0x43_1d_67_c4, 0x9c_10_0d_4c),
  new X64Word(0x4c_c5_d4_be, 0xcb_3e_42_b6),
  new X64Word(0x59_7f_29_9c, 0xfc_65_7e_2a),
  new X64Word(0x5f_cb_6f_ab, 0x3a_d6_fa_ec),
  new X64Word(0x6c_44_19_8c, 0x4a_47_58_17)
];
const W: X64Word[] = [];
for (let i = 0; i < 80; i += 1) {
  W[i] = {} as X64Word;
}

/**
 * SHA512算法
 *
 * @author rikka
 * @exports
 * @class SHA512Algo
 * @augments {Hasher}
 */
export class SHA512Algo extends Hasher {
  public _hash!: X64WordArray;
  blockSize = 1024 / 32;
  constructor() {
    super();
  }

  reset(): void {
    super.reset();
    this._hash = new X64WordArray([
      new X64Word(0x6a_09_e6_67, 0xf3_bc_c9_08),
      new X64Word(0xbb_67_ae_85, 0x84_ca_a7_3b),
      new X64Word(0x3c_6e_f3_72, 0xfe_94_f8_2b),
      new X64Word(0xa5_4f_f5_3a, 0x5f_1d_36_f1),
      new X64Word(0x51_0e_52_7f, 0xad_e6_82_d1),
      new X64Word(0x9b_05_68_8c, 0x2b_3e_6c_1f),
      new X64Word(0x1f_83_d9_ab, 0xfb_41_bd_6b),
      new X64Word(0x5b_e0_cd_19, 0x13_7e_21_79)
    ]);
  }

  public _doFinalize(): WordArray {
    // Shortcuts
    const data = this._data;
    const dataWords = data.words;

    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = data.sigBytes * 8;

    // Add padding
    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
    dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(
      nBitsTotal / 0x1_00_00_00_00
    );
    dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
    data.sigBytes = dataWords.length * 4;

    // Hash final blocks
    this._process();

    // Convert hash to 32-bit word array before returning
    const hash = this._hash.toX32();

    // Return final computed hash
    return hash;
  }
  _doProcessBlock(M: number[], offset: number): void {
    const H = this._hash.words;

    const H0 = H[0];
    const H1 = H[1];
    const H2 = H[2];
    const H3 = H[3];
    const H4 = H[4];
    const H5 = H[5];
    const H6 = H[6];
    const H7 = H[7];

    const H0h = H0.high;
    let H0l = H0.low;
    const H1h = H1.high;
    let H1l = H1.low;
    const H2h = H2.high;
    let H2l = H2.low;
    const H3h = H3.high;
    let H3l = H3.low;
    const H4h = H4.high;
    let H4l = H4.low;
    const H5h = H5.high;
    let H5l = H5.low;
    const H6h = H6.high;
    let H6l = H6.low;
    const H7h = H7.high;
    let H7l = H7.low;

    // Working variables
    let ah = H0h;
    let al = H0l;
    let bh = H1h;
    let bl = H1l;
    let ch = H2h;
    let cl = H2l;
    let dh = H3h;
    let dl = H3l;
    let eh = H4h;
    let el = H4l;
    let fh = H5h;
    let fl = H5l;
    let gh = H6h;
    let gl = H6l;
    let hh = H7h;
    let hl = H7l;

    for (let i = 0; i < 80; i++) {
      let Wil;
      let Wih;

      // Shortcut
      const Wi = W[i];

      // Extend message
      if (i < 16) {
        Wih = Wi.high = M[offset + i * 2] | 0;
        Wil = Wi.low = M[offset + i * 2 + 1] | 0;
      } else {
        // Gamma0
        const gamma0x = W[i - 15];
        const gamma0xh = gamma0x.high;
        const gamma0xl = gamma0x.low;
        const gamma0h =
          ((gamma0xh >>> 1) | (gamma0xl << 31)) ^
          ((gamma0xh >>> 8) | (gamma0xl << 24)) ^
          (gamma0xh >>> 7);
        const gamma0l =
          ((gamma0xl >>> 1) | (gamma0xh << 31)) ^
          ((gamma0xl >>> 8) | (gamma0xh << 24)) ^
          ((gamma0xl >>> 7) | (gamma0xh << 25));

        // Gamma1
        const gamma1x = W[i - 2];
        const gamma1xh = gamma1x.high;
        const gamma1xl = gamma1x.low;
        const gamma1h =
          ((gamma1xh >>> 19) | (gamma1xl << 13)) ^
          ((gamma1xh << 3) | (gamma1xl >>> 29)) ^
          (gamma1xh >>> 6);
        const gamma1l =
          ((gamma1xl >>> 19) | (gamma1xh << 13)) ^
          ((gamma1xl << 3) | (gamma1xh >>> 29)) ^
          ((gamma1xl >>> 6) | (gamma1xh << 26));

        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
        const Wi7 = W[i - 7];
        const Wi7h = Wi7.high;
        const Wi7l = Wi7.low;

        const Wi16 = W[i - 16];
        const Wi16h = Wi16.high;
        const Wi16l = Wi16.low;

        Wil = gamma0l + Wi7l;
        Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
        Wil = Wil + gamma1l;
        Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
        Wil = Wil + Wi16l;
        Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);

        Wi.high = Wih;
        Wi.low = Wil;
      }

      const chh = (eh & fh) ^ (~eh & gh);
      const chl = (el & fl) ^ (~el & gl);
      const majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
      const majl = (al & bl) ^ (al & cl) ^ (bl & cl);

      const sigma0h =
        ((ah >>> 28) | (al << 4)) ^
        ((ah << 30) | (al >>> 2)) ^
        ((ah << 25) | (al >>> 7));
      const sigma0l =
        ((al >>> 28) | (ah << 4)) ^
        ((al << 30) | (ah >>> 2)) ^
        ((al << 25) | (ah >>> 7));
      const sigma1h =
        ((eh >>> 14) | (el << 18)) ^
        ((eh >>> 18) | (el << 14)) ^
        ((eh << 23) | (el >>> 9));
      const sigma1l =
        ((el >>> 14) | (eh << 18)) ^
        ((el >>> 18) | (eh << 14)) ^
        ((el << 23) | (eh >>> 9));

      // t1 = h + sigma1 + ch + K[i] + W[i]
      const Ki = K[i];
      const Kih = Ki.high;
      const Kil = Ki.low;

      let t1l = hl + sigma1l;
      let t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
      t1l = t1l + chl;
      t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
      t1l = t1l + Kil;
      t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
      t1l = t1l + Wil;
      t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);

      // t2 = sigma0 + maj
      const t2l = sigma0l + majl;
      const t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);

      // Update working variables
      hh = gh;
      hl = gl;
      gh = fh;
      gl = fl;
      fh = eh;
      fl = el;
      el = (dl + t1l) | 0;
      eh = (dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0)) | 0;
      dh = ch;
      dl = cl;
      ch = bh;
      cl = bl;
      bh = ah;
      bl = al;
      al = (t1l + t2l) | 0;
      ah = (t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0)) | 0;
    }
    H0l = H0.low = H0l + al;
    H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
    H1l = H1.low = H1l + bl;
    H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
    H2l = H2.low = H2l + cl;
    H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
    H3l = H3.low = H3l + dl;
    H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
    H4l = H4.low = H4l + el;
    H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
    H5l = H5.low = H5l + fl;
    H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
    H6l = H6.low = H6l + gl;
    H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
    H7l = H7.low = H7l + hl;
    H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
  }
}
