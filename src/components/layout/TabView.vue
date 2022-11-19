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
        props.otherTabState.tabs.push("_settings.md")
        props.otherTabState.selected = "_settings.md"
        props.otherTabState.show = "self"
        props.tabState.show = "other"
        props.otherTabState.lastSelected = props.otherTabState.selected
      } else if (
        props.otherTabState.selected === '_settings.md' &&
        props.otherTabState.show === 'self' &&
        props.tabState.show === 'other'
      ) {
        props.otherTabState.tabs.splice(i, 1)
        if (props.otherTabState.lastSelected !== null && props.otherTabState.tabs.includes(props.otherTabState.lastSelected)) {
          props.otherTabState.selected = props.otherTabState.lastSelected
        } else if (props.otherTabState.tabs.length > 0) {
          props.otherTabState.selected = props.otherTabState.tabs[0]
        }
        props.otherTabState.show = 'self'
        props.tabState.show = 'other'
        props.otherTabState.lastSelected = null
      } else {
        props.otherTabState.selected = '_settings.md'
        props.otherTabState.show = 'self'
        props.tabState.show = 'other'
      }
    }

    const filename = computed(() => (
      props.tabState.show === 'self' ? props.tabState.selected : props.otherTabState.selected
    ))
    const mode = computed(() => props.tabState.show === 'self' ? 'edit' : 'view')
    const pageKey = computed(() => `${filename.value}---${mode.value}`)
    const page = computed(() => {
      const isSettings = filename.value === '_settings.md'
      const body = (
        (typeof filename.value === 'string') ?
        props.notebook.getFile(filename.value) :
        null
      )
      if (body) {
        return {
          body,
          isSettings,
        }
      }
    })

    return {
      notebook: props.notebook,
      tabState: props.tabState,
      side: props.side,
      filename,
      mode,
      pageKey,
      page,
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
        <Tab
          v-for="tab in tabState.tabs"
          :selected="tab === tabState.selected"
          @click="() => { tabState.selected = tab; tabState.show = 'self'; }"
        >
          {{ notebook.content.files[tab].emoji }} {{ notebook.content.files[tab].title }}
        </Tab>
      </TabArea>
      <Tab
        class="right"
        :selected="tabState.show === 'other' || otherTabState.show === 'other'"
        @click="() => toggleMode()"
      ><span v-if="tabState.show === 'other'">Preview </span>👁</Tab>
      <TabViewButton v-if="side === 'right'" @click="() => toggleSettings()">⚙️</TabViewButton>
      <DisplayButton v-if="side === 'right'" />
      <div class="spacer" v-if="side === 'left'"></div>
    </Nav>
  </div>
  <div :class="['overflow-auto', 'content', 'relative', side]" v-if="page">
    <PageView :notebook="notebook" :key="pageKey" :page="page" :mode="mode" />
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