<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive } from "vue";
import Split from "split-grid";
import Nav from "../Nav.vue";
import TabArea from "../TabArea.vue";
import Tab from "../Tab.vue";
import TabView from "./TabView.vue";
import { colorScheme } from "../../modules/store";
import { nanoid } from "nanoid";

export interface FrameGroup {
  code: HTMLIFrameElement | undefined;
  view: HTMLIFrameElement | undefined;
}

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
  selected: string | undefined;
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
        key: "edit",
        title: "Edit",
        emoji: "📝",
        body: sessionStorage.getItem("doc") || "",
      },
    });

    watch(pages[ids[0]], () => {
      sessionStorage.setItem("doc", pages[ids[0]].body);
    });

    const tabs = Object.keys(pages);
    const selected = tabs[0];
    const tabState = reactive<TabState>({
      tabs,
      selected,
      mode: "edit",
    });

    const rightTabs: string[] = [];
    const rightTabState = reactive<TabState>({
      tabs: rightTabs,
      selected: undefined,
      mode: "view",
    });

    const frames = reactive<FrameGroup>({
      code: undefined,
      view: undefined,
    });

    const handleMessage = (e: MessageEvent) => {
      if (frames.code) {
        if (
          e.isTrusted &&
          e.source === frames.code.contentWindow &&
          Array.isArray(e.data) &&
          e.data.length === 2 &&
          e.data[0] === "md"
        ) {
          pages[tabState.selected].body = e.data[1];
        }
      }
    };

    onMounted(() => {
      Split({
        columnGutters: [
          {
            track: 1,
            element: split.value,
          },
        ],
        columnMinSizes: 0,
      });
      window.addEventListener("message", handleMessage);
    });

    watch(colorScheme, () => {
      for (const frame of Object.values(frames)) {
        if (frame) {
          frame.contentWindow?.postMessage!(
            ["color-scheme", colorScheme.value],
            "*"
          );
        }
      }
    });

    return {
      frames,
      split,
      colorScheme,
      pages,
      tabState,
      rightTabState,
    };
  },
});
</script>

<template>
  <div class="view-container text-gray-700 dark:text-gray-200">
    <TabView
      :frames="frames"
      :pages="pages"
      :tabState="tabState"
      :otherTabState="rightTabState"
      :showSymmetric="false"
      side="left"
    />
    <TabView
      :frames="frames"
      :pages="pages"
      :tabState="rightTabState"
      :otherTabState="tabState"
      :showSymmetric="true"
      side="right"
    />
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
