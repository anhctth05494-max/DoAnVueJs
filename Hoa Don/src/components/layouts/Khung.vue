

<script setup>
import { ref } from 'vue';
const isProductOpen = ref(false);
</script>

<template>
  <div class="layout-wrapper">
    <aside class="sidebar">
      <div class="logo-area">
        <img src="/Logo.png" alt="Logo" class="logo-img">
      </div>
      
      <nav class="nav-menu">
  <RouterLink to="/" class="nav-item">
    <i class="bi bi-house-door"></i> Trang Chủ
  </RouterLink>
  
  <RouterLink to="/thong-ke" class="nav-item">
    <i class="bi bi-bar-chart-line"></i> Thống Kê
  </RouterLink>
  
  <RouterLink to="/ban-hang" class="nav-item">
    <i class="bi bi-shop"></i> Bán hàng
  </RouterLink>
  
  <RouterLink to="/hoa-don" class="nav-item">
    <i class="bi bi-receipt"></i> Hóa đơn
  </RouterLink>

  <div class="nav-item" @click="isProductOpen = !isProductOpen">
    <div class="d-flex align-items-center justify-content-between w-100">
      <span><i class="bi bi-box-seam"></i> Sản phẩm</span>
      <i :class="isProductOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </div>
  </div>
  
  <div v-if="isProductOpen" class="submenu">
  <RouterLink to="/san-pham" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Danh sách sản phẩm</a>
  </RouterLink>

  <RouterLink to="/thuong-hieu" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Thương hiệu</a>
  </RouterLink>

  <RouterLink to="/danh-muc" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Danh mục</a>
  </RouterLink>

  <RouterLink to="/chat-lieu" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Chất liệu</a>
  </RouterLink>

  <RouterLink to="/kieu-dang" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Kiểu dáng</a>
  </RouterLink>

  <RouterLink to="/co-ao" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Cổ áo</a>
  </RouterLink>

  <RouterLink to="/tay-ao" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Tay áo</a>
  </RouterLink>

  <RouterLink to="/mau-sac" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Màu sắc</a>
  </RouterLink>

  <RouterLink to="/kich-co" custom v-slot="{ navigate, isActive }">
    <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Kích cỡ</a>
  </RouterLink>
  </div>
 

  <RouterLink to="/phieu-giam-gia" class="nav-item">
    <i class="bi bi-ticket-perforated"></i> Phiếu giảm giá
  </RouterLink>
  <RouterLink to="/khach-hang" class="nav-item">
    <i class="bi bi-people"></i> Khách hàng
  </RouterLink>
</nav>

      <div class="sidebar-footer">

        <a href="#" class="nav-item"><i class="bi bi-box-arrow-right"></i> Đăng Xuất</a>
      </div>
    </aside>
  <main class="flex-grow-1 d-flex flex-column overflow-hidden">
     <header class="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
  
  <div>
     <h4 class="mb-1 fw-bold text-dark fs-5">Quản Lý Sản Phẩm</h4>
     <div class="text-muted" style="font-size: 0.8rem">Trang chủ | Sản phẩm | Danh sách sản phẩm</div>
  </div>

  <div class="d-flex align-items-center gap-3">
     <div class="input-group">
        <span class="input-group-text bg-transparent rounded-start-pill"><i class="bi bi-search"></i></span>
        <input type="text" class="form-control rounded-end-pill" placeholder="Tìm kiếm sản phẩm...">
     </div>
     <i class="bi bi-bell fs-5"></i>
     <i class="bi bi-clock-history fs-5"></i>
     <img src="" class="rounded-circle" width="35" height="35">
  </div>

</header>

      <div class="p-4 overflow-auto flex-grow-1">
  <router-view /> </div>
    </main>
    
  </div>
</template>

<style scoped>

/* Tự động làm nổi bật menu đang chọn */
.router-link-active:not(.submenu a) {
  background: #EBDCD0 !important;
  color: #5a4031 !important;
  border-radius: 0 25px 25px 0;
  margin-right: 20px;
}

/* Style cho submenu khi active */
.submenu .router-link-active {
  color: #5a4031 !important;
  font-weight: 600;
}
/* Reset & Layout */
.layout-wrapper { display: flex; height: 100vh; background: #f8f9fa; overflow: hidden; } /* Ẩn tràn cho toàn màn hình */

/* Sidebar & Menu */
.sidebar { width: 260px; background: white; border-right: 1px solid #eee; display: flex; flex-direction: column; height: 100vh; }
.nav-menu { flex-grow: 1; overflow-y: auto; } /* Chỉ cho phép cuộn ở đây */

/* ẨN THANH CUỘN CÔNG THỨC CHUẨN */
.nav-menu, .page-body {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.nav-menu::-webkit-scrollbar,
.page-body::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

/* Các thành phần khác giữ nguyên */
.nav-item { 
  display: flex; align-items: center; padding: 12px 25px; 
  text-decoration: none; color: #666; font-weight: 500; cursor: pointer;
  transition: 0.2s;
}
.nav-item i:first-child { width: 25px; font-size: 18px; display: inline-block; }
.nav-item:hover { background: #fdfaf8; color: #8a6d5b; }
.nav-item.active { background: #EBDCD0; color: #5a4031; border-radius: 0 25px 25px 0; margin-right: 20px; }

.submenu { display: flex; flex-direction: column; padding-left: 65px; }

/* Áp dụng cho tất cả các thẻ <a> (RouterLink) nằm trong .submenu */
.submenu a {
  display: block;
  text-decoration: none !important; 
  color: #6c757d !important;         /* Màu đen nhạt */
  font-size: 14px !important;       /* Chữ bé lại */
  font-weight: 400 !important;      /* Chữ không bị thô */
  padding: 5px 0 !important;        
  transition: all 0.2s ease;
}

/* Áp dụng khi di chuột vào */
.submenu a:hover {
  color: #5a4031 !important; 
}

/* Áp dụng khi link đó đang được chọn (active) */
.submenu a.router-link-active {
  color: #5a4031 !important;
  font-weight: 600 !important;
} 

.logo-area { padding: 20px; text-align: center; }
.logo-img { max-width: 120px; }
.header { display: flex; align-items: center; justify-content: space-between; padding: 15px 30px; background: white; border-bottom: 1px solid #eee; }
.content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.page-body { flex-grow: 1; overflow-y: auto; padding: 20px; } /* Phải có overflow-y: auto ở đây để cuộn được nội dung trang */
</style>