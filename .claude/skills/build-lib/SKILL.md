---
name: build-lib
description: Build espresso library and verify all output formats
---
# Build Library
1. Run `cd packages/espresso && pnpm build`
2. Verify these outputs exist:
   - `dist/cjs/index.js` (CommonJS)
   - `dist/esm/index.js` (ES Modules)
   - `dist/umd/index.umd.js` (UMD)
   - `dist/typings/index.d.ts` (Type declarations)
3. Report any TypeScript errors or warnings
