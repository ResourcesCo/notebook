<script lang="ts">
import { defineComponent, computed, toRef, PropType } from "vue"
import Nav from "../Nav.vue"
import TabArea from "../TabArea.vue"
import Tab from "../Tab.vue"
import PageView from "./PageView.vue"
import DisplayButton from "../DisplayButton.vue"
import type { PageCollection, TabState } from "../../store/notebook"
import TabViewButton from "../TabViewButton.vue"

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
    PageView,
    DisplayButton,
    TabViewButton
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
  },
  setup(props, ctx) {
    const setSelected = (id: string) => {
      props.tabState.mode = 'edit'
      props.tabState.selected = id
    }
    const toggleMode = () => {
      if (props.tabState.mode === 'edit') {
        props.otherTabState.mode = props.otherTabState.mode === 'edit' ? 'view' : 'edit'
      } else {
        props.tabState.mode = 'edit'
      }
    }

    const toggleSettings = () => {
      props.tabState.settingsOn = !props.tabState.settingsOn
      props.otherTabState.settingsOn = !props.otherTabState.settingsOn
      const settingsTab = props.otherTabState.tabs.find(t => {
        const page = props.pages[t]
        if (page) {
          if (page.isSettings) {
            return true
          }
        }
      })
      if (settingsTab) {
        if (props.otherTabState.settingsOn) {
          props.otherTabState.lastSelected = props.otherTabState.selected
          props.otherTabState.selected = settingsTab
          props.otherTabState.mode = 'edit'
          props.tabState.mode = 'view'
        } else if (props.otherTabState.lastSelected !== undefined) {
          props.otherTabState.selected = props.otherTabState.lastSelected
        }
      }
    }

    const tabs = computed(() => {
      if (props.tabState.settingsOn) {
        return props.tabState.tabs
      } else {
        return props.tabState.tabs.filter(t => {
          const page = props.pages[t]
          if (page) {
            return !page.isSettings
          } else {
            return true
          }
        })
      }
    })
    const selected = toRef(props.tabState, 'selected')
    const page =
      computed(() => props.tabState.mode === 'edit' ? props.pages[props.tabState.selected] :
        props.pages[props.otherTabState.selected])
    const mode = toRef(props.tabState, 'mode')
    const pageKey = computed(() => `${page.value.id}---${props.tabState.mode}`)

    return {
      side: props.side,
      tabs,
      selected,
      mode,
      page,
      pageKey,
      setSelected,
      toggleMode,
      toggleSettings,
    }
  },
})
</script>

<template>
  <div :class="['header', side]">
    <Nav class="nav">
      <TabArea :active="mode === 'edit'">
        <Tab v-for="tab in tabs" :selected="tab === selected" @click="() => { setSelected(tab) }">
          {{ pages[tab].emoji }} {{ pages[tab].title }}
        </Tab>
      </TabArea>
      <Tab class="right" :selected="mode === 'view'" @click="() => toggleMode()"><span v-if="mode === 'view'">Preview </span>👁</Tab>
      <TabViewButton v-if="side === 'right'" @click="() => toggleSettings()">⚙️</TabViewButton>
      <DisplayButton v-if="side === 'right'" />
      <div class="spacer" v-if="side === 'left'"></div>
    </Nav>
  </div>
  <div :class="['overflow-auto', 'content', 'relative', side]" v-if="page">
    <PageView :key="pageKey" :page="page" :mode="mode" />
  </div>
</template>

<style scoped>
.header {
  grid-row: 1;
  overflow-x: auto;
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
  width: 30px;
}
</style>