# @kaffee/espresso

A TypeScript cryptography library with Web Crypto + pure JS dual runtime support. Tree-shakeable, zero-dependency, compatible with [crypto-js](https://github.com/brix/crypto-js) output.

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
import { AES, enc, mode, pad, hash, hmac } from '@kaffee/espresso';

// Encrypt with AES-CBC
const encrypted = AES.encrypt('Hello, World!', enc.Utf8.parse('secret-key'), {
  iv: enc.Utf8.parse('0123456789abcdef'),
  mode: mode.CBC,
  padding: pad.PKCS7,
});

// Decrypt
const decrypted = AES.decrypt(encrypted, enc.Utf8.parse('secret-key'), {
  iv: enc.Utf8.parse('0123456789abcdef'),
  mode: mode.CBC,
  padding: pad.PKCS7,
}).toString(enc.Utf8);

// Hash
const digest = hash('sha256', 'Hello, World!');

// HMAC
const mac = hmac('sha256', 'Hello, World!', 'secret-key');
```

## Supported Algorithms

### Block Ciphers
- AES (128, 192, 256-bit)
- DES
- Triple DES (3-key EDE)
- BlowFish
- SEED

### Stream Ciphers
- RC4 / RC4Drop
- Rabbit / RabbitLegacy

### Hash Functions
- MD4, MD5
- SHA-1, SHA-224, SHA-256, SHA-384, SHA-512
- SHA3
- RIPEMD-128, RIPEMD-160, RIPEMD-256, RIPEMD-320

### MAC
- HMAC (with any supported hash)

### KDF
- PBKDF2

### Block Modes
- CBC, ECB, CTR, CFB, OFB

### Padding
- PKCS7, Zero, ANSI X.923, ISO 9797-1, ISO 10126, No Padding

## API Reference

### `AES.encrypt(data, key, options?)`

Encrypts data using AES. Returns a `CipherResult` object.

### `AES.decrypt(data, key, options?)`

Decrypts ciphertext using AES. Returns a `CipherResult` object.

### `hash(algorithm, data, options?)`

Computes a hash of the data. Returns a `HashResult` with `.toString()` and `.toHex()` methods.

### `hmac(algorithm, data, key, options?)`

Computes HMAC of the data. Returns a `HashResult`.

### `pbkdf2(password, salt, options?)`

Derives a key using PBKDF2. Returns a `HashResult`.

### `encrypt(algorithm, data, key, options?)`

Generic encryption dispatcher. Use class methods directly for tree-shaking.

### `decrypt(algorithm, data, key, options?)`

Generic decryption dispatcher. Use class methods directly for tree-shaking.

## Tree Shaking

The library is fully tree-shakeable. Import only what you need:

```typescript
// Only imports AES — other algorithms are excluded from bundle
import { AES } from '@kaffee/espresso';
```

## Code Quality

```bash
pnpm format        # Format code
pnpm format:check  # Check formatting
pnpm lint:oxlint   # Lint code
pnpm lint:fix      # Auto-fix lint issues
pnpm typecheck     # Check TypeScript types
```

## License

GPL-3.0
