import { type Preset } from "@unocss/core";
import { type CssVarName, type PaletteOptions } from "./types";
import { getColorComponents } from "./utils";


/**
 *
 * @param options
 * @returns
 */
export function presetPalette(options: PaletteOptions = {}): Preset<{}> {
  const { colors: _colors = {}, themeColors = {}, colorMode = {} } = options;
  
  Object.assign(themeColors, { ..._colors });

  const { selector = ":root", attribute = "class", defaultValue = "light" } = colorMode;

  const cssVarName: CssVarName = options.cssVarName || ((name) => `un-platte-${name}-color`);

  const colorComponents = getColorComponents(themeColors, defaultValue);

  let getVarName: (name: string) => string;

  if (typeof cssVarName === "function") {
    getVarName = name => `--${cssVarName(name)}`;
  } else {
    const prefix = options.cssVarName?.prefix ?? "un-platte-";
    const suffix = options.cssVarName?.suffix ?? "-color";
    getVarName = name => `--${prefix}${name}${suffix}`;
  }

  const colors = Object.fromEntries(Object.keys(themeColors).map(e => [e, `rgba(var(${getVarName(e)}))`]));

  return {
    name: "preset-palette",
    theme: {
      colors
    },
    layers: {
      palette: -1
    },
    preflights: [
      {
        layer: "palette",
        getCSS() {
          const rs = [];

          for (const theme in colorComponents) {
            rs.push(selector);
            if (theme !== defaultValue) {
              rs.push(`[${attribute}="${theme}"]`);
            }
            rs.push("{");
            for (const colorName in colorComponents[theme]) {
              const components = colorComponents[theme][colorName];
              rs.push(`${getVarName(colorName)}:${components}`, ";");
            }
            rs.push("}");
          }
          return rs.join("");
        }
      }
    ],
    rules: [
      [
        /^bg-(.*)-([1-9]|[1-9]\d)$/,
        ([, c, o]) => {
          const opacity = Number(o);
          if (themeColors[c]) {
            return { background: `rgba(var(${getVarName(c)}), ${opacity / 100})` };
          }
        }
      ],
      [
        /^text-(.*)-([1-9]|[1-9]\d)$/,
        ([, c, o]) => {
          const opacity = Number(o);
          if (themeColors[c]) {
            return { color: `rgba(var(${getVarName(c)}), ${opacity / 100})` };
          }
        }
      ]
    ]
  };
}


export default presetPalette;
