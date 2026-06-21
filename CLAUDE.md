# @ice-drip/espresso

TypeScript cryptography library implementing AES, DES, TripleDES, BlowFish, SHA*, MD5, HMAC, and stream ciphers.

## Structure
- `packages/espresso/` — Core library (Rollup → CJS/ESM/UMD)
- `packages/test/` — Jest compatibility tests vs crypto-js
- `website/caesar/` — Angular 16 demo site

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
