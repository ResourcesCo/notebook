import { ref } from 'vue'

export * from './colorMode'

export const download = ref<{name: string, data: Blob} | undefined>(undefined)