<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
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
  props: ['frames'],
  setup(props, ctx) {
    const codeFrame = ref()
    onMounted(() => {
      props.frames.code = codeFrame.value
    })
    return { codeFrame, colorScheme: colorScheme.value }
  }
})
</script>

<template>
  <div class="header">
    <Nav class="nav">
      <TabArea>
        <Tab :selected="true">🏡 Home</Tab>
        <Tab>🌎 Request</Tab>
      </TabArea>
    </Nav>
  </div>
  <div class="overflow-auto content">
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
  grid-column: 1;
  grid-row: 1;
}
.content {
  grid-column: 1;
  grid-row: 2;
}
</style>