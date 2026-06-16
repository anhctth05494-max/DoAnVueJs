<template>
  <div class="client-home bg-white" style="min-height: 100vh">
    <!-- NAVBAR ĐỒNG BỘ -->
    <nav class="navbar navbar-expand-lg bg-white sticky-top py-3 border-bottom shadow-sm">
      <div class="container-fluid px-4 px-lg-5">
        <a
          class="navbar-brand d-flex align-items-center text-decoration-none"
          href="#"
          @click.prevent="router.push('/')"
        >
          <img src="/Logo.png" alt="Logo Giai Đài" style="height: 60px; object-fit: contain" />
        </a>


        <button
          class="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>


        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center align-items-center">
            <li class="nav-item">
              <a class="nav-link fw-medium nav-text" href="#" @click.prevent="router.push('/')"
                >Trang chủ</a
              >
            </li>


            <li class="nav-item dropdown">
              <a
                class="nav-link fw-medium nav-text dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                >Sản phẩm</a
              >
              <ul
                class="dropdown-menu border-0 shadow rounded-0 mt-3 p-2 bg-white"
                style="min-width: 250px"
              >
                <li v-for="cat in categories" :key="cat">
                  <a
                    class="dropdown-item d-flex justify-content-between align-items-center py-2 text-secondary custom-drop-item"
                    href="#"
                    @click.prevent="goToStore(cat)"
                  >
                    {{ cat }} <i class="bi bi-chevron-right small"></i>
                  </a>
                </li>
              </ul>
            </li>


            <li class="nav-item">
              <a
                class="nav-link fw-medium nav-text"
                href="#"
                @click.prevent="router.push('/san-voucher')"
                >Săn Voucher</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link fw-medium nav-text"
                href="#"
                @click.prevent="router.push('/lien-he')"
                >Liên hệ</a
              >
            </li>
          </ul>


          <div
            class="d-flex align-items-center justify-content-center gap-4 fs-5 nav-text mt-3 mt-lg-0"
          >
            <div class="dropdown">
              <i
                class="bi bi-bell icon-btn position-relative"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="cursor: pointer"
              ></i>
              <div
                class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3 rounded-3 text-center custom-dropdown bg-white"
              >
                <i class="bi bi-bell-slash fs-3 mb-2 d-block" style="color: #a07856"></i>
                <span class="small" style="color: #6f4d38">Không có thông báo mới</span>
              </div>
            </div>


            <div class="d-flex align-items-center">
              <i
                class="bi bi-bag position-relative"
                @click="router.push('/gio-hang')"
                style="cursor: pointer; font-size: 1.3rem; color: #6f4d38"
              >
                <span
                  v-if="cartCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style="background-color: #a82e3e; font-size: 0.65rem"
                >
                  {{ cartCount }}
                </span>
              </i>
            </div>


            <div class="dropdown">
              <i
                class="bi bi-person-circle icon-btn"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="cursor: pointer"
              ></i>
              <div
                class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-4 rounded-3 text-center custom-dropdown bg-white"
                style="min-width: 220px"
              >
                <div class="d-flex flex-column align-items-center mb-3">
                  <div
                    class="rounded-circle d-flex align-items-center justify-content-center mb-2 bg-white"
                    style="width: 55px; height: 55px; border: 1px solid #cbb799"
                  >
                    <i class="bi bi-person fs-2" style="color: #6f4d38"></i>
                  </div>
                  <span class="fw-bold" style="color: #3d211a; font-size: 1.1rem"
                    >Tài khoản Khách</span
                  >
                </div>
                <button class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-login">
                  Đăng nhập
                </button>
                <button
                  class="btn w-100 btn-sm text-white rounded-1"
                  style="background-color: #6f4d38"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>


    <!-- NỘI DUNG LIÊN HỆ -->
    <div class="container py-5 mt-2" style="min-height: 60vh">
      <section class="text-center mb-5" style="max-width: 800px; margin: auto">
        <h2 class="title-cursive-elegant mb-3" style="font-size: 3.5rem; color: #3d211a">
          Liên Hệ
        </h2>
        <p class="lh-lg fst-italic" style="font-size: 1rem; color: #6f4d38">
          "Giai Đài luôn lắng nghe và trân trọng mọi chia sẻ từ bạn. Hãy để lại thông tin, chúng tôi
          sẽ phản hồi trong thời gian sớm nhất."
        </p>
      </section>


      <div class="row g-5">
        <div class="col-md-5">
          <h4 class="fw-bold mb-4" style="font-family: 'Playfair Display', serif; color: #3d211a">
            Thông tin cửa hàng
          </h4>
          <div class="d-flex mb-4">
            <i class="bi bi-geo-alt fs-4 me-3" style="color: #a07856"></i>
            <div>
              <h6 class="fw-bold mb-1" style="color: #3d211a">Trụ sở chính Hà Nội</h6>
              <p class="mb-0" style="color: #6f4d38">
                Số 123 Đường Áo Dài, Quận Hoàn Kiếm, TP. Hà Nội
              </p>
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
            <h4 class="fw-bold mb-4" style="font-family: 'Playfair Display', serif; color: #3d211a">
              Gửi tin nhắn cho chúng tôi
            </h4>
            <form @submit.prevent="submitContact">
              <div class="row g-3 mb-3">
                <div class="col-sm-6">
                  <label class="form-label fw-medium" style="color: #6f4d38">Họ và tên</label>
                  <input
                    type="text"
                    class="form-control custom-input bg-white"
                    placeholder="Nhập họ tên..."
                  />
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-medium" style="color: #6f4d38">Số điện thoại</label>
                  <input
                    type="tel"
                    class="form-control custom-input bg-white"
                    placeholder="Nhập số điện thoại..."
                  />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium" style="color: #6f4d38">Email</label>
                <input
                  type="email"
                  class="form-control custom-input bg-white"
                  placeholder="Nhập địa chỉ email..."
                />
              </div>
              <div class="mb-4">
                <label class="form-label fw-medium" style="color: #6f4d38">Nội dung lời nhắn</label>
                <textarea
                  class="form-control custom-input bg-white"
                  rows="4"
                  placeholder="Nhập nội dung cần hỗ trợ..."
                ></textarea>
              </div>
              <button type="submit" class="btn w-100 fw-bold py-2 btn-submit-contact">
                GỬI YÊU CẦU
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>


    <!-- FOOTER ĐỒNG BỘ -->
    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #cbb799">
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img
              src="/Logo.png"
              alt="Logo Giai Đài"
              style="height: 55px; object-fit: contain"
              class="mb-3"
            />
            <p class="small lh-lg" style="color: #6f4d38">
              Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam.
            </p>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Về chúng tôi</h6>
            <ul class="list-unstyled footer-links">
              <li><a href="#">Câu chuyện thương hiệu</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Liên hệ</h6>
            <ul class="list-unstyled footer-links text-muted small">
              <li>
                <i class="bi bi-telephone-fill me-2" style="color: #a07856"></i
                ><span style="color: #6f4d38">0123 456 789</span>
              </li>
              <li>
                <i class="bi bi-envelope-fill me-2" style="color: #a07856"></i
                ><span style="color: #6f4d38">cskh@giaidai.vn</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="text-center pt-4 mt-4" style="border-top: 1px solid #f0f0f0">
          <p class="small mb-0" style="color: #a07856">
            &copy; 2026 Giai Đài. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()
const categories = [
  'Áo dài truyền thống',
  'Áo dài cách tân',
  'Áo dài nam',
  'Áo dài cưới',
  'Áo dài học sinh',
]


const goToStore = (category) => {
  router.push({ path: '/cua-hang', query: { category: category } })
}
const submitContact = () => {
  alert('Cảm ơn bạn đã liên hệ. Giai Đài sẽ phản hồi sớm nhất!')
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
.client-home {
  font-family: 'Segoe UI', sans-serif;
}
.nav-text {
  color: #3d211a !important;
  font-size: 0.95rem;
  text-transform: uppercase;
  transition: color 0.3s ease;
}
.nav-text:hover {
  color: #a07856 !important;
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



