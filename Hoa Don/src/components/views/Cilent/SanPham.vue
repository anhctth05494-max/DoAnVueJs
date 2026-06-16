
<template>
  <div class="client-home bg-white">
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
                <li v-for="(cat, idx) in Object.keys(productsData)" :key="idx">
                  <a
                    class="dropdown-item d-flex justify-content-between align-items-center py-2 text-secondary custom-drop-item"
                    href="#"
                    @click.prevent="changeCategory(cat)"
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

            <div class="dropdown">
              <i
                class="bi bi-bag icon-btn position-relative"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="cursor: pointer"
              ></i>
              <div
                class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3 rounded-3 text-center custom-dropdown bg-white"
              >
                <i class="bi bi-bag-x fs-3 mb-2 d-block" style="color: #a07856"></i>
                <span class="small" style="color: #6f4d38">Giỏ hàng đang trống</span>
              </div>
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

    <!-- NỘI DUNG SẢN PHẨM -->
    <div v-if="currentView === 'PRODUCTS'">
      <section class="container pt-5 pb-3 mt-3 text-center" style="max-width: 800px">
        <h2 class="title-cursive-elegant mb-3" style="font-size: 3.5rem; color: #3d211a">
          {{ currentCategory }}
        </h2>
        <p class="lh-lg fst-italic" style="font-size: 1rem; color: #6f4d38">
          "{{ currentCategoryInfo.desc }}"
        </p>
      </section>

      <section class="container pb-5 mb-5 mt-2">
        <div class="d-flex justify-content-end mb-4 border-bottom pb-3">
          <span style="font-size: 0.95rem; color: #a07856"
            >Hiển thị {{ currentProductList.length }} sản phẩm</span
          >
        </div>

        <div class="row g-4 justify-content-center">
          <div
            class="col-12 col-sm-6 col-lg-4"
            v-for="product in currentProductList"
            :key="product.id"
          >
            <div class="card border-0 shadow-none h-100 product-card-v2 text-center bg-white">
              <div class="position-relative overflow-hidden mb-3 bg-white" style="height: 550px">
                <img
                  :src="product.image"
                  class="w-100 h-100 object-fit-cover"
                  :alt="product.name"
                />
              </div>
              <div class="card-body p-0 bg-white">
                <h6 class="fw-bold mb-1" style="font-size: 1.05rem; color: #3d211a">
                  {{ product.name }}
                </h6>
                <p class="mb-3 fw-medium" style="font-size: 0.95rem; color: #6f4d38">
                  {{ product.priceFormatted }}
                </p>
                <button
                  class="btn rounded-0 px-4 py-2 fw-bold btn-xem-chi-tiet"
                  @click="showDetail(product)"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- NỘI DUNG CHI TIẾT SẢN PHẨM -->
    <div
      v-else-if="currentView === 'PRODUCT_DETAIL' && selectedProduct"
      class="container py-5 mt-2"
      style="min-height: 70vh"
    >
      <button
        class="btn btn-link text-decoration-none mb-4 px-0 fw-medium"
        style="color: #a07856"
        @click="currentView = 'PRODUCTS'"
      >
        <i class="bi bi-arrow-left me-1"></i> Quay lại {{ currentCategory }}
      </button>

      <div class="row g-5">
        <div class="col-md-6">
          <div
            class="rounded-2 overflow-hidden h-100 d-flex align-items-center justify-content-center bg-white"
            style="min-height: 600px"
          >
            <img
              :src="selectedProduct.image"
              class="w-100 h-100 object-fit-cover"
              :alt="selectedProduct.name"
            />
          </div>
        </div>

        <div class="col-md-6">
          <h2 class="fw-bold mb-3" style="font-family: 'Playfair Display', serif; color: #3d211a">
            {{ selectedProduct.name }}
          </h2>
          <h4 class="fw-bold mb-4" style="color: #6f4d38">{{ selectedProduct.priceFormatted }}</h4>

          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold" style="color: #3d211a">Kích cỡ</span>
              <a
                href="#"
                class="text-decoration-none small"
                style="color: #a07856; border-bottom: 1px solid #a07856"
                >Bảng kích thước</a
              >
            </div>
            <div class="d-flex gap-2">
              <button
                v-for="size in ['XS', 'S', 'M', 'L', 'XL']"
                :key="size"
                class="btn size-btn"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="mb-4">
            <span class="fw-bold d-block mb-2" style="color: #3d211a">Số lượng</span>
            <div
              class="quantity-selector d-inline-flex border rounded-1 bg-white"
              style="border-color: #cbb799 !important"
            >
              <button
                class="btn px-3 border-0 bg-white"
                style="color: #6f4d38"
                @click="quantity > 1 ? quantity-- : null"
              >
                -
              </button>
              <input
                type="text"
                class="form-control border-0 text-center fw-bold bg-white"
                style="width: 50px; color: #3d211a"
                v-model="quantity"
                readonly
              />
              <button class="btn px-3 border-0 bg-white" style="color: #6f4d38" @click="quantity++">
                +
              </button>
            </div>
          </div>

          <div class="d-flex gap-3 mb-5">
            <button class="btn flex-fill text-white fw-bold py-3 rounded-1 btn-add-cart">
              Thêm vào giỏ hàng
            </button>
            <button class="btn flex-fill fw-bold py-3 rounded-1 btn-buy-now">Mua ngay</button>
          </div>

          <div
            class="product-description p-4 rounded-1 bg-white"
            style="border: 1px solid #cbb799; color: #6f4d38"
          >
            <p class="fw-bold mb-2" style="color: #3d211a">MÔ TẢ SẢN PHẨM:</p>
            <p class="mb-1 fw-bold" style="color: #3d211a">{{ selectedProduct.name }}</p>
            <p class="mb-3 fst-italic" style="font-size: 0.9rem">{{ selectedProduct.desc }}</p>
            <p class="mb-1">Lớp ngoài: {{ selectedProduct.outLayer }}</p>
            <p class="mb-1">Lớp trong: {{ selectedProduct.inLayer }}</p>
            <p class="mb-1">Hoạ tiết: {{ selectedProduct.pattern }}</p>
            <p class="mb-4">Kích cỡ: XS | S | M | L | XL</p>
            <p class="fst-italic mb-4" style="color: #3d211a">
              Lưu ý: Màu sắc sản phẩm có thể thay đổi nhẹ tùy điều kiện ánh sáng.
            </p>
            <ul class="list-unstyled mb-0">
              <li>+ Giặt hấp hoặc giặt tay thật nhẹ nhàng</li>
              <li>+ Không sử dụng thuốc tẩy.</li>
            </ul>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentView = ref('PRODUCTS')
