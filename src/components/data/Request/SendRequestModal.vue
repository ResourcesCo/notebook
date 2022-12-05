<script lang="ts" setup>
import {computed, defineProps, PropType} from 'vue'
import { RequestModel } from '.'
import {action as settingsAction} from '../../../store/settings'
import Modal from '../../layout/Modal.vue'
import Button from '../../form/Button.vue'
import RequestDispatcher from './RequestDispatcher'

const props = defineProps({
  data: Object as PropType<RequestModel>,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const status = computed<{messages: string[], deletes: string[]}>(() => {
  return {messages: [], deletes: []}
})

const requestDispatcher = new RequestDispatcher()

async function send() {
  if (props.data !== undefined) {
    await requestDispatcher.send(props.data)
  }
  emit('close')
}
</script>

<template>
  <Modal title="Confirm Request" @close="emit('close')">
    <div class="flex flex-col text-sm">
      <div v-for="message of status.messages">
        {{message}}
      </div>
      <div v-if="status.messages.length === 0">
        <div class="flex flex-col" v-if="status.deletes.length > 0">
          <div>Delete these files?</div>
          <div v-for="del of status.deletes" class="pl-5">
            {{del}}
          </div>
        </div>
        <div v-else>
          Send?
        </div>
      </div>
    </div>
    <div class="pt-5 text-center">
      <Button :disabled="status.messages.length !== 0" @click="send">Send</Button>
      <Button @click="emit('close')" class="ml-2">Cancel</Button>
    </div>
  </Modal>
</template>