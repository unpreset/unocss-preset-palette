### UNOCSS-PRESET-PALETTE

## Install

```bash
// npm
npm i unocss-preset-palette
// yarn
yarn add unocss-preset-palette
// pnpm
pnpm add unocss-preset-palette
```

## Usage

```js
import { defineConfig, presetUno } from "unocss";

import presetPalette from "unocss-preset-palette";

export default defineConfig({
  presets: [
    presetUno(),
    presetPalette({
      // hsl | rgb
      colorFormat: "hsl",
      themeColors: {
        // [hue, saturation, lightness]
        primary: [100, "100%", "50%"],
        tertiary: "#0000ff",
        secondary: {
          // dark theme
          dark: "#ff0000",
          // light theme
          default: "#00ff00",
        }
      },
    }),
  ],
});
```

### Rules

- text-`[color]`/`[opacity]`
- bg-`[color]`/`[opacity]`
- border-`[color]`/`[opacity]`
- underline-`[color]`/`[opacity]`
- decoration-`[color]`/`[opacity]`
- ring-`[color]`/`[opacity]`
- outline-`[color]`/`[opacity]`
- fill-`[color]`/`[opacity]`
- text-stroke-`[color]`/`[opacity]`
- bg-gradient-`[color]`/`[opacity]`

```html
<div class="text-primary/72"></div>
<div class="bg-primary/36"></div>
```

```css
.text-primary\/72 {
  // hsla
  color: hsla(var(--un-platte-primary-color), 0.72);
  // rgba
  // color: rgba(var(--un-platte-primary-color), 0.72);
}

.bg-primary\/36 {
  // hsla
  background-color: hsla(var(--un-platte-primary-color), 0.36);
  // rgba
  // background-color: rgba(var(--un-platte-primary-color), 0.36);
}

```


### Type Declarations

```ts
export type ThemeColors = Record<string, string | (string | number)[] | Record<string, string | (string | number)[]>>;

export interface CssVarName {
  (name: string): string
  prefix?: string
  suffix?: string
}

export interface PaletteOptions {

  /**
   * define theme colors
   */
  themeColors?: ThemeColors
  /**
 * @deprecated
 */
  colors?: ThemeColors
  /**
  *  @see "@vueuse/core/useColorMode"
  */
  colorMode?: {
    /**
   *  @default  ':root'
   */
    selector?: string
    /**
   *  @default 'class'
   */
    attribute?: string
    /**
   *  @default 'light'
   */
    defaultValue?: string
  }

  /**
  * @default --un-platte-[name]-color
  */
  cssVarName?: CssVarName

  colorFormat?: "rgb" | "hsl"
}

```


### License

MIT License © 2022-PRESENT [Chizukicn](https://github.com/chizukicn)