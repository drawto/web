<script setup lang="ts">
import { getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import Konva from 'konva'
import { createCursorCircle } from 'drawers/cursor'
import { createLine } from 'drawers/line'
import { useDrawStore } from 'stores/draw'
import { storeToRefs } from 'pinia'
import { Dimensions } from 'components/models'
import { saveToDataUrl } from 'composables/drawboardExport'

const instance = getCurrentInstance()
const drawStore = useDrawStore()
const { tool, canvasState, duringPainting } = storeToRefs(drawStore)
const toolCursor = ref<string>('pointer')
const stageConfig = ref<any>({
  ...getParentElDimensions()
})

function onMouseUp ( e: Konva.KonvaEventObject<MouseEvent> ) {
  duringPainting.value = false
  drawStore.createSnapshot()
}

function onMouseDown ( e: Konva.KonvaEventObject<MouseEvent> ) {
  duringPainting.value = true
  const newLine = createLine(e, tool.value)
  if (!newLine) return
  drawStore.createSnapshot()
  canvasState.value.lines.push(newLine)
}

function onMouseMove ( e: Konva.KonvaEventObject<MouseEvent> ) {
  if (!duringPainting.value) {
    return
  }
  const newLine = createLine(e, tool.value)
  if (!newLine) return

  const lines = canvasState.value.lines
  const lastLine = lines[lines.length - 1]
  lastLine.points = lastLine.points.concat(newLine.points)
  lines.splice(lines.length - 1, 1, lastLine)
}

function getParentElDimensions () {
  const defaultDimensions = { width: 0, height: 0 }
  const { width, height } = instance?.parent?.vnode?.el?.getBoundingClientRect() || defaultDimensions
  return { width, height }
}

async function updateToolCursor () {
  const circle = await createCursorCircle(tool.value.size, tool.value.color)
  const url = URL.createObjectURL(circle)
  toolCursor.value = `url(${url}) 2 2, auto`
}

onMounted(() => {
  const isDimensionsEqual = ( a: Dimensions, b: Dimensions ) => {
    return a.width === b.width && a.height === b.height
  }
  const updateStageConfigDimensions = ( e: any ) => {
    const dimensions = getParentElDimensions()
    Object.keys(dimensions).forEach(key => {
      stageConfig.value[key] = dimensions[key as keyof typeof dimensions]
    })

    if (!e.withOg) {
      return;
    }

    if (!isDimensionsEqual(canvasState.value.originalDimensions, dimensions)) {
      const url = saveToDataUrl(canvasState.value)
      if (url) {
        canvasState.value.scaledBackground = url
        drawStore.resetCanvasState()
      }
    }

    canvasState.value.originalDimensions = dimensions
  }

  updateStageConfigDimensions({ withOg: true })

  window.addEventListener('resize', updateStageConfigDimensions)

  onUnmounted(() => {
    window.removeEventListener('resize', updateStageConfigDimensions)
  })
})

watch(tool, updateToolCursor, { immediate: true, deep: true })
</script>

<template>
  <div class="drawboard">
    <div class="drawboard__canvas-container">
      <v-stage
        :config="stageConfig"
        @mouseup="onMouseUp"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
      >
        <v-layer>
          <v-line
            v-for="(line, index) in canvasState.lines"
            :key="index"
            :config="line"
          />
        </v-layer>
      </v-stage>
    </div>
    <div v-if="canvasState.scaledBackground" class="drawboard__scaled-bg">
      <img
        :src="canvasState.scaledBackground"
        alt=""
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawboard {
  cursor: v-bind(toolCursor);
  position: relative;
  &__canvas-container {
    z-index: 2;
  }
  &__scaled-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      object-fit: cover;
      width: 100%;
    }
  }
}
</style>
