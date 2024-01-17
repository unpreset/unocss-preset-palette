import { definePreset } from "@unocss/core";
import type { Theme } from "@unocss/preset-mini";
import type { CssVarName, PaletteOptions } from "./types";
import { getColorComponents, normalizeVarName } from "./utils";



/**
 *
 * @param options
 * @returns
 */
export const presetPalette = definePreset((options: PaletteOptions = {}) => {
  const { colors: _colors = {}, themeColors = {}, colorMode = {}, colorFormat = "rgb", useOpacityVariable = true, colorScheme = {} } = options;
  
  Object.assign(themeColors, { ..._colors });

  const { selector = ":root", attribute = "class", defaultValue = "default" } = colorMode;

  const cssVarName: CssVarName = options.cssVarName || "un-palette-[name]-color";

  const colorComponents = getColorComponents(themeColors, defaultValue, colorFormat);

  let getVarName: (name: string) => string;

  if (typeof cssVarName === "string") {
    getVarName = name => normalizeVarName(cssVarName.replace(/\[name]/g, name));
  } else if (typeof cssVarName === "function") {
    getVarName = name => normalizeVarName(cssVarName(name));
  } else {
    const prefix = cssVarName?.prefix ?? "un-palette-";
    const suffix = cssVarName?.suffix ?? "-color";
    getVarName = name => normalizeVarName(`${prefix}${name}${suffix}`);
  }

  const colors = Object.fromEntries(Object.keys(themeColors).map(e => {
    const colorValue = useOpacityVariable ? `${colorFormat}(var(${getVarName(e)}-${colorFormat}))` : `var(${getVarName(e)})`;
    return [e, colorValue];
  }));


  return {
    name: "preset-palette",
    theme: {
      colors
    } as Theme,
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
            if (colorScheme[theme]) {
              rs.push(`color-scheme:${colorScheme[theme]};`);
            }

            for (const colorName in colorComponents[theme]) {
              const components = colorComponents[theme][colorName];
              const varName = getVarName(colorName);
              if (useOpacityVariable) {
                rs.push(`${varName}-${colorFormat}:${components}`, ";", `${varName}:${colorFormat}(var(${varName}-${colorFormat}))`, ";");
              } else {
                rs.push(`${varName}:${colorFormat}(${components})`, ";");
              }
            }
            rs.push("}");
          }
          return rs.join("");
        }
      }
    ]
  };
});


export default presetPalette;
