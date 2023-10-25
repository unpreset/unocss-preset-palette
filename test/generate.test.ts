import { createGenerator, presetUno } from "unocss";
import { describe, expect, it } from "vitest";
import { presetPalette } from "../src";
describe("generate test", () => {
  it("generate prelights", async () => {
    const uno = createGenerator({
      presets: [
        presetPalette({
          themeColors: {
            primary: "rgb(255,0,0)"
          }
        })
      ]
    });
    const { css } = await uno.generate("bg-primary");
    expect(css).toMatchInlineSnapshot(`
      "/* layer: palette */
      :root{--un-palette-primary-color-rgb:255 0 0;--un-palette-primary-color:rgb(var(--un-palette-primary-color-rgb));}"
    `);
  });

  it("generate", async () => {
    const uno = createGenerator({
      presets: [
        presetPalette({
          themeColors: {
            primary: "rgb(255,0,0)"
          }
        }),
        presetUno()
      ]
    });
    const { css } = await uno.generate("bg-primary", {
      preflights: false
    });
    expect(css).toMatchInlineSnapshot(`
      "/* layer: default */
      .bg-primary{--un-bg-opacity:1;background-color:rgb(var(--un-palette-primary-color-rgb) / var(--un-bg-opacity));}"
    `);
  });
});
