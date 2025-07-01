import tailwindcss from "@tailwindcss/vite";
import { defineConfig, Plugin } from "vite";
import sitemap from "vite-plugin-sitemap";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ mode }) => {
  let veltraPlugin: () => Plugin;

  console.log(mode);

  if (mode === "development") {
    veltraPlugin = (await import("../../packages/vite-plugin-veltra/src/index.ts")).default;
  } else if (mode === "production") {
    veltraPlugin = (await import("vite-plugin-veltra")).default;
  } else {
    throw new Error(`Unknown mode: ${mode}`);
  }

  return {
    plugins: [
      tsconfigPaths(),
      veltraPlugin(),
      tailwindcss(),
      sitemap({ hostname: "http://localhost:4173/" }),
    ],
  };
});
