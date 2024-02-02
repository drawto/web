import { defineStore } from 'pinia'
import DrawboardTool from 'composables/drawboardTool'
import { colors, EventBus } from 'quasar'
import getPaletteColor = colors.getPaletteColor
import { DrawTool } from 'components/models'

const MAX_SNAPSHOTS = 10

export const drawEventBus = new EventBus()
export const useDrawStore = defineStore('draw', {
  state: () => ({
    tool: {
      type: DrawboardTool.BRUSH,
      size: 5,
      color: getPaletteColor('primary')
    } as DrawTool,
    snapshots: [] as any[],
    currentSnapshotIndex: -1
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
    currentSnapshot ( state ) {
      return state.snapshots[state.currentSnapshotIndex] || null
    }
  },

  actions: {
    pushSnapshot ( snapshot: any ) {
      const lastSnapshot = this.snapshots[this.snapshots.length - 1]
      if (lastSnapshot && isSameSnapshot(lastSnapshot, snapshot)) {
        return
      }

      if (this.snapshots.length >= MAX_SNAPSHOTS) {
        this.snapshots.shift()
        this.currentSnapshotIndex--
      }

      this.snapshots.push(snapshot)
      this.currentSnapshotIndex = this.snapshots.length - 1
    },

    undo () {
      if (!this.canUndo) {
        return
      }

      this.currentSnapshotIndex--
      drawEventBus.emit('undo')
    },

    redo () {
      if (!this.canRedo) {
        return
      }

      this.currentSnapshotIndex++
      drawEventBus.emit('redo')
    }
  }
})

function isSameSnapshot ( a: any, b: any ) {
  return a.canvas.toDataURL() === b.canvas.toDataURL()
}
