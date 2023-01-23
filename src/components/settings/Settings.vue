<script lang="ts" setup>
import ExportLocalStorageModal from './ExportLocalStorageModal.vue'
import ImportLocalStorageModal from './ImportLocalStorageModal.vue'
import ClearLocalStorageModal from './ClearLocalStorageModal.vue'
import ApplyContentChangesModal from './ApplyContentChangesModal.vue'
import ApplyViewChangesModal from './ApplyViewChangesModal.vue'
import ApplyContainerChangesModal from './ApplyContainerChangesModal.vue'
import ApplyEnvironmentChangesModal from './ApplyEnvironmentChangesModal.vue'
import { PropType } from 'vue'
import { Notebook } from '@/store/notebook'

defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})
</script>

<template>
  <ExportLocalStorageModal :notebook="notebook"></ExportLocalStorageModal>
  <ImportLocalStorageModal :notebook="notebook"></ImportLocalStorageModal>
  <ClearLocalStorageModal :notebook="notebook"></ClearLocalStorageModal>
  <ApplyContentChangesModal :notebook="notebook"></ApplyContentChangesModal>
  <ApplyViewChangesModal :notebook="notebook"></ApplyViewChangesModal>
  <ApplyContainerChangesModal :notebook="notebook"></ApplyContainerChangesModal>
  <ApplyEnvironmentChangesModal :notebook="notebook"></ApplyEnvironmentChangesModal>
</template>