import { fabric } from 'fabric'

declare module 'fabric' {
  namespace fabric {
    interface Canvas {
      toolCursor: ToolCursorPlugin
    }
  }
}

export default class ToolCursorPlugin {
  private readonly dCanvas: fabric.Canvas
  public readonly cursorCanvas: fabric.StaticCanvas
  private cursor: fabric.Object | null = null

  static install ( canvas: fabric.Canvas ) {
    canvas.toolCursor = new ToolCursorPlugin(canvas)
  }

  constructor ( dCanvas: fabric.Canvas ) {
    this.dCanvas = dCanvas

    const canvas = dCanvas.getElement()
    const cursorCanvas = document.createElement('canvas')

    // append the cursorCanvas after the main canvas
    canvas.parentNode?.insertBefore(cursorCanvas, canvas.nextSibling)

    this.cursorCanvas = new fabric.StaticCanvas(cursorCanvas)
    this.cursorCanvas.setWidth(dCanvas.getWidth())
    this.cursorCanvas.setHeight(dCanvas.getHeight())
    this.cursorCanvas.setZoom(dCanvas.getZoom())

    this.addZoomListener()

    this.update()
  }

  update () {
    this.cleanup()

    switch (this.dCanvas.tool?.key) {
      case 'pencil':
      case 'eraser':
        this.setFreeDrawingCursor('none')
        this.cursor = circleCursor(this.dCanvas, this.cursorCanvas)
        break
      default:
        this.setFreeDrawingCursor('crosshair')
    }
  }

  private addZoomListener () {
    const originalSetZoom = this.dCanvas.setZoom
    this.dCanvas.setZoom = ( value: number ) => {
      this.cursorCanvas.setZoom(value)
      return originalSetZoom.call(this.dCanvas, value)
    }
  }

  private setFreeDrawingCursor ( cursor: string ) {
    this.dCanvas.freeDrawingCursor = cursor
  }

  cleanup () {
    this.cursorCanvas.clear()
  }
}

function circleCursor ( canvas: fabric.Canvas, cursorCanvas: fabric.StaticCanvas ) {
  const radius = canvas.freeDrawingBrush.width / 2
  const circle = new fabric.Circle({
    radius,
    fill: 'transparent',
    stroke: canvas.freeDrawingBrush.color,
    strokeWidth: 2,
    originX: 'center',
    originY: 'center'
  })

  cursorCanvas.add(circle)

  canvas.on('mouse:move', ( event ) => {
    const { x, y } = canvas.getPointer(event.e)
    circle.top = y
    circle.left = x
    cursorCanvas.renderAll()
  })
  canvas.on('mouse:out', () => {
    circle.visible = false
    cursorCanvas.renderAll()
  })
  canvas.on('mouse:over', () => {
    circle.visible = true
    cursorCanvas.renderAll()
  })

  return circle
}
