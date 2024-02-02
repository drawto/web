<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { createCursorCircle } from 'drawers/cursor'
import { drawEventBus, useDrawStore } from 'stores/draw'
import { storeToRefs } from 'pinia'
import p5 from 'p5'

const drawStore = useDrawStore()
const { tool } = storeToRefs(drawStore)
const toolCursor = ref<string>('pointer')
const canvas = ref<HTMLElement | null>(null)
let   p: p5

function getCanvasDimensions () {
  const defaultDimensions = { width: 0, height: 0 }
  const { width, height } = canvas.value?.getBoundingClientRect() || defaultDimensions
  return { width, height }
}

function p5Setup () {
  const dimensions = getCanvasDimensions()
  p.createCanvas(dimensions.width, dimensions.height)
}

function p5Draw () {
  if (! p.mouseIsPressed) {
    return
  }

  p.stroke(tool.value.color)
  p.strokeWeight(tool.value.size)

  const cursorOffset = tool.value.size / 2
  const mouseX = p.mouseX + cursorOffset
  const mouseY = p.mouseY + cursorOffset
  const pmouseX = p.pmouseX + cursorOffset
  const pmouseY = p.pmouseY + cursorOffset

  p.line(mouseX, mouseY, pmouseX, pmouseY)
}

function p5PushSnapshot () {
  drawStore.pushSnapshot(p.get())
}

function p5DrawCurrentSnapshot () {
  p.clear()
  p.image(drawStore.currentSnapshot, 0, 0)
  // We need to disable and enable erase mode again
  // because for some reason after drawing an image
  // erase mode is not working
  p.noErase()
  p5RefreshEraseMode()
}

function p5RefreshEraseMode () {
  if (tool.value.type === 'eraser') {
    p?.erase()
  } else {
    p?.noErase()
  }
}

function p5MouseToggle ( e: MouseEvent ) {
  if (e.target !== canvas.value?.querySelector('canvas')) {
    return
  }
  p5PushSnapshot()
}

async function refreshCanvasCursor () {
  const circle = await createCursorCircle(tool.value.size, tool.value.color)
  const url = URL.createObjectURL(circle)
  toolCursor.value = `url(${url}) 2 2, auto`
}

onMounted(() => {
  p = new p5(( _p ) => {
    _p.setup = p5Setup
    _p.draw = p5Draw
    _p.mousePressed = p5MouseToggle
    _p.mouseReleased = p5MouseToggle
  }, canvas.value as HTMLElement)

  const onResize = () => {
    p5PushSnapshot()
    const dimensions = getCanvasDimensions()
    p.resizeCanvas(dimensions.width, dimensions.height)
    p5DrawCurrentSnapshot()
  }

  window.addEventListener('resize', onResize)
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })
})

watch(tool, () => {
  refreshCanvasCursor()

  p5RefreshEraseMode()
}, { immediate: true, deep: true })

drawEventBus.on('undo', p5DrawCurrentSnapshot)
drawEventBus.on('redo', p5DrawCurrentSnapshot)
</script>

<template>
  <div class="drawboard">
    <div class="drawboard__canvas" ref="canvas" />
  </div>
</template>

<style scoped lang="scss">
.drawboard {
  cursor: v-bind(toolCursor);
  position: relative;
  display: flex;
  flex-direction: column;
  &__canvas {
    flex: 1;
    z-index: 2;
  }
}
</style>
