<template>
  <router-view v-if="isClientPage" class="client-layout" />

  <div v-else class="admin-wrapper">
    <Khung />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Khung from './components/layouts/Khung.vue'

const route = useRoute()

// Nhận diện các đường dẫn của Khách hàng
const isClientPage = computed(() => {
  const p = route.path
  // Bao gồm cả trang Giỏ hàng nếu bạn đã tạo
  return (
    p === '/' ||
    p.startsWith('/cua-hang') ||
    p.startsWith('/san-voucher') ||
    p.startsWith('/lien-he') ||
    p.startsWith('/gio-hang')
  )
})

// TỰ ĐỘNG ĐỔI MÀU NỀN
watch(
  isClientPage,
  (isClient) => {
    // Luôn đặt thuộc tính cho cả body và html để đảm bảo không bị dính màu nền cũ
    document.body.style.backgroundColor = isClient ? '#ffffff' : '#f8f9fa'
    document.documentElement.style.backgroundColor = isClient ? '#ffffff' : '#f8f9fa'
  },
  { immediate: true },
)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Ép layout khách hàng luôn trắng */
.client-layout {
  background-color: #ffffff !important;
  min-height: 100vh;
}

.admin-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
}
</style>
