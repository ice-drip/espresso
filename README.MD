# @kaffee/espresso

[![npm version](https://img.shields.io/npm/v/@kaffee/espresso.svg)](https://www.npmjs.com/package/@kaffee/espresso)
[![license](https://img.shields.io/npm/l/@kaffee/espresso.svg)](https://github.com/ice-drip/espresso/blob/master/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@kaffee/espresso)](https://bundlephobia.com/package/@kaffee/espresso)

A TypeScript cryptography library implementing AES, DES, Triple DES, BlowFish, SEED, SHA-1/2/3, MD5, RIPEMD, HMAC, PBKDF2, and stream ciphers. Zero dependencies, fully tree-shakeable, with output compatible with [crypto-js](https://github.com/brix/crypto-js).

## Features

- **Zero dependencies** — no runtime `node_modules`, no supply chain risk
- **Tree-shakeable** — import only the algorithms you use; unused code is eliminated
- **Dual format** — ships ESM and CJS, works in Node.js, Bun, Deno, and browsers
- **crypto-js compatible** — drop-in replacement for existing crypto-js users
- **Type-safe** — written in TypeScript with full type definitions included
- **Modern runtime** — uses `crypto.getRandomValues()` for secure random bytes

## Installation

```bash
npm install @kaffee/espresso
# or
pnpm add @kaffee/espresso
# or
yarn add @kaffee/espresso
```

## Quick Start

```typescript
import { AES, SHA256, hmac, pbkdf2, enc, mode, pad } from '@kaffee/espresso';

// Hash
const digest = SHA256('Hello, World!').toString();

// AES encryption
const key = enc.Utf8.parse('my-secret-key');   // 16 bytes = AES-128
const iv = enc.Utf8.parse('0123456789abcdef');

const encrypted = AES.encrypt('Hello, World!', key, {
  iv,
  mode: mode.CBC,
  padding: pad.PKCS7,
}).toString();

const decrypted = AES.decrypt(encrypted, key, {
  iv,
  mode: mode.CBC,
  padding: pad.PKCS7,
}).toString(enc.Utf8);

// HMAC
const mac = hmac('sha256', 'Hello, World!', 'secret-key').toString();

// Key derivation
const derived = pbkdf2('password', 'salt', {
  keySize: 256 / 32,
  iterations: 10000,
}).toString();
```

## Supported Algorithms

### Block Ciphers

| Cipher | Key Sizes |
|--------|-----------|
| AES | 128, 192, 256-bit |
| DES | 64-bit |
| Triple DES | 192-bit (3-key EDE) |
| BlowFish | 32–448-bit |
| SEED | 128-bit |

### Stream Ciphers

RC4, RC4Drop, Rabbit, RabbitLegacy

### Hash Functions

| Family | Variants |
|--------|----------|
| MD | MD4, MD5 |
| SHA-1 | SHA-1 |
| SHA-2 | SHA-224, SHA-256, SHA-384, SHA-512 |
| SHA-3 | SHA3 (configurable output length) |
| RIPEMD | RIPEMD-128, RIPEMD-160, RIPEMD-256, RIPEMD-320 |

### MAC & KDF

- **HMAC** with any supported hash algorithm
- **PBKDF2** with configurable iterations and key size

### Block Modes

CBC, ECB, CTR, CFB, OFB

### Padding Schemes

PKCS7, Zero, ANSI X.923, ISO 9797-1, ISO 10126, No Padding

## Usage Examples

### Hashing

```typescript
import { MD5, SHA256, SHA512, SHA3, RIPEMD160 } from '@kaffee/espresso';

MD5('message').toString();          // hex string
SHA256('message').toString();       // hex string
SHA512('message').toBase64();       // base64 string
SHA3('message', { outputLength: 256 }).toString();
RIPEMD160('message').toString();
```

### HMAC

```typescript
import { hmac, HmacSHA256 } from '@kaffee/espresso';

// Generic HMAC
hmac('sha256', 'data', 'key').toString();

// Pre-bound shortcut (tree-shakeable)
HmacSHA256('data', 'key').toString();
```

### AES Encryption

```typescript
import { AES, enc, mode, pad } from '@kaffee/espresso';

const key = enc.Utf8.parse('1234567890abcdef'); // 16 bytes
const iv = enc.Utf8.parse('abcdef0123456789');

// Encrypt
const ciphertext = AES.encrypt('secret message', key, {
  iv,
  mode: mode.CBC,
  padding: pad.PKCS7,
}).toString();

// Decrypt
const plaintext = AES.decrypt(ciphertext, key, {
  iv,
  mode: mode.CBC,
  padding: pad.PKCS7,
}).toString(enc.Utf8);
```

### DES / Triple DES / BlowFish

```typescript
import { DES, TripleDES, BlowFish, enc, mode, pad } from '@kaffee/espresso';

const key = enc.Utf8.parse('12345678');       // DES: 8 bytes
const iv = enc.Utf8.parse('abcdef01');

const encrypted = DES.encrypt('data', key, { iv, mode: mode.CBC, padding: pad.PKCS7 });

const tripleKey = enc.Utf8.parse('1234567890abcdef12345678'); // 24 bytes
const tripleEnc = TripleDES.encrypt('data', tripleKey, { iv, mode: mode.CBC, padding: pad.PKCS7 });

const bfKey = enc.Utf8.parse('1234567890abcdef');
const bfEnc = BlowFish.encrypt('data', bfKey, { iv, mode: mode.CBC, padding: pad.PKCS7 });
```

### Stream Ciphers

```typescript
import { RC4, RC4Drop, Rabbit, enc } from '@kaffee/espresso';

const key = enc.Utf8.parse('secret-key');

const rc4Enc = RC4.encrypt('message', key).toString();
const rc4Dec = RC4.decrypt(rc4Enc, key).toString(enc.Utf8);

const rabbitEnc = Rabbit.encrypt('message', key).toString();
```

### PBKDF2 Key Derivation

```typescript
import { pbkdf2 } from '@kaffee/espresso';

const key = pbkdf2('password', 'salt', {
  keySize: 256 / 32,   // 256-bit key
  iterations: 10000,
}).toString();
```

### Encodings

```typescript
import { enc } from '@kaffee/espresso';

// Parse strings into WordArray (internal representation)
const fromUtf8 = enc.Utf8.parse('hello');
const fromHex = enc.Hex.parse('68656c6c6f');
const fromBase64 = enc.Base64.parse('aGVsbG8=');

// Convert WordArray back to strings
fromUtf8.toString(enc.Hex);     // '68656c6c6f'
fromUtf8.toString(enc.Base64);  // 'aGVsbG8='
```

## Tree Shaking

The library is fully tree-shakeable. Import only what you need:

```typescript
// Only AES is included in the bundle
import { AES } from '@kaffee/espresso';

// Only SHA256 is included
import { SHA256 } from '@kaffee/espresso';
```

## Migrating from crypto-js

`@kaffee/espresso` is designed as a drop-in replacement for crypto-js. The API is intentionally compatible:

```typescript
// Before (crypto-js)
import CryptoJS from 'crypto-js';
const hash = CryptoJS.SHA256('message').toString();

// After (espresso)
import { SHA256 } from '@kaffee/espresso';
const hash = SHA256('message').toString();
```

Key differences:
- Named exports instead of a single default export
- Tree-shakeable — smaller bundles when using a subset of algorithms
- TypeScript types included — no need for `@types/crypto-js`
- Zero dependencies

## API Reference

### Hash

```typescript
hash(algorithm: string, data: string | WordArray, options?: HashOptions): HashResult
```

Computes a hash using the specified algorithm. Returns a `HashResult` with `.toString()` and `.toBase64()` methods.

### HMAC

```typescript
hmac(algorithm: string, data: string | WordArray, key: string | WordArray): HashResult
```

Computes HMAC using the specified hash algorithm.

### PBKDF2

```typescript
pbkdf2(password: string, salt: string, options?: PBKDF2Options): HashResult
```

Derives a key using PBKDF2. Options: `keySize` (in 32-bit words), `iterations`, `hasher`.

### Cipher Classes

Each cipher (AES, DES, TripleDES, BlowFish, SEED, RC4, RC4Drop, Rabbit, RabbitLegacy) exposes:

```typescript
CipherClass.encrypt(data, key, options?): CipherResult
CipherClass.decrypt(data, key, options?): CipherResult
```

Options: `iv`, `mode` (from `mode`), `padding` (from `pad`), `format` (from `format`).

### Generic Dispatcher

```typescript
encrypt(algorithm: Algorithm, data, key, options?): CipherResult
decrypt(algorithm: Algorithm, data, key, options?): CipherResult
```

Use class methods directly for better tree-shaking.

### Utilities

| Export | Description |
|--------|-------------|
| `enc` | Encoding helpers: `Utf8`, `Latin1`, `Hex`, `Base64`, `Utf16`, `Utf16BE`, `Utf16LE` |
| `mode` | Block modes: `CBC`, `ECB`, `CTR`, `CFB`, `OFB` |
| `pad` | Padding: `PKCS7`, `ZeroPadding`, `AnsiX923`, `Iso97971`, `Iso10126`, `NoPadding` |
| `format` | Output formats: `OpenSSL`, `Hex` |
| `randomBytes(n)` | Generates `n` cryptographically secure random bytes |

## Development

```bash
pnpm install         # Install dependencies
pnpm build           # Build CJS + ESM + typings
pnpm test            # Run all tests (compatibility + unit)
pnpm typecheck       # Type check
pnpm lint            # Lint with oxlint
pnpm format          # Format with oxfmt
```

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
