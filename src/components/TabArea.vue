<script setup lang="ts">
const { active } = defineProps({ active: Boolean })
</script>

<template>
  <div class="root mr-1" :class="active ? '' : 'inactive'">
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
    scrollbar-width: 3px;
  }

  div.root::-webkit-scrollbar {
    display: none;
  }
</style>
