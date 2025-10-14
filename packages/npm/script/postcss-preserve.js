import path from "node:path";

import postcss from "rollup-plugin-postcss";

/**
 * https://github.com/egoist/rollup-plugin-postcss/issues/160
 * https://github.com/egoist/rollup-plugin-postcss/issues/204
 * https://github.com/jleeson/rollup-plugin-import-css/issues/37
 * @typedef { import("rollup-plugin-postcss").PostCSSPluginConf } PostCSSConfig
 * @param { PostCSSConfig & { preserveRoot?: string } } options
 * @return { import("rollup").Plugin }
 */
export const postcssPreserve = options => {
  const css = postcss(options);
  /** @type { Record<string, string[]> } */
  const importedCSS = {};
  const extensions = options.extensions || [".css", ".scss", ".less"];
  const toCSSExtension = filePath => {
    const mapped = extensions.map(ext => ext.replace(".", "\\.")).join("|");
    return filePath.replace(new RegExp(`(${mapped})$`), ".css");
  };

  return {
    name: "postcss-preserve",
    enforce: "post",
    resolveId(sourceId, importer) {
      if (
        options.extract &&
        options.preserveRoot &&
        extensions.some(ext => sourceId.endsWith(ext))
      ) {
        const imports = importedCSS[importer] || [];
        imports.push(sourceId);
        importedCSS[importer] = imports;
      }
      return null;
    },
    async transform(code, id) {
      const result = await css.transform.call(this, code, id);
      return result;
    },
    async augmentChunkHash() {
      const result = css.augmentChunkHash.call(this);
      return result;
    },
    async generateBundle(outputOptions, bundle) {
      const res = await css.generateBundle.call(this, outputOptions, bundle);
      if (options.extract && options.preserveRoot) {
        const root = path.resolve(options.preserveRoot);
        /** @type {Record<string, { id:string, code:string } >} */
        const allCSSFiles = JSON.parse(css.augmentChunkHash.call(this));
        Object.values(allCSSFiles).forEach(extract => {
          const relative = toCSSExtension(path.relative(root, extract.id));
          this.emitFile({ type: "asset", fileName: relative, source: extract.code });
        });
        for (const chunk of Object.values(bundle)) {
          if (chunk.type != "chunk" || !importedCSS[chunk.facadeModuleId]) continue;
          const cssFiles = [...importedCSS[chunk.facadeModuleId]].reverse();
          for (const cssPath of cssFiles) {
            const relative = path.relative(path.dirname(chunk.facadeModuleId), cssPath);
            chunk.code = `import "./${toCSSExtension(relative)}";\n${chunk.code}`;
          }
        }
      }
      return res;
    },
  };
};
