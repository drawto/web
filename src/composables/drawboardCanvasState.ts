import { DrawCanvasState } from 'components/models'

export function isStatesEquals ( a: DrawCanvasState, b: DrawCanvasState ): boolean {
  const aLines = a.lines
  const bLines = b.lines
  return JSON.stringify(aLines) === JSON.stringify(bLines)
}

export function isStateEmpty ( state: DrawCanvasState ): boolean {
  return state.lines.length === 0
}
