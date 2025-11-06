<script setup lang="ts">
interface BannerItem {
  image: string
  link: string
  alt: string
}

defineProps<{
  items: BannerItem[]
  autoplay?: boolean
  interval?: number
}>()

const handleBannerClick = (link: string) => {
  if (link) {
    window.open(link, '_blank')
  }
}
</script>

<template>
  <div class="home-banner-wrapper">
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
        @click="handleBannerClick(item.link)"
      >
        <img :src="item.image" :alt="item.alt" class="banner-image" />
      </div>
    </n-carousel>
  </div>
</template>


