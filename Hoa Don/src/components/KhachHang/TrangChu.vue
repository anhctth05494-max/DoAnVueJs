<template>
  <div class="client-home bg-white" style="min-height: 100vh">
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

    <nav class="navbar navbar-expand-lg bg-white sticky-top py-3 border-bottom shadow-sm">
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

    <header class="hero-banner-section mb-5">
      <div class="hero-bg-image d-flex align-items-center" style="background-image: url('s.png')">
        <div class="container px-4 px-lg-5">
          <div class="row">
            <div class="col-12 col-md-8 col-lg-6">
              <div class="hero-text-box">
                <div class="hero-brand mt-4">
                  <span class="fw-bold" style="font-family: 'Playfair Display', serif; font-size: 1.1rem; letter-spacing: 2px;"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="container px-4 px-lg-5 pb-2 mt-5">
      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 pe-lg-5 mb-4 mb-lg-0">
          <div class="img-elegant shadow-none" style="background-image: url('anh2.jpg')"></div>
        </div>
        <div class="col-lg-6 ps-lg-4 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Ngang qua ngày cũ</h2>
          <p class="desc-elegant mb-0">
            Một mùa mới, bước ra từ ký ức. Lắng nghe những khoảng lặng vang vọng trong những khoảnh
            khắc của những ngày cuối cùng trong năm: mùi vải và chỉ thêu trong chiếc hộp kim chỉ của
            mẹ, tiếng chim sẻ rúc rích ngoài hiên, những buổi trưa nắng lung linh trên tà áo. Những
            điều bé nhỏ ấy, khi năm tháng đi qua, bỗng trở thành nơi trú ẩn của tâm hồn.
            <br /><br />
            Từng nếp gấp, từng khoảnh khắc của thời gian và những bộ áo dài được sáng tạo ra để trân
            trọng hành trình phát triển bản thân của mỗi người phụ nữ, là sự trở về với vẻ đẹp nền
            tảng của đời sống Việt: dịu dàng, chừng mực và sâu sắc.
          </p>
        </div>
      </div>

      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 order-2 order-lg-1 pe-lg-5 mt-4 mt-lg-0 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Duyên Ước</h2>
          <p class="desc-elegant mb-0">
            Duyên Ước là bản tình ca bằng lụa, được dệt nên từ sự thấu hiểu và cảm xúc chân thành
            của những người yêu nhau. Đó là hiện thân cho tình yêu khi đã đủ chín, đủ sâu — lặng lẽ,
            điềm nhiên mà bền vững như gốc rễ lâu năm của một mối duyên lành. Duyên Ước là lời
            nguyện ước thành hình, là hồi ức của khoảnh khắc mà cả hai biết: đây chính là người sẽ
            cùng nắm tay đi đến trọn đời.
            <br /><br />
            Giai Đài tin rằng Duyên Ước sẽ là nơi chốn dịu dàng để mỗi cặp đôi tìm thấy chính mình -
            trong tình yêu, trong ký ức, và trong vẻ đẹp của một di sản đang sống.
          </p>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 ps-lg-4">
          <div class="img-elegant shadow-none" style="background-image: url('duyenuoc.jpg')"></div>
        </div>
      </div>

      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 pe-lg-5 mb-4 mb-lg-0">
          <div class="img-elegant shadow-none" style="background-image: url('giaoduyen.jpg')"></div>
        </div>
        <div class="col-lg-6 ps-lg-4 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Giao Duyên</h2>
          <p class="desc-elegant mb-0">
            Tình yêu không được đo đếm bằng những xa hoa phù phiếm, mà đọng lại trong những khoảnh
            khắc chân thật và giản dị nhất. Như ánh mắt của lần đầu gặp gỡ, hay nhịp tim hẫng trong
            khoảnh khắc tay đan - Giao Duyên được sinh ra từ chính những điều đơn thuần ấy - một
            thiết kế mang đậm hơi thở truyền thống nhưng tinh giản, nơi từng đường kim mũi chỉ được
            chăm chút để kể lại câu chuyện tình yêu thuần khiết qua ngôn ngữ của Áo Dài Việt.
            <br /><br />
            Dành tặng cho những cặp đôi muốn lưu lại những khoảnh khắc Pre-wedding đầy dấu ấn, Giao
            Duyên với chất liệu lụa gấm cùng những đường may tinh tế trên dáng áo suông mềm là thiết
            kế vừa vặn nhất để ôm trọn xúc cảm của người mặc.
          </p>
        </div>
      </div>
    </section>

    <section class="container px-4 px-lg-5 pt-5 border-top border-light">
      <div class="text-center mb-5">
        <h2 class="title-cursive-elegant mb-2" style="font-size: 3.5rem">Sản Phẩm Nổi Bật</h2>
        <p class="text-muted fst-italic" style="color: #6f4d38 !important">
          Những thiết kế được yêu thích nhất mùa này
        </p>
      </div>

      <div v-if="featuredProducts.length === 0" class="text-center py-5">
        <div class="spinner-border text-secondary" role="status"></div>
      </div>

      <div v-else class="row justify-content-center g-4">
        <div class="col-12 col-md-4" v-for="item in featuredProducts" :key="item.id">
          <div class="card border-0 shadow-none h-100 text-center bg-white product-bestseller">
            <div class="position-relative overflow-hidden mb-3" style="height: 550px; background-color: #f8f9fa; cursor: pointer" @click="goToProductDetail(item.id)">
              <img :src="item.image || '/Logo.png'" @error="handleImageError" class="w-100 h-100 object-fit-cover" :alt="item.name" />
            </div>
            <div class="card-body p-0">
              <h6 class="fw-bold mb-2 text-dark" style="font-size: 1.1rem; color: #3d211a !important; cursor: pointer" @click="goToProductDetail(item.id)">
                {{ item.name }}
              </h6>
              <p class="mb-3 fw-medium" style="font-size: 0.95rem; color: #6f4d38">{{ item.priceRangeLabel }}</p>
              <button class="btn rounded-0 px-4 py-2 fw-medium btn-xem-chi-tiet" @click="goToProductDetail(item.id)">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container px-4 px-lg-5 py-5 mt-5">
      <div class="text-center mb-5">
        <h3 class="mb-2" style="color: #3d211a; letter-spacing: 1px">
          Khách hàng <span class="fw-bold" style="font-family: 'Playfair Display', serif; color: #a82e3e">GIAI ĐÀI</span>
        </h3>
      </div>
      <div class="row g-3">
        <div class="col-4 col-md-4" v-for="(img, index) in feedbacks" :key="index">
          <div class="feedback-img-wrapper overflow-hidden rounded-1">
            <img :src="img" class="w-100 object-fit-cover feedback-img" alt="Khách hàng Giai Đài" />
          </div>
        </div>
      </div>
    </section>

    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #cbb799">
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img src="/Logo.png" alt="Logo Giai Đài" style="height: 55px; object-fit: contain" class="mb-3" />
            <p class="small lh-lg" style="color: #6f4d38">
              Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam. Từng
              đường kim mũi chỉ là sự kết tinh của nghệ thuật thủ công và hơi thở thời đại.
            </p>
            <div class="d-flex gap-3 mt-3">
              <a href="#" class="social-icon"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Về chúng tôi</h6>
            <ul class="list-unstyled footer-links">
              <li><router-link to="/gioi-thieu" style="color: #6f4d38; text-decoration: none;">Câu chuyện thương hiệu</router-link></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Liên hệ</h6>
            <ul class="list-unstyled footer-links text-muted small">
              <li class="mb-2">
                <i class="bi bi-telephone-fill me-2" style="color: #a07856"></i><span style="color: #6f4d38">0123 456 789</span>
              </li>
              <li>
                <i class="bi bi-envelope-fill me-2" style="color: #a07856"></i><span style="color: #6f4d38">cskh@giaidai.vn</span>
              </li>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Lấy biến cartCount từ store để đồng bộ giỏ hàng
