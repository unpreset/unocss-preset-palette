import { parseCssColor } from "@unocss/preset-mini/utils";
function getCssColor(color) {
    const cssColor = parseCssColor(color);
    if (cssColor) {
        const components = Array.from(cssColor.components);
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
function getColorComponents(colors = {}, defaultTheme) {
    const rs = {};
    for (let key in colors) {
        const value = colors[key];
        if (typeof value === "string") {
            if (!rs[defaultTheme]) {
                rs[defaultTheme] = {};
            }
            rs[defaultTheme][key] = getCssColor(value);
        }
        else {
            for (let colorName in value) {
                if (!rs[colorName]) {
                    rs[colorName] = {};
                }
                rs[colorName][key] = getCssColor(value[colorName]);
            }
        }
    }
    return rs;
}
/**
 *
 * @param options
 * @returns
 */
export default function presetPalette(options = {}) {
    var _a, _b, _c, _d;
    let { colors = {}, colorMode = {} } = options;
    const { selector = "html", attribute = "class", defaultValue = "light" } = colorMode;
    const cssVarName = options.cssVarName || ((name) => `un-platte-${name}-color`);
    const themes = getColorComponents(colors, defaultValue);
    let getVarName;
    if (typeof cssVarName === "function") {
        getVarName = name => `--${cssVarName(name)}`;
    }
    else {
        const prefix = (_b = (_a = options.cssVarName) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : "un-platte-";
        const suffix = (_d = (_c = options.cssVarName) === null || _c === void 0 ? void 0 : _c.suffix) !== null && _d !== void 0 ? _d : "-color";
        getVarName = name => `--${prefix}${name}${suffix}`;
    }
    colors = Object.fromEntries(Object.keys(colors).map(e => [e, `rgba(var(${getVarName(e)}))`]));
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
                    for (let theme in themes) {
                        const themeColors = themes[theme];
                        rs.push(selector);
                        if (theme != defaultValue) {
                            rs.push(`[${attribute}="${theme}"]`);
                        }
                        rs.push("{");
                        for (let colorName in themeColors) {
                            let components = themeColors[colorName];
                            rs.push(`${getVarName(colorName)}:${components}`);
                            rs.push(";");
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
                    let opacity = Number(o);
                    if (colors[c]) {
                        return { background: `rgba(var(${getVarName(c)}), ${opacity / 100})` };
                    }
                }
            ],
            [
                /^text-(.*)-([1-9]|[1-9]\d)$/,
                ([, c, o]) => {
                    let opacity = Number(o);
                    if (colors[c]) {
                        return { color: `rgba(var(${getVarName(c)}), ${opacity / 100})` };
                    }
                }
            ]
        ]
    };
}
