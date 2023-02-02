import type { InjectionKey } from 'vue'

export const mermaidKey = Symbol() as InjectionKey<{initialized: boolean}>