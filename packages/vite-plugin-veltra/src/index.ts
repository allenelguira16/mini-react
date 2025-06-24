import { transformAsync } from "@babel/core";
// @ts-expect-error - babel-preset-typescript is not typed
import babelPluginTS from "@babel/preset-typescript";
import type { Plugin } from "vite";

import babelPluginVeltra from "../../babel-preset-veltra/src/index.ts";

const vitePlugin = (): Plugin => {
  return {
    name: "vite-plugin-veltra",
    enforce: "pre",
    async transform(code, id) {
      if (/\.(tsx?|jsx?)$/.test(id)) {
        const result = await transformAsync(code, {
          filename: id,
          sourceMaps: true,
          presets: [babelPluginVeltra, babelPluginTS],
        });

        if (result?.code) {
          return {
            code: result.code,
            map: result.map,
          };
        }
      }
    },
  };
};

export default vitePlugin;
