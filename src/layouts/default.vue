<script setup lang="ts">
import { onMounted } from 'vue';
import Split from 'split-grid';

onMounted(() => {
  Split({
    columnGutters: [{
      track: 1,
      element: document.querySelector('.view-split'),
    }],
  })
})
</script>

<style type="text/css">
.view-container {
  display: grid;
  grid-template-columns: 1fr 10px 1fr;
  height: 100vh;
}
.view-split {
  cursor: ew-resize;
}
.view-split-bar {
  width: 2px;
}
.view-split:hover .view-split-bar, .view-split:active .view-split-bar {
  width: 4px;
}
</style>

<template>
  <div class="view-container">
    <main class="view-a px-4 py-10 text-center text-gray-700 dark:text-gray-200">
      <router-view />
    </main>
    <div class="view-split flex justify-center">
      <div class="view-split-bar h-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div class="view-b px-4 py-10 text-center text-gray-700 dark:text-gray-200">
      <Footer />
    </div>
  </div>
</template>
