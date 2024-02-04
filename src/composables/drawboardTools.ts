import { fabric } from 'fabric'
import { TDrawboardToolKey } from 'components/models'

declare module 'fabric' {
  namespace fabric {
    class EraserBrush extends fabric.PencilBrush {}
    interface Canvas {
      tool?: IDrawboardTool
    }
  }
}

interface IDrawboardTool {
  dCanvas: fabric.Canvas
  key: TDrawboardToolKey
  color: string
  size: number
  setup ( dCanvas: fabric.Canvas ): void;
  opts ( opts: any ): void;
}
interface IBaseToolOptions {
  size?: number;
  color?: string;
}

abstract class BaseTool implements IDrawboardTool {
  dCanvas: fabric.Canvas
  public key: TDrawboardToolKey = this.resolveKey()
  protected __size: number = 5
  protected __color: string

  constructor (
    dCanvas: fabric.Canvas,
    opts?: IBaseToolOptions
  ) {
    this.dCanvas = dCanvas
    this.dCanvas.tool = this

    this.__size = opts?.size || 5
    this.__color = opts?.color || '#fff'

    this.setup(dCanvas)
  }

  setup ( dCanvas: fabric.Canvas ): void {
    this.init(dCanvas)
    this.size = this.__size
    this.color = this.__color

    this.dCanvas.toolCursor.update()
  }

  protected init ( dCanvas: fabric.Canvas ): void {
    throw new Error('Method not implemented.')
  }

  opts ( opts: any ): void {
    this.size = opts.size || this.size
    this.color = opts.color || this.color

    this.dCanvas.toolCursor.update()
  }

  set color ( value: string ) {
    this.__color = value
    this.dCanvas.freeDrawingBrush.color = value
  }

  get color (): string {
    return this.__color || this.dCanvas.freeDrawingBrush.color
  }

  set size ( value: number ) {
    this.__size = value
    this.dCanvas.freeDrawingBrush.width = value
  }

  get size () {
    return this.__size
  }

  protected resolveKey (): TDrawboardToolKey {
    const search = () => {
      let result: TDrawboardToolKey | undefined = undefined
      Object.entries(toolsMap).forEach(([key, Tool]) => {
        if (this instanceof Tool) {
          result = key as TDrawboardToolKey
          return false
        }
      })
      return result
    }
    const key = search()
    if (! key) {
      throw new Error('Tool not registered in toolsMap.')
    }
    return key
  }
}

export class PencilTool extends BaseTool {
  init ( dCanvas: fabric.Canvas ): void {
    dCanvas.freeDrawingBrush = new fabric.PencilBrush(dCanvas)
  }
}

export class EraserTool extends BaseTool {
  init ( dCanvas: fabric.Canvas ): void {
    dCanvas.freeDrawingBrush = new fabric.EraserBrush(dCanvas)
  }
}

type ToolConstructor = new (...args: any[]) => IDrawboardTool;
type ToolMap = Record<TDrawboardToolKey, ToolConstructor>;
const toolsMap = {
  pencil: PencilTool,
  eraser: EraserTool
} as ToolMap

export default toolsMap
