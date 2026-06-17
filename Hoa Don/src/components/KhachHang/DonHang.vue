<template>
  <div class="client-home" style="background-color: #f8f9fa !important; min-height: 100vh">
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

    <nav class="navbar navbar-expand-lg sticky-top py-3 border-bottom shadow-sm" style="background-color: #ffffff !important">
      <div class="container-fluid px-4 px-lg-5">
        <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
          <img src="/Logo.png" alt="Logo Giai Đài" style="height: 60px; object-fit: contain" />
        </router-link>

        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-5 text-center align-items-center justify-content-center">
            <li class="nav-item">
              <router-link to="/" class="nav-link fw-medium nav-text menu-underline" exact-active-class="active-link">Trang chủ</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/gioi-thieu" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Giới Thiệu</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/cua-hang" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Sản phẩm</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/don-hang" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Đơn Hàng</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/lien-he" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Liên hệ</router-link>
            </li>
          </ul>

          <div class="d-flex align-items-center justify-content-center gap-4 fs-5 nav-text mt-3 mt-lg-0">
            <div class="dropdown">
              <i class="bi bi-bell icon-btn position-relative" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer"></i>
              <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3 rounded-3 text-center custom-dropdown" style="background-color: #ffffff !important">
                <i class="bi bi-bell-slash fs-3 mb-2 d-block" style="color: #a07856"></i>
                <span class="small" style="color: #6f4d38">Không có thông báo mới</span>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <i class="bi bi-bag position-relative" @click="router.push('/gio-hang')" style="cursor: pointer; font-size: 1.3rem; color: #6f4d38">
                <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background-color: #a82e3e; font-size: 0.65rem">
                  {{ cartCount }}
                </span>
              </i>
            </div>
            <div class="dropdown">
              <i class="bi bi-person-circle icon-btn" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer"></i>
              <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-4 rounded-3 text-center custom-dropdown" style="min-width: 220px; background-color: #ffffff !important">
                <div class="d-flex flex-column align-items-center mb-3">
                  <div class="rounded-circle d-flex align-items-center justify-content-center mb-2 bg-white" style="width: 55px; height: 55px; border: 1px solid #cbb799;">
                    <i class="bi bi-person fs-2" style="color: #6f4d38"></i>
                  </div>
                  <span class="fw-bold" style="color: #3d211a; font-size: 1.1rem">{{ currentUsername }}</span>
                </div>
                <button v-if="currentUsername === 'Guest'" class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-login" @click="router.push('/dang-nhap')">
                  Đăng nhập
                </button>
                <button v-if="currentUsername === 'Guest'" class="btn w-100 btn-sm text-white rounded-1" style="background-color: #6f4d38" @click="router.push('/dang-ky')">
                  Đăng ký
                </button>
                <button v-if="currentUsername !== 'Guest'" class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-logout" @click="handleLogout">
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="container py-5 mt-2" style="min-height: 60vh">
      <div class="row">
        <div class="col-lg-3 d-none d-lg-block mb-4">
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div class="rounded-circle d-flex align-items-center justify-content-center bg-light" style="width: 50px; height: 50px; border: 1px solid #cbb799;">
                  <i class="bi bi-person fs-3" style="color: #6f4d38"></i>
                </div>
                <div>
                  <div class="small text-muted">Tài khoản của</div>
                  <strong style="color: #3d211a;">{{ currentUsername }}</strong>
                </div>
              </div>
              <ul class="list-unstyled mb-0 profile-menu">
                <li class="mb-3">
                  <a href="#" class="text-decoration-none d-flex align-items-center gap-2">
                    <i class="bi bi-person-vcard"></i> Thông tin tài khoản
                  </a>
                </li>
                <li class="mb-3 active">
                  <a href="#" class="text-decoration-none d-flex align-items-center gap-2 fw-bold" style="color: #3d211a;">
                    <i class="bi bi-bag-check"></i> Đơn hàng của tôi
                  </a>
                </li>
                <li>
                  <a href="#" @click.prevent="handleLogout" class="text-decoration-none d-flex align-items-center gap-2 text-danger">
                    <i class="bi bi-box-arrow-right"></i> Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
            <div class="card-header bg-white p-0 border-bottom">
              <ul class="nav nav-tabs border-0 w-100 d-flex text-center order-tabs" id="myTab" role="tablist">
                <li class="nav-item flex-fill" role="presentation">
                  <button class="nav-link active w-100 py-3 border-0 fw-medium" type="button" role="tab">Tất cả</button>
                </li>
                <li class="nav-item flex-fill" role="presentation">
                  <button class="nav-link w-100 py-3 border-0 fw-medium text-muted" type="button" role="tab">Chờ xác nhận</button>
                </li>
                <li class="nav-item flex-fill" role="presentation">
                  <button class="nav-link w-100 py-3 border-0 fw-medium text-muted" type="button" role="tab">Đang giao</button>
                </li>
                <li class="nav-item flex-fill" role="presentation">
                  <button class="nav-link w-100 py-3 border-0 fw-medium text-muted" type="button" role="tab">Hoàn thành</button>
                </li>
                <li class="nav-item flex-fill" role="presentation">
                  <button class="nav-link w-100 py-3 border-0 fw-medium text-muted" type="button" role="tab">Đã hủy</button>
                </li>
              </ul>
            </div>
            
            <div class="card-body p-5 text-center" style="background-color: #fdfdfd;">
              <div class="empty-state py-5">
                <i class="bi bi-receipt mb-3 d-inline-block" style="font-size: 4rem; color: #dcd1c4;"></i>
                <h5 class="fw-bold mb-2" style="color: #3d211a;">Chưa có đơn hàng nào</h5>
                <p class="text-muted mb-4">Bạn chưa thực hiện giao dịch nào trên hệ thống của Giai Đài.</p>
                <button class="btn px-4 py-2 fw-medium rounded-pill text-white btn-mua-sam" @click="router.push('/cua-hang')" style="background-color: #6f4d38;">
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #cbb799">
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img src="/Logo.png" alt="Logo Giai Đài" style="height: 55px; object-fit: contain" class="mb-3" />
            <p class="small lh-lg" style="color: #6f4d38">
              Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam.
            </p>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Về chúng tôi</h6>
            <ul class="list-unstyled footer-links">
              <li><router-link to="/gioi-thieu">Câu chuyện thương hiệu</router-link></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Liên hệ</h6>
            <ul class="list-unstyled footer-links text-muted small">
              <li><i class="bi bi-telephone-fill me-2" style="color: #a07856"></i><span style="color: #6f4d38">0123 456 789</span></li>
              <li><i class="bi bi-envelope-fill me-2" style="color: #a07856"></i><span style="color: #6f4d38">cskh@giaidai.vn</span></li>
            </ul>
          </div>
        </div>
        <div class="text-center pt-4 mt-4" style="border-top: 1px solid #f0f0f0">
          <p class="small mb-0" style="color: #a07856">&copy; 2026 Giai Đài. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

