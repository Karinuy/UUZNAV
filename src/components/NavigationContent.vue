<script setup lang="ts">
import type { NavLink, NavGroup, NavSubGroup } from '../types/nav'

defineProps<{
  groups: NavGroup[]
  searchKeyword: string
  searchResults: NavLink[]
}>()

const handleCardClick = (url: string) => {
  window.open(url, '_blank')
}

const isPlainSub = (sub: NavSubGroup) => !sub.label

const hasSubLabels = (group: NavGroup) => group.subs.some(sub => sub.label)
</script>

<template>
  <main class="main-content">
    <section v-if="searchKeyword.trim()" class="category-section">
      <h2 class="category-title">搜索结果</h2>
      <div v-if="searchResults.length" class="cards-grid">
        <n-popover
          v-for="link in searchResults"
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
                    {{ link.category.split('/').pop() }}
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
                {{ link.category.split('/').pop() }}
              </n-tag>
            </div>
            <div class="popover-description">{{ link.description }}</div>
            <div class="popover-url">{{ link.url }}</div>
          </div>
        </n-popover>
      </div>
      <n-empty v-else description="没有匹配的站点" />
    </section>

    <template v-else>
      <section
        v-for="group in groups"
        :key="group.key"
        :id="group.key"
        class="category-section"
      >
        <h2 v-if="!hasSubLabels(group)" class="category-title">{{ group.label }}</h2>
        <div
          v-for="sub in group.subs"
          :key="sub.key"
          :id="isPlainSub(sub) ? undefined : sub.key"
          class="subcategory-block"
        >
          <h3 v-if="!isPlainSub(sub)" class="subcategory-title">{{ sub.label }}</h3>
          <div class="cards-grid">
            <n-popover
              v-for="link in sub.links"
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
                        {{ link.category.split('/').pop() }}
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
                    {{ link.category.split('/').pop() }}
                  </n-tag>
                </div>
                <div class="popover-description">{{ link.description }}</div>
                <div class="popover-url">{{ link.url }}</div>
              </div>
            </n-popover>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
