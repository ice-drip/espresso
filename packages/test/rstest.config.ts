import { defineConfig } from '@rstest/core';

export default defineConfig({
  globals: true,
  include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  testEnvironment: 'node',
  resolve: {
    alias: {
      '@kaffee/espresso': '../espresso/src/index.ts',
    },
  },
});
