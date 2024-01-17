import type * as CSS from "csstype";
export interface CSSProperties extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {
  [v: `--${string}`]: string | number | undefined
}
export type ThemeColors = Record<string, string | (string | number)[] | Record<string, string | (string | number)[]>>;

export type CssVarName = string | {
  (name: string): string
} | {
  prefix?: string
  suffix?: string
};

export type ColorScheme = "light" | "dark";
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
   * use opacity variable
   *
   * ```css
   * .text-primary {
   *   --un-text-opacity: 1;
   *   color: rgb(var(--un-palette-primary-rgb) / var(--un-text-opacity));
   * }
   * ```
   * @default true
   */
  useOpacityVariable?: boolean

  /**
  * @default --un-palette-[name]-color
  */
  cssVarName?: CssVarName

  colorFormat?: "rgb" | "hsl"

  colorScheme?: Record<string, ColorScheme>
}

