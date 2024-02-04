import { fabric } from 'fabric'
import HistoryPlugin from 'fabricPlugins/history'
import ToolCursorPlugin from 'fabricPlugins/toolCursor'
import drawboardTools from 'composables/drawboardTools'
import { TDrawboardToolOptions } from 'components/models'

interface ICanvasDimensions {
  width: number;
  height: number;
}

export function createDrawboardCanvas ( canvas: HTMLCanvasElement, dimensions: ICanvasDimensions ) {
  const fCanvas = new fabric.Canvas(canvas, {
    isDrawingMode: true,
    backgroundColor: 'transparent',
    width: dimensions.width,
    height: dimensions.height
  })

  setupPlugins(fCanvas)

  return fCanvas
}

function setupPlugins ( dCanvas: fabric.Canvas ) {
  HistoryPlugin.install(dCanvas)
  ToolCursorPlugin.install(dCanvas)
}

export function setupDrawboardTool ( dCanvas: fabric.Canvas, opts: TDrawboardToolOptions ) {
  if (dCanvas.tool && dCanvas.tool.key === opts.key) {
    dCanvas.tool.opts(opts)
    return dCanvas.tool
  }

  const Tool = drawboardTools[opts.key]
  const options: any = { ...opts }
  delete options.key
  return new Tool(dCanvas, options)
}