const currentCategory = ref('Áo dài truyền thống')
const selectedProduct = ref(null)
const selectedSize = ref('M')
const quantity = ref(1)

const categoryData = {
  'Áo dài truyền thống': {
    desc: 'Từ nét vẽ phóng khoáng trên tà lụa mềm mại, đến âm hưởng rộn rã của ngày Tết cổ truyền, tất cả hòa quyện tạo nên một diện mạo duyên dáng, e ấp nhưng đầy kiêu hãnh của người phụ nữ Việt Nam.',
  },
  'Áo dài cách tân': {
    desc: 'Sự giao thoa hoàn hảo giữa nét đẹp truyền thống và nhịp sống đương đại. Từ những đường cắt cúp hiện đại đến chất liệu phá cách, mỗi thiết kế là một bản hòa ca tôn vinh sự trẻ trung và năng động.',
  },
  'Áo dài nam': {
    desc: 'Mang đậm khí chất nam nhi, tà áo dài truyền tải vẻ đẹp phong độ, đĩnh đạc và niềm tự hào dân tộc. Lựa chọn hoàn hảo để đấng mày râu thể hiện bản sắc trong những dịp sự kiện trọng đại.',
  },
  'Áo dài cưới': {
    desc: 'Sắc đỏ rực rỡ cùng những họa tiết uyên ương tinh xảo gửi gắm lời chúc trăm năm viên mãn. Từng đường kim mũi chỉ thêu dệt nên một thiết kế lộng lẫy.',
  },
  'Áo dài học sinh': {
    desc: 'Màu áo trắng tinh khôi gắn liền với những mộng mơ của tuổi học trò. Thiết kế giản dị, mộc mạc cùng chất liệu mềm mại bay bổng theo những vòng xe đạp chở đầy thanh xuân rực rỡ.',
  },
}

