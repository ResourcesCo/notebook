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
import SecretsModal from './SecretsModal.vue'

defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})
</script>

<template>
  <ExportLocalStorageModal></ExportLocalStorageModal>
  <ImportLocalStorageModal></ImportLocalStorageModal>
  <ClearLocalStorageModal></ClearLocalStorageModal>
  <ApplyContentChangesModal></ApplyContentChangesModal>
  <ApplyViewChangesModal></ApplyViewChangesModal>
  <ApplyContainerChangesModal></ApplyContainerChangesModal>
  <ApplyEnvironmentChangesModal></ApplyEnvironmentChangesModal>
</template>