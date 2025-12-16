import type { App } from 'vue'
import naive from 'naive-ui'

import { setup as setupCssRenderSsr } from '@css-render/vue3-ssr'

export default (app: App) => {
  const { collect } = setupCssRenderSsr(app)
  if (typeof document === 'undefined') {
    ;(globalThis as any).__NAIVE_UI_CSSR_COLLECT__ = collect
  }

  app.use(naive)
}


