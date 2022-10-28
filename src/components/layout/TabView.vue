<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import Nav from "../Nav.vue";
import TabArea from "../TabArea.vue";
import Tab from "../Tab.vue";
import PageView from "./PageView.vue";
import DisplayMenu from "../DisplayMenu.vue";
import type { PageCollection, TabState } from "./SplitView.vue";

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
    PageView,
    DisplayMenu,
  },
  props: {
    side: {
      type: String as PropType<"left" | "right">,
      required: true,
    },
    pages: {
      type: Object as PropType<PageCollection>,
      required: true,
    },
    tabState: {
      type: Object as PropType<TabState>,
      required: true,
    },
    otherTabState: {
      type: Object as PropType<TabState>,
      required: true,
    },
    showSymmetric: Boolean,
  },
  setup(props, ctx) {
    const handleClick = (id: string) => {
      props.tabState.selected = id;
    };

    const tabs = computed(() => props.tabState.tabs);
    const selected = computed(() => props.tabState.selected);
    const page = computed(() => {
      if (props.tabState.selected) {
        return props.pages[props.tabState.selected];
      } else if (props.otherTabState.selected) {
        return props.pages[props.otherTabState.selected];
      }
    });
    const mode = computed(() => props.tabState.mode);
    const pageKey = computed(() => `${page.value ? page.value.id : '(none)'}-props.tabState.mode`);

    return {
      side: props.side,
      tabs,
      selected,
      mode,
      page,
      pageKey,
      handleClick,
    };
  },
});
</script>

<template>
  <div :class="['header', side]">
    <Nav class="nav">
      <TabArea>
        <Tab v-for="tab in tabs" :selected="tab === selected" @click="() => handleClick(tab)">
          {{ pages[tab].emoji }} {{ pages[tab].title }}
        </Tab>
      </TabArea>
      <Tab :selected="showSymmetric">👁</Tab>
      <DisplayMenu v-if="side === 'right'" />
      <div class="spacer" v-if="side === 'left'"></div>
    </Nav>
  </div>
  <div :class="['overflow-auto', 'content', side]" v-if="page">
    <PageView :key="pageKey" :page="page" :mode="mode" />
  </div>
</template>

<style scoped>
.header {
  grid-row: 1;
}

.content {
  grid-row: 2;
}

.left {
  grid-column: 1;
}

.right {
  grid-column: 3;
}

.spacer {
  width: 26px;
}
</style>