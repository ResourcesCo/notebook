<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { validate } from './data'
import SettingsClient from '@/store/SettingsClient'
import Button from '@/components/form/Button.vue'
import ContentArea from './ContentArea.vue'

const props = defineProps({
  data: {
    required: true
  },
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  },
})

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
    <div v-if="Object.keys(result.data.containers).length === 0">No containers defined.</div>
    <div v-for="container, name in result.data.containers">
      <span class="py-1">{{name}}</span>
      <span class="tag">container</span>
      <div class="pl-2 py-1">
        <ContentArea
          v-for="[contentAreaKey, contentArea] in Object.entries(container.content)"
          :contentAreaKey="contentAreaKey"
          :contentArea="contentArea"
        />
      </div>
    </div>
    <div class="pt-3">
      <Button @click="() => settings.applyContainerChanges(data)">Apply</Button>
      <Button @click="() => settings.resetContainerChanges()">Reset</Button>
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