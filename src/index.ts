import { definePreset } from "@unocss/core";
import { directionMap, h } from "@unocss/preset-mini/utils";
import type { Theme } from "@unocss/preset-mini";
import type { CSSProperties, CssVarName, PaletteOptions } from "./types";
import { getColorComponents } from "./utils";



/**
 *
 * @param options
 * @returns
 */
export const presetPalette = definePreset((options: PaletteOptions = {}) => {
  const { colors: _colors = {}, themeColors = {}, colorMode = {}, colorFormat = "rgb" } = options;
  
  Object.assign(themeColors, { ..._colors });

  const { selector = ":root", attribute = "class", defaultValue = "default" } = colorMode;

  const cssVarName: CssVarName = options.cssVarName || ((name) => `un-platte-${name}-color`);

  const colorComponents = getColorComponents(themeColors, defaultValue, colorFormat);

  let getVarName: (name: string) => string;

  if (typeof cssVarName === "function") {
    getVarName = name => `--${cssVarName(name)}`;
  } else {
    const prefix = options.cssVarName?.prefix ?? "un-platte-";
    const suffix = options.cssVarName?.suffix ?? "-color";
    getVarName = name => `--${prefix}${name}${suffix}`;
  }

  const getColor = (name: string, opacity: string | number = 100) => {
    const alpha = typeof opacity === "number" ? `${opacity / 100}` : opacity;
    const value = `var(${getVarName(name)})`;
    if (colorFormat === "hsl") {
      return `hsla(${value}, ${alpha})`;
    }
    return `rgba(${value}, ${alpha})`;
  };



  const colors = Object.fromEntries(Object.keys(themeColors).map(e => {
    return [e, getColor(e)];
  }));

  function borderColorResolver(direction: string) {
    return (colorName: string, opacity: number): CSSProperties | undefined => {
      if (direction === "") {
        return {
          "--un-border-opacity": `${opacity / 100}`,
          "border-color": getColor(colorName, "var(--un-border-opacity)")
        };
      }
      return {
        // Separate this return since if `direction` is an empty string, the first key will be overwritten by the second.
        "--un-border-opacity": `${opacity / 100}`,
        [`--un-border${direction}-opacity`]: "var(--un-border-opacity)",
        [`border${direction}-color`]: getColor(colorName, `var(--un-border${direction}-opacity)`)
      };
    };
  }

  const handlerBorderColor = ([, a = "", c, o]: string[]) => {
    const opacity = Number(o);
    if (themeColors[c]) {
      return Object.assign({},
        ...directionMap[a].map(i => borderColorResolver(i)(c, opacity))
      );
    }
  };


  const colorResolver = (property: keyof CSSProperties) => {
    return ([, c, o]: string[]) => {
      const opacity = Number(o);
      if (themeColors[c]) {
        return { [property]: getColor(c, opacity) };
      }
    };
  };


  function bgGradientColorResolver() {
    return ([, mode, c, o]: string[]) => {
      const opacity = Number(o);
      if (!themeColors[c]) {
        return;
      }

      const color = getColor(c, opacity);

      switch (mode) {
        case "from":
          return {
            "--un-gradient-from-position": "0%",
            "--un-gradient-from": `${color} var(--un-gradient-from-position)`,
            "--un-gradient-to-position": "100%",
            "--un-gradient-to": `${color} var(--un-gradient-to-position)`,
            "--un-gradient-stops": "var(--un-gradient-from), var(--un-gradient-to)"
          };
        case "via":
          return {
            "--un-gradient-via-position": "50%",
            "--un-gradient-to": color,
            "--un-gradient-stops": `var(--un-gradient-from), ${color} var(--un-gradient-via-position), var(--un-gradient-to)`
          };
        case "to":
          return {
            "--un-gradient-to-position": "100%",
            "--un-gradient-to": `${color} var(--un-gradient-to-position)`
          };
      }
    };
  }



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
        /^bg-(\w+)\/(\d{1,2})$/,
        colorResolver("background-color"),
        {
          autocomplete: "bg-$colors/<percent>"
        }
      ],
      [
        /^text-(\w+)\/(\d{1,2})$/,
        colorResolver("color"),
        {
          autocomplete: "text-$colors/<percent>"
        }
      ],
      [
        /^(?:border|b)-()(?:color-)?(.+)\/(\d{1,2})$/,
        handlerBorderColor,
        {
          autocomplete: [
            "(border|b)-$colors/<percent>",
            "(border|b)-<directions>-$colors/<percent>"
          ]
        }
      ],
      [/^(?:border|b)-([xy])-(?:color-)?(.+)\/(\d{1,2})$/, handlerBorderColor],
      [/^(?:border|b)-([belr-t])-(?:color-)?(.+)\/(\d{1,2})$/, handlerBorderColor],
      [/^(?:border|b)-(block|inline)-(?:color-)?(.+)\/(\d{1,2})$/, handlerBorderColor],
      [/^(?:border|b)-([bi][es])-(?:color-)?(.+)\/(\d{1,2})$/, handlerBorderColor],
      [
        /^shadow-(\w+)\/(\d{1,2})$/,
        ([, c, o]) => {
          const opacity = Number(o);
          if (themeColors[c]) {
            return {
              "--un-shadow-opacity": opacity / 100,
              "--un-shadow-color": getColor(c, "var(--un-shadow-opacity)")
            };
          }
        },
        {
          autocomplete: "shadow-$colors/<percent>"
        }
      ],
      [
        /^(?:underline|decoration)-(.+)\/(\d{1,2})$/,
        ([, c, o]) => {
          const opacity = Number(o);
          if (themeColors[c]) {
            return {
              "--un-line-opacity": opacity / 100,
              "text-decoration-color": getColor(c, "var(--un-line-opacity)"),
              "-webkit-text-decoration-color": getColor(c, "var(--un-line-opacity)")
            };
          }
        },
        {
          autocomplete: "(underline|decoration)-$colors/<percent>"
        }
      ],
      [
        /^(?:underline|decoration)-(.+)\/(\d{1,2})$/,
        ([, c, o]) => {
          const opacity = Number(o);
          if (themeColors[c]) {
            return {
              "--un-decoration-opacity": opacity / 100,
              "--un-decoration-color": getColor(c, "var(--un-decoration-opacity)")
            };
          }
        },
        {
          autocomplete: "(underline|decoration)-$colors/<percent>"
        }
      ],
      [
        /^outline-(?:color-)?(.+)\/(\d{1,2})$/,
        colorResolver("outline-color"),
        { autocomplete: "outline-$colors/<percent>" }
      ],
      [
        /^ring-(?:color-)?(.+)\/(\d{1,2})$/,
        colorResolver("--ring-color"),
        { autocomplete: "ring-$colors/<percent>" }
      ],
      [/^fill-(.+)(\d{1,2})$/, colorResolver("fill"), { autocomplete: "fill-$colors/<percent>" }],
      [/^text-stroke-(.+)(\d{1,2})$/, colorResolver("fill"), { autocomplete: "text-stroke-$colors/<percent>" }],

      [/^bg-gradient-(.+)$/, ([, d]) => ({ "--un-gradient": h.bracket(d) }), {
        autocomplete: ["bg-gradient", "bg-gradient-(from|to|via)", "bg-gradient-(from|to|via)-$colors", "bg-gradient-(from|to|via)-(op|opacity)", "bg-gradient-(from|to|via)-(op|opacity)-<percent>"]
      }],
      [/^(?:bg-gradient-)?stops-(\[.+])(\d{1,2})$/, ([, s]) => ({ "--un-gradient-stops": h.bracket(s) })],
      [/^(?:bg-gradient-)?(from)-(.+)(\d{1,2})$/, bgGradientColorResolver()],
      [/^(?:bg-gradient-)?(via)-(.+)(\d{1,2})$/, bgGradientColorResolver()],
      [/^(?:bg-gradient-)?(to)-(.+)(\d{1,2})$/, bgGradientColorResolver()]
   
    ]
  };
});


export default presetPalette;
