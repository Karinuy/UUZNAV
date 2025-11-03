<script setup lang="ts">
defineProps<{
  title: string
  content: string
}>()
</script>

<template>
  <div class="announcement-container">
    <n-alert :title="title" type="warning">
      {{ content }}
    </n-alert>
  </div>
</template>

