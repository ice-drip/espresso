import {
  HmacMD4,
  HmacMD5,
  HmacRIPEMD128,
  HmacRIPEMD160,
  HmacRIPEMD256,
  HmacRIPEMD320,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA3,
  HmacSHA384,
  HmacSHA512,
  MD4,
  MD5,
  RIPEMD128,
  RIPEMD160,
  RIPEMD256,
  RIPEMD320,
  SHA1,
  SHA224,
  SHA256,
  SHA3,
  SHA384,
  SHA512,
} from '@kaffee/espresso';

abstract class CryptoUtils {
  public static MD4(str: string): string {
    return MD4(str).toString();
  }
  public static MD5(str: string): string {
    return MD5(str).toString();
  }
  public static RIPEMD128(str: string): string {
    return RIPEMD128(str).toString();
  }
  public static RIPEMD160(str: string): string {
    return RIPEMD160(str).toString();
  }
  public static RIPEMD256(str: string): string {
    return RIPEMD256(str).toString();
  }
  public static RIPEMD320(str: string): string {
    return RIPEMD320(str).toString();
  }
  public static SHA1(str: string): string {
    return SHA1(str).toString();
  }
  public static SHA3(str: string): string {
    return SHA3(str).toString();
  }
  public static SHA224(str: string): string {
    return SHA224(str).toString();
  }
  public static SHA256(str: string): string {
    return SHA256(str).toString();
  }
  public static SHA384(str: string): string {
    return SHA384(str).toString();
  }
  public static SHA512(str: string): string {
    return SHA512(str).toString();
  }
  public static HmacMD4(str: string, salt: string): string {
    return HmacMD4(str, salt).toString();
  }
  public static HmacMD5(str: string, salt: string): string {
    return HmacMD5(str, salt).toString();
  }
  public static HmacRIPEMD128(str: string, salt: string): string {
    return HmacRIPEMD128(str, salt).toString();
  }
  public static HmacRIPEMD160(str: string, salt: string): string {
    return HmacRIPEMD160(str, salt).toString();
  }
  public static HmacRIPEMD256(str: string, salt: string): string {
    return HmacRIPEMD256(str, salt).toString();
  }
  public static HmacRIPEMD320(str: string, salt: string): string {
    return HmacRIPEMD320(str, salt).toString();
  }
  public static HmacSHA1(str: string, salt: string): string {
    return HmacSHA1(str, salt).toString();
  }
  public static HmacSHA3(str: string, salt: string): string {
    return HmacSHA3(str, salt).toString();
  }
  public static HmacSHA224(str: string, salt: string): string {
    return HmacSHA224(str, salt).toString();
  }
  public static HmacSHA256(str: string, salt: string): string {
    return HmacSHA256(str, salt).toString();
  }
  public static HmacSHA384(str: string, salt: string): string {
    return HmacSHA384(str, salt).toString();
  }
  public static HmacSHA512(str: string, salt: string): string {
    return HmacSHA512(str, salt).toString();
  }
  public static reverse(str: string): string {
    return str.split('').reverse().join('');
  }
  public static join(str: string, salt: string): string {
    return str.split('').join(salt);
  }
}
type LabelType =
  | 'MD4'
  | 'MD5'
  | 'RIPEMD128'
  | 'RIPEMD160'
  | 'RIPEMD256'
  | 'RIPEMD320'
  | 'SHA1'
  | 'SHA3'
  | 'SHA224'
  | 'SHA256'
  | 'SHA384'
  | 'SHA512'
  | 'HmacMD4'
  | 'HmacMD5'
  | 'HmacRIPEMD128'
  | 'HmacRIPEMD160'
  | 'HmacRIPEMD256'
  | 'HmacRIPEMD320'
  | 'HmacSHA1'
  | 'HmacSHA3'
  | 'HmacSHA224'
  | 'HmacSHA256'
  | 'HmacSHA384'
  | 'HmacSHA512'
  | 'reverse'
  | 'join';
interface CryptoItem {
  label: LabelType;
  extension: CryptoItemExtension;
}

interface CryptoItemExtension {
  case: 'lower' | 'upper';
  repeat: number;
  salt: string;
}

function execCrypto(text: string, list: CryptoItem[]): string {
  let _text = text;
  list.forEach((item) => {
    Array.from({ length: item.extension.repeat }).forEach(() => {
      _text = CryptoUtils[item.label](_text, item.extension.salt);
    });
  });
  return _text;
}

export { CryptoItem, execCrypto };
