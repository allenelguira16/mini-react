import { TransformOptions, ConfigAPI } from "@babel/core";
// @ts-ignore
import babelReactPlugin from "@babel/preset-react";
import {
  logJsxPlugin,
  loopMapPlugin,
  wrapJSXExpressionsPlugin,
} from "./plugins";

// Main preset function
export default function babelPresetVeltra(api: ConfigAPI): TransformOptions {
  api.assertVersion(7);

  return {
    presets: [
      [
        babelReactPlugin,
        {
          runtime: "automatic",
          importSource: "@veltra/app",
        },
      ],
    ],
    plugins: [loopMapPlugin, logJsxPlugin, wrapJSXExpressionsPlugin],
  };
}
