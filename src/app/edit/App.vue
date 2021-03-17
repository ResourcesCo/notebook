<script lang="ts">
import { defineComponent } from 'vue'
import debounce from 'lodash/debounce'
import Nav from '../../components/Nav.vue'
import TabArea from '../../components/TabArea.vue'
import Tab from '../../components/Tab.vue'
import MarkdownEdit from '../../components/MarkdownEdit.vue'

export default defineComponent({
  components: {
    Nav,
    TabArea,
    Tab,
    MarkdownEdit,
  },
  setup(props, ctx) {
    const handleChange = debounce((value) => {
      parent.postMessage(String(value), window.location.href)
    }, 10, { leading: true })

    return { handleChange }
  }
})
</script>

<template>
  <Nav class="nav">
    <TabArea>
      <Tab :selected="true">🏡 Home</Tab>
      <Tab>🌎 Request</Tab>
    </TabArea>
  </Nav>
  <main class="m-1 flex flex-col flex-grow">
    <MarkdownEdit @change="handleChange" />
  </main>
</template>

<style scoped>
.nav {
  padding-right: 35px;
}
</style>