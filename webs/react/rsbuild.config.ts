import path from "node:path";

import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

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
      "process.env.PUBLIC_URL": JSON.stringify("."),
    },
    transformImport: [
      {
        libraryName: "lodash-es",
        customName: "lodash-es/{{ member }}",
      },
      {
        libraryName: "@arco-design/web-react",
        customName: "@arco-design/web-react/es/{{ member }}",
        style: true,
      },
      {
        libraryName: "@arco-design/web-react/icon",
        customName: "@arco-design/web-react/icon/react-icon/{{ member }}",
        style: false,
      },
    ],
  },
  resolve: {
    alias: {
      "@workspace/utils": path.resolve(WORKSPACE, "packages/utils/src"),
    },
  },
  html: {
    template: "./public/index.html",
  },
  output: {
    distPath: "./build",
    externals: {
      "react": "React",
      "react-dom": "ReactDOM",
    },
    cssModules: {
      auto: /\.(module|m)\.scss$/,
    },
  },
  plugins: [
    pluginReact(),
    pluginLess(),
    pluginSass({
      sassLoaderOptions: {
        implementation: require.resolve("sass"),
      },
    }),
  ],
});
