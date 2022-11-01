<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from "vue";
import Split from "split-grid";
import Nav from "../Nav.vue";
import TabArea from "../TabArea.vue";
import Tab from "../Tab.vue";
import TabView from "./TabView.vue";
import { nanoid } from "nanoid";

export interface Page {
  id: string;
  key: string;
  title: string;
  emoji: string;
  body: string;
}

export type PageCollection = { [key: string]: Page };

export interface TabState {
  tabs: string[];
  selected: string;
  mode: "edit" | "view";
}

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
    TabView,
  },
  setup(props, _ctx) {
    const split = ref();

    const ids = [nanoid(7), nanoid(7), nanoid(7)];
    const pages = reactive<PageCollection>({
      [ids[0]]: {
        id: ids[0],
        key: "doc-1",
        title: "Untitled 1",
        emoji: "📝",
        body: "",
      },
      [ids[1]]: {
        id: ids[1],
        key: "doc-2",
        title: "Untitled 2",
        emoji: "📝",
        body: "",
      },
      [ids[2]]: {
        id: ids[1],
        key: "doc-3",
        title: "Untitled 3",
        emoji: "📝",
        body: "",
      },
    });

    const tabs = Object.keys(pages).slice(0, 2);
    const tabState = reactive<TabState>({
      tabs,
      selected: tabs[0],
      mode: 'edit'
    });

    const rightTabs = Object.keys(pages).slice(2);
    const rightTabState = reactive<TabState>({
      tabs: rightTabs,
      selected: rightTabs[0],
      mode: 'view'
    });

    onMounted(() => {
      Split({
        columnGutters: [
          {
            track: 1,
            element: split.value,
          },
        ],
        columnMinSizes: { [1]: 0 },
      });
    });

    return {
      split,
      pages,
      tabState,
      rightTabState,
    };
  },
});
</script>

<template>
  <div class="view-container text-gray-700 dark:text-gray-200">
    <TabView :pages="pages" :tabState="tabState" :otherTabState="rightTabState" side="left" />
    <TabView :pages="pages" :tabState="rightTabState" :otherTabState="tabState" side="right" />
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
  @apply bg-gray-200 dark: bg-gray-700;
}


.view-split-handle {
  cursor: ew-resize;
  position: absolute;
  left: -30px;
  width: 25px;
  top: 4px;
  text-align: center;
  @apply bg-gray-100 text-gray-400 dark: bg-gray-700 dark:text-gray-500 rounded-md;
}

.view-split:hover .view-split-handle,
.view-split:active .view-split-handle {
  left: -30px;
  width: 60px;
  @apply bg-gray-200 text-gray-500 border-2 border-gray-300 shadow-md dark: bg-gray-700 dark:text-gray-300 dark:border-gray-400;
}

.view-split-handle svg {
  width: 10px;
  height: 10px;
  margin: 0;
  padding: 0;
}
</style>
