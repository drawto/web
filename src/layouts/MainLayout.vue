<script setup lang="ts">
import { ref } from 'vue'
import DrawboardTools from 'components/DrawboardTools.vue'

const rightDrawerOpen = ref(false)
</script>

<template>
  <q-layout view="lHr lpR fFf">
    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      bordered
    >
      <drawboard-tools />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
