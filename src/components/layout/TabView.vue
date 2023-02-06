<script lang="ts" setup>
import { defineComponent, computed, toRef, reactive, PropType } from "vue"
import TabArea from "../TabArea.vue"
import Tab from "../Tab.vue"
import PageView from "./PageView.vue"
import DisplayButton from "../DisplayButton.vue"
import type { FileData, Notebook, TabState } from "@/store/notebook"
import TabViewButton from "../TabViewButton.vue"
import { Container } from "../data/Containers/data"
import { pathToRegexp } from 'path-to-regexp'

const props = defineProps({
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
})

const toggleMode = () => {
  if (props.tabState.show === 'self') {
    props.otherTabState.show = props.otherTabState.show === 'self' ? 'other' : 'self'
  } else {
    props.tabState.show = 'self'
  }
}

const toggleSettings = () => {
  const i = props.tabState.tabs.findIndex(s => s === "_settings.md")
  if (i === -1) {
    props.tabState.tabs.push("_settings.md")
    props.tabState.selected = "_settings.md"
    props.tabState.show = "self"
    props.otherTabState.show = "other"
    props.tabState.lastSelected = props.tabState.selected
  } else if (
    props.tabState.selected === '_settings.md' &&
    props.tabState.show === 'self' &&
    props.otherTabState.show === 'other'
  ) {
    props.tabState.tabs.splice(i, 1)
    if (props.tabState.lastSelected !== null && props.tabState.tabs.includes(props.tabState.lastSelected)) {
      props.tabState.selected = props.tabState.lastSelected
    } else if (props.tabState.tabs.length > 0) {
      props.tabState.selected = props.tabState.tabs[0]
    }
    props.tabState.show = 'other'
    props.otherTabState.show = 'self'
    props.tabState.lastSelected = null
  } else {
    props.tabState.selected = '_settings.md'
    props.tabState.show = 'self'
    props.otherTabState.show = 'other'
  }
}

const filename = computed(() => (
  props.tabState.show === 'self' ? props.tabState.selected : props.otherTabState.selected
))
const primaryComponent = computed(() => (
  props.notebook.content.files[
    props[props.tabState.show === 'other' ? 'otherTabState' : 'tabState'].selected || ''
  ]?.primaryComponent === 'edit' ? 'edit' : 'view'
))
const mode = computed<'view' | 'edit'>(() => (
  props.tabState.show === 'self' ?
    (primaryComponent.value === 'view' ? 'view' : 'edit') :
    (primaryComponent.value === 'view' ? 'edit' : 'view')
))
const page = computed(() => {
  const isSettings = filename.value === '_settings.md'
  return {isSettings}
})
const file = computed<FileData | undefined>(() => {
  if (filename.value) {
    return props.notebook.getFile(filename.value)
  }
  return undefined
})
const container = computed<Container>(() => {
  let result = {pages: ['*'], content: {}}
  const path = filename.value
  if (path !== null) {
    for (const container of Object.values(props.notebook.containers.value.containers)) {
      const pages = Array.isArray(container.pages) ? container.pages : [container.pages]
      for (const page of pages) {
        if (pathToRegexp(page).test(path)) {
          return container
        }
      }
    }
  }
  return result
})
const pageKey = computed(() => `${filename.value}---${mode.value}---${JSON.stringify(container.value)}`)
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
    <PageView
      v-if="file !== undefined"
      :key="pageKey"
      :notebook="notebook"
      :page="page"
      :file="file"
      :mode="mode"
      :container="container"
    />
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