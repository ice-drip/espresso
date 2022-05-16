# @kaffee/espresso

A based TypeScript crypto library, tree shaking support

## Installation

Install with npm

```bash
  npm install --dev @kaffee/espresso
```

Install with yarn

```bash
  yarn add --dev @kaffee/espresso
```

Install with pnpm

```bash
  pnpm add -D @kaffee/espresso
```

## Support List

### Hash

- md4
- md5
- pbkdf2
- ripemd128
- ripemd160
- ripemd256
- ripemd320
- sha1
- sha3
- sha224
- sha256
- sha384
- sha512

### Hmac Hash

- md4
- md5
- pbkdf2
- ripemd128
- ripemd160
- ripemd256
- ripemd320
- sha1
- sha3
- sha224
- sha256
- sha384
- sha512

### Block Cipher

- AES
- DES
- Triple DES

### Stream Cipher

`but is not support`

- SEED
- Rabbit
- Rabbit Legacy
- RC4

## Example

### Hash Example

```javascript
import { MD5 } from "@kaffee/espresso";

const hash = MD5("LIBAOBAO").toString();
```

### Block Cipher Example

```typescript

import { AES, enc, RIPEMD160, mode, pad } from "@kaffee/espresso";

function AESEncrypt(text: string, keyStr: string, ivStr: string): string {
  const key = RIPEMD160(keyStr).toString().slice(0, 16);
  const iv = enc.Utf8.parse(ivStr);
  return AES.encrypt(text, Utf8.parse(key), {
    iv,
    mode: mode.CBC,
    padding: pad.PKCS7
  }).toString();
}

function AESDecrypt(text: string, key: string, ivStr: string): string {
  const iv = enc.Utf8.parse(ivStr);
  return AES.decrypt(text, key, {
    iv,
    mode: mode.CBC,
    padding: pad.PKCS7
  }).toString(enc.Utf8);
}

```

## Other

![tree shaking](https://i.imgur.com/vqZrctP.png)

## License

[GPL](https://choosealicense.com/licenses/gpl-3.0/)

## Contributors

<a href="https://github.com/Muromi-Rikka" >
  <img style="border-radius:200px;" src="https://github.com/Muromi-Rikka.png?size=50">
</a>
