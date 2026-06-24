import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import {resolve} from "path";
import {rmdirSync} from "fs";
import { execSync } from "child_process";
const config = [
  {
    input: "src/index.ts",
    plugins: [
      buildUtil(),
      typescript({
        tsconfigOverride: { compilerOptions: { module: "es2015" } }
      })
    ],
    output: [
      {
        format: "cjs",
        sourcemap: true,
        preserveModules: true,
        dir: "dist/cjs"
      },
      {
        format: "esm",
        sourcemap: true,
        preserveModules: true,
        dir: "dist/esm"
      },
      {
        format: "umd",
        name: "espresso",
        sourcemap: true,
        file: "dist/umd/index.umd.js"
      }
    ]
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: [{ file: "dist/typings/index.d.ts", format: "es" }]
  }
];
function buildUtil() {
  return {
    name: "build-util",
    buildStart() {
      rmdirSync(resolve(process.cwd(),"dist"),{recursive:true});
    },
    closeBundle(){
      execSync("tsc --project tsconfig.type.json")
    }
  };
}
export default config;
