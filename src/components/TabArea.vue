<script setup lang="ts">
const { active } = defineProps({ active: Boolean })
</script>

<template>
  <div class="flex flex-grow root" :class="active ? '' : 'inactive'">
    <slot />
  </div>
</template>

<style>
  div.root.inactive {
    @apply opacity-30;
  }

  div.root.inactive:hover {
    @apply opacity-100;
  }
</style>
