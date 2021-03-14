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
      <Nav>
        <Tab :selected="true">🏡 Home</Tab>
        <Tab>Not Selected</Tab>
      </Nav>
    </div>
    <div class="overflow-x-auto">
      <Nav><Tab>👁 Preview</Tab></Nav>
    </div>
    <main class="view-a overflow-auto px-4 py-10 text-center">
      <router-view />
    </main>
    <div class="view-b overflow-auto px-4 py-10 text-center">
      <Footer />
    </div>
    <div class="view-split">
      <div class="view-split-bar h-full" />
      <div class="view-split-handle">↔</div>
    </div>
  </div>
</template>

<style type="text/css">
.view-container {
  display: grid;
  grid-template-columns: 1fr 0px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
}
.view-split {
  position: relative;
  grid-column: 2;
  grid-row: 1 / span 2;
}
.view-split-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  background: transparent;
}
.view-split:hover .view-split-bar, .view-split:active .view-split-bar {
  left: -1px;
  right: -1px;
  @apply bg-gray-200 dark:bg-gray-700;
}
.view-split-handle {
  cursor: ew-resize;
  position: absolute;
  left: -30px;
  width: 25px;
  top: 4px;
  height: 1.3em;
  line-height: 1.3em;
  text-align: center;
  @apply bg-gray-100 text-gray-300 dark:bg-gray-900 dark:text-gray-600 rounded-md
    border-gray-200 dark:border-gray-800 border-1;
}
.view-split:hover .view-split-handle, .view-split:active .view-split-handle {
  left: -30px;
  width: 60px;
  @apply bg-indigo-200 text-indigo-400 border-indigo-300 shadow-md
    dark:bg-indigo-700 dark:text-indigo-400 dark:border-indigo-600;
}
.view-split-handle svg {
  width: 10px;
  height: 10px;
  margin: 0;
  padding: 0;
}
</style>
