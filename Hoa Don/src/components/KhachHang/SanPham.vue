<template>
  <div class="client-home bg-white" style="min-height: 100vh;">
    <!-- ==============================================
         NAVBAR ĐỒNG BỘ CÁC TRANG
         ============================================== -->
    <nav class="navbar navbar-expand-lg bg-white sticky-top py-3 border-bottom shadow-sm">
      <div class="container-fluid px-4 px-lg-5">
        <a class="navbar-brand d-flex align-items-center text-decoration-none" href="#" @click.prevent="router.push('/')">
          <img src="/Logo.png" alt="Logo Giai Đài" style="height: 60px; object-fit: contain" />
        </a>


        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>


        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center align-items-center">
            <li class="nav-item">
              <a class="nav-link fw-medium nav-text" href="#" @click.prevent="router.push('/')">Trang chủ</a>
            </li>


            <li class="nav-item dropdown">
              <a class="nav-link fw-medium nav-text dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Sản phẩm
              </a>
              <ul class="dropdown-menu border-0 shadow rounded-0 mt-3 p-2 bg-white" style="min-width: 250px">
                <li v-for="cat in Object.keys(productsData)" :key="cat">
                  <a class="dropdown-item d-flex justify-content-between align-items-center py-2 text-secondary custom-drop-item"
                     href="#" @click.prevent="changeCategory(cat)">
                    {{ cat }} <i class="bi bi-chevron-right small"></i>
                  </a>
                </li>
              </ul>
            </li>


            <li class="nav-item">
              <a class="nav-link fw-medium nav-text" href="#" @click.prevent="router.push('/san-voucher')">Săn Voucher</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-medium nav-text" href="#" @click.prevent="router.push('/lien-he')">Liên hệ</a>
            </li>
          </ul>


          <div class="d-flex align-items-center justify-content-center gap-4 fs-5 nav-text mt-3 mt-lg-0">
            <i class="bi bi-bag icon-btn position-relative" @click="router.push('/gio-hang')" style="cursor: pointer; color: #3D211A;">
              <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background-color: #a82e3e; font-size: 0.65rem">
                {{ cartCount }}
              </span>
            </i>
          </div>
        </div>
      </div>
    </nav>


    <!-- ==============================================
         VIEW: DANH SÁCH SẢN PHẨM PHỐI HỢP BỘ LỌC
         ============================================== -->
    <div v-if="currentView === 'PRODUCTS'" class="container-fluid px-4 px-lg-5 py-5">
     
      <!-- HEADER MỖI DANH MỤC -->
      <section class="text-center mb-4 mx-auto" style="max-width: 800px">
        <h2 class="title-cursive-elegant mb-3" style="font-size: 3.5rem; color: #3d211a">
          {{ currentCategory }}
        </h2>
        <p class="lh-lg fst-italic" style="font-size: 1rem; color: #6f4d38">
          "{{ currentCategoryInfo.desc }}"
        </p>
      </section>


      <div class="row g-4 mt-2">
       
        <!-- CỘT TRÁI: BỘ LỌC SẢN PHẨM CHUẨN ẢNH image_f8c146.png -->
        <div class="col-12 col-lg-3">
          <div class="card border-0 shadow-sm p-4 bg-white rounded-3">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0" style="color: #3D211A; letter-spacing: 0.5px;">Bộ lọc sản phẩm</h5>
              <button class="btn btn-sm btn-light rounded-pill px-3 py-1" style="font-size: 0.8rem; color: #6f4d38;" @click="clearAllFilters">Xóa</button>
            </div>


            <!-- Trường lọc: Từ khóa -->
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Từ khóa</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-start-0 ps-0 shadow-none" placeholder="Tên sản phẩm, mô tả..." v-model="searchKeyword" />
              </div>
            </div>


            <!-- Trường lọc: Loại sản phẩm (Danh mục) -->
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Loại sản phẩm</label>
              <select class="form-select shadow-none" v-model="currentCategory" @change="syncCategoryRoute">
                <option v-for="cat in Object.keys(productsData)" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>


            <!-- Trường lọc: Màu sắc -->
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Màu sắc</label>
              <select class="form-select shadow-menu shadow-none" v-model="filterColor">
                <option value="">Tất cả màu sắc</option>
                <option value="Hồng">Hồng duyên dáng</option>
                <option value="Trắng">Trắng tinh khôi</option>
                <option value="Xanh ngọc">Xanh ngọc nhã nhặn</option>
                <option value="Vàng">Vàng ánh kim</option>
                <option value="Đỏ">Đỏ cổ điển</option>
                <option value="Đỏ đô">Đỏ đô quý phái</option>
                <option value="Xanh navy">Xanh navy lịch lãm</option>
                <option value="Xanh">Xanh trúc thư thái</option>
              </select>
            </div>


            <!-- Trường lọc: Kích thước -->
            <div class="mb-4">
              <label class="form-label small fw-bold text-muted mb-2">Kích thước</label>
              <select class="form-select shadow-none" v-model="filterSize">
                <option value="">Tất cả kích thước</option>
                <option value="XS">Kích cỡ XS</option>
                <option value="S">Kích cỡ S</option>
                <option value="M">Kích cỡ M</option>
                <option value="L">Kích cỡ L</option>
                <option value="XL">Kích cỡ XL</option>
              </select>
            </div>


            <!-- Nút xóa toàn bộ bộ lọc dính chân -->
            <button class="btn w-100 text-white fw-medium py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    style="background-color: #3D211A;" @click="clearAllFilters">
              <i class="bi bi-arrow-counterclockwise"></i> Xóa toàn bộ bộ lọc
            </button>
          </div>
        </div>


        <!-- CỘT PHẢI: THANH TÌM KIẾM DƯỚI HEADER VÀ GRID SẢN PHẨM -->
        <div class="col-12 col-lg-9">
         
          <!-- Thanh tìm kiếm độc lập đặt dưới Header -->
          <div class="card border-0 shadow-sm p-3 mb-4 bg-white rounded-3">
            <div class="row g-3 align-items-center">
              <div class="col-12 col-md-8">
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted fs-5 py-2"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0 shadow-none py-2"
                         placeholder="Tìm kiếm nhanh tà áo dài bạn yêu thích trong bộ sưu tập này..." v-model="searchKeyword" />
                </div>
              </div>
              <div class="col-12 col-md-4 text-md-end text-start">
                <span class="small fw-medium" style="color: #a07856">Tìm thấy {{ filteredProductList.length }} tà áo phù hợp</span>
              </div>
            </div>
          </div>


          <!-- Trạng thái không tìm thấy kết quả phù hợp -->
          <div v-if="filteredProductList.length === 0" class="card border-0 shadow-sm text-center p-5 bg-white rounded-3">
            <i class="bi bi-search-heart text-muted mb-3" style="font-size: 3rem;"></i>
            <h5 class="fw-bold" style="color: #3d211a;">Không tìm thấy sản phẩm phù hợp</h5>
            <p class="text-muted small mb-0">Bạn hãy thử thay đổi từ khóa, màu sắc hoặc kích cỡ ở bộ lọc bên cạnh nhé.</p>
          </div>


          <!-- Lưới danh sách sản phẩm hiển thị -->
          <div v-else class="row g-4 justify-content-start">
            <div class="col-12 col-sm-6 col-lg-4" v-for="product in filteredProductList" :key="product.id">
              <div class="card border-0 shadow-none h-100 product-card-v2 text-center bg-white">
                <div class="position-relative overflow-hidden mb-3 bg-white" style="height: 520px">
                  <img :src="product.image" class="w-100 h-100 object-fit-cover rounded-2" :alt="product.name" />
                </div>
                <div class="card-body p-0 bg-white">
                  <h6 class="fw-bold mb-1" style="font-size: 1.05rem; color: #3d211a">
                    {{ product.name }}
                  </h6>
                  <p class="mb-2 small text-muted">Màu sắc: {{ product.color }}</p>
                  <p class="mb-3 fw-medium" style="font-size: 0.95rem; color: #6f4d38">
                    {{ product.priceFormatted }}
                  </p>
                  <button class="btn rounded-0 px-4 py-2 fw-bold btn-xem-chi-tiet" @click="showDetail(product)">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>


    <!-- ==============================================
         VIEW: CHI TIẾT SẢN PHẨM & TỒN KHO BIẾN THỂ ĐỘNG
         ============================================== -->
    <div v-else-if="currentView === 'PRODUCT_DETAIL' && selectedProduct" class="container py-5 mt-2" style="min-height: 70vh">
      <button class="btn btn-link text-decoration-none mb-4 px-0 fw-medium" style="color: #a07856" @click="currentView = 'PRODUCTS'">
        <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
      </button>


      <div class="row g-5">
        <div class="col-md-6">
          <div class="rounded-2 overflow-hidden h-100 d-flex align-items-center justify-content-center bg-white" style="min-height: 600px">
            <img :src="selectedProduct.image" class="w-100 h-100 object-fit-cover" :alt="selectedProduct.name" />
          </div>
        </div>


        <div class="col-md-6">
          <h2 class="fw-bold mb-3" style="font-family: 'Playfair Display', serif; color: #3d211a">
            {{ selectedProduct.name }}
          </h2>
          <p class="text-muted mb-2">Màu sắc chính: <strong>{{ selectedProduct.color }}</strong></p>
          <h4 class="fw-bold mb-4" style="color: #6f4d38">{{ selectedProduct.priceFormatted }}</h4>


          <!-- Chọn Kích cỡ -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold" style="color: #3d211a">Kích cỡ</span>
              <a href="#" class="text-decoration-none small" style="color: #a07856; border-bottom: 1px solid #a07856">Bảng kích thước</a>
            </div>
            <div class="d-flex gap-2">
              <button v-for="(stock, size) in selectedProduct.variants" :key="size"
                class="btn size-btn" :class="{ active: selectedSize === size, 'disabled-size': stock === 0 }"
                :disabled="stock === 0" @click="selectSize(size)">
                {{ size }}
              </button>
            </div>
          </div>


          <!-- Chọn Số lượng -->
          <div class="mb-4">
            <span class="fw-bold d-block mb-2" style="color: #3d211a">Số lượng</span>
            <div class="d-flex align-items-center gap-3">
              <div class="quantity-selector d-inline-flex border rounded-1 bg-white" style="border-color: #cbb799 !important">
                <button class="btn px-3 border-0 bg-white" style="color: #6f4d38" @click="quantity > 1 ? quantity-- : null">-</button>
                <input type="text" class="form-control border-0 text-center fw-bold bg-white" style="width: 50px; color: #3d211a" v-model="quantity" readonly />
                <button class="btn px-3 border-0 bg-white" style="color: #6f4d38" @click="quantity < currentStock ? quantity++ : null">+</button>
              </div>
              <span class="text-muted small">{{ currentStock }} sản phẩm có sẵn</span>
            </div>
          </div>


          <div class="d-flex gap-3 mb-5">
            <button class="btn flex-fill text-white fw-bold py-3 rounded-1 btn-add-cart" @click="handleAddToCart">
              Thêm vào giỏ hàng
            </button>
            <button class="btn flex-fill fw-bold py-3 rounded-1 btn-buy-now" @click="handleBuyNow">
              Mua ngay
            </button>
          </div>


          <!-- Thông tin cấu trúc vải -->
          <div class="product-description p-4 rounded-1 bg-white" style="border: 1px solid #cbb799; color: #6f4d38">
            <p class="fw-bold mb-2" style="color: #3d211a">MÔ TẢ SẢN PHẨM:</p>
            <p class="mb-1 fw-bold" style="color: #3d211a">{{ selectedProduct.name }}</p>
            <p class="mb-3 fst-italic" style="font-size: 0.9rem">{{ selectedProduct.desc }}</p>
            <p class="mb-1">Lớp ngoài: {{ selectedProduct.outLayer }}</p>
            <p class="mb-1">Lớp trong: {{ selectedProduct.inLayer }}</p>
            <p class="mb-1">Hoạ tiết: {{ selectedProduct.pattern }}</p>
            <p class="mb-4">Kích cỡ chuẩn: XS | S | M | L | XL</p>
          </div>
        </div>
      </div>
    </div>


    <!-- ==============================================
         FOOTER ĐỒNG BỘ
         ============================================== -->
    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #cbb799">
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img src="/Logo.png" alt="Logo Giai Đài" style="height: 55px; object-fit: contain" class="mb-3" />
            <p class="small lh-lg" style="color: #6f4d38">
              Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam. Từng đường kim mũi chỉ là sự kết tinh của nghệ thuật thủ công và hơi thở thời đại.
            </p>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Về chúng tôi</h6>
            <ul class="list-unstyled footer-links">
              <li><a href="#">Câu chuyện thương hiệu</a></li>
              <li><a href="#">Hệ thống Showroom</a></li>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addToCart, cartCount } from '../../store/cartStore.js'


