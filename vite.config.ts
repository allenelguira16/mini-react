import { defineConfig } from "vite";
import path from "path";
import miniSolidBabelPlugin from "./mini-app/miniSolidPlugin";

export default defineConfig({
  plugins: [
    miniSolidBabelPlugin({
      importSource: path.resolve(__dirname, "./mini-app"),
    }),
  ],
});