import { cartCount } from '../../store/cartStore.js' // Chú ý: sửa lại đường dẫn nếu thư mục store của bạn nằm ở vị trí khác nhé

const router = useRouter()
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

const handleImageError = (e) => {
  e.target.src = '/Logo.png' 
  e.target.style.objectFit = 'contain'
  e.target.onerror = null 
}

// FORMAT TIỀN TỆ VÀ ẢNH
const formatVND = (value) => {
  if (value === undefined || value === null) return '0 đ'
  return value.toLocaleString('vi-VN') + ' đ'
}

const formatProductImage = (imgName) => {
  if (!imgName || imgName === 'null' || imgName === 'undefined') return '/Logo.png' 
  if (imgName.startsWith('data:image')) return imgName
  if (imgName.startsWith('http://') || imgName.startsWith('https://')) return imgName
  return `http://localhost:8080/api/sanpham-chitiet/images/${imgName}`
}

// DANH SÁCH 3 SẢN PHẨM NỔI BẬT LẤY TỪ API
const featuredProducts = ref([])

const loadFeaturedProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/sanpham') 
    if (response.data && response.data.length > 0) {
      // Lọc sản phẩm đang kinh doanh và CHỈ LẤY 3 SẢN PHẨM ĐẦU TIÊN
      const activeProducts = response.data.filter(p => p.trangThai === 1 || p.trangThai === true).slice(0, 3)

      const loaded = await Promise.all(
        activeProducts.map(async (p) => {
          let variants = []
          try {
            const variantRes = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${p.id}`)
            variants = variantRes.data || []
          } catch (err) { }

          let priceRangeLabel = 'Đang cập nhật'
          let defaultImg = p.hinhAnhDaiDien

          if (variants.length > 0) {
            const prices = variants.map(v => v.giaSauGiam)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            if (minPrice === maxPrice) {
              priceRangeLabel = formatVND(minPrice)
            } else {
              priceRangeLabel = `${minPrice.toLocaleString('vi-VN')} ~ ${maxPrice.toLocaleString('vi-VN')} đ`
            }
            if (!defaultImg) {
              defaultImg = variants[0].hinhAnh
            }
          }

          return {
            id: p.id,
            name: p.tenSanPham || p.name,
            image: formatProductImage(defaultImg),
            priceRangeLabel: priceRangeLabel
          }
        })
      )
      featuredProducts.value = loaded
    }
  } catch (error) {
    console.error("Lỗi tải sản phẩm nổi bật:", error)
  }
}

const goToProductDetail = (productId) => {
  // Lưu ID sản phẩm vào sessionStorage trước khi chuyển trang
  sessionStorage.setItem('pendingProductId', productId);
  router.push('/cua-hang');
  window.scrollTo(0, 0);
}

// DỮ LIỆU FEEDBACK ẢNH ẢO
const feedbacks = [
  'https://i.pinimg.com/1200x/a6/24/4e/a6244efe696231f53a85edf4006a9a80.jpg',
  'https://i.pinimg.com/736x/a1/dc/9c/a1dc9c697c321bb5b06e6d1f99517148.jpg',
  'https://i.pinimg.com/736x/44/68/8a/44688aad3f0e8db7eb53d9e99fc49bb5.jpg',
  'https://i.pinimg.com/736x/b4/54/23/b45423238fd7c3fecc06bb2d7b1550ee.jpg',
  'https://i.pinimg.com/1200x/e6/c2/ee/e6c2ee0550b7f16965e0311c7f88acb4.jpg',
  'https://i.pinimg.com/1200x/90/dd/cd/90ddcd9b09accec2ea93e798f59f7128.jpg',
  'https://i.pinimg.com/1200x/be/df/f1/bedff10d70f20f1a122a390db7320557.jpg',
  'https://i.pinimg.com/736x/d6/da/a3/d6daa31a1a50b2fc9a51ecad4a957cf3.jpg',
  'https://i.pinimg.com/1200x/6d/25/df/6d25df3882e1a50adb03f70ebb1000c4.jpg',
]

onMounted(() => {
  loadFeaturedProducts()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.client-home {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

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
  min-width: 200px;
  border-top: 3px solid #6f4d38 !important;
  margin-top: 10px;
}

.hero-banner-section {
  width: 100%;
}
.hero-bg-image {
  width: 100%;
  height: 85vh;
  min-height: 600px;
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
}

.title-cursive-elegant {
  font-family: 'Dancing Script', cursive !important;
  font-weight: 700;
  color: #3d211a;
  line-height: 1.2;
}

.desc-elegant {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #6f4d38;
  text-align: justify;
}

.img-elegant {
  width: 100%;
  height: 380px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
}

/* CSS BEST SELLER */
.product-bestseller {
  transition: all 0.3s ease;
}
.product-bestseller:hover {
  transform: translateY(-5px);
}
.btn-xem-chi-tiet {
  background-color: #f1efef;
  color: #a82e3e;
  border: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}
.btn-xem-chi-tiet:hover {
  background-color: #e2e0e0;
}

/* CSS FEEDBACK IMAGE */
.feedback-img-wrapper {
  aspect-ratio: 1 / 1;
}
.feedback-img {
  height: 100%;
  transition: transform 0.3s ease;
}
.feedback-img:hover {
  transform: scale(1.05); 
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
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #cbb799;
  color: #6f4d38;
  transition: all 0.3s;
  text-decoration: none;
}
.social-icon:hover {
  background-color: #6f4d38;
  color: #ffffff;
}

@media (max-width: 992px) {
  .title-cursive-elegant {
    font-size: 2.5rem;
    text-align: center;
  }
}
</style>