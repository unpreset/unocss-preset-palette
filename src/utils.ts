import { parseCssColor } from "@unocss/preset-mini/utils";
import { type ThemeColors } from "./types";


function getCssColor(color: string) {
  const cssColor = parseCssColor(color);
  if (cssColor) {
    const components = [...cssColor.components];
    if (cssColor.alpha) {
      components.push(cssColor.alpha);
    }
    return components.join(",");
  }
  return color;
}

/**
 *
 * @param colors
 * @param defaultTheme
 * @returns
 */
export function getColorComponents(colors: ThemeColors = {}, defaultTheme: string) {
  const rs: Record<string, Record<string, (string | number)[] | string>> = {};
  for (const key in colors) {
    const value = colors[key];

    if (typeof value === "string") {
      if (!rs[defaultTheme]) {
        rs[defaultTheme] = {};
      }
 
      rs[defaultTheme][key] = getCssColor(value);
    } else {
      for (const colorName in value) {
        if (!rs[colorName]) {
          rs[colorName] = {};
        }
        rs[colorName][key] = getCssColor(value[colorName]);
      }
    }
  }
  return rs;
}
