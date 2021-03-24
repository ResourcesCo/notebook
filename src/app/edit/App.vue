<script lang="ts">
import { defineComponent } from 'vue'
import debounce from 'lodash/debounce'
import MarkdownEdit from '../../components/MarkdownEdit.vue'

export default defineComponent({
  components: {
    MarkdownEdit,
  },
  setup(props, ctx) {
    const handleChange = debounce((value) => {
      parent.postMessage(['md', String(value)], '*')
    }, 10, { leading: true })

    return { handleChange }
  }
})
</script>

<template>
  <main class="p-1 flex flex-col flex-grow">
    <MarkdownEdit @change="handleChange" />
  </main>
</template>

<style scoped>
.nav {
  padding-right: 35px;
}
</style>