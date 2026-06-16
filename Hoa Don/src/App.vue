<template>
  <router-view v-if="isClientPage" class="client-layout" />

  <div v-else class="admin-wrapper">
    <div class="main-content">
      <Khung />
    </div>
  </div>
</template>

<script setup>
  import { computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import Khung from './components/layouts/Khung.vue'

  const route = useRoute()

  // TỰ ĐỘNG NHẬN DIỆN: Nếu trang yêu cầu quyền 'khachhang' hoặc KHÔNG yêu cầu quyền admin
  const isClientPage = computed(() => {
    // Tìm xem trong chuỗi route hiện tại có yêu cầu role 'nhanvien' hay không
    const isAdminRoute = route.matched.some(record => record.meta.requiresRole === 'nhanvien')
    
    // Nếu KHÔNG PHẢI route của nhân viên -> Tự động tính là Layout Khách hàng/Công cộng
    return !isAdminRoute
  })

  // TỰ ĐỘNG ĐỔI MÀU NỀN THEO LAYOUT
  watch(
    isClientPage,
    (isClient) => {
      const bgColor = isClient ? '#ffffff' : '#f8f9fa'
      document.body.style.backgroundColor = bgColor
      document.documentElement.style.backgroundColor = bgColor
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