const route = useRoute()
const router = useRouter()


const currentView = ref('PRODUCTS')
const currentCategory = ref('Áo dài truyền thống')
const selectedProduct = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)


// CÁC BIẾN QUẢN LÝ TRẠNG THÁI BỘ LỌC (CHUẨN ẢNH)
const searchKeyword = ref('')
const filterColor = ref('')
const filterSize = ref('')


const categoryData = {
  'Áo dài truyền thống': { desc: 'Từ nét vẽ phóng khoáng trên tà lụa mềm mại, đến âm hưởng rộn rã của ngày Tết cổ truyền, tất cả hòa quyện tạo nên một diện mạo duyên dáng, e ấp nhưng đầy kiêu hãnh của người phụvn Việt Nam.' },
  'Áo dài cách tân': { desc: 'Sự giao thoa hoàn hảo giữa nét đẹp truyền thống và nhịp sống đương đại. Từ những đường cắt cúp hiện đại đến chất liệu phá cách, mỗi thiết kế là một bản hòa ca tôn vinh sự trẻ trung.' },
  'Áo dài nam': { desc: 'Mang đậm khí chất nam nhi, tà áo dài truyền tải vẻ đẹp phong độ, đĩnh đạc và niềm tự hào dân tộc. Lựa chọn hoàn hảo để đấng mày râu thể hiện bản sắc.' },
  'Áo dài cưới': { desc: 'Sắc đỏ rực rỡ cùng những họa tiết uyên ương tinh xảo gửi gắm lời chúc trăm năm viên mãn. Từng đường kim mũi chỉ thêu dệt nên một thiết kế lộng lẫy.' },
  'Áo dài học sinh': { desc: 'Màu áo trắng tinh khôi gắn liền với những mộng mơ của tuổi học trò. Thiết kế giản dị, mộc mạc cùng chất liệu mềm mại bay bổng tự nhiên.' }
}


