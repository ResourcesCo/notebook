import type { App } from 'vue'

export type UserModule = (ctx: { app: App, sandbox?: true }) => void
