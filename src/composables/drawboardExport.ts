import { DrawCanvasState, DrawLine } from 'components/models'
import Konva from 'konva'
import { isStateEmpty } from 'composables/drawboardCanvasState'

export function saveToDataUrl ( state: DrawCanvasState ): string {
  if (isStateEmpty(state)) {
    return ''
  }

  // Create a Konva Stage
  const stage = new Konva.Stage({
    container: document.createElement('div'),
    width: state.originalDimensions.width,
    height: state.originalDimensions.height
  })

  // Create a Konva Layer
  const layer = new Konva.Layer()
  stage.add(layer)

  // Draw the lines on the layer
  state.lines.forEach(( line: DrawLine ) => {
    const pointsFlat = []
    for (let i = 0; i < line.points.length; i += 2) {
      pointsFlat.push(line.points[i], line.points[i + 1])
    }
    const konvaLine = new Konva.Line({
      points: pointsFlat,
      stroke: line.stroke,
      strokeWidth: line.strokeWidth,
      lineCap: line.lineCap,
      lineJoin: line.lineJoin,
      globalCompositeOperation: line.globalCompositeOperation
    })
    layer.add(konvaLine)
  })

  layer.draw()

  try {
    return stage.toDataURL()
  } catch (error) {
    console.error('Error saving to data URL:', error)
    return ''
  } finally {
    stage.destroy()
  }
}
