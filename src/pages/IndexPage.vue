<script setup lang="ts">
import Drawboard from 'components/Drawboard.vue'
import { ref } from 'vue'
import { beautyAge } from 'composables/beautyTime'

const drawTime = ref<Date>(new Date)
</script>

<template>
  <q-page class="flex column">
    <div class="relative-position flex-fit flex column">
      <div class="absolute-top-left q-pl-sm q-pt-sm z-top">
        <div class="draw-time">{{ beautyAge(drawTime) }}</div>
      </div>
      <drawboard class="flex-fit" />
    </div>
  </q-page>
</template>

<style lang="scss">
.draw-time {
  --font-size-time: 12px;
  --height: calc(var(--font-size-time) + .375rem);
  font-size: var(--font-size-time);
  color: white;
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: var(--height);
  padding: 0 6px;
}
</style>
