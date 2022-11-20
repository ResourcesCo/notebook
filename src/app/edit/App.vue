<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import debounce from 'lodash/debounce'
import MarkdownEdit from '../../components/MarkdownEdit.vue'
import { useEventListener } from '@vueuse/core';

const page = reactive({body: '', counter: 0})

const handleChange = debounce((value) => {
  parent.postMessage(['md', String(value)], '*')
}, 10, { leading: true })

useEventListener('message', e => {
  if (e.isTrusted && e.source === parent && Array.isArray(e.data) && e.data.length === 2 && e.data[0] === 'md') {
    page.body = e.data[1]
    page.counter += 1 // This is how resetting works
  }
})
</script>

<template>
  <main class="p-1 flex flex-col flex-grow">
    <MarkdownEdit :page="page" @change="handleChange" />
  </main>
</template>

<style scoped>
.nav {
  padding-right: 35px;
}
</style>