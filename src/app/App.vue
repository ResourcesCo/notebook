<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Split from 'split-grid'

export default defineComponent({
  setup(props, _ctx) {
    const codeFrame = ref()
    const viewFrame = ref()
    const split = ref()

    onMounted(() => {
      Split({
        columnGutters: [{
          track: 1,
          element: split.value,
        }],
        columnMinSizes: 0,
      })
      window.addEventListener('message', e => {
        if (e.isTrusted && e.source === codeFrame?.value.contentWindow && viewFrame.value) {
          viewFrame.value.contentWindow.postMessage(e.data, window.location.href)
        }
      })
    })

    return {
      codeFrame,
      viewFrame,
      split
    }
  }
})

</script>

<template>
  <div class="view-container text-gray-700 dark:text-gray-200">
    <div class="overflow-auto">
      <iframe
        ref="codeFrame"
        class="h-full w-full"
        src="/app/edit/"
        sandbox="allow-same-origin allow-scripts allow-popups allow-downloads"
      ></iframe>
    </div>
    <div class="overflow-auto">
      <iframe
        ref="viewFrame"
        class="h-full w-full"
        src="/app/view/"
        sandbox="allow-same-origin allow-scripts allow-popups allow-downloads"
      ></iframe>
    </div>
    <div ref="split" class="view-split">
      <div class="view-split-bar h-full" />
      <div class="view-split-handle p-1">↔</div>
    </div>
  </div>
</template>

<style type="text/css">
.view-container {
  display: grid;
  grid-template-columns: 1fr 0px 1fr;
  grid-template-rows: 1fr;
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
.view-split:hover .view-split-bar,
.view-split:active .view-split-bar {
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
  text-align: center;
  @apply bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 rounded-md;
}
.view-split:hover .view-split-handle,
.view-split:active .view-split-handle {
  left: -30px;
  width: 60px;
  @apply bg-gray-200 text-gray-500 border-2 border-gray-300 shadow-md
    dark:bg-gray-700 dark:text-gray-300 dark:border-gray-400;
}
.view-split-handle svg {
  width: 10px;
  height: 10px;
  margin: 0;
  padding: 0;
}
</style>
