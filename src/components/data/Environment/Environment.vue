<script lang="ts" setup>
import { computed, ref, PropType } from 'vue'
import { validate } from './data'
import SettingsClient from '@/store/SettingsClient'
import Button from '@/components/form/Button.vue'

const props = defineProps({
  data: {
    required: true
  },
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  },
})

const showSecrets = ref(false)

const result = computed(() => validate(props.data))

function toArray(input: string | string[] | undefined) {
  return Array.isArray(input) ? input : (input !== undefined ? [input] : [])
}
</script>

<template>
  <template v-if="'errors' in result">
    <ul class="m-2">
      <li class="list-disc ml-9 text-red-500" v-for="error in result.errors">
        {{error.instancePath}}
        {{error.message}}
      </li>
    </ul>
  </template>
  <div class="mx-5 my-7" v-if="'data' in result">
    <div v-if="Object.keys(result.data).length === 0">No environment variables defined.</div>
    <div class="my-2" v-for="value, name in result.data">
      <span class="py-1">{{name}}</span>
      <span class="value" v-if="typeof value === 'string'">{{value}}</span>
      <span class="value" v-if="typeof value !== 'string'">********</span>
    </div>
    <div class="pt-3">
      <Button @click="() => settings.applyEnvironmentChanges(data)">Apply</Button>
      <Button @click="() => settings.resetEnvironmentChanges()">Reset</Button>
      <Button @click="() => settings.openSecrets()">View/Edit Secrets</Button>
    </div>
  </div>
</template>

<style scoped>
  span {
    background-color: #555;
    padding: 3px;
    border-radius: 3px;
    @apply px-2 focus:outline-gray-800 mx-1 slate-800 bg-slate-200 dark:slate-50 dark:bg-slate-800;
  }

  span.value {
    @apply text-xs;
  }

  span.tag {
    @apply text-xs bg-teal-200 dark:bg-slate-600;
  }
</style>