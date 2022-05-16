import type { InitialOptionsTsJest } from "ts-jest";
const config: InitialOptionsTsJest = {
  projects: [
    {
      preset: "ts-jest",
      testEnvironment: "node",
      displayName: "espresso",
      moduleDirectories: [
        "./packages/test/node_modules",
        "node_modules"
      ],
      testRegex: "/packages/test/(.*).test.ts",
      globals: {
        "ts-jest": {
          tsconfig: "./packages/test/tsconfig.json"
        }
      }
    } as any
  ]
};
export default config;
