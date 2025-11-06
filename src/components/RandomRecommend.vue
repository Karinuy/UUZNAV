<script setup lang="ts">
import { computed } from 'vue'
import type { NavLink } from '../types/nav'

const props = defineProps<{
  navLinks: NavLink[]
}>()

const randomLinks = computed(() => {
  const shuffled = [...props.navLinks].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 6)
})

const handleCardClick = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="random-recommend">
    <h2 class="recommend-title">随机推荐</h2>
    <div class="cards-grid">
      <n-popover
        v-for="link in randomLinks"
        :key="link.title"
        placement="top"
        trigger="hover"
        :show-arrow="true"
      >
        <template #trigger>
          <n-card
            :bordered="true"
            class="nav-card"
            @click="handleCardClick(link.url)"
          >
            <div class="card-body">
              <div class="card-icon-wrapper">
                <img :src="link.icon" :alt="link.title" class="card-icon" loading="lazy" />
              </div>
              <div class="card-info">
                <n-tag :bordered="false" size="small" class="card-category">
                  {{ link.category }}
                </n-tag>
                <h3 class="card-title">{{ link.title }}</h3>
                <p class="card-description">{{ link.description }}</p>
              </div>
            </div>
          </n-card>
        </template>
        <div class="popover-content">
          <div class="popover-title">{{ link.title }}</div>
          <div class="popover-category">
            <n-tag :bordered="false" size="tiny">
              {{ link.category }}
            </n-tag>
          </div>
          <div class="popover-description">{{ link.description }}</div>
          <div class="popover-url">{{ link.url }}</div>
        </div>
      </n-popover>
    </div>
  </div>
</template>

