<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { drawEventBus, useDrawStore } from 'stores/draw'
import { storeToRefs } from 'pinia'
import { fabric } from 'fabric'
import { createDrawboardCanvas, setupDrawboardTool } from 'composables/drawboardCanvas'
import { IDimensions } from 'components/models'

const drawStore = useDrawStore()
const { toolKey, toolOpts, canUndo, canRedo } = storeToRefs(drawStore)
const drawboard = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let   dCanvas: fabric.Canvas
let   originalDimensions: { width: number, height: number }

function getDrawboardDimensions () {
  const { width, height } = drawboard.value?.getBoundingClientRect() || { width: 0, height: 0 }
  return { width, height }
}

function getCanvasDimensions () {
  const dimensions = getDrawboardDimensions()
  dimensions.height = window.innerHeight
  return dimensions
}

function updateHistoryButtons () {
  canUndo.value = dCanvas.history.canUndo()
  canRedo.value = dCanvas.history.canRedo()
}

function setupHistoryButtonChanges () {
  const events = ['undo', 'redo', 'append']
  events.forEach(event => {
    dCanvas.on(`history:${event}`, updateHistoryButtons)
  })
  onUnmounted(() => {
    events.forEach(event => {
      dCanvas.off(`history:${event}`, updateHistoryButtons)
    })
  })
}

function setupResizeObserver () {
  const onResize = () => fitToDimensions(getCanvasDimensions())
  window.addEventListener('resize', onResize)
  onUnmounted(() => window.removeEventListener('resize', onResize))
}

function fitToDimensions ( dimensions: IDimensions, _originalDimensions?: IDimensions ) {
  if (! _originalDimensions) {
    _originalDimensions = originalDimensions
  }

  dCanvas.setWidth(dimensions.width)
  dCanvas.setHeight(dimensions.height)

  // Calculate aspect ratios
  const originalAspectRatio = _originalDimensions.width / _originalDimensions.height;
  const newAspectRatio = dimensions.width / dimensions.height;

  let zoom

  // Compare the aspect ratios to decide whether to fit to width or height
  if (newAspectRatio > originalAspectRatio) {
    // Window is wider than the original aspect ratio, fit to height
    zoom = dimensions.height / _originalDimensions.height;
  } else {
    // Window is narrower than the original aspect ratio, fit to width
    zoom = dimensions.width / _originalDimensions.width;
  }

  // Apply zoom only if it has changed
  if (zoom) {
    dCanvas.setZoom(zoom);
  }

  // move to center
  dCanvas.absolutePan(new fabric.Point(0, 0));
}

onMounted(() => {
  originalDimensions = getCanvasDimensions()
  dCanvas = createDrawboardCanvas(canvas.value as HTMLCanvasElement, originalDimensions)

  setupDrawboardTool(dCanvas, drawStore.toolOpts)

  setupHistoryButtonChanges()
  setupResizeObserver()
})

watch(toolKey, () => setupDrawboardTool(dCanvas, drawStore.toolOpts))
watch(toolOpts, () => setupDrawboardTool(dCanvas, drawStore.toolOpts))

drawEventBus.on('undo', () => dCanvas?.history.undo())
drawEventBus.on('redo', () => dCanvas?.history.redo())
</script>

<template>
  <div class="drawboard" ref="drawboard">
    <canvas class="drawboard__canvas" ref="canvas" />
  </div>
</template>

<style scoped lang="scss">
.drawboard {
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
