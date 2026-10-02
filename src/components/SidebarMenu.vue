<script setup lang="ts">
import type { MenuItem } from '../types/nav'

defineProps<{
  menuOptions: MenuItem[]
  activeKey: string
}>()

const emit = defineEmits<{
  menuSelect: [key: string]
}>()

const handleMenuSelect = (key: string) => {
  emit('menuSelect', key)
}
</script>

<template>
  <n-menu
    class="sidebar-nav"
    :options="menuOptions"
    :value="activeKey"
    :indent="28"
    @update:value="handleMenuSelect"
  />
</template>
