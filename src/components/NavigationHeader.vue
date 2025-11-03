<script setup lang="ts">
import { ref } from 'vue'
import { MenuOutline } from '@vicons/ionicons5'
import type { MenuItem } from '../types/nav'

const props = defineProps<{
  siteTitle: string
  menuOptions: MenuItem[]
  activeKey: string
}>()

const emit = defineEmits<{
  menuSelect: [key: string]
}>()

const drawerActive = ref(false)

const handleMenuSelect = (key: string) => {
  emit('menuSelect', key)
  drawerActive.value = false
}
</script>

<template>
  <header class="nav-header">
    <div class="header-content">
      <div class="logo">{{ siteTitle }}</div>

      <nav class="desktop-menu">
        <n-menu
          mode="horizontal"
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuSelect"
        />
      </nav>

      <div class="mobile-menu-button">
        <n-button @click="drawerActive = true" text>
          <template #icon>
            <n-icon :size="24"><MenuOutline /></n-icon>
          </template>
        </n-button>
      </div>
    </div>

    <n-drawer 
      v-model:show="drawerActive" 
      :width="280" 
      placement="right"
      :trap-focus="true"
      :block-scroll="true"
    >
      <n-drawer-content title="菜单" :native-scrollbar="false">
        <n-menu
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuSelect"
        />
      </n-drawer-content>
    </n-drawer>
  </header>
</template>

