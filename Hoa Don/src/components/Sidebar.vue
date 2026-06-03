<template>
  <div class="sidebar sticky-top">
    <div class="logo">
      <img src="/logo.png" alt="Logo" />
    </div>
    <ul class="menu">
      <li>Trang Chủ</li>
      <li>Thống Kê</li>
      <li>Bán hàng</li>
      <li>Hóa đơn</li>
      <li>Sản phẩm</li>
      <li>Phiếu giảm giá</li>
      <li>Đợt giảm giá</li>
      <li>Khách hàng</li>
      <li class="active">Nhân viên</li>
    </ul>
    <div class="bottom-menu">
      <div>Cài Đặt</div>
      <div>Đăng Xuất</div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: #FFFFFF;
  color: #000000;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 20px 0;
}
.logo {
  padding: 20px;
  text-align: center;
}
.logo img {
  width: 120px;
}
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu li {
  padding: 16px 32px;
  cursor: pointer;
  color: #000000;
  font-size: 16px;
}
.menu li.active, .menu li:hover {
  background: #D4C3B8;
  color: #7b5e3d;
  border-radius: 0 20px 20px 0;
}
.bottom-menu {
  padding: 0 32px;
  color: #50453C;
  font-size: 15px;
}
.bottom-menu > div {
  margin: 12px 0;
  cursor: pointer;
}
</style>
