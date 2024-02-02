import { defineStore } from 'pinia'
import { DrawCanvasState } from 'components/models'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    states: [] as DrawCanvasState[]
  }),

  actions: {
    addState ( state: DrawCanvasState ) {
      this.states.push(state)
    },
  }
})
