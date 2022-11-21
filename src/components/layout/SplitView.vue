<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Split from 'split-grid'
import { notebook } from '../../store/notebook'
import Nav from '../Nav.vue'
import TabArea from '../TabArea.vue'
import Tab from '../Tab.vue'
import TabView from './TabView.vue'
import { useWindowSize } from '@vueuse/core'

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
    TabView,
  },
  setup(props, _ctx) {
    const split = ref()
    const {width} = useWindowSize()

    onMounted(() => {
      Split({
        columnGutters: [
          {
            track: 1,
            element: split.value,
          },
        ],
        columnMinSizes: { [0]: Math.floor(width.value / 5), [2]: Math.floor(width.value / 5) },
        snapOffset: 0,
      })
    })

    return {
      split,
      notebook,
    }
  },
})
</script>

<template>
  <div class="view-container text-zinc-700 dark:text-zinc-200">
    <TabView :notebook="notebook" :tabState="notebook.view.left" :otherTabState="notebook.view.right" side="left" />
    <TabView :notebook="notebook" :tabState="notebook.view.right" :otherTabState="notebook.view.left" side="right" />
    <div ref="split" class="view-split">
      <div class="view-split-bar h-full"></div>
      <div class="view-split-handle p-1 <sm:opacity-0">↔</div>
    </div>
  </div>
</template>

<style type="text/css">
.view-container {
  display: grid;
  grid-template-columns: 1fr 0px 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;
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
  @apply bg-zinc-400 dark:bg-zinc-700;
}


.view-split-handle {
  cursor: ew-resize;
  position: absolute;
  left: -25px;
  width: 25px;
  top: 4px;
  text-align: center;
  @apply bg-zinc-300 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 rounded-md;
}

.view-split:hover .view-split-handle,
.view-split:active .view-split-handle {
  left: -30px;
  width: 60px;
  @apply bg-zinc-400 text-zinc-700 border-2 border-zinc-300 shadow-md dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-400;
}

.view-split-handle svg {
  width: 10px;
  height: 10px;
  margin: 0;
  padding: 0;
}
</style>
