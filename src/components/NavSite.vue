<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowUpOutline } from '@vicons/ionicons5'
import type { NavLink, MenuItem } from '../types/nav'
import NavigationHeader from './NavigationHeader.vue'
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

const activeKey = ref<string>('')
const isScrolling = ref(false)
const showBackTop = ref(false)

const filteredNavLinks = computed<Map<string, NavLink[]>>(() => {
  const grouped = new Map<string, NavLink[]>()
  
  props.navLinks.forEach((link: NavLink) => {
    const category = link.category
    if (!grouped.has(category)) {
      grouped.set(category, [])
    }
    grouped.get(category)!.push(link)
  })
  
  return grouped
})

const menuOptions = computed<MenuItem[]>(() => {
  const categories = Array.from(filteredNavLinks.value.keys())
  
  return categories.map(category => ({
    label: category,
    key: category
  }))
})

const firstCategory = Array.from(filteredNavLinks.value.keys())[0]
if (firstCategory) {
  activeKey.value = firstCategory
}

const handleMenuSelect = (key: string) => {
  isScrolling.value = true
  activeKey.value = key
  
  const element = document.getElementById(key)
  if (element) {
    const headerHeight = 64
    const elementPosition = element.offsetTop - headerHeight - 20
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      isScrolling.value = false
    }, 1000)
  }
}

const handleScroll = () => {
  showBackTop.value = window.scrollY > 100
  
  if (isScrolling.value) return
  
  const headerHeight = 64
  const offset = headerHeight + 100
  const sections = Array.from(filteredNavLinks.value.keys())
  
  for (const category of sections) {
    const element = document.getElementById(category)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= offset && rect.bottom > offset) {
        activeKey.value = category
        break
      }
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
  
  // activeKey 在 setup 阶段已初始化；这里不再重复设置
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="nav-site">
    <NavigationHeader
      :site-title="props.siteTitle"
      :menu-options="menuOptions"
      :active-key="activeKey"
      @menu-select="handleMenuSelect"
    />
    
    <div class="content-wrapper">
      <HomeBanner
        v-if="props.homeBanner?.enabled"
        :items="props.homeBanner.items"
        :autoplay="props.homeBanner.autoplay"
        :interval="props.homeBanner.interval"
      />
      
      <Announcement
        v-if="props.announcement?.enabled"
        :title="props.announcement.title"
        :content="props.announcement.content"
      />
      
      <slot name="random-recommend" />
      
      <NavigationContent :filtered-nav-links="filteredNavLinks" />
    </div>
    
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
