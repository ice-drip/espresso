# @ice-drip/espresso

TypeScript cryptography library implementing AES, DES, TripleDES, BlowFish, SHA*, MD5, HMAC, stream ciphers, and PBKDF2.

## Structure

- `packages/espresso/` — Core library (rslib → CJS/ESM)
- `packages/test/` — rstest compatibility tests vs crypto-js

## Build

```bash
cd packages/espresso && pnpm build
```

## Test

```bash
cd packages/test && pnpm test
```

## Rules

- Never edit `dist/` — it's build output
- Tests must pass against crypto-js reference before merging
- All cipher/hash implementations must be in `packages/espresso/src/`
- Use `pnpm` for package management (monorepo with pnpm-workspace.yaml)