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
    const primaryComponent = computed(() => (
      props.notebook.content.files[
        props[props.tabState.show === 'other' ? 'otherTabState' : 'tabState'].selected || ''
      ]?.primaryComponent
    ))
    const mode = computed<'view' | 'edit'>(() => (
      props.tabState.show === 'self' ?
        (primaryComponent.value === 'view' ? 'view' : 'edit') :
        (primaryComponent.value === 'view' ? 'edit' : 'view')
    ))
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
      primaryComponent,
    }
  },
})
</script>

<template>
  <div class="flex py-1 border-collapse" :class="['header', side]">
    <TabArea :active="mode === (primaryComponent === 'view' ? 'view' : 'edit')">
      <Tab v-for="tab in tabState.tabs" :selected="tab === tabState.selected"
        @click="() => { tabState.selected = tab; tabState.show = 'self' }">
        {{ notebook.content.files[tab].emoji }} {{ notebook.content.files[tab].title }}
      </Tab>
    </TabArea>
    <Tab class="right flex-shrink-0 utility" :selected="tabState.show === 'other' || otherTabState.show === 'other'"
      @click="() => toggleMode()"><span class="<sm:hidden" v-if="tabState.show === 'other'">{{ primaryComponent ===
          'view' ? 'Edit ' : 'Preview '
      }} </span>{{
    primaryComponent === 'view' ? '📝' : '👁'
}}
    </Tab>
    <TabViewButton class="flex-shrink-0" v-if="side === 'right'" @click="() => toggleSettings()">⚙️</TabViewButton>
    <DisplayButton class="flex-shrink-0" v-if="side === 'right'" />
    <div class="spacer <sm:hidden" v-if="side === 'left'"></div>
  </div>
  <div :class="['overflow-auto', 'content', 'relative', side]" v-if="page">
    <PageView :notebook="notebook" :key="pageKey" :page="page" :mode="mode" />
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
  min-width: 0;
}

.right {
  grid-column: 3;
  min-width: 0;
}

.spacer {
  width: 25px;
}
</style>