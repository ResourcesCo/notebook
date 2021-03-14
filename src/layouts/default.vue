<script setup lang="ts">
import { onMounted } from 'vue'
import Split from 'split-grid'

onMounted(() => {
  Split({
    columnGutters: [{
      track: 1,
      element: document.querySelector('.view-split'),
    }],
    columnMinSizes: 0,
  })
})
</script>

<template>
  <div class="view-container text-gray-700 dark:text-gray-200">
    <div class="overflow-x-auto">
      Tab 1
    </div>
    <div class="overflow-x-auto">
      Preview
    </div>
    <main class="view-a overflow-auto px-4 py-10 text-center">
      <router-view />
    </main>
    <div class="view-b overflow-auto px-4 py-10 text-center">
      <Footer />
    </div>
    <div class="view-split">
      <div class="view-split-bar h-full" />
    </div>
  </div>
</template>

<style type="text/css">
.view-container {
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
}
.view-split {
  position: relative;
  @apply bg-gray-200 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-500;
  grid-column: 2;
  grid-row: 1 / span 2;
}
.view-split-bar {
  cursor: ew-resize;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -10px;
  right: -10px;
  background: transparent;
}
</style>
