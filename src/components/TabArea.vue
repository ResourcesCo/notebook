<script setup lang="ts">
const { active } = defineProps({ active: Boolean })
</script>

<template>
  <div class="flex flex-grow" :class="active ? '' : 'opacity-30'">
    <slot />
  </div>
</template>
