import { defineConfig, presetUno } from "unocss";
import presetPalette from "../src";

export default defineConfig({

  presets: [
    presetUno(),
    presetPalette({
      colorMode: {
        attribute: "data-theme"
      },
      colorFormat: "hsl",
      colors: {
        // hsl format
        primary: [0, "100%", "50%"],
        tertiary: "#30fad3",
        // dark mode
        secondary: {
          dark: "#000000",
          default: "#f5f5f5",
          // brown
          cafe: "#a52a2a"
        }
      }
    })
  ]
});
