import { LineCap, LineJoin } from 'konva/lib/Shape'
type globalCompositeOperationType = '' | 'source-over' | 'source-in' | 'source-out' | 'source-atop' | 'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' | 'lighter' | 'copy' | 'xor' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'

export interface DrawTool {
  type: string;
  size: number;
  color: string;
}
export interface DrawLine {
  points: number[];
  stroke: string;
  strokeWidth: number;
  lineCap: LineCap;
  lineJoin: LineJoin;
  globalCompositeOperation: globalCompositeOperationType;
}
export interface DrawCanvasState {
  originalDimensions: Dimensions;
  lines: DrawLine[];
  scaledBackground?: string;
}
export type DrawToolType = 'brush' | 'eraser';
export interface Dimensions {
  width: number;
  height: number;
}
