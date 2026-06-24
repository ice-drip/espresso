import { defineConfig } from "bumpp";

export default defineConfig({
  tag: "@kaffee/espresso@${version}",
  push: true,
  commit: "chore(release): @kaffee/espresso@${version}",
  files: ["packages/espresso/package.json"],
  execute: "pnpm run release:check && pnpm run release:changelog",
});
