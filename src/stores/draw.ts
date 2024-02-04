import { defineStore } from 'pinia'
import { colors, EventBus } from 'quasar'
import { TDrawboardToolKey } from 'components/models'
import getPaletteColor = colors.getPaletteColor

export const drawEventBus = new EventBus()
export const useDrawStore = defineStore('draw', {
  state: () => ({
    toolKey: 'pencil' as TDrawboardToolKey,
    toolSize: 5,
    toolColor: getPaletteColor('primary'),
    canUndo: false,
    canRedo: false
  }),

  getters: {
    toolOpts ( state ) {
      return {
        key: state.toolKey,
        size: state.toolSize,
        color: state.toolColor
      }
    }
  },

  actions: {
    undo () {
      drawEventBus.emit('undo')
    },

    redo () {
      drawEventBus.emit('redo')
    },
  }
})