const productsData = {
  'Áo dài truyền thống': [
    { id: 'tt1', name: 'Bích Họa Xuân Thì', price: 2500000, priceFormatted: '2.500.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_XVXOlduqX9.jpeg?v=1766630773', outLayer: 'Tơ tằm cao cấp', inLayer: 'Lụa ngọc trai', pattern: 'Hoa bách hợp thêu chìm', color: 'Hồng', desc: 'Kiểu dáng suông tà dài mềm mại quyến rũ phong cách quý phái.', variants: { XS: 5, S: 12, M: 8, L: 2, XL: 0 } },
    { id: 'tt2', name: 'Bích Họa Liên Hoa', price: 2850000, priceFormatted: '2.850.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_Jd1SiUulSn.jpeg?v=1766630545', outLayer: 'Lụa tơ thô dệt tay', inLayer: 'Lụa bảo anh', pattern: 'Đoá sen hồng thủ công', color: 'Trắng', desc: 'Nền nã đài các đậm đà bản sắc truyền thống cổ xưa.', variants: { XS: 2, S: 0, M: 15, L: 4, XL: 3 } },
    { id: 'tt3', name: 'Bích Họa Phong Xuân', price: 2300000, priceFormatted: '2.300.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_w6fE7kKq0O.jpeg?v=1766630313', outLayer: 'Gấm thêu vân thượng hạng', inLayer: 'Lụa mềm', pattern: 'Vân mây tùng hạc', color: 'Xanh ngọc', desc: 'Chất liệu gấm phom đứng sang trọng cho những ngày lễ hội quan trọng.', variants: { XS: 0, S: 4, M: 7, L: 0, XL: 2 } }
  ],
  'Áo dài cách tân': [
    { id: 'ct1', name: 'Áo Dài Giao Mùa', price: 1950000, priceFormatted: '1.950.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_LzYroc7Cct.jpeg?v=1766745547', outLayer: 'Organza kính óng ánh', inLayer: 'Lụa habotai lót mịn', pattern: 'Cành đào xuân nhí', color: 'Vàng', desc: 'Dáng ngắn trẻ trung tay lửng bồng phom rộng phối chân váy thanh thoát.', variants: { XS: 8, S: 9, M: 11, L: 3, XL: 1 } },
    { id: 'ct2', name: 'Áo Dài Yên Đan', price: 2100000, priceFormatted: '2.100.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_rDsPZYagEU.jpeg?v=1766745494', outLayer: 'Tafta nhật phom đứng', inLayer: 'Lụa silk lót mềm', pattern: 'Trơn thanh lịch tối giản', color: 'Đỏ', desc: 'Thiết kế chiết eo cổ vuông cách điệu tân thời tôn dáng mảnh mai.', variants: { XS: 4, S: 2, M: 0, L: 6, XL: 0 } },
    { id: 'ct3', name: 'Áo Dài Trúc Đào', price: 1800000, priceFormatted: '1.800.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_Lq5H9rz6yB.jpeg?v=1766745454', outLayer: 'Voan nhung vân cát', inLayer: 'Lụa lót co giãn', pattern: 'Khối lập thể nghệ thuật', color: 'Hồng', desc: 'Sự pha trộn phá cách mang đậm tính đương đại cho quý cô thời thượng.', variants: { XS: 12, S: 5, M: 8, L: 9, XL: 4 } }
  ],
  'Áo dài nam': [
    { id: 'nam1', name: 'Nam Phục Long Cổ', price: 3200000, priceFormatted: '3.200.000 đ', image: 'https://i.pinimg.com/1200x/ba/d4/16/bad41623d05e5daa11948a3978f4b7ee.jpg', outLayer: 'Gấm dập sợi kim tuyến', inLayer: 'Lụa lót mịn', pattern: 'Rồng uốn lượn cổ điển', color: 'Đỏ đô', desc: 'Phom đứng mạnh mẽ đứng dáng oai nghiêm nam tính khí chất.', variants: { XS: 3, S: 6, M: 9, L: 4, XL: 2 } },
    { id: 'nam2', name: 'Nam Phục Hạc Điểu', price: 3800000, priceFormatted: '3.800.000 đ', image: 'https://i.pinimg.com/1200x/83/1a/d3/831ad3d2f472e1535a869614f37df885.jpg', outLayer: 'Gấm tuyết hoàng gia', inLayer: 'Satin mượt', pattern: 'Trống đồng chim hạc cổ', color: 'Xanh navy', desc: 'Tinh xảo quý phái thích hợp cho chú rể diện làm lễ cưới hỏi trọng đại.', variants: { XS: 1, S: 0, M: 5, L: 8, XL: 4 } },
    { id: 'nam3', name: 'Nam Phục Trúc Sơn', price: 2900000, priceFormatted: '2.900.000 đ', image: 'https://i.pinimg.com/736x/44/8d/d6/448dd638cec05e40e3a34346205e2cab.jpg', outLayer: 'Đũi tơ tằm thô mộc', inLayer: 'Không lót thoáng mát', pattern: 'Vân lá trúc chìm ẩn', color: 'Xanh', desc: 'Đem lại nét điềm đạm thư sinh học thức mộc mạc tự nhiên.', variants: { XS: 6, S: 7, M: 12, L: 5, XL: 1 } }
  ],
  'Áo dài cưới': [
    { id: 'cuoi1', name: 'Hỷ Phục Uyên Ương', price: 5500000, priceFormatted: '5.500.000 đ', image: 'https://i.pinimg.com/736x/d1/bf/28/d1bf2815ba8ebed60b9d27f9b873f0b9.jpg', outLayer: 'Lụa tơ tằm nguyên chất', inLayer: 'Lụa ngọc trai thượng hạng', pattern: 'Phượng hoàng đính đá quý', color: 'Đỏ', desc: 'Thêu pha lê vàng thủ công lấp lánh rực rỡ thu hút mọi góc nhìn.', variants: { XS: 2, S: 4, M: 3, L: 1, XL: 0 } },
    { id: 'cuoi2', name: 'Hỷ Phục Bách Hợp', price: 4800000, priceFormatted: '4.800.000 đ', image: 'https://i.pinimg.com/1200x/80/38/a5/8038a5f53b374db10209825dd357957f.jpg', outLayer: 'Ren hoa lưới pháp dập nổi', inLayer: 'Satin dày mịn', pattern: 'Hoa bách hợp nở rộ dập nổi', color: 'Trắng', desc: 'Vẻ lãng mạn phong cách vương giả cho ngày cưới ngọt ngào hoàn hảo.', variants: { XS: 0, S: 5, M: 6, L: 2, XL: 1 } },
    { id: 'cuoi3', name: 'Hỷ Phục Giao Tình', price: 6200000, priceFormatted: '6.200.000 đ', image: 'https://i.pinimg.com/1200x/ea/57/4e/ea574e0db6e35711185a5af38939dd98.jpg', outLayer: 'Gấm thêu chỉ vàng đỏ đô', inLayer: 'Lụa habotai lót', pattern: 'Song Hỷ đối xứng cung đình', color: 'Đỏ đô', desc: 'Màu đỏ may mắn cát tường mang lời chúc trăm năm bền chặt sắt son.', variants: { XS: 1, S: 3, M: 4, L: 0, XL: 2 } }
  ],
  'Áo dài học sinh': [
    { id: 'hs1', name: 'Bạch Tuệ Nữ Sinh', price: 850000, priceFormatted: '850.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20250905_kOB5RJ5r2E.jpeg?v=1757039795', outLayer: 'Chiffon cát siêu rủ', inLayer: 'Lụa mỏng lót tinh tế', pattern: 'Trắng trơn học đường tinh khôi', color: 'Trắng', desc: 'Tà rộng bay bổng nhẹ nhàng chống lộ tối đa kín đáo nữ sinh thanh lịch.', variants: { XS: 20, S: 35, M: 40, L: 15, XL: 10 } },
    { id: 'hs2', name: 'Tinh Khôi Nhật Bình', price: 950000, priceFormatted: '950.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20251225_spy9wQkZob.jpeg?v=1766630389', outLayer: 'Lụa Ý co giãn 4 chiều', inLayer: 'Không lót thông thoáng', pattern: 'Trắng tinh mờ nhẹ chống nhăn', color: 'Trắng', desc: 'Thấm hút mồ hôi cực tốt thích hợp cho việc vận động nhiều tại trường.', variants: { XS: 15, S: 22, M: 30, L: 12, XL: 5 } },
    { id: 'hs3', name: 'Thanh Vân Sơ Tâm', price: 1100000, priceFormatted: '1.100.000 đ', image: 'https://pos.nvncdn.com/22713a-176435/ps/20241122_FsrcRTpQUb.jpeg?v=1732289738', outLayer: 'Gấm lụa tơ hoa văn mờ', inLayer: 'Lụa lót mịn màng', pattern: 'Hoa văn cúc sọc chìm ẩn', color: 'Trắng', desc: 'Chất liệu gấm cao cấp tạo điểm nhấn tinh tế kín đáo nhã nhặn đoan trang.', variants: { XS: 10, S: 18, M: 25, L: 8, XL: 2 } }
  ]
}


