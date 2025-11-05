import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

import sitemap from '@astrojs/sitemap';

export const siteConfig = {
  title: 'UUZ导航 | ACG导航站',
  url: 'https://www.uuznav.com',
  description: '一个简约美观实用的导航网站，这里收录着超100个优秀优质的网站！',
  keywords: 'UUZ导航,ACG导航,网址导航,导航网站,网站收录,常用网站,galgame网站,资源网站,漫画网站,动漫网站,轻小说网站',
  author: 'UUZNav'
}

export default defineConfig({
  integrations: [vue({
    appEntrypoint: '/src/plugins/naive-ui'
  }), sitemap()],
  site: siteConfig.url
});