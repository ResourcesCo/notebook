<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const name = ref('')

const router = useRouter()
const go = () => {
  if (name.value)
    router.replace(`/app/hi/${encodeURIComponent(name.value)}`)
}

const { t } = useI18n()
</script>

<template>
  <Nav class="nav">
    <TabArea>
      <Tab :selected="true">🏡 Home</Tab>
      <Tab>🌎 Request</Tab>
    </TabArea>
  </Nav>
  <main class="m-1 flex flex-col flex-grow">
    <MarkdownEdit />
  </main>
</template>

<style scoped>
.nav {
  padding-right: 35px;
}
</style>