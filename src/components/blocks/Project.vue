<script lang="ts" setup>
import type { ProjectInfo } from './ProjectInfo'

import { defineProps, PropType } from 'vue'

const {data} = defineProps({
  data: Object as PropType<ProjectInfo>
})
</script>

<template>
  <div v-if="data" v-for="side in ['left', 'right']">
    <h2>
      {{side}}
    </h2>
    <div v-for="page in data[side as 'left' | 'right']">
      {{ page.emoji }}
      {{ page.title }}
      <span v-if="page.role">{{ page.role }}</span>
    </div>
  </div>
</template>

<style>
  span {
    font-size: 70%;
    color: #f7f7f7;
    background-color: #555;
    padding: 3px;
    border-radius: 3px;
  }
</style>