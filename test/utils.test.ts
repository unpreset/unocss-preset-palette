import { describe, expect, it } from "vitest";
import { getColorComponents, normalizeVarName, rgb2hsl } from "../src/utils";


describe("utils test", () => {
  it("rgb2hsl", () => {
    expect(rgb2hsl([255, 0, 0])).toEqual([0, 1, 0.5]);
  });

  it("getColorComponents", () => {
    const components = getColorComponents({
      primary: "rgb(255,0,0)"
    }, "light", "hsl");
    expect(components.light.primary).toEqual("0 100% 50%");
  });

  it("normalizeVarName", () => {
    expect(normalizeVarName("un-palette-primary-color")).toEqual("--un-palette-primary-color");
    expect(normalizeVarName("--un-palette-primary-color")).toEqual("--un-palette-primary-color");
  });
});
