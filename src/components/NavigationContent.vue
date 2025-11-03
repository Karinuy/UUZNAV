<script setup lang="ts">
import type { NavLink } from '../types/nav'

defineProps<{
  filteredNavLinks: Map<string, NavLink[]>
}>()

const handleCardClick = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <main class="main-content">
    <section
      v-for="[category, links] in filteredNavLinks"
      :key="category"
      :id="category"
      class="category-section"
    >
      <h2 class="category-title">
        {{ category }}
      </h2>
      <div class="cards-grid">
        <n-popover
          v-for="link in links"
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
    </section>
  </main>
</template>

