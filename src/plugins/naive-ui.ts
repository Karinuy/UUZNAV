import type { App } from 'vue'
import naive from 'naive-ui'

// 关键：为 Naive UI 的 css-render 提供 SSR adapter 的注入上下文，
// 否则构建期（Vue SSR）会因为访问 document 而失败，导致导航只能在客户端 JS 才渲染（不利于 SEO）。
import { setup as setupCssRenderSsr } from '@css-render/vue3-ssr'

export default (app: App) => {
  // 在 SSR 阶段：提供 ssrContext，使 Naive UI 能把样式收集到上下文里而不是访问 document
  // 在浏览器阶段：useSsrAdapter 会自动返回 undefined，这里相当于无副作用的 provide
  setupCssRenderSsr(app)

  app.use(naive)
}


