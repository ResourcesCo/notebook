<script lang="ts" setup>
import Notebook from '../components/Notebook.vue'
import { useNotebook } from '../store/notebook'

const notebook = useNotebook()
</script>

<template>
  <Notebook :notebook="notebook" />
</template>
