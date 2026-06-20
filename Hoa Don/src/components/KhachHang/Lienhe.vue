<template>
  <div class="client-home" style="background-color: #ffffff !important; min-height: 100vh">
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
              <router-link to="/cua-hang" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Sản Phẩm</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/don-hang" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Đơn Hàng</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/lien-he" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Liên Hệ</router-link>
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
                <button v-if="currentUsername === 'Guest'" class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-login" @click="router.push('/dang-nhap')">Đăng nhập</button>
                <button v-if="currentUsername === 'Guest'" class="btn w-100 btn-sm text-white rounded-1" style="background-color: #6f4d38" @click="router.push('/dang-ky')">Đăng ký</button>
                <button v-if="currentUsername !== 'Guest'" class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-logout" @click="handleLogout">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="container py-5 mt-2" style="min-height: 60vh">
      <section class="text-center mb-5" style="max-width: 800px; margin: auto">
        <h2 class="title-cursive-elegant mb-3" style="font-size: 3.5rem; color: #3d211a">
          Liên Hệ
        </h2>
        <p class="lh-lg fst-italic" style="font-size: 1rem; color: #6f4d38">
          "Giai Đài luôn lắng nghe và trân trọng mọi chia sẻ từ bạn. Hãy để lại thông tin, chúng tôi sẽ phản hồi trong thời gian sớm nhất."
        </p>
      </section>

      <div class="row g-5">
        <div class="col-md-5">
          <h4 class="fw-bold mb-4" style="font-family: 'Playfair Display', serif; color: #3d211a">Thông tin cửa hàng</h4>
          <div class="d-flex mb-4">
            <i class="bi bi-geo-alt fs-4 me-3" style="color: #a07856"></i>
            <div>
              <h6 class="fw-bold mb-1" style="color: #3d211a">Trụ sở chính Hà Nội</h6>
              <p class="mb-0" style="color: #6f4d38">Số 123 Đường Áo Dài, Quận Hoàn Kiếm, TP. Hà Nội</p>
            </div>
          </div>
          <div class="d-flex mb-4">
            <i class="bi bi-telephone fs-4 me-3" style="color: #a07856"></i>
            <div>
              <h6 class="fw-bold mb-1" style="color: #3d211a">Hotline hỗ trợ</h6>
              <p class="mb-0" style="color: #6f4d38">0123 456 789 (8:30 - 21:30 hàng ngày)</p>
            </div>
          </div>
          <div class="d-flex mb-4">
            <i class="bi bi-envelope fs-4 me-3" style="color: #a07856"></i>
            <div>
              <h6 class="fw-bold mb-1" style="color: #3d211a">Email</h6>
              <p class="mb-0" style="color: #6f4d38">cskh@giaidai.vn</p>
            </div>
          </div>
        </div>

        <div class="col-md-7">
          <div class="p-4 p-md-5 bg-white" style="border: 1px solid #cbb799">
            <h4 class="fw-bold mb-4" style="font-family: 'Playfair Display', serif; color: #3d211a">Gửi tin nhắn cho chúng tôi</h4>
            <form @submit.prevent="submitContact">
              <div class="row g-3 mb-3">
                <div class="col-sm-6">
                  <label class="form-label fw-medium" style="color: #6f4d38">Họ và tên</label>
                  <input type="text" class="form-control custom-input bg-white" placeholder="Nhập họ tên..." />
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-medium" style="color: #6f4d38">Số điện thoại</label>
                  <input type="tel" class="form-control custom-input bg-white" placeholder="Nhập số điện thoại..." />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium" style="color: #6f4d38">Email</label>
                <input type="email" class="form-control custom-input bg-white" placeholder="Nhập địa chỉ email..." />
              </div>
              <div class="mb-4">
                <label class="form-label fw-medium" style="color: #6f4d38">Nội dung lời nhắn</label>
                <textarea class="form-control custom-input bg-white" rows="4" placeholder="Nhập nội dung cần hỗ trợ..."></textarea>
              </div>
              <button type="submit" class="btn w-100 fw-bold py-2 btn-submit-contact">GỬI YÊU CẦU</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #cbb799">
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img src="/Logo.png" alt="Logo Giai Đài" style="height: 55px; object-fit: contain" class="mb-3" />
            <p class="small lh-lg" style="color: #6f4d38">Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam.</p>
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
import { ref, reactive, onMounted } from 'vue'
import { cartCount } from '../../store/cartStore.js' // Đảm bảo đường dẫn này chính xác tới file store của bạn

const router = useRouter()
const currentUsername = ref(localStorage.getItem('username') || 'Guest')

// Ép đồng bộ lại dữ liệu thực tế từ Storage đề phòng trường hợp store bị reset khi đổi trang / F5
onMounted(() => {
  const storedCart = localStorage.getItem('cart') || localStorage.getItem('cart')
  if (storedCart) {
    try {
      const parsedCart = JSON.parse(storedCart)
      if (Array.isArray(parsedCart)) {
        // Cộng dồn toàn bộ quantity (số lượng) của các sản phẩm có trong giỏ hàng
        cartCount.value = parsedCart.reduce((total, item) => total + (item.quantity || 1), 0)
      }
    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu giỏ hàng:", error)
    }
  }
})

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
  localStorage.removeItem('userRole')
  localStorage.removeItem('username') 

  showToast('Đăng xuất thành công!')

  setTimeout(() => {
    router.push('/dang-nhap')
  }, 1000)
}

const submitContact = () => {
  showToast('Cảm ơn bạn đã liên hệ. Giai Đài sẽ phản hồi sớm nhất!')
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

/* Gạch chân ẩn mặc định */
.menu-underline {
  border-bottom: 2px solid transparent;
}

/* Gạch chân khi hover HOẶC khi đang active */
.menu-underline:hover,
.active-link {
  border-bottom: 2px solid #3d211a !important;
}

.custom-dropdown {
  border-top: 3px solid #6f4d38 !important;
}
.custom-drop-item {
  color: #6f4d38 !important;
  transition: all 0.2s ease;
}
.custom-drop-item:hover {
  color: #a07856 !important;
  padding-left: 15px;
  background-color: #ffffff;
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
.custom-input {
  border: 1px solid #cbb799;
  border-radius: 4px;
  padding: 10px 15px;
  color: #3d211a;
}
.custom-input:focus {
  border-color: #6f4d38;
  box-shadow: none;
  outline: none;
}
.btn-submit-contact {
  background-color: #6f4d38;
  color: #ffffff;
  transition: background-color 0.2s;
}
.btn-submit-contact:hover {
  background-color: #3d211a;
  color: #ffffff;
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
@media (max-width: 992px) {
  .title-cursive-elegant {
    font-size: 2.8rem !important;
  }
}
</style>