const currentCategoryInfo = computed(() => categoryData[currentCategory.value] || categoryData['Áo dài truyền thống'])


// ==============================================
// LOGIC LỌC KHỚP TOÀN BỘ ĐIỀU KIỆN (CHUẨN CHỦ ĐỀ)
// ==============================================
const filteredProductList = computed(() => {
  const baseList = productsData[currentCategory.value] || []
  return baseList.filter(product => {
    // 1. Lọc theo từ khóa (Tên hoặc mô tả)
    const matchKeyword = !searchKeyword.value ||
      product.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchKeyword.value.toLowerCase())
   
    // 2. Lọc theo màu sắc chính xác
    const matchColor = !filterColor.value || product.color === filterColor.value
   
    // 3. Lọc theo kích cỡ (Kiểm tra kho của size đó phải lớn hơn 0)
    const matchSize = !filterSize.value || (product.variants[filterSize.value] > 0)
   
    return matchKeyword && matchColor && matchSize
  })
})


const clearAllFilters = () => {
  searchKeyword.value = ''
  filterColor.value = ''
  filterSize.value = ''
}


const syncCategoryRoute = () => {
  router.push({ path: '/cua-hang', query: { category: currentCategory.value } })
  window.scrollTo(0, 0)
}


// Logic tồn kho chi tiết
const totalStock = computed(() => {
  if (!selectedProduct.value) return 0
  return Object.values(selectedProduct.value.variants).reduce((a, b) => a + b, 0)
})


