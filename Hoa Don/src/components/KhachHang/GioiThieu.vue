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
        <h2 class="title-cursive-elegant mb-3" style="font-size: 3.5rem; color: #3d211a">Câu Chuyện Giai Đài</h2>
        <p class="lh-lg fst-italic" style="font-size: 1rem; color: #6f4d38">
          "Đánh thức vẻ đẹp bản nguyên, lưu giữ nét duyên ngầm của người phụ nữ Việt Nam qua từng đường kim, mũi chỉ."
        </p>
      </section>

      <div class="row align-items-center mb-5 pb-4">
        <div class="col-lg-6 pe-lg-5 mb-4 mb-lg-0">
          <div class="rounded-3 overflow-hidden shadow-sm" style="height: 450px;">
            <img src="https://i.pinimg.com/1200x/6d/25/df/6d25df3882e1a50adb03f70ebb1000c4.jpg" alt="Câu chuyện Giai Đài" class="w-100 h-100 object-fit-cover" />
          </div>
        </div>
        <div class="col-lg-6 ps-lg-4 text-center text-lg-start">
          <h4 class="fw-bold mb-3" style="font-family: 'Playfair Display', serif; color: #3d211a">Khởi Nguồn Từ Tình Yêu Di Sản</h4>
          <p class="lh-lg mb-4" style="color: #6f4d38; text-align: justify;">
            Giai Đài ra đời từ niềm đam mê mãnh liệt với tà áo dài truyền thống. Chúng tôi tin rằng, áo dài không chỉ là một trang phục, mà là biểu tượng của tinh hoa văn hóa, là niềm tự hào của dân tộc. Mỗi thiết kế của Giai Đài đều là sự kết hợp hoàn hảo giữa nét đằm thắm cổ điển và hơi thở đương đại, mang đến sự tự tin và rạng rỡ cho người mặc.
          </p>
          <p class="lh-lg" style="color: #6f4d38; text-align: justify;">
            Từ khâu chọn lụa, phác thảo hoa văn cho đến những mũi thêu tay tỉ mỉ, đội ngũ nghệ nhân của chúng tôi luôn đặt trọn tâm huyết vào từng nếp áo, mong muốn mang đến những sản phẩm chỉn chu và hoàn mỹ nhất.
          </p>
        </div>
      </div>

      <div class="row text-center mt-5 pt-4 border-top" style="border-color: #f0e9df !important;">
        <div class="col-md-4 mb-4">
          <i class="bi bi-gem fs-1 mb-3 d-block" style="color: #a07856;"></i>
          <h5 class="fw-bold" style="color: #3d211a">Chất Lượng Thượng Hạng</h5>
          <p class="small text-muted px-3">Sử dụng lụa tự nhiên, gấm cao cấp nhập khẩu, mang lại cảm giác mềm mại, êm ái trên da.</p>
        </div>
        <div class="col-md-4 mb-4">
          <i class="bi bi-scissors fs-1 mb-3 d-block" style="color: #a07856;"></i>
          <h5 class="fw-bold" style="color: #3d211a">Đường May Tinh Tế</h5>
          <p class="small text-muted px-3">Được chế tác bởi những nghệ nhân thủ công lành nghề với hơn 20 năm kinh nghiệm.</p>
        </div>
        <div class="col-md-4 mb-4">
          <i class="bi bi-heart fs-1 mb-3 d-block" style="color: #a07856;"></i>
          <h5 class="fw-bold" style="color: #3d211a">Phục Vụ Tận Tâm</h5>
          <p class="small text-muted px-3">Chúng tôi lắng nghe và cá nhân hóa từng số đo để bộ áo dài thuộc về riêng bạn.</p>
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
import { cartCount } from '../../store/cartStore.js' // Import trực tiếp từ store dùng chung

const router = useRouter()
const currentUsername = ref(sessionStorage.getItem('username') || 'Guest')

// Tự động kiểm tra bộ nhớ để ép đồng bộ lại số lượng giỏ hàng khi người dùng chuyển trang hoặc nhấn F5
onMounted(() => {
  const storedCart = localStorage.getItem('cart') || sessionStorage.getItem('cart')
  if (storedCart) {
    try {
      const parsedCart = JSON.parse(storedCart)
      if (Array.isArray(parsedCart)) {
        // Tính tổng số lượng tất cả các mặt hàng có trong giỏ
        cartCount.value = parsedCart.reduce((total, item) => total + (item.quantity || 1), 0)
      }
    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu giỏ hàng bên trang Giới thiệu:", error)
    }
  }
})

const toast = reactive({
  show: false, title: 'Thông báo', message: '', type: 'success'
});

const showToast = (message, type = 'success', title = 'Thông báo') => {
  toast.title = title; toast.message = message; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 2500);
};

const handleLogout = () => {
  sessionStorage.removeItem('userRole'); sessionStorage.removeItem('username');
  showToast('Đăng xuất thành công!');
  setTimeout(() => { router.push('/dang-nhap') }, 1000);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
.client-home { font-family: 'Segoe UI', sans-serif; }

/* --- NAVBAR VÀ GẠCH CHÂN ACTIVE --- */
.nav-text {
  color: #3d211a !important; font-size: 1rem; text-transform: uppercase; transition: all 0.3s ease;
  padding: 10px 0 !important; position: relative; display: inline-block;
}
.menu-underline { border-bottom: 2px solid transparent; }
.menu-underline:hover, .active-link { border-bottom: 2px solid #3d211a !important; }
.custom-dropdown { border-top: 3px solid #6f4d38 !important; }
.btn-login { color: #6f4d38; border: 1px solid #cbb799; background-color: #ffffff; transition: all 0.2s; }
.btn-login:hover { background-color: #6f4d38; color: #ffffff; border-color: #6f4d38; }

.title-cursive-elegant { font-family: 'Dancing Script', cursive !important; font-weight: 700; }
.footer-links li a { color: #6f4d38; text-decoration: none; display: block; padding-bottom: 8px; transition: color 0.2s; }
.footer-links li a:hover { color: #a07856; }
@media (max-width: 992px) { .title-cursive-elegant { font-size: 2.8rem !important; } }
</style>