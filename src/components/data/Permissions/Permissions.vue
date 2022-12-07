<script lang="ts" setup>
import { computed, PropType } from 'vue'
import type { PermissionSpec } from './data'
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
    <div v-if="result.data.permissions.length === 0">No permissions defined.</div>
    <div v-for="permission in result.data.permissions">
      <span class="py-1">Permission</span>
      <div class="pl-2 py-1">
        <span class="py-1">grantee</span>
        <div class="pl-2 py-1">
          <div>
            <span>file</span>
            <span class="value">{{permission.grantee.file}}</span>
          </div>
        </div>
        <span class="py-1">request</span>
        <div class="pl-2 py-1">
          <div class="py-1" v-for="request in permission.requests">
            <div class="py-1" v-for="urlPattern in request.urlPatterns">
              <span>urlPattern</span>
              <span class="value">{{urlPattern}}</span>
            </div>
            <div class="py-1" v-for="env in toArray(request.authorizationEnv)">
              <span>authorizationEnv</span>
              <span class="value">{{env}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-3">
      <Button @click="() => settings.applyViewChanges(data)">Apply</Button>
      <Button @click="() => settings.resetViewChanges()">Reset</Button>
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