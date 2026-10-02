<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { ArrowUpOutline } from '@vicons/ionicons5'
import type { NavLink, MenuItem, NavGroup, NavSubGroup } from '../types/nav'
import NavigationHeader from './NavigationHeader.vue'
import SidebarMenu from './SidebarMenu.vue'
import NavigationContent from './NavigationContent.vue'
import Announcement from './Announcement.vue'
import HomeBanner from './HomeBanner.vue'

const props = defineProps<{
  siteTitle: string
  navLinks: NavLink[]
  announcement?: {
    enabled: boolean
    title: string
    content: string
  }
  homeBanner?: {
    enabled: boolean
    autoplay: boolean
    interval: number
    items: Array<{
      image: string
      link: string
      alt: string
    }>
  }
}>()

const searchKeyword = ref('')
const activeKey = ref('')
const isScrolling = ref(false)
const showBackTop = ref(false)
const drawerActive = ref(false)

const searchActive = computed(() => searchKeyword.value.trim() !== '')

const groups = computed<NavGroup[]>(() => {
  const map = new Map<string, NavGroup>()

  props.navLinks.forEach((link: NavLink) => {
    const segments = link.category.split('/').map(s => s.trim()).filter(Boolean)
    const parentLabel = segments[0] || link.category
    const childLabel = segments[1] || ''

    if (!map.has(parentLabel)) {
      map.set(parentLabel, { label: parentLabel, key: parentLabel, subs: [] })
    }

    const group = map.get(parentLabel)!
    const subKey = childLabel ? `${parentLabel}/${childLabel}` : parentLabel
    let sub = group.subs.find(item => item.key === subKey)

    if (!sub) {
      sub = { label: childLabel, key: subKey, links: [] }
      group.subs.push(sub)
    }

    sub.links.push(link)
  })

  return Array.from(map.values())
})

const menuOptions = computed<MenuItem[]>(() => {
  return groups.value.map(group => {
    const children = group.subs
      .filter(sub => sub.label)
      .map(sub => ({ label: sub.label, key: sub.key }))

    if (!children.length) {
      return { label: group.label, key: group.key }
    }

    if (group.subs.some(sub => !sub.label)) {
      children.unshift({ label: '其他', key: group.key })
    }

    return { label: group.label, key: group.key, children }
  })
})

const searchResults = computed<NavLink[]>(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return []

  return props.navLinks.filter(link =>
    link.title.toLowerCase().includes(keyword) ||
    link.description.toLowerCase().includes(keyword) ||
    link.category.toLowerCase().includes(keyword)
  )
})

const anchorKeys = computed<string[]>(() => {
  const keys: string[] = []

  groups.value.forEach(group => {
    keys.push(group.key)
    group.subs.forEach(sub => {
      if (sub.label) keys.push(sub.key)
    })
  })

  return keys
})

const firstGroup = groups.value[0]
if (firstGroup) {
  activeKey.value = firstGroup.key
}

const HEADER_HEIGHT = 56

const handleMenuSelect = (key: string) => {
  drawerActive.value = false
  isScrolling.value = true
  activeKey.value = key

  if (searchKeyword.value) {
    searchKeyword.value = ''
  }

  nextTick(() => {
    requestAnimationFrame(() => {
      const element = document.getElementById(key)
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT - 20
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
      setTimeout(() => {
        isScrolling.value = false
      }, 1000)
    })
  })
}

const handleScroll = () => {
  showBackTop.value = window.scrollY > 100

  if (isScrolling.value || searchActive.value) return

  const offset = HEADER_HEIGHT + 100

  for (const key of anchorKeys.value) {
    const element = document.getElementById(key)
    if (!element) continue

    const rect = element.getBoundingClientRect()
    if (rect.top <= offset && rect.bottom > offset) {
      activeKey.value = key
      break
    }
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="nav-dashboard">
    <NavigationHeader
      :site-title="props.siteTitle"
      v-model="searchKeyword"
      @open-menu="drawerActive = true"
    />

    <div class="dashboard-body">
      <aside class="sidebar">
        <SidebarMenu
          :menu-options="menuOptions"
          :active-key="activeKey"
          @menu-select="handleMenuSelect"
        />
      </aside>

      <div class="dashboard-content">
        <HomeBanner
          v-if="props.homeBanner?.enabled && !searchActive"
          :items="props.homeBanner.items"
          :autoplay="props.homeBanner.autoplay"
          :interval="props.homeBanner.interval"
        />

        <Announcement
          v-if="props.announcement?.enabled && !searchActive"
          :title="props.announcement.title"
          :content="props.announcement.content"
        />

        <template v-if="!searchActive">
          <slot name="random-recommend" />
        </template>

        <NavigationContent
          :groups="groups"
          :search-keyword="searchKeyword"
          :search-results="searchResults"
        />
      </div>
    </div>

    <n-drawer
      v-model:show="drawerActive"
      :width="260"
      placement="left"
      :trap-focus="true"
      :block-scroll="true"
    >
      <n-drawer-content title="菜单" :native-scrollbar="false">
        <SidebarMenu
          :menu-options="menuOptions"
          :active-key="activeKey"
          @menu-select="handleMenuSelect"
        />
      </n-drawer-content>
    </n-drawer>

    <transition name="back-top-fade">
      <div v-if="showBackTop" class="back-top-button" @click="scrollToTop">
        <n-button circle type="primary" size="large">
          <template #icon>
            <n-icon><ArrowUpOutline /></n-icon>
          </template>
        </n-button>
      </div>
    </transition>
  </div>
</template>
