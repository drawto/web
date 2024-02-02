<script setup lang="ts">
import { useDrawStore } from 'stores/draw'
import { storeToRefs } from 'pinia'
import {
  ionArrowRedoCircleOutline,
  ionArrowUndoCircleOutline,
  ionColorPaletteOutline, ionTrashOutline
} from '@quasar/extras/ionicons-v7'
import { DrawToolType } from 'components/models'

const drawStore = useDrawStore()
const { tool } = storeToRefs(drawStore)

const tools = [
  ['brush', 'svguse:icons.svg#brush'],
  ['eraser', 'svguse:icons.svg#eraser']
]
</script>

<template>
  <div class="drawboard-tools">
    <q-list>
      <q-item
        v-for="([type, icon]) in tools"
        :key="type"
        clickable
        :active="tool.type === type"
        @click="tool.type = type as DrawToolType"
      >
        <q-item-section avatar>
          <q-icon :name="icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ $t(`tools.${type}`) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="q-px-md q-mt-sm">
        {{ $t('tools.size') }}: {{ tool.size }}px
        <q-slider v-model="tool.size" :min="1" :max="100" />
      </div>
      <div class="q-px-md">
        {{ $t('tools.color') }}:
        <q-input
          v-model="tool.color"
          dense
        >
          <template #append>
            <q-icon :name="ionColorPaletteOutline" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="tool.color" format-model="hex" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </q-list>
    <div class="q-px-md q-mt-md">
      <q-btn-group flat spread>
        <q-btn
          color="primary"
          :label="$t('undo')"
          @click="drawStore.undo()"
          :disable="!drawStore.canUndo"
          :icon="ionArrowUndoCircleOutline"
        />
        <q-btn
          color="primary"
          :label="$t('redo')"
          @click="drawStore.redo()"
          :disable="!drawStore.canRedo"
          :icon="ionArrowRedoCircleOutline"
        />
      </q-btn-group>
      <div class="flex justify-end q-mt-sm">
        <q-btn
          color="primary"
          :label="$t('clear')"
          @click="drawStore.clear()"
          :disable="!drawStore.canClear"
          :icon="ionTrashOutline"
        />
      </div>
    </div>
  </div>
</template>
