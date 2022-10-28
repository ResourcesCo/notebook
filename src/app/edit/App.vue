<script lang="ts">
import { defineComponent, reactive } from 'vue'
import debounce from 'lodash/debounce'
import MarkdownEdit from '../../components/MarkdownEdit.vue'

export default defineComponent({
  components: {
    MarkdownEdit,
  },
  setup(props, ctx) {
    const iSetup = Math.random()
    console.log('MarkdownEdit setup', iSetup)
    const page = reactive({
      body: undefined,
    })
    const handleChange = debounce((value) => {
      parent.postMessage(['md', String(value)], '*')
    }, 10, { leading: true })

    window.addEventListener('message', e => {
      console.log('MarkdownEdit setup message', iSetup)
      if (e.isTrusted && e.source === parent && Array.isArray(e.data) && e.data.length === 2 && e.data[0] === 'md') {
        page.body = e.data[1]
      }
    })

    return { page, handleChange }
  }
})
</script>

<template>
  <main class="p-1 flex flex-col flex-grow">
    <MarkdownEdit :page="page" @change="handleChange" v-if="typeof page.body == 'string'" />
  </main>
</template>

<style scoped>
.nav {
  padding-right: 35px;
}
</style>