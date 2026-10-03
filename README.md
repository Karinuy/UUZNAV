# 🧭 UUZ导航 | ACG导航站

> 🎯 一个简约、好看、好用的 ACG 网址导航站！收录 140+ 优质网站

![Astro](https://img.shields.io/badge/Astro-7-FF5D01?logo=astro&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Naive UI](https://img.shields.io/badge/Naive_UI-2-6CB588)

---

## ✨ 特性一览

- 🎛️ **仪表盘布局** — 顶部搜索栏 + 侧边栏菜单，一目了然
- 🗂️ **二级菜单自动生成** — 分类写 `动漫/在线观看` 就自动拆成两级菜单，懒人狂喜
- 🔍 **即时搜索** — 输入关键词，内容区立刻过滤，找站不用翻
- 🃏 **卡片 + 悬浮详情** — 鼠标一悬停，站点简介立刻见
- 🎲 **随机推荐** — 不知道逛啥？让命运决定（bushi
- 📱 **全端响应式** — 手机、平板、大屏都好看，连刘海屏安全区都安排了
- 💚 **墨迹风标题** — 主题绿墨水划过标题字脚，精致感拿捏
- 🔎 **SEO 友好** — sitemap、robots.txt、OG 标签全都有
- 🩺 **存活检测脚本** — 一键体检所有收录网站，还懂系统代理

## 🛠️ 技术栈

**Astro 7 · Vue 3 · Naive UI · TypeScript**

纯静态生成，零后端，丢到任何静态托管就能跑 🚀

## 🚀 快速开始

> 需要 Node.js ≥ 22.12（推荐 24+，开发机请自备）

```bash
# 📥 克隆项目
git clone https://github.com/Karinuy/UUZNAV.git
cd uuznav

# 📦 安装依赖
npm install

# 🎉 启动开发服务器
npm run dev
```

打开浏览器访问终端里提示的地址，开始玩耍～ ✨

### 🎮 命令速查

| 命令 | 干什么的 |
|---|---|
| `npm run dev` | 🏃 启动开发服务器（热更新） |
| `npm run build` | 📦 构建生产版本到 `dist/` |
| `npm run preview` | 👀 本地预览构建产物 |
| `npm run check` | 🩺 体检所有收录网站的存活状态 |

## 🗂️ 项目结构

```
uuznav/
├── public/
│   └── logos/            🖼️ 站点图标（按分类放文件夹）
├── scripts/
│   └── check.mjs         🩺 网站存活检测脚本
├── src/
│   ├── components/       🧩 Vue 组件（顶栏/侧栏/卡片/公告…）
│   ├── config/           ⚙️ 公告与轮播 Banner 配置
│   ├── data/
│   │   └── nav-data.json 📝 导航数据（重点维护对象！）
│   ├── layouts/          🪟 页面骨架 Layout.astro
│   ├── pages/            📄 页面（index.astro / robots.txt.ts）
│   ├── plugins/          💊 Naive UI 全局注册
│   ├── styles/           🎨 全局样式 nav-site.css
│   └── types/            📐 TypeScript 类型定义
└── astro.config.mjs      🛰️ Astro 配置与站点信息
```

## 📝 维护导航数据

所有站点都在 `src/data/nav-data.json` 里，照着格式加就行：

```json
{
  "title": "哔哩哔哩",
  "description": "知名的视频弹幕网站～",
  "icon": "/logos/anime/bilibili.png",
  "url": "https://www.bilibili.com/",
  "category": "动漫/在线观看"
}
```

| 字段 | 说明 |
|---|---|
| `title` | 🏷️ 站点名称 |
| `description` | 📄 一句话简介（悬浮详情里展示） |
| `icon` | 🖼️ 图标路径，图片丢到 `public/logos/` 对应文件夹 |
| `url` | 🔗 站点地址 |
| `category` | 🗂️ 分类，**用 `/` 分隔就是二级菜单** |

分类写法小课堂 📚：

- `"category": "壁纸"` → 一级菜单「壁纸」
- `"category": "ACG游戏/Galgame资源"` → 一级「ACG游戏」+ 二级「Galgame资源」

侧边栏菜单和内容区小节都会自动跟着变，完全不用改代码，舒服～ 😌

## 🩺 站点存活检测

收录的网站偶尔会跑路，定期体检一下：

```bash
npm run check
```

跑起来是这样婶的 👇

```text
[proxy] http://127.0.0.1:7890 (系统代理)
[42/142] alive 30 warn 8 dead 4 | Pixiv
...
[DEAD] 某某网站
       https://example.com/
       timeout

total 142 | alive 110 | warn 25 | dead 7
```

### 🩺 判定标准

| 状态 | 含义 | 说明 |
|---|---|---|
| ✅ alive | 活得好好的 | 响应正常（状态码 < 400） |
| ⚠️ warn | 活着但有点怪 | 服务器可达但状态码 4xx/5xx，可能只是屏蔽了脚本访问 |
| 💀 dead | 真的跑路了 | 超时、DNS 失败、拒绝连接等网络级失效 |

贴心小细节 💅：

- 🌐 **自动走系统代理** — 优先读 `HTTP_PROXY`/`HTTPS_PROXY` 环境变量，没有就去 Windows 系统代理里找，启动时会告诉你走了哪条路
- 🔄 **HEAD → GET 回退** — 有些站屏蔽 HEAD 请求，回退 GET 再判，不冤枉好人
- ⏱️ 8 秒超时、10 个并发，142 个站不用等到天荒地老
- 🚦 **退出码**：只有真死站（dead）才返回 1，挂 CI 里当巡检刚刚好

## 🎨 自定义配置

想改哪里改哪里，都是明摆着的配置文件 👇

**📣 公告栏** — `src/config/announcement.ts`

```ts
export const announcementConfig = {
  enabled: true,
  title: '公告',
  content: '欢迎使用UUZ导航，如果好用的话分享一下吧~'
}
```

**🎠 首页轮播** — `src/config/homeBanner.ts`（`enabled: true` 就能开）

**🛰️ 站点信息** — `astro.config.mjs` 里的 `siteConfig`（标题、域名、SEO 描述等）

## 📦 部署

```bash
npm run build
```

产物在 `dist/` 目录，纯静态文件，扔到 GitHub Pages / Vercel / Netlify / Cloudflare Pages… 哪里都能活 🌱

构建时会自动生成 `sitemap-index.xml` 和 `robots.txt`，SEO 无痛～

## 💖 写在最后

UUZ导航还在持续收录好站中！如果这个小站帮到了你：

- ⭐ 给个 Star，让作者开心一整天
- 📢 分享给同好，好东西要一起摸鱼（划掉）一起学习
- 🐛 发现坏链？跑一下 `npm run check` 把跑路的站揪出来

**祝大家冲浪愉快，天天有好站可逛！🌊🏄‍♂️**