const router = useRouter()
const currentUsername = ref(sessionStorage.getItem('username') || 'Guest')
const cartCount = ref(0) 

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
  }, 2500);
};

const handleLogout = () => {
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('username') 

  showToast('Đăng xuất thành công!')

  setTimeout(() => {
    router.push('/dang-nhap')
  }, 1000)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
.client-home {
  font-family: 'Segoe UI', sans-serif;
}

/* --- NAVBAR VÀ GẠCH CHÂN ACTIVE --- */
.nav-text {
  color: #3d211a !important;
  font-size: 1rem;
  text-transform: uppercase;
  transition: all 0.3s ease;
  padding: 10px 0 !important;
  position: relative;
  display: inline-block;
}

.menu-underline {
  border-bottom: 2px solid transparent;
}

.menu-underline:hover,
.active-link {
  border-bottom: 2px solid #3d211a !important;
}

.custom-dropdown {
  border-top: 3px solid #6f4d38 !important;
}

.btn-login {
  color: #6f4d38;
  border: 1px solid #cbb799;
  background-color: #ffffff;
  transition: all 0.2s;
}
.btn-login:hover {
  background-color: #6f4d38;
  color: #ffffff;
  border-color: #6f4d38;
}

.title-cursive-elegant {
  font-family: 'Dancing Script', cursive !important;
  font-weight: 700;
}

.footer-links li a {
  color: #6f4d38;
  text-decoration: none;
  display: block;
  padding-bottom: 8px;
  transition: color 0.2s;
}
.footer-links li a:hover {
  color: #a07856;
}

/* --- TRANG ĐƠN HÀNG STYLE --- */
.profile-menu a {
  color: #6c757d;
  transition: color 0.2s;
}
.profile-menu a:hover {
  color: #3d211a;
}
.order-tabs .nav-link {
  color: #6c757d;
  border-bottom: 2px solid transparent !important;
  border-radius: 0;
}
.order-tabs .nav-link.active, .order-tabs .nav-link:hover {
  color: #3d211a !important;
  border-bottom: 2px solid #3d211a !important;
}
.btn-mua-sam {
  transition: all 0.3s;
}
.btn-mua-sam:hover {
  background-color: #3d211a !important;
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .title-cursive-elegant {
    font-size: 2.8rem !important;
  }
}
</style>