import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";
import veltraPlugin from "vite-plugin-veltra";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    veltraPlugin(),
    tailwindcss(),
    sitemap({ hostname: "http://localhost:4173/" }),
  ],
});