const currentStock = computed(() => {
  if (!selectedProduct.value) return 0
  if (selectedSize.value === null) return totalStock.value
  return selectedProduct.value.variants[selectedSize.value]
})


const selectSize = (size) => {
  selectedSize.value = size
  quantity.value = 1
}


// Logic Giỏ hàng
const handleAddToCart = () => {
  if (selectedSize.value === null) {
    alert('Vui lòng chọn Kích cỡ trước khi thêm vào giỏ hàng!')
    return
  }
  if (quantity.value > currentStock.value) {
    alert('Số lượng chọn mua vượt quá mức tồn kho hiện có!')
    return
  }
  addToCart(selectedProduct.value, selectedSize.value, quantity.value)
  alert(`Đã thêm thành công sản phẩm: ${selectedProduct.value.name} (Size: ${selectedSize.value}) vào giỏ hàng!`)
}


const handleBuyNow = () => {
  if (selectedSize.value === null) {
    alert('Vui lòng lựa chọn Kích cỡ trước khi tiến hành mua ngay!')
    return
  }
  if (quantity.value <= currentStock.value) {
    addToCart(selectedProduct.value, selectedSize.value, quantity.value)
    router.push('/gio-hang')
  }
}


// Đồng bộ hóa chu kỳ router
onMounted(() => {
  if (route.query.category && productsData[route.query.category]) {
    currentCategory.value = route.query.category
  }
})


