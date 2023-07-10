import { defineConfig } from "vite";

import jsx from "@vitejs/plugin-vue-jsx";

import uno from "unocss/vite";
// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",

  plugins: [
    jsx(),
    uno()
  ]
}));
