<script setup lang="ts">
import { MenuOutline, SearchOutline } from '@vicons/ionicons5'

defineProps<{
  siteTitle: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  openMenu: []
}>()

const handleInput = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <header class="top-navbar">
    <button class="mobile-menu-button" type="button" @click="emit('openMenu')">
      <n-icon :size="22"><MenuOutline /></n-icon>
    </button>
    <div class="nav-logo">{{ siteTitle }}</div>
    <div class="nav-search">
      <n-input
        :value="modelValue"
        round
        clearable
        placeholder=""
        @update:value="handleInput"
      >
        <template #prefix>
          <n-icon><SearchOutline /></n-icon>
        </template>
      </n-input>
    </div>
  </header>
</template>
