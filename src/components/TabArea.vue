<script setup lang="ts">
const { active } = defineProps({ active: Boolean })
</script>

<template>
  <div class="root pr-1" :class="active ? '' : 'inactive'">
    <slot></slot>
  </div>
</template>

<style scoped>
  div.root.inactive {
    @apply opacity-30;
  }

  div.root.inactive:hover {
    @apply opacity-100;
  }

  div.root {
    flex-grow: 1;
    display: flex;
    overflow-x: auto;
  }
</style>