watch(() => route.query.category, (newCat) => {
  if (newCat && productsData[newCat]) {
    currentCategory.value = newCat
    currentView.value = 'PRODUCTS'
    window.scrollTo(0, 0)
  }
})


const changeCategory = (cat) => {
  currentCategory.value = cat
  currentView.value = 'PRODUCTS'
  router.push({ path: '/cua-hang', query: { category: cat } })
  window.scrollTo(0, 0)
}


const showDetail = (product) => {
  selectedProduct.value = product
  currentView.value = 'PRODUCT_DETAIL'
  selectedSize.value = null
  quantity.value = 1
  window.scrollTo(0, 0)
}
</script>


<script>
export default { name: 'SanPhamClient' }
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');


.nav-text {
  color: #3d211a !important;
  font-size: 0.95rem;
  text-transform: uppercase;
  transition: color 0.3s ease;
  letter-spacing: 0.5px;
}
.nav-text:hover {
  color: #a07856 !important;
}
.custom-dropdown {
  border-top: 3px solid #6f4d38 !important;
  margin-top: 10px;
}
.custom-drop-item {
  color: #6f4d38 !important;
  transition: all 0.2s ease;
}
.custom-drop-item:hover {
  color: #a07856 !important;
  padding-left: 15px;
  background-color: #ffffff !important;
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
.size-btn:hover:not(.disabled-size) {
  border-color: #6f4d38;
  color: #3d211a;
}
.size-btn.active {
  background-color: #6f4d38 !important;
  color: #ffffff !important;
  border-color: #6f4d38 !important;
}
.disabled-size {
  background-color: #f1f1f1 !important;
  color: #ccc !important;
  cursor: not-allowed;
  text-decoration: line-through;
  border-color: #eee !important;
  opacity: 0.6;
}


.btn-add-cart {
  background-color: #6f4d38;
  border: 1px solid #6f4d38;
}
.btn-add-cart:hover {
  background-color: #3d211a;
}
.btn-buy-now {
  background-color: #ffffff;
  color: #6f4d38;
  border: 1px solid #6f4d38;
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
</style>

