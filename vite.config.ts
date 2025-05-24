import { defineConfig } from "vite";
import path from "path";
import miniApp from "./mini-app/miniSolidPlugin";

export default defineConfig({
  plugins: [
    miniApp({
      importSource: path.resolve(__dirname, "./mini-app"),
    }),
  ],
});
