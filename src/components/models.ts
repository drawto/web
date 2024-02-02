export interface DrawTool {
  type: DrawToolType;
  size: number;
  color: string;
}
export type DrawToolType = 'brush' | 'eraser';
