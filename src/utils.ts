import { parseCssColor } from "@unocss/preset-mini/utils";
import { type ThemeColors } from "./types";

/// rgb->hsl
function rgb2hsl(values: (string | number)[]) {
  const [red, green, blue] = values.map(e => Number(e) / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  // eslint-disable-next-line prefer-const
  let [hue, sat, light] = [Number.NaN, 0, (min + max) / 2];
  const d = max - min;

  if (d !== 0) {
    sat = (light === 0 || light === 1)
      ? 0
      : (max - light) / Math.min(light, 1 - light);

    switch (max) {
      case red:
        hue = (green - blue) / d + (green < blue ? 6 : 0);
        break



        ;
      case green:
        hue = (blue - red) / d + 2;
        break



        ;
      case blue: hue = (red - green) / d + 4;
    }

    hue = hue * 60;
  }

  return [hue, sat * 100, light * 100];
}



function getCssColor(color: string | (string | number) [], colorFormat: "rgb" | "hsl") {
  if (Array.isArray(color)) {
    return color.join(",");
  }
  const cssColor = parseCssColor(color);
  if (cssColor) {
    const components = [...cssColor.components];
    if (cssColor.alpha) {
      components.push(cssColor.alpha);
    }
    if (colorFormat === "hsl") {
      const [hue, sat, light] = rgb2hsl(components);
      components[0] = hue;
      components[1] = `${sat}%`;
      components[2] = `${light}%`;
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
export function getColorComponents(colors: ThemeColors = {}, defaultTheme: string, colorFormat: "rgb" | "hsl") {
  const rs: Record<string, Record<string, (string | number)[] | string>> = {};
  for (const key in colors) {
    const value = colors[key];

    if (typeof value === "string" || Array.isArray(value)) {
      if (!rs[defaultTheme]) {
        rs[defaultTheme] = {};
      }
      rs[defaultTheme][key] = getCssColor(value, colorFormat);
    } else {
      for (const colorName in value) {
        if (!rs[colorName]) {
          rs[colorName] = {};
        }
        rs[colorName][key] = getCssColor(value[colorName], colorFormat);
      }
    }
  }
  return rs;
}
