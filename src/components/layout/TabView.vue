<script lang="ts">
import { defineComponent, computed, toRef, reactive, PropType } from "vue"
import Nav from "../Nav.vue"
import TabArea from "../TabArea.vue"
import Tab from "../Tab.vue"
import PageView from "./PageView.vue"
import DisplayButton from "../DisplayButton.vue"
import type { Notebook, TabState } from "../../store/notebook"
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
    notebook: {
      type: Object as PropType<Notebook>,
      required: true,
    },
    side: {
      type: String as PropType<"left" | "right">,
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
      props.tabState.show = 'self'
      props.tabState.selected = id
    }
    const toggleMode = () => {
      if (props.tabState.show === 'self') {
        props.otherTabState.show = props.otherTabState.show === 'self' ? 'other' : 'self'
      } else {
        props.tabState.show = 'self'
      }
    }

    const toggleSettings = () => {
      const i = props.otherTabState.tabs.findIndex(s => s === "_settings.md")
      if (i === -1) {
        props.otherTabState.tabs.unshift("_settings.md")
        props.tabState.show = "other"
        props.otherTabState.lastSelected = props.otherTabState.selected
        props.otherTabState.selected = "_settings.md"
      } else {
        props.otherTabState.tabs.splice(i, 1)
        if (props.otherTabState.selected === "_settings.md") {
          if (props.otherTabState.lastSelected !== null && props.otherTabState.lastSelected !== "_settings.md") {
            props.otherTabState.selected = props.otherTabState.lastSelected
            props.otherTabState.lastSelected = null
          } else if (props.otherTabState.tabs.length > 0) {
            props.otherTabState.selected = props.otherTabState.tabs[0]
          }
        }
      }
    }

    const tabs = computed(() => {
      return props.tabState.tabs
    })
    const selected = toRef(props.tabState, 'selected')
    const filename = computed(() => (
      props.tabState.show === 'self' ? props.tabState.selected : props.otherTabState.selected
    ))
    const mode = computed(() => props.tabState.show === 'self' ? 'edit' : 'view')
    const pageKey = computed(() => `${filename.value}---${mode.value}`)
    const page = computed(() => {
      const isSettings = filename.value === '_settings.md'
      const body = (
        (typeof filename.value === 'string' && filename.value in props.notebook.fileData) ?
        toRef(props.notebook.fileData, filename.value) :
        null
      )
      if (body) {
        return reactive({
          body,
          isSettings,
        })
      }
    })

    return {
      files: props.notebook.content.files,
      side: props.side,
      tabs,
      selected,
      filename,
      mode,
      pageKey,
      page,
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
          {{ files[tab].emoji }} {{ files[tab].title }}
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