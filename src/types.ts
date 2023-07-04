export type ThemeColors = Record<string, string | Record<string, string>>;

export interface CssVarName {
  (name: string): string
  prefix?: string
  suffix?: string
}

export interface PaletteOptions {

  /**
   *
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
}

