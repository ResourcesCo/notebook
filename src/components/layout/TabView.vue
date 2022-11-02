<script lang="ts">
import { defineComponent, computed, toRef, PropType } from "vue";
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
    }
  },
  setup(props, ctx) {
    const setSelected = (id: string) => {
      props.tabState.mode = 'edit'
      props.tabState.selected = id
    };
    const toggleMode = () => {
      if (props.tabState.mode === 'edit') {
        props.otherTabState.mode = 'edit'
      }
      props.tabState.mode = props.tabState.mode === 'edit' ? 'view' : 'edit'
    }

    const tabs = toRef(props.tabState, 'tabs');
    const selected = toRef(props.tabState, 'selected');
    const page =
      computed(() => props.tabState.mode === 'edit' ? props.pages[props.tabState.selected] :
        props.pages[props.otherTabState.selected])
    const mode = toRef(props.tabState, 'mode');
    const pageKey = computed(() => `${page.value.id}---${props.tabState.mode}`);

    return {
      side: props.side,
      tabs,
      selected,
      mode,
      page,
      pageKey,
      setSelected,
      toggleMode,
    };
  },
});
</script>

<template>
  <div :class="['header', side]">
    <Nav class="nav">
      <TabArea :active="mode === 'edit'">
        <Tab v-for="tab in tabs" :selected="tab === selected" @click="() => { setSelected(tab) }">
          {{ pages[tab].emoji }} {{ pages[tab].title }}
        </Tab>
      </TabArea>
      <Tab :selected="mode === 'view'" @click="() => toggleMode()"><span v-if="mode === 'view'">Preview </span>👁</Tab>
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