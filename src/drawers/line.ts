import Konva from 'konva'
import { DrawTool, DrawLine } from 'components/models'

export function createLine (
  e: Konva.KonvaEventObject<MouseEvent>,
  tool: DrawTool
): DrawLine | null {
  const position = e.target.getStage()?.getPointerPosition()

  if (!position) return null

  // Adjust the start point based on the cursor size
  const cursorOffset = tool.size / 2
  const adjustedX = position.x + cursorOffset
  const adjustedY = position.y + cursorOffset

  // Add point twice, so we have some drawings even on a simple click
  // Start and end points are adjusted to account for cursor size
  const points = [adjustedX, adjustedY, adjustedX, adjustedY]
  const lineCap = 'round'
  const lineJoin = 'round'
  const globalCompositeOperation = tool.type === 'eraser' ? 'destination-out' : 'source-over'
  const stroke = tool.color
  const strokeWidth = tool.size

  return { points, lineCap, lineJoin, globalCompositeOperation, stroke, strokeWidth }
}
