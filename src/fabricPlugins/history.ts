// Thanks
// https://github.com/alimozdemir/fabric-history/issues/48#issuecomment-1835805502

import { fabric } from 'fabric'

declare module 'fabric' {
  namespace fabric {
    interface Canvas {
      history: HistoryPlugin
    }
  }
}

type HistoryEventCallback = () => void;

class HistoryPlugin {
  private canvas: fabric.Canvas
  private historyUndo: string[]
  private historyRedo: string[]
  private extraProps: string[]
  private historyNextState: string
  private historyProcessing: boolean

  static install ( canvas: fabric.Canvas ) {
    canvas.history = new HistoryPlugin(canvas)
  }

  constructor ( canvas: fabric.Canvas ) {
    this.canvas = canvas
    this.historyUndo = []
    this.historyRedo = []
    this.extraProps = ['selectable', 'editable']
    this.historyNextState = this._historyNext()
    this.historyProcessing = false

    this._historyInit()
  }

  undo ( callback?: HistoryEventCallback ) {
    this.historyProcessing = true

    const history = this.historyUndo.pop()
    if (history) {
      this.historyRedo.push(this._historyNext())
      this.historyNextState = history
      this._loadHistory(history, 'history:undo', callback)
    } else {
      this.historyProcessing = false
    }
  }

  redo ( callback?: HistoryEventCallback ) {
    this.historyProcessing = true

    const history = this.historyRedo.pop()
    if (history) {
      this.historyUndo.push(this._historyNext())
      this.historyNextState = history
      this._loadHistory(history, 'history:redo', callback)
    } else {
      this.historyProcessing = false
    }
  }

  clearHistory () {
    this.historyUndo = []
    this.historyRedo = []
    this.canvas.fire('history:clear')
  }

  onHistory () {
    this.historyProcessing = false
    this._historySaveAction()
  }

  canUndo (): boolean {
    return this.historyUndo.length > 0
  }

  canRedo (): boolean {
    return this.historyRedo.length > 0
  }

  offHistory () {
    this.historyProcessing = true
  }

  private _historyNext (): string {
    return JSON.stringify(this.canvas.toDatalessJSON(this.extraProps))
  }

  private _historyEvents () {
    return {
      'object:added': this._historySaveAction.bind(this),
      'object:removed': this._historySaveAction.bind(this),
      'object:modified': this._historySaveAction.bind(this),
      'object:skewing': this._historySaveAction.bind(this)
    }
  }

  private _historyInit () {
    const events: any = this._historyEvents()
    Object.keys(events).forEach(( event ) => {
      this.canvas.on(event, events[event])
    })
  }

  private _historyDispose () {
    const events: any = this._historyEvents()
    Object.keys(events).forEach(( event ) => {
      this.canvas.off(event, events[event])
    })
  }

  private _historySaveAction () {
    if (this.historyProcessing) return

    const json = this.historyNextState
    this.historyUndo.push(json)
    this.historyNextState = this._historyNext()
    this.canvas.fire('history:append', { json: json })
  }

  private _loadHistory ( history: string, event: string, callback?: HistoryEventCallback ) {
    this.canvas.loadFromJSON(history, () => {
      this.canvas.renderAll()
      this.canvas.fire(event)
      this.historyProcessing = false

      if (callback) callback()
    })
  }
}

export default HistoryPlugin
