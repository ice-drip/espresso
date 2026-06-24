import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      id: "esm",
      format: "esm",
      syntax: "es2022",
      source: {
        entry: { index: "./src/index.ts" },
      },
      output: {
        target: "node",
        distPath: "dist/esm",
      },
      dts: {
        tsgo: true,
        distPath: "dist/typings",
      },
    },
    {
      id: "cjs",
      format: "cjs",
      syntax: "es2022",
      source: {
        entry: { index: "./src/index.ts" },
      },
      output: {
        target: "node",
        distPath: "dist/cjs",
        filename: {
          js: "[name].cjs",
        },
      },
    },
  ],
});
