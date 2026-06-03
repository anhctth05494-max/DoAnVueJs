<template>
  <div class="pagination">
    <span>Hiển thị 10 dòng &gt;</span>
    <div class="pages">
      <button class="page active">1</button>
      <button class="page">2</button>
      <button class="page">3</button>
      <span>...</span>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 32px 0 32px;
  color: #7b5e3d;
  font-size: 15px;
}
.pages {
  display: flex;
  gap: 4px;
  align-items: center;
}
.page {
  background: #e5ded7;
  color: #7b5e3d;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-weight: bold;
  cursor: pointer;
}
.page.active {
  background: #7b5e3d;
  color: #fff;
}
</style>
