import type * as CSS from "csstype";
export interface CSSProperties extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {
  [v: `--${string}`]: string | number | undefined
}
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

