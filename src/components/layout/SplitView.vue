<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Split from 'split-grid'
import { pages, tabState, rightTabState } from '../../store/pages'
import Nav from '../Nav.vue'
import TabArea from '../TabArea.vue'
import Tab from '../Tab.vue'
import TabView from './TabView.vue'
import DownloadModal from '../DownloadModal.vue'

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
    TabView,
    DownloadModal
},
  setup(props, _ctx) {
    const split = ref()

    onMounted(() => {
      Split({
        columnGutters: [
          {
            track: 1,
            element: split.value,
          },
        ],
        columnMinSizes: { [1]: 0 },
      })
    })

    return {
      split,
      pages,
      tabState,
      rightTabState,
    }
  },
})
</script>

<template>
  <div class="view-container text-zinc-700 dark:text-zinc-200">
    <TabView :pages="pages" :tabState="tabState" :otherTabState="rightTabState" side="left" />
    <TabView :pages="pages" :tabState="rightTabState" :otherTabState="tabState" side="right" />
    <div ref="split" class="view-split">
      <div class="view-split-bar h-full" />
      <div class="view-split-handle p-1">↔</div>
    </div>
  </div>
  <DownloadModal></DownloadModal>
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
  left: -30px;
  width: 25px;
  top: 4px;
  text-align: center;
  @apply bg-zinc-300 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500 rounded-md;
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
