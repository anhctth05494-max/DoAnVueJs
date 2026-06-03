<template>
  <div class="header sticky-top">
    <div>
      <div class="title">Giai Dài Admin Dashboard</div>
      <div class="breadcrumb">Trang chủ | Quản lý nhân viên</div>
    </div>
    <div class="search-user">
      <!-- <input type="text" class="search" placeholder="Tìm kiếm nhân viên..." /> -->
      <div class="user-avatar">
        <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="avatar" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 0 32px;
  background: #fff;
  border-bottom: 1px solid #e5ded7;
}
.title {
  font-size: 28px;
  font-weight: bold;
  color: #222;
}
.breadcrumb {
  color: #bdbdbd;
  font-size: 15px;
  margin-top: 4px;
}
.search-user {
  display: flex;
  align-items: center;
  gap: 16px;
}
.search {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e5ded7;
  font-size: 15px;
}
.user-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
</style>
