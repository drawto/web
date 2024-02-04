<script setup lang="ts">
import { useDrawStore } from 'stores/draw'
import { storeToRefs } from 'pinia'
import {
  ionArrowRedoCircleOutline,
  ionArrowUndoCircleOutline,
  ionColorPaletteOutline,
} from '@quasar/extras/ionicons-v7'
import drawboardTools from 'composables/drawboardTools'
import { TDrawboardToolKey } from 'components/models'

const drawStore = useDrawStore()
const { toolKey, toolSize, toolColor } = storeToRefs(drawStore)
const dToolKeys = Object.keys(drawboardTools)

const toolIconsMap = {
  pencil: 'svguse:icons.svg#brush',
  eraser: 'svguse:icons.svg#eraser'
}
</script>

<template>
  <div class="drawboard-tools">
    <q-list>
      <q-item
        v-for="tKey in dToolKeys"
        :key="tKey"
        clickable
        :active="toolKey === tKey"
        @click="toolKey = tKey as TDrawboardToolKey"
      >
        <q-item-section avatar>
          <q-icon :name="toolIconsMap[tKey]" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ $t(`tools.${tKey}`) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="q-px-md q-mt-sm">
        {{ $t('tools.size') }}: {{ toolSize }}px
        <q-slider v-model="toolSize" :min="1" :max="100" />
      </div>
      <div class="q-px-md">
        {{ $t('tools.color') }}:
        <q-input
          v-model="toolColor"
          dense
        >
          <template #append>
            <q-icon :name="ionColorPaletteOutline" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="toolColor" format-model="hex" />
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
          @click="drawStore.undo"
          :disabled="!drawStore.canUndo"
          :icon="ionArrowUndoCircleOutline"
        />
        <q-btn
          color="primary"
          :label="$t('redo')"
          @click="drawStore.redo"
          :disabled="!drawStore.canRedo"
          :icon="ionArrowRedoCircleOutline"
        />
      </q-btn-group>
    </div>
  </div>
</template>
