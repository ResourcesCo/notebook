<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref } from "vue";
import Split from "split-grid";
import Nav from "../Nav.vue";
import TabArea from "../TabArea.vue";
import Tab from "../Tab.vue";
import TabView from "./TabView.vue";
import { nanoid } from "nanoid";
import { useStorage } from '@vueuse/core'

export interface Page {
  id: string;
  key: string;
  title: string;
  emoji: string;
  body: string;
  isSettings?: true;
}

export type PageCollection = { [key: string]: Page };

export interface TabState {
  tabs: string[];
  selected: string;
  lastSelected: string | undefined;
  mode: "edit" | "view";
  settingsOn: boolean;
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
  
    const settingsOn = ref(false);

    const ids = [nanoid(7), nanoid(7), nanoid(7), nanoid(7), nanoid(7)];
    const pageBody1: Ref<string> = useStorage('doc-1', '')
    const pageBody2: Ref<string> = useStorage('doc-2', '')
    const pageBody3: Ref<string> = useStorage('doc-3', '')
    const pageBody4: Ref<string> = useStorage('doc-4', '')
    const pageBody5: Ref<string> = useStorage('doc-5', '')
    const page1 = reactive({
      id: ids[0],
      key: "doc-1",
      title: "Untitled 1",
      emoji: "📝",
      body: pageBody1,
    })
    const page2 = reactive({
      id: ids[1],
      key: "doc-2",
      title: "Untitled 2",
      emoji: "📝",
      body: pageBody2,
    })
    const page3 = reactive({
      id: ids[2],
      key: "doc-3",
      title: "Untitled 3",
      emoji: "📝",
      body: pageBody3,
    })
    const page4 = reactive({
      id: ids[3],
      key: "doc-4",
      title: "Untitled 4",
      emoji: "📝",
      body: pageBody4,
    })
    const page5 = reactive({
      id: ids[4],
      key: "doc-5",
      title: "Settings",
      emoji: "⚙️",
      body: pageBody5,
      isSettings: true,
    })
    const pages = reactive<PageCollection>({
      [ids[0]]: page1,
      [ids[1]]: page2,
      [ids[2]]: page3,
      [ids[3]]: page4,
      [ids[4]]: page5,
    });

    const tabs = [...Object.keys(pages).slice(0, 2), Object.keys(pages)[4]];
    const tabState = reactive<TabState>({
      tabs,
      selected: tabs[0],
      lastSelected: undefined,
      mode: 'edit',
      settingsOn: false,
    });

    const rightTabs = Object.keys(pages).slice(2, 4);
    const rightTabState = reactive<TabState>({
      tabs: rightTabs,
      selected: rightTabs[0],
      lastSelected: undefined,
      mode: 'view',
      settingsOn: false,
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
      settingsOn,
    };
  },
});
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
