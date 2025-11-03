<script setup lang="ts">
interface AdItem {
  image: string
  link: string
  alt: string
}

defineProps<{
  items: AdItem[]
  autoplay?: boolean
  interval?: number
}>()

const handleAdClick = (link: string) => {
  if (link) {
    window.open(link, '_blank')
  }
}
</script>

<template>
  <div class="advertisement-wrapper">
    <n-carousel
      :autoplay="autoplay"
      :interval="interval"
      :show-dots="true"
      :draggable="true"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item"
        @click="handleAdClick(item.link)"
      >
        <img :src="item.image" :alt="item.alt" class="ad-image" />
      </div>
    </n-carousel>
  </div>
</template>

