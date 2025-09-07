import { atom } from "jotai";

export const showFilterAtom = atom(false);


export enum ColorSchema {
  nivo = "nivo",
  category10 = "category10",
  accent = "accent",
  dark2 = "dark2",
  paired = "paired",
  pastel1 = "pastel1",
  set1 = "set1",
  brown_blueGreen = "brown_blueGreen",
  purpleRed_green = "purpleRed_green",
  pink_yellowGreen = "pink_yellowGreen",
  purple_orange = "purple_orange",
  Sequential = "Sequential",
  blues = "blues",
  greens = "greens",
  greys = "greys",
  oranges = "oranges",
  purples = "purples",
  reds = "reds",
  blue_green = "blue_green",
  blue_purple = "blue_purple",
  green_blue = "green_blue",
  yellow_orange_brown = "yellow_orange_brown",
  yellow_orange_red = "yellow_orange_red",
}

export interface FilterState {
  innerRadius: number;
  padAngle: number;
  cornerRadius: number;
  colorSchema: ColorSchema;
  title: string;
}

// ✅ proper default state
export const filterState = atom<FilterState>({
  innerRadius: 0.5,
  padAngle: 1,
  cornerRadius: 3,
  colorSchema: ColorSchema.nivo,
  title: "My Chart",
});
