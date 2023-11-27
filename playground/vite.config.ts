import { resolve } from "node:path";
import { defineConfig } from "vite";

import jsx from "@vitejs/plugin-vue-jsx";
import uno from "unocss/vite";


// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",

  plugins: [
    jsx(),
    uno({
      configFile: resolve(__dirname, "./src/uno.config.ts")
    })
  ]
}));
