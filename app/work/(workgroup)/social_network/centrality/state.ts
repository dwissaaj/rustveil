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

export interface PieFilterStateType {
  innerRadius: number;
  padAngle: number;
  cornerRadius: number;
  colorSchema: ColorSchema;
  title: string;
  description: string;
  author: string;
  labelsOffset :number
  textOffset: number
}


export const PieFilterState = atom<PieFilterStateType>({
  innerRadius: 0.5,
  padAngle: 1,
  labelsOffset : 0,
  textOffset:0,
  cornerRadius: 0,
  colorSchema: ColorSchema.nivo,
  title: "My Chart",
  description: "Description",
  author: "Your Name"
});


export interface NivoPieType {
  id: string;
  value: number;
  label?: string;
}

export const topShowDataPie = atom(20);




export interface NivoBarType {
  node: string;
  centrality: number;
  [key: string]: string | number; 
}


export const topShowDataBar = atom(20);




export interface BarFilterStateType {
  title: string;
  description: string;
  author: string;
  layout: "horizontal"| "vertical";
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin:number;
  colorSchema: ColorSchema;
  borderRadius: number;
  borderWidth: number;
  labelPosition: "start" | "middle"| "end";
  labelOffset: number;
  axisBottomSize: number;
  axisBottomPadding: number;
  axisBottomRotation: number;
  axisBottomLegend: string;
  axisBottomLegendOffset: number;
  axisLeftSize: number;
  axisLeftPadding: number;
  axisLeftRotation: number;
  axisLeftLegend: string;
  axisLeftLegendOffset: number;
}


export const BarFilterState = atom<BarFilterStateType>({
    title: 'Chart Title',
  description: "Simple Description",
  author: "Your Name",
  layout: "horizontal",
  topMargin: 50,
  bottomMargin: 50,
  leftMargin: 50,
  rightMargin:50,
  borderRadius: 0,
  borderWidth: 0,
  labelPosition: "start",
  labelOffset: 0,
  colorSchema: ColorSchema.nivo,
  axisBottomSize: 0,
  axisBottomPadding: 0,
  axisBottomRotation: 0,
  axisBottomLegend: 'Bottom Legend',
  axisBottomLegendOffset: 0,
  axisLeftSize: 0,
  axisLeftPadding: 0,
  axisLeftRotation: 0,
  axisLeftLegend: "Left Legend",
  axisLeftLegendOffset: 0,
});

