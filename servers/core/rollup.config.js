import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { glob } from "glob";
import path from "path";
import ts from "rollup-plugin-typescript2";

import alias from "./node_modules/@rollup/plugin-alias/dist/index.js";
import nodeDevServer from "./scripts/dev-server.js";

const IGNORES = ["src/**/*.d.ts"];
const ENTRIES = ["src/**/*.{ts,tsx}"];
const TS_CONFIG = path.resolve(__dirname, "./tsconfig.json");
const IS_DEV = process.env.NEST_ENV === "dev";
const WORKSPACE = path.resolve(__dirname, "../../");
const ROOT = path.resolve(__dirname);

const defineVars = {
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
};

const defineAlias = {
  // dev 模式下, 直接编译 utils 的 ts 源文件, 无需预构建 utils
  "@workspace/utils": path.resolve(WORKSPACE, "packages/utils/src"),
};

const packages = require(path.resolve(ROOT, "package.json"));
const deps = { ...packages.dependencies, ...packages.peerDependencies };
const depKeys = Object.keys(deps).filter(key => (IS_DEV ? !defineAlias[key] : true));
const external = depKeys.map(key => new RegExp(`(^${key}$)|(^${key}/.*)`));

/**
 * https://rollupjs.org/introduction/
 * @typedef { import("rollup").RollupOptions } RollupConfig
 * @return { Promise<RollupConfig[]> }
 * */
export default async () => {
  const inputs = await Promise.all(ENTRIES.map(item => glob(item, { ignore: IGNORES })))
    .then(res => res.reduce((pre, cur) => [...pre, ...cur]))
    .then(entries => {
      return entries.map(fullPath => [
        fullPath,
        fullPath.replace(/^src\//, "").replace(/\.tsx?$/, ""),
      ]);
    })
    .then(arr => {
      return arr.reduce((res, [pre, cur]) => ({ ...res, [cur]: pre }), {});
    });

  const LIB_CONFIG = {
    input: inputs,
    output: {
      dir: IS_DEV ? "./.cache" : "./dist",
      format: "commonjs",
      hoistTransitiveImports: false,
    },
    plugins: [
      alias({ entries: defineAlias }),
      resolve({ preferBuiltins: false }),
      commonjs({ include: /node_modules/ }),
      ts({
        tsconfig: TS_CONFIG,
        extensions: [".ts", ".tsx"],
      }),
      replace({
        values: defineVars,
        preventAssignment: true,
      }),
      nodeDevServer({ entryFileName: "index.js" }),
    ],
    external: [...external, /^node:/, "path", "fs"],
  };

  return LIB_CONFIG;
};
