<script lang="ts" setup>
import {computed, ref, onMounted, PropType} from 'vue'
import {action as settingsAction} from '../../store/settings'
import Modal from '../layout/Modal.vue'
import Button from '../form/Button.vue'
import { Notebook } from '@/store/notebook'
import { isPlainObject } from 'lodash'
import SecretsModalForm from './SecretsModalForm.vue'


const props = defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})

function dismiss() {
  settingsAction.value = undefined
}

const action = computed(() => settingsAction.value?.action === 'openSecrets' ? settingsAction.value : undefined)
</script>

<template>
  <Modal v-if="action !== undefined" title="View/Edit Secrets" @close="dismiss">
    <SecretsModalForm :notebook="notebook" />
  </Modal>
</template>