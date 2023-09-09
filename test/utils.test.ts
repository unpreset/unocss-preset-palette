import { expect, it } from "vitest";
import { rgb2hsl } from "../src/utils";

it("rgb2hsl", () => {
  expect(rgb2hsl([255, 0, 0])).toEqual([0, 1, 0.5]);
});
