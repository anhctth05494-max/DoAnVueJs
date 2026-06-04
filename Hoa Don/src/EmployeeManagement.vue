<template>

      <div class="page-body-container">
        <router-view></router-view>
      </div>

</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import EmployeeTable from './components/EmployeeTable.vue';
import Pagination from './components/Pagination.vue';
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f7f6f3;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7f6f3;
}

.page-body-container {
  flex: 1;
  padding-top: 12px; /* Đệm nhẹ khoảng cách từ Header xuống nội dung */
}
</style>