const productsData = {
  'Áo dài truyền thống': [
    {
      id: 'tt1',
      name: 'Bích Họa Xuân Thì',
      priceFormatted: '2.500.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_XVXOlduqX9.jpeg?v=1766630773',
      outLayer: 'Tơ sống',
      inLayer: 'Lụa ngọc trai',
      pattern: 'Hoa Lan',
      desc: 'Thiết kế mang đậm nét truyền thống với tà áo suông dài.',
    },
    {
      id: 'tt2',
      name: 'Bích Họa Liên Hoa',
      priceFormatted: '2.850.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_Jd1SiUulSn.jpeg?v=1766630545',
      outLayer: 'Lụa tơ tằm',
      inLayer: 'Lụa satin',
      pattern: 'Hoa Sen thêu tay',
      desc: 'Lấy cảm hứng từ đoá sen tinh khiết, nền nã.',
    },
    {
      id: 'tt3',
      name: 'Bích Họa Phong Xuân',
      priceFormatted: '2.300.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_w6fE7kKq0O.jpeg?v=1766630313',
      outLayer: 'Gấm ta',
      inLayer: 'Lụa habotai',
      pattern: 'Chim Công múa',
      desc: 'Họa tiết lộng lẫy trên nền gấm xanh ngọc.',
    },
  ],
  'Áo dài cách tân': [
    {
      id: 'ct1',
      name: 'Áo Dài Giao Mùa',
      priceFormatted: '1.950.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_LzYroc7Cct.jpeg?v=1766745547',
      outLayer: 'Organza',
      inLayer: 'Lụa mềm',
      pattern: 'Hoa mai nhí',
      desc: 'Dáng áo tay phồng lửng trẻ trung.',
    },
    {
      id: 'ct2',
      name: 'Áo Dài Yên Đan',
      priceFormatted: '2.100.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_rDsPZYagEU.jpeg?v=1766745494',
      outLayer: 'Tafta',
      inLayer: 'Cotton lụa',
      pattern: 'Trơn',
      desc: 'Thiết kế cổ vuông hiện đại, chít eo tinh tế.',
    },
    {
      id: 'ct3',
      name: 'Áo Dài Trúc Đào',
      priceFormatted: '1.800.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_Lq5H9rz6yB.jpeg?v=1766745454',
      outLayer: 'Voan tơ',
      inLayer: 'Lụa crepe',
      pattern: 'Hoạ tiết lập thể',
      desc: 'Sự pha trộn giữa nét truyền thống và hơi thở hiện đại.',
    },
  ],
  'Áo dài nam': [
    {
      id: 'nam1',
      name: 'Nam Phục Long Cổ',
      priceFormatted: '3.200.000 đ',
      image: 'https://i.pinimg.com/1200x/ba/d4/16/bad41623d05e5daa11948a3978f4b7ee.jpg',
      outLayer: 'Gấm Hàn',
      inLayer: 'Lụa bóng',
      pattern: 'Rồng cuộn',
      desc: 'Thiết kế nam tính, mạnh mẽ.',
    },
    {
      id: 'nam2',
      name: 'Nam Phục Hạc Điểu',
      priceFormatted: '3.800.000 đ',
      image: 'https://i.pinimg.com/1200x/83/1a/d3/831ad3d2f472e1535a869614f37df885.jpg',
      outLayer: 'Gấm thượng hạng',
      inLayer: 'Satin',
      pattern: 'Trống đồng',
      desc: 'Chất liệu gấm dày dặn, sang trọng.',
    },
    {
      id: 'nam3',
      name: 'Nam Phục Trúc Sơn',
      priceFormatted: '2.900.000 đ',
      image: 'https://i.pinimg.com/736x/44/8d/d6/448dd638cec05e40e3a34346205e2cab.jpg',
      outLayer: 'Đũi tơ tằm',
      inLayer: 'Lụa',
      pattern: 'Vân trúc',
      desc: 'Mang vẻ đẹp thư sinh, điềm đạm.',
    },
  ],
  'Áo dài cưới': [
    {
      id: 'cuoi1',
      name: 'Hỷ Phục Uyên Ương',
      priceFormatted: '5.500.000 đ',
      image: 'https://i.pinimg.com/736x/d1/bf/28/d1bf2815ba8ebed60b9d27f9b873f0b9.jpg',
      outLayer: 'Lụa tơ tằm',
      inLayer: 'Lụa ngọc trai',
      pattern: 'Phượng Hoàng',
      desc: 'Biểu tượng của tình yêu viên mãn.',
    },
    {
      id: 'cuoi2',
      name: 'Hỷ Phục Bách Hợp',
      priceFormatted: '4.800.000 đ',
      image: 'https://i.pinimg.com/1200x/80/38/a5/8038a5f53b374db10209825dd357957f.jpg',
      outLayer: 'Ren Pháp',
      inLayer: 'Satin',
      pattern: 'Hoa bách hợp',
      desc: 'Vẻ đẹp lãng mạn, ngọt ngào mang đậm phong cách hoàng gia.',
    },
    {
      id: 'cuoi3',
      name: 'Hỷ Phục Giao Tình',
      priceFormatted: '6.200.000 đ',
      image: 'https://i.pinimg.com/1200x/ea/57/4e/ea574e0db6e35711185a5af38939dd98.jpg',
      outLayer: 'Gấm đỏ đô',
      inLayer: 'Lụa mềm',
      pattern: 'Chữ Hỷ',
      desc: 'Sắc đỏ rực rỡ tượng trưng cho may mắn.',
    },
  ],
  'Áo dài học sinh': [
    {
      id: 'hs1',
      name: 'Bạch Tuệ Nữ Sinh',
      priceFormatted: '850.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20250905_kOB5RJ5r2E.jpeg?v=1757039795',
      outLayer: 'Chiffon',
      inLayer: 'Lụa lót',
      pattern: 'Trơn',
      desc: 'Áo dài trắng tinh khôi, mỏng nhẹ.',
    },
    {
      id: 'hs2',
      name: 'Tinh Khôi Nhật Bình',
      priceFormatted: '950.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_spy9wQkZob.jpeg?v=1766630389',
      outLayer: 'Lụa Ý',
      inLayer: 'Không',
      pattern: 'Trơn',
      desc: 'Sử dụng lụa Ý co giãn nhẹ.',
    },
    {
      id: 'hs3',
      name: 'Thanh Vân Sơ Tâm',
      priceFormatted: '1.100.000 đ',
      image: 'https://pos.nvncdn.com/22713a-176435/ps/20241122_FsrcRTpQUb.jpeg?v=1732289738',
      outLayer: 'Gấm tơ',
      inLayer: 'Lụa',
      pattern: 'Vân hoa chìm',
      desc: 'Phiên bản cao cấp hoa chìm.',
    },
  ],
}

