<script lang="ts" setup>
import Notebook from '../components/Notebook.vue'
import { notebook } from '../store/notebook'
</script>

<template>
  <Notebook :notebook="notebook" />
</template>
