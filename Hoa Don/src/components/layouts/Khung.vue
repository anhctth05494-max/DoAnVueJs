<template>
  <div class="layout-wrapper">
    <aside class="sidebar">
      <div class="logo-area">
        <img src="/Logo.png" alt="Logo" class="logo-img">
      </div>

      <nav class="nav-menu">
        <RouterLink to="/thong-ke" class="nav-item">
          <i class="bi bi-bar-chart-line"></i> Thống Kê
        </RouterLink>

        <RouterLink to="/ban-hang" class="nav-item">
          <i class="bi bi-shop"></i> Bán hàng
        </RouterLink>

        <RouterLink to="/hoa-don" class="nav-item">
          <i class="bi bi-receipt"></i> Hóa đơn
        </RouterLink>


        <template v-if="!isNhanVien">
          <!-- 1. MENU SẢN PHẨM (Chỉ chứa DS Sản phẩm & DS Biến thể) -->
          <div class="nav-item" @click="isProductOpen = !isProductOpen">
            <div class="d-flex align-items-center justify-content-between w-100">
              <span><i class="bi bi-box-seam"></i> Sản phẩm</span>
              <i :class="isProductOpen ? 'bi bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
          </div>

          <div v-if="isProductOpen" class="submenu">
            <RouterLink to="/san-pham" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Danh sách sản phẩm</a>
            </RouterLink>


            <RouterLink to="/san-pham/danh-sach-chi-tiet" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Danh sách biến thể</a>
            </RouterLink>
          </div>


          <!-- 2. MENU THUỘC TÍNH (Gom toàn bộ các danh mục nhỏ vào đây) -->
          <div class="nav-item" @click="isAttributeOpen = !isAttributeOpen">
            <div class="d-flex align-items-center justify-content-between w-100">
              <span><i class="bi bi-tags"></i> Thuộc tính</span>
              <i :class="isAttributeOpen ? 'bi bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
          </div>

          <div v-if="isAttributeOpen" class="submenu">
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


          <!-- 3. MENU GIẢM GIÁ -->
          <div class="nav-item" @click="isDiscountOpen = !isDiscountOpen">
            <div class="d-flex align-items-center justify-content-between w-100">
              <span><i class="bi bi-ticket-perforated"></i> Giảm giá</span>
              <i :class="isDiscountOpen ? 'bi bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
          </div>


          <div v-if="isDiscountOpen" class="submenu">
            <RouterLink to="/dot-giam-gia" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Đợt giảm giá</a>
            </RouterLink>


            <RouterLink to="/phieu-giam-gia" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Phiếu giảm giá</a>
            </RouterLink>
          </div>


          <div class="nav-item" @click="isCalendarOpen = !isCalendarOpen">
            <div class="d-flex align-items-center justify-content-between w-100">
              <span><i class="bi bi-box-seam"></i> Lịch làm việc</span>
              <i :class="isCalendarOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
            </div>
          </div>

          <div v-if="isCalendarOpen" class="submenu">
            <RouterLink to="/lich-lam-viec/quan-ly-ca" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Xếp ca làm việc</a>
            </RouterLink>


            <RouterLink to="/lich-lam-viec" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Xếp lịch nhân viên</a>
            </RouterLink>
          </div>

          <div class="nav-item" @click="isAccountOpen = !isAccountOpen">
            <div class="d-flex align-items-center justify-content-between w-100">
              <span><i class="bi bi-people"></i> Tài khoản</span>
              <i :class="isAccountOpen ? 'bi bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
          </div>


          <div v-if="isAccountOpen" class="submenu">
            <RouterLink to="/khach-hang" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Khách hàng</a>
            </RouterLink>


            <RouterLink to="/nhan-vien" custom v-slot="{ navigate, isActive }">
              <a href="#" @click="navigate" :class="{ 'active-link': isActive }">Nhân viên</a>
            </RouterLink>
          </div>
        </template>


      </nav>


      <div class="sidebar-footer">
        <a href="#" class="nav-item nav-link" @click.prevent="handleLogout">
          <i class="bi bi-box-arrow-right"></i> Đăng Xuất
        </a>
      </div>
    </aside>


    <!-- TOAST NOTIFICATION -->
    <div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin: 20px;">
      <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3"
        :class="toast.type === 'success' ? 'bg-white' : 'bg-white'"
        role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex align-items-center gap-2">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-triangle-fill text-danger'" class="fs-5"></i>
          <div class="toast-body">
            <strong>{{ toast.title }}</strong>
            <div>{{ toast.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <main class="flex-grow-1 d-flex flex-column overflow-hidden">
      <header class="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
        <div>
          <h4 class="mb-1 fw-bold text-dark fs-5">
            {{ $route.meta.title || 'Quản Lý Hệ Thống' }}
          </h4>

          <div class="text-muted" style="font-size: 0.8rem">
            {{ $route.meta.breadcrumb || 'Trang chủ | Hệ thống quản lý bán hàng thời trang' }}
          </div>
        </div>

        <div class="d-flex align-items-center gap-3">
          <div class="input-group">
            <span class="input-group-text bg-transparent rounded-start-pill"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control rounded-end-pill" placeholder="Tìm kiếm...">
          </div>
          <i class="bi bi-bell fs-5"></i>
          <i class="bi bi-clock-history fs-5"></i>
          <div class="dropdown">
            <i class="bi bi-person-circle icon-btn" data-bs-toggle="dropdown" aria-expanded="false"
              style="cursor: pointer"></i>
            <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-4 rounded-3 text-center custom-dropdown"
              style="min-width: 220px; background-color: #ffffff !important">
              <div class="d-flex flex-column align-items-center mb-3">
                <div class="rounded-circle d-flex align-items-center justify-content-center mb-2" style="
                      width: 55px;
                      height: 55px;
                      border: 1px solid #cbb799;
                      background-color: #ffffff;
                    ">
                  <i class="bi bi-person fs-2" style="color: #6f4d38"></i>
                </div>
                <span class="fw-bold" style="color: #3d211a; font-size: 1.1rem">{{ currentUsername }}</span>
              </div>

            </div>
          </div>
        </div>
      </header>


      <div class="p-4 overflow-auto flex-grow-1">
        <router-view />
      </div>
    </main>
  </div>
</template>


<script setup>
import { computed, ref, reactive } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
// 1. Kết nối vào cùng một kênh phát sóng 'auth-channel'
const authChannel = new BroadcastChannel('auth-channel');
// Lấy tên tài khoản từ sessionStorage ra xem (nếu không có thì để mặc định là 'Guest')
const currentUsername = ref(sessionStorage.getItem('username') || 'Guest')

const toast = reactive({
  show: false,
  title: 'Thông báo',
  message: '',
  type: 'success'
});

const showToast = (message, type = 'success', title = 'Thông báo') => {
  toast.title = title;
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 5500);
};

// 2. Viết hàm xử lý khi nhận được tín hiệu từ tab khác bắn sang
const handleAuthMessage = (event) => {
  const { action, username } = event.data;

  if (action === 'kick_user' && username === currentUsername.value) {
    showToast(
      'Tài khoản của bạn đã bị vô hiệu hóa hoặc thay đổi quyền bởi một Quản lý khác. Hệ thống sẽ tự động đăng xuất sau khi thông báo hiển thị.',
      'danger',
      'Đã bị đăng xuất'
    );

    setTimeout(() => {
      sessionStorage.clear();
      router.push('/dang-nhap');
    }, 5500);
  }
};

onMounted(() => {
  // Đăng ký lắng nghe kênh phát sóng khi Layout được khởi tạo
  authChannel.addEventListener('message', handleAuthMessage);
});

onUnmounted(() => {
  // Hủy lắng nghe khi thoát để tránh rò rỉ bộ nhớ
  authChannel.removeEventListener('message', handleAuthMessage);
  authChannel.close();
});


// Quản lý trạng thái đóng mở độc lập của các menu con
const isProductOpen = ref(false);
const isAttributeOpen = ref(false); // Biến để đóng mở phần Thuộc tính
const isDiscountOpen = ref(false);
const isCalendarOpen = ref(false);
const isAccountOpen = ref(false);


const userRole = sessionStorage.getItem('userRole')
const isNhanVien = computed(() => userRole === 'nhanvien')
const isQuanLy = computed(() => userRole === 'quanly')

const handleLogout = () => {
  // 🌟 SỬA TẠI ĐÂY: Dùng sessionStorage.clear() luôn cho sạch bách cả role lẫn username khi out
  sessionStorage.clear();

  // 2. Hiện thông báo ngắn gọn
  showToast('Đăng xuất thành công!')

  // 3. Đẩy người dùng về lại trang đăng nhập sau 1 giây
  setTimeout(() => {
    router.push('/dang-nhap')
  }, 1000)
}
</script>


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
.layout-wrapper {
  display: flex;
  height: 100vh;
  background: #f8f9fa;
  overflow: hidden;
}


/* Sidebar & Menu */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.nav-menu {
  flex-grow: 1;
  overflow-y: auto;
}


/* ẨN THANH CUỘN CÔNG THỨC CHUẨN */
.nav-menu,
.page-body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-menu::-webkit-scrollbar,
.page-body::-webkit-scrollbar {
  display: none;
}


.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 25px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.nav-item i:first-child {
  width: 25px;
  font-size: 18px;
  display: inline-block;
}

.nav-item:hover {
  background: #fdfaf8;
  color: #8a6d5b;
}

.nav-item.active {
  background: #EBDCD0;
  color: #5a4031;
  border-radius: 0 25px 25px 0;
  margin-right: 20px;
}


.submenu {
  display: flex;
  flex-direction: column;
  padding-left: 65px;
}


/* Áp dụng cho tất cả các thẻ a trong .submenu */
.submenu a {
  display: block;
  text-decoration: none !important;
  color: #6c757d !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  padding: 5px 0 !important;
  transition: all 0.2s ease;
}


.submenu a:hover {
  color: #5a4031 !important;
}


.submenu a.router-link-active {
  color: #5a4031 !important;
  font-weight: 600 !important;
}


.logo-area {
  padding: 20px;
  text-align: center;
}

.logo-img {
  max-width: 120px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background: white;
  border-bottom: 1px solid #eee;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