const currentCategoryInfo = computed(
  () => categoryData[currentCategory.value] || categoryData['Áo dài truyền thống'],
)
const currentProductList = computed(
  () => productsData[currentCategory.value] || productsData['Áo dài truyền thống'],
)

onMounted(() => {
  if (route.query.category && productsData[route.query.category]) {
    currentCategory.value = route.query.category
  }
})
watch(
  () => route.query.category,
  (newCat) => {
    if (newCat && productsData[newCat]) {
      currentCategory.value = newCat
      currentView.value = 'PRODUCTS'
      window.scrollTo(0, 0)
    }
  },
)

const changeCategory = (cat) => {
  currentCategory.value = cat
  currentView.value = 'PRODUCTS'
  router.push({ path: '/cua-hang', query: { category: cat } })
  window.scrollTo(0, 0)
}

const showDetail = (product) => {
  selectedProduct.value = product
  currentView.value = 'PRODUCT_DETAIL'
  selectedSize.value = 'M'
  quantity.value = 1
  window.scrollTo(0, 0)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
.client-home {
  font-family: 'Segoe UI', sans-serif;
  background-color: #ffffff;
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
.product-card-v2 {
  transition: all 0.3s ease;
}
.product-card-v2:hover {
  transform: translateY(-3px);
}
.btn-xem-chi-tiet {
  background-color: #ffffff;
  color: #6f4d38;
  border: 1px solid #cbb799;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}
.btn-xem-chi-tiet:hover {
  background-color: #6f4d38;
  color: #ffffff;
  border-color: #6f4d38;
}

.size-btn {
  background-color: #ffffff;
  border: 1px solid #cbb799;
  color: #6f4d38;
  width: 45px;
  height: 45px;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.2s;
}
.size-btn:hover {
  border-color: #6f4d38;
  color: #3d211a;
}
.size-btn.active {
  background-color: #6f4d38;
  color: white;
  border-color: #6f4d38;
}
.quantity-selector {
  height: 45px;
}

.btn-add-cart {
  background-color: #6f4d38;
  border: 1px solid #6f4d38;
  transition: background-color 0.2s;
}
.btn-add-cart:hover {
  background-color: #3d211a;
  border-color: #3d211a;
}
.btn-buy-now {
  background-color: #ffffff;
  color: #6f4d38;
  border: 1px solid #6f4d38;
  transition: background-color 0.2s;
}
.btn-buy-now:hover {
  background-color: #f8f9fa;
  color: #3d211a;
  border-color: #3d211a;
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
