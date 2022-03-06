import { defineConfig } from "vite"

import jsx from "@vitejs/plugin-vue-jsx"

import uno from "unocss/vite"
import { presetUno } from "unocss"

import presetPalette from "./src"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	base: "/",

	plugins: [
		jsx(),
		uno({
			presets: [
				presetUno(),
				presetPalette({
					colorMode: {
						attribute: "data-theme"
					},
					cssVarName(name) {
						return name
					},
					colors: {
						primary: "#4fb3ff",
						light: {
							light: "#f7f8f9",
							dark: "#1a1a1a",
							cafe: "#ffa500",
						},
						dark: {
							light: "#1a1a1a",
							dark: "#ffffffde",
							cafe: "#00a5ff"
						},
						neutral: {
							light: "#e3e4e5",
							dark: "#232323",
							cafe: "#ffa5a5"
						}
					}
				})
			]
		})
	],
	build: {
		lib:
			mode === 'demo'
				? false
				: {
					entry: './src/index.ts',
					formats: ['es', "cjs"],
					fileName: (format) => format == "cjs" ? 'index.cjs' : `index.js`

				},
		rollupOptions: {
			external: ['unocss', '@unocss/preset-mini'],
		},
	},
}))
