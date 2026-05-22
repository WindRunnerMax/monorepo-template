/// <reference types="./scripts/global.d.ts" />
import path from "node:path";

import { defineConfig } from "@rsbuild/core";
import getNodeExternals from "webpack-node-externals";

const IS_DEV = process.env.NEST_ENV !== "prod";
const WORKSPACE = path.resolve(__dirname, "../../");

/**
 * https://rsbuild.rs/zh/config/
 */
export default defineConfig({
  source: {
    entry: {
      index: "./src/index.ts",
    },
    define: {
      "__DEV__": JSON.stringify(IS_DEV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
    decorators: { version: "legacy" },
    tsconfigPath: IS_DEV ? "./tsconfig.json" : "./tsconfig.build.json",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/utils": path.resolve(WORKSPACE, "packages/utils/src"),
    },
  },
  output: {
    target: "node",
    minify: false,
    distPath: "./build",
    externals: [getNodeExternals()],
  },
  plugins: [],
});
