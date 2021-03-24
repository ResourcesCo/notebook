<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { colorScheme } from '../../modules/store'
import Nav from '../Nav.vue'
import TabArea from '../TabArea.vue'
import Tab from '../Tab.vue'

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
  },
  props: {
    frames: Object,
    side: String,
    pages: Object,
    tabState: Object,
    mode: String,
    showSymmetric: Boolean,
  },
  setup(props, ctx) {
    const codeFrame = ref()
    onMounted(() => {
      if (props.frames) {
        props.frames.code = codeFrame.value
      }
    })

    const handleClick = (id) => {
      props.tabState.selected = id
    }

    const tabs = computed(() => props.tabState.tabs)
    const selected = computed(() => props.tabState.selected)

    return {
      codeFrame,
      colorScheme: colorScheme.value,
      side: props.side,
      tabs,
      selected,
      handleClick,
    }
  }
})
</script>

<template>
  <div class="header">
    <Nav class="nav">
      <TabArea>
        <Tab
          v-for="tab in tabs"
          :selected="tab === selected"
          @click="() => handleClick(tab)"
        >{{ pages[tab].emoji }} {{ pages[tab].title }}</Tab>
      </TabArea>
    </Nav>
  </div>
  <div :class="['overflow-auto', 'content', side]">
    <iframe
      ref="codeFrame"
      class="h-full w-full"
      :src="'/app/edit/?color-scheme=' + colorScheme"
      sandbox="allow-scripts allow-popups allow-downloads"
    ></iframe>
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
</style>