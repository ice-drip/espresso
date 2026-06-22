import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      id: 'esm',
      source: {
        entry: { index: './src/index.ts' },
      },
      output: {
        target: 'node',
        format: 'esm',
        distPath: 'dist/esm',
      },
    },
    {
      id: 'cjs',
      source: {
        entry: { index: './src/index.ts' },
      },
      output: {
        target: 'node',
        format: 'cjs',
        distPath: 'dist/cjs',
        autoExtension: true,
      },
    },
  ],
  dts: {
    distPath: 'dist/typings',
  },
});
