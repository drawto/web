import { defineStore } from 'pinia';
import DrawboardTool from 'composables/drawboardTool'
import { colors } from 'quasar'
import getPaletteColor = colors.getPaletteColor
import { DrawCanvasState, DrawTool } from 'components/models'
import { unwrapProxy } from 'composables/vue'
import { isStateEmpty, isStatesEquals } from 'composables/drawboardCanvasState'

export const useDrawStore = defineStore('draw', {
  state: () => ({
    tool: {
      type: DrawboardTool.BRUSH,
      size: 5,
      color: getPaletteColor('primary'),
    } as DrawTool,
    duringPainting: false,
    canvasState: {
      originalDimensions: {
        width: 0,
        height: 0,
      },
      lines: [],
    } as DrawCanvasState,
    snapshots: [] as DrawCanvasState[],
    currentSnapshotIndex: -1,
  }),

  getters: {
    canUndo ( state ) {
      return state.snapshots.length && state.currentSnapshotIndex !== 0
    },
    canRedo ( state ) {
      return state.snapshots.length
        && state.currentSnapshotIndex > -1
        && state.currentSnapshotIndex < state.snapshots.length - 1
    },
    canClear ( state ) {
      return !isStateEmpty(state.canvasState) || state.snapshots.length
    }
  },

  actions: {
    resetCanvasState () {
      this.canvasState.lines = []
    },

    createSnapshot () {
      if (this.snapshots.length
        && isStatesEquals(this.canvasState, this.snapshots[this.snapshots.length - 1])
      ) {
        return
      }

      this.snapshots.push(unwrapProxy(this.canvasState))
      this.currentSnapshotIndex = this.snapshots.length - 1
    },

    undo () {
      if (this.currentSnapshotIndex === -1) {
        this.currentSnapshotIndex = this.snapshots.length - 1
      } else {
        this.currentSnapshotIndex--
      }
      this.canvasState = { ...this.snapshots[this.currentSnapshotIndex] }
    },

    redo () {
      if (this.currentSnapshotIndex < this.snapshots.length - 1) {
        this.currentSnapshotIndex++
        this.canvasState = { ...this.snapshots[this.currentSnapshotIndex] }
      }
    },

    clear () {
      // Clear snapshots on double clear
      if (isStateEmpty(this.canvasState)) {
        this.snapshots = []
        this.currentSnapshotIndex = -1
        return
      }

      this.resetCanvasState()
      this.createSnapshot()
    }
  }
});
