<template>

      <div class="page-body-container">
        <router-view></router-view>
      </div>

</template>

<script setup>


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
  
}
</style>
