# @kaffee/espresso

A TypeScript cryptography library with Web Crypto + pure JS dual runtime support. Tree-shakeable, zero-dependency, compatible with crypto-js output.

## Installation

```bash
npm install @kaffee/espresso
# or
pnpm add @kaffee/espresso
# or
yarn add @kaffee/espresso
```

## Supported Algorithms

### Hash

- MD4, MD5
- SHA-1, SHA-224, SHA-256, SHA-384, SHA-512
- SHA3
- RIPEMD-128, RIPEMD-160, RIPEMD-256, RIPEMD-320
- PBKDF2

### HMAC

- HMAC with any supported hash algorithm

### Block Cipher

- AES (128, 192, 256-bit)
- DES
- Triple DES (3-key EDE)
- BlowFish
- SEED

### Stream Cipher

- RC4 / RC4Drop
- Rabbit / RabbitLegacy

### Block Modes

- CBC, ECB, CTR, CFB, OFB

### Padding

- PKCS7, Zero, ANSI X.923, ISO 9797-1, ISO 10126, No Padding

## Examples

### Hash

```typescript
import { MD5, SHA256 } from '@kaffee/espresso';

const md5Hash = MD5('LIBAOBAO').toString();
const sha256Hash = SHA256('Hello, World!').toString();
```

### Block Cipher

```typescript
import { AES, enc, mode, pad } from '@kaffee/espresso';

const key = enc.Utf8.parse('my-secret-key');
const iv = enc.Utf8.parse('0123456789abcdef');

const encrypted = AES.encrypt('Hello, World!', key, {
  iv,
  mode: mode.CBC,
  padding: pad.PKCS7,
});

const decrypted = AES.decrypt(encrypted, key, {
  iv,
  mode: mode.CBC,
  padding: pad.PKCS7,
}).toString(enc.Utf8);
```

### HMAC

```typescript
import { hmac } from '@kaffee/espresso';

const mac = hmac('sha256', 'Hello, World!', 'secret-key').toString();
```

### PBKDF2

```typescript
import { pbkdf2 } from '@kaffee/espresso';

const key = pbkdf2('password', 'salt', {
  keySize: 256 / 32,
  iterations: 1000,
}).toString();
```

## Tree Shaking

The library supports tree shaking. Import only what you need:

```typescript
// Only AES is included in the bundle
import { AES } from '@kaffee/espresso';
```

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
