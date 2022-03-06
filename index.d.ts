
declare type Colors = Record<string, string | Record<string, string>>

declare interface CssVarName{
	(name: string): string
	prefix?: string
	suffix?: string
}

declare interface PaletteOptions {
	colors?: Colors
	/**
	 *  @see "@vueuse/core/useColorMode"
	 */
	colorMode?: {
		/**
		 *  @default  'html'
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
