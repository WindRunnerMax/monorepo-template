import path from "node:path";

import { defineConfig } from "@rsbuild/core";

const WORKSPACE = path.resolve(__dirname, "../../");

/**
 * https://rsbuild.rs/zh/config/
 */
export default defineConfig({
  source: {
    entry: {
      index: "./src/index.tsx",
    },
    define: {
      "__DEV__": JSON.stringify(process.env.NODE_ENV === "development"),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/utils": path.resolve(WORKSPACE, "utils/src"),
    },
  },
  output: {
    distPath: "./build",
  },
  plugins: [],
});
