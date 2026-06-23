# @ice-drip/espresso

A TypeScript crypto library with Web Crypto + pure JS dual runtime support.

## Installation

```bash
npm install @ice-drip/espresso
# or
pnpm add @ice-drip/espresso
```

## Quick Start

```typescript
import { encrypt, decrypt, hash, hmac } from '@ice-drip/espresso';

// Encrypt with AES-CBC
const ciphertext = encrypt('aes', 'Hello, World!', 'secret-key', {
  mode: 'cbc',
  iv: crypto.getRandomValues(new Uint8Array(16)),
});

// Decrypt
const plaintext = decrypt('aes', ciphertext, 'secret-key', {
  mode: 'cbc',
  iv: /* same iv */,
});

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

### `encrypt(algorithm, message, key, options?)`

Encrypts a message using the specified algorithm.

### `decrypt(algorithm, ciphertext, key, options?)`

Decrypts ciphertext using the specified algorithm.

### `hash(algorithm, data, options?)`

Computes a hash of the data.

### `hmac(algorithm, data, key, options?)`

Computes HMAC of the data.

## License

GPL-3.0
