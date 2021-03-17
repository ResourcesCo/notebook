<script lang="ts">
import { defineComponent, ref } from 'vue'
import Nav from '../../components/Nav.vue'
import TabArea from '../../components/TabArea.vue'
import Tab from '../../components/Tab.vue'
import DisplayMenu from '../../components/DisplayMenu.vue'
import MarkdownView from '../../components/MarkdownView.vue'

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
    DisplayMenu,
    MarkdownView,
  },
  setup(props, ctx) {
    const value = ref('')

    window.addEventListener('message', e => {
      if (e.isTrusted && e.source === parent) {
        value.value = e.data
      }
    })

    return { value }
  }
})
</script>

<template>
  <div class="text-gray-700 dark:text-gray-200 flex flex-col h-full">
    <Nav>
      <TabArea>
        <Tab :selected="true">👁 Preview</Tab>
      </TabArea>
      <DisplayMenu />
    </Nav>
    <main class="m-1">
      <MarkdownView :value="value" />
    </main>
  </div>
</template>