import { ConfigAPI, TransformOptions } from "@babel/core";
// @ts-expect-error - babel-preset-react is not typed
import babelReactPlugin from "@babel/preset-react";

import {
  logJsxPlugin,
  loopAutoWrapPlugin,
  suspenseWrapPlugin,
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
    plugins: [
      logJsxPlugin,
      // loopMapPlugin,
      loopAutoWrapPlugin,
      suspenseWrapPlugin,
      wrapJSXExpressionsPlugin,
    ],
  };
}
