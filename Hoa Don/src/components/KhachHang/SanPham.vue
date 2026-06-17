<template>
  <div class="client-home bg-white" style="min-height: 100vh">
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

    <!-- ==============================================
         NAVBAR ĐỒNG BỘ CÁC TRANG
         ============================================== -->
    <nav class="navbar navbar-expand-lg sticky-top py-3 border-bottom shadow-sm" style="background-color: #ffffff !important">
      <div class="container-fluid px-4 px-lg-5">
        <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
          <img src="/Logo.png" alt="Logo Giai Đài" style="height: 60px; object-fit: contain" />
        </router-link>

        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <!-- CĂN GIỮA VÀ SẮP XẾP MENU -->
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

    <!-- NỘI DUNG SẢN PHẨM -->
    <div v-if="currentView === 'PRODUCTS'" class="container-fluid px-4 px-lg-5 py-5">
      
      <!-- ĐƯA TIÊU ĐỀ LÊN ĐẦU TIÊN ĐỂ CĂN GIỮA VÀ CHIẾM TOÀN BỘ CHIỀU RỘNG -->
      <section class="text-center mb-5">
        <h2 class="title-cursive-elegant mb-3" style="font-size: 3.5rem; color: #3d211a">
          Áo Dài Giai Đài
        </h2>
        <p class="lh-lg fst-italic mx-auto" style="font-size: 1rem; color: #6f4d38; max-width: 700px;">
          "Mang trong mình vẻ đẹp truyền thống, tinh khôi và đằm thắm. Từng đường kim mũi chỉ là sự chắt chiu tinh hoa văn hóa Việt."
        </p>
      </section>

      <div class="row g-4">
        <!-- SIDEBAR BỘ LỌC BÊN TRÁI -->
        <div class="col-12 col-lg-3">
          <div class="card border-0 shadow-sm p-4 bg-white rounded-3" style="border: 1px solid #f0e9df !important;">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0" style="color: #3D211A; letter-spacing: 0.5px;">Bộ lọc sản phẩm</h5>
              <button class="btn btn-sm btn-light rounded-pill px-3 py-1" style="font-size: 0.8rem; color: #6f4d38;" @click="clearAllFilters">Xóa</button>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Từ khóa</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-start-0 ps-0 shadow-none" placeholder="Tên sản phẩm..." v-model="searchKeyword" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Loại sản phẩm (Danh mục)</label>
              <select class="form-select shadow-none" v-model="currentCategory">
                <option value="Tất cả">Tất cả danh mục</option>
                <option v-for="cat in categoriesList" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Thương hiệu</label>
              <select class="form-select shadow-none" v-model="filterBrand">
                <option value="Tất cả">Tất cả thương hiệu</option>
                <option v-for="brand in brandsList" :key="brand" :value="brand">{{ brand }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Màu sắc</label>
              <select class="form-select shadow-none" v-model="filterColor">
                <option value="">Tất cả màu sắc</option>
                <option v-for="color in dynamicColorsFilter" :key="color" :value="color">{{ color }}</option>
              </select>
            </div>

            <button class="btn w-100 text-white fw-medium py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 btn-main-brown mt-3" @click="clearAllFilters">
              <i class="bi bi-arrow-counterclockwise"></i> Xóa toàn bộ bộ lọc
            </button>
          </div>
        </div>

        <!-- CỘT CHÍNH HIỂN THỊ SẢN PHẨM SẼ NGANG HÀNG VỚI BỘ LỌC BÊN TRÁI -->
        <div class="col-12 col-lg-9">
          <div v-if="filteredProductList.length === 0" class="card border-0 shadow-sm text-center p-5 bg-white rounded-3">
            <i class="bi bi-search-heart text-muted mb-3" style="font-size: 3rem;"></i>
            <h5 class="fw-bold" style="color: #3d211a;">Không tìm thấy sản phẩm phù hợp trong hệ thống</h5>
          </div>

          <div v-else class="row g-4 justify-content-start">
            <div class="col-12 col-sm-6 col-lg-4" v-for="product in filteredProductList" :key="product.id">
              <div class="card border-0 shadow-none h-100 product-card-v2 text-center bg-white d-flex flex-column justify-content-between" style="cursor: pointer;" @click="showDetail(product)">
                <div>
                  <div class="position-relative overflow-hidden mb-3 bg-white border rounded-2" style="height: 400px">
                    <img :src="product.image" class="w-100 h-100 object-fit-cover product-img" :alt="product.name" />
                  </div>
                  <div class="card-body p-0 bg-white d-flex flex-column align-items-center">
                    <h5 class="fw-bold mb-1 px-2" style="font-size: 1.1rem; color: #3d211a; font-family: 'Playfair Display', sans-serif; min-height: 2.4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      {{ product.name }}
                    </h5>
                    <p class="mb-3 fw-bold" style="font-size: 1.1rem; color: #3D211A;">
                      {{ product.priceRangeLabel }}
                    </p>
                  </div>
                </div>
                <div class="px-3 pb-2">
                  <button class="btn btn-sm w-100 btn-outline-brown py-2 fw-medium" style="font-size: 0.85rem;">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NỘI DUNG CHI TIẾT SẢN PHẨM -->
    <div v-else-if="currentView === 'PRODUCT_DETAIL' && selectedProduct" class="container py-5 mt-2" style="min-height: 70vh">
      <button class="btn btn-link text-decoration-none mb-4 px-0 fw-medium" style="color: #3D211A" @click="currentView = 'PRODUCTS'">
        <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
      </button>

      <div class="row g-5 mb-5">
        <div class="col-md-6">
          <div class="rounded-2 overflow-hidden d-flex align-items-center justify-content-center bg-white border style-main-frame" style="height: 550px">
            <img :src="currentDisplayImage" class="w-100 h-100 object-fit-cover" :alt="selectedProduct.name" />
          </div>
        </div>

        <div class="col-md-6">
          <h1 class="fw-bold mb-2" style="font-family: 'Playfair Display', sans-serif; color: #3d211a; font-size: 2.2rem;">
            {{ selectedProduct.name }}
          </h1>
          
          <div class="mb-3 small text-muted d-flex gap-3">
            <span>Mã SKU: <strong class="text-dark">{{ selectedVariantInfo?.maSku || 'Vui lòng chọn size...' }}</strong></span>
            <span>|</span>
            <span>Thương hiệu: <strong class="text-dark">{{ selectedProduct.thuongHieu || 'Chưa cập nhật' }}</strong></span>
          </div>

          <h2 class="fw-bold mb-4" style="color: #3D211A; font-size: 1.8rem;">
            {{ displayPrice }}
          </h2>

          <div class="p-4 rounded-2 mb-4" style="background-color: #faf8f5; border: 1px solid #f2edd9;">
            <div class="d-flex align-items-center mb-4">
              <span class="text-secondary fw-medium" style="width: 110px; font-size: 0.95rem;">Màu Sắc</span>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="color in uniqueColors" :key="color"
                  class="btn variant-brown-btn" 
                  :class="{ active: selectedColor === color }"
                  @click="selectColor(color)">
                  {{ color }}
                </button>
              </div>
            </div>

            <div class="d-flex align-items-center mb-4">
              <span class="text-secondary fw-medium" style="width: 110px; font-size: 0.95rem;">Kích Cỡ</span>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="size in uniqueSizes" :key="size"
                  class="btn variant-brown-btn"
                  :class="{ 
                    active: selectedSize === size, 
                    'disabled-brown': isSizeDisabledForCurrentColor(size) 
                  }"
                  :disabled="isSizeDisabledForCurrentColor(size)"
                  @click="selectSize(size)">
                  {{ size }}
                </button>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <span class="text-secondary fw-medium" style="width: 110px; font-size: 0.95rem;">Số Lượng</span>
              <div class="d-flex align-items-center gap-3">
                <div class="quantity-selector d-inline-flex border bg-white rounded">
                  <button class="btn px-3 border-0 fw-bold text-muted" @click="handleDecreaseQty">-</button>
                  <input type="text" class="form-control border-0 text-center fw-bold bg-white" style="width: 50px; padding: 0;" v-model="quantity" readonly />
                  <button class="btn px-3 border-0 fw-bold text-muted" @click="handleIncreaseQty">+</button>
                </div>
                <span class="text-muted small">{{ stockMessage }}</span>
              </div>
            </div>
          </div>

          <div class="d-flex gap-3 mt-4">
            <button class="btn flex-fill fw-bold py-3 btn-outline-brown" @click="handleAddToCart">
              Thêm vào giỏ hàng
            </button>
            <button class="btn flex-fill text-white fw-bold py-3 btn-main-brown" @click="handleBuyNow">
              Mua ngay
            </button>
          </div>

          <div class="mt-4 pt-3 border-top d-flex flex-wrap justify-content-start gap-4 text-dark align-items-center style-service-bar">
            <div class="d-flex align-items-center gap-2 font-medium small" style="color: #3D211A;">
              <i class="bi bi-arrow-counterclockwise fs-5 text-danger"></i>
              <span class="fw-bold">Đổi trả hàng trong 15 ngày</span>
            </div>
            <div class="vertical-divider d-none d-sm-block"></div>
            <div class="d-flex align-items-center gap-2 font-medium small" style="color: #3D211A;">
              <i class="bi bi-shield-check fs-5 text-danger"></i>
              <span class="fw-bold">Bảo hiểm thời trang</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <div class="product-description p-4 rounded-3 bg-white shadow-sm" style="border: 1px solid #eadecc; color: #523b2e">
            <h5 class="fw-bold mb-3 pb-2 text-uppercase" style="color: #3d211a; border-bottom: 2px solid #3d211a; display: inline-block; letter-spacing: 0.5px;">
              Mô tả chi tiết sản phẩm
            </h5>
            <p class="mb-4 text-secondary lh-lg" style="font-size: 1rem; white-space: pre-line;">
              {{ selectedProduct.desc }}
            </p>
            <div class="row g-3 bg-light p-3 rounded-2" style="background-color: #fafafa !important;">
              <div class="col-12 col-sm-6">
                <span class="text-muted">Cổ áo:</span> <strong class="ms-1 text-dark">{{ selectedProduct.coAo || 'Cổ tròn truyền thống' }}</strong>
              </div>
              <div class="col-12 col-sm-6">
                <span class="text-muted">Tay áo:</span> <strong class="ms-1 text-dark">{{ selectedProduct.tayAo || 'Tay lỡ tôn dáng' }}</strong>
              </div>
              <div class="col-12 col-sm-6">
                <span class="text-muted">Chất liệu:</span> <strong class="ms-1 text-dark">{{ selectedProduct.chatLieu || 'Tơ lụa cao cấp tự nhiên' }}</strong>
              </div>
              <div class="col-12 col-sm-6">
                <span class="text-muted">Kiểu dáng:</span> <strong class="ms-1 text-dark">{{ selectedProduct.kieuDang || 'Phom suông cách tân' }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #eadecc">
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
              <li><router-link to="/gioi-thieu" style="color: #6f4d38; text-decoration: none;">Câu chuyện thương hiệu</router-link></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Liên hệ</h6>
            <ul class="list-unstyled footer-links text-muted small">
              <li><i class="bi bi-telephone-fill me-2" style="color: #3D211A"></i><span style="color: #6f4d38">0123 456 789</span></li>
              <li><i class="bi bi-envelope-fill me-2" style="color: #3D211A"></i><span style="color: #6f4d38">cskh@giaidai.vn</span></li>
            </ul>
          </div>
        </div>
        <div class="text-center pt-4 mt-4" style="border-top: 1px solid #f0f0f0">
          <p class="small mb-0" style="color: #3D211A">&copy; 2026 Giai Đài. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addToCart, cartCount } from '../../store/cartStore.js'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const currentUsername = ref(sessionStorage.getItem('username') || 'Guest')

const toast = ref({
  show: false,
  type: '',
  title: '',
  message: ''
})

const handleLogout = () => {
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('username') 
  alert('Đăng xuất thành công!')
  setTimeout(() => { router.push('/dang-nhap') }, 500)
}

const currentView = ref('PRODUCTS')
const selectedProduct = ref(null)

const selectedColor = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)

// TRẠNG THÁI BỘ LỌC
const searchKeyword = ref('')
const currentCategory = ref('Tất cả') 
const filterBrand = ref('Tất cả') 
const filterColor = ref('')

const allProductsMaster = ref([])

// CHỨA DANH MỤC VÀ THƯƠNG HIỆU LẤY TỪ SQL
const categoriesList = ref([])
const brandsList = ref([])

const dynamicColorsFilter = computed(() => {
  const colors = []
  allProductsMaster.value.forEach(p => {
    if (p.variants) {
      p.variants.forEach(v => {
        if (v.tenMau) colors.push(v.tenMau)
      })
    }
  })
  return [...new Set(colors)]
})

const formatVND = (value) => {
  if (value === undefined || value === null) return '0 đ'
  return value.toLocaleString('vi-VN') + ' đ'
}

const formatProductImage = (imgName) => {
  if (!imgName) return 'https://via.placeholder.com/400x550?text=Giai+Dai+Ao+Dai'
  if (imgName.startsWith('http')) return imgName
  return `http://localhost:8080/api/sanpham-chitiet/images/${imgName}`
}

const fetchFiltersData = async () => {
  try {
    const catRes = await axios.get('http://localhost:8080/api/danh-muc')
    if (catRes.data && Array.isArray(catRes.data)) {
      const activeCats = catRes.data.filter(item => item.trangThai === 1)
      const sortedCats = activeCats.sort((a, b) => b.id - a.id)
      categoriesList.value = sortedCats.map(c => (c.tenDanhMuc || c.ten || '').trim()).filter(Boolean)
    }
  } catch (error) {
    console.error('Lỗi khi tải danh mục dropdown:', error)
  }

  try {
    const brandRes = await axios.get('http://localhost:8080/api/thuong-hieu')
    if (brandRes.data && Array.isArray(brandRes.data)) {
      const activeBrands = brandRes.data.filter(item => item.trangThai === 1)
      const sortedBrands = activeBrands.sort((a, b) => b.id - a.id)
      brandsList.value = sortedBrands.map(b => (b.tenThuongHieu || b.ten || '').trim()).filter(Boolean)
    }
  } catch (error) {
    console.error('Lỗi khi tải thương hiệu dropdown:', error)
  }
}

const loadAllProductsFromServer = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/sanpham') 
    if (response.data && response.data.length > 0) {
      const parentProducts = response.data.filter(p => p.trangThai === 1 || p.trangThai === true)

      const fullLoadedProducts = await Promise.all(
        parentProducts.map(async (p) => {
          let variants = []
          try {
            const variantRes = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${p.id}`)
            variants = variantRes.data || []
          } catch (err) {
            console.error(`Không lấy được biến thể của sản phẩm ${p.id}`, err)
          }

          let priceRangeLabel = 'Chưa cập nhật giá'
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

          const tenDM = p.danhMuc?.tenDanhMuc || p.danhMuc?.ten || (typeof p.danhMuc === 'string' ? p.danhMuc : p.tenDanhMuc) || ''
          const tenTH = p.thuongHieu?.tenThuongHieu || p.thuongHieu?.ten || (typeof p.thuongHieu === 'string' ? p.thuongHieu : p.tenThuongHieu) || ''

          return {
            id: p.id,
            name: p.tenSanPham || p.name,
            category: tenDM.trim(), 
            thuongHieu: tenTH.trim(), 
            desc: p.moTa || 'Kiểu dáng suông tà dài mềm mại quyến rũ phong cách quý phái.',
            image: formatProductImage(defaultImg),
            variants: variants,
            priceRangeLabel: priceRangeLabel
          }
        })
      )
      allProductsMaster.value = fullLoadedProducts
    } else {
      allProductsMaster.value = [] 
    }
  } catch (error) {
    console.error("Lỗi tải sản phẩm từ máy chủ:", error)
    allProductsMaster.value = [] 
  }
}

const filteredProductList = computed(() => {
  return allProductsMaster.value.filter(product => {
    const matchCategory = currentCategory.value === 'Tất cả' || (product.category && product.category === currentCategory.value.trim())
    const matchBrand = filterBrand.value === 'Tất cả' || !filterBrand.value || (product.thuongHieu && product.thuongHieu === filterBrand.value.trim())
    const matchKeyword = !searchKeyword.value || product.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    let matchColor = true
    if (filterColor.value) {
      matchColor = product.variants && product.variants.some(v => v.tenMau && v.tenMau.trim().toLowerCase() === filterColor.value.trim().toLowerCase())
    }

    return matchCategory && matchBrand && matchKeyword && matchColor
  })
})

const availableVariants = ref([])

const uniqueColors = computed(() => {
  const colors = availableVariants.value.map(v => v.tenMau)
  return [...new Set(colors)]
})

const uniqueSizes = computed(() => {
  const sizes = availableVariants.value.map(v => v.tenKichCo)
  return [...new Set(sizes)]
})

const isSizeDisabledForCurrentColor = (size) => {
  if (!selectedColor.value) return false
  const match = availableVariants.value.find(v => v.tenMau === selectedColor.value && v.tenKichCo === size)
  if (!match) return true
  return match.soLuongTon === 0
}

const selectedVariantInfo = computed(() => {
  if (!selectedColor.value || !selectedSize.value) return null
  return availableVariants.value.find(v => v.tenMau === selectedColor.value && v.tenKichCo === selectedSize.value)
})

const currentDisplayImage = computed(() => {
  if (selectedColor.value) {
    const variantWithImg = availableVariants.value.find(v => v.tenMau === selectedColor.value && v.hinhAnh)
    if (variantWithImg) {
      return formatProductImage(variantWithImg.hinhAnh)
    }
  }
  return selectedProduct.value?.image
})

const displayPrice = computed(() => {
  if (selectedVariantInfo.value) {
    return formatVND(selectedVariantInfo.value.giaSauGiam)
  }
  if (availableVariants.value.length > 0) {
    const listGia = availableVariants.value.map(v => v.giaSauGiam)
    const minGia = Math.min(...listGia)
    const maxGia = Math.max(...listGia)
    if (minGia === maxGia) return formatVND(minGia)
    return `${minGia.toLocaleString('vi-VN')} ~ ${maxGia.toLocaleString('vi-VN')} đ`
  }
  return 'Chưa cập nhật giá'
})

const stockMessage = computed(() => {
  if (selectedVariantInfo.value) {
    return `${selectedVariantInfo.value.soLuongTon} sản phẩm có sẵn`
  }
  const totalStock = availableVariants.value.reduce((sum, item) => sum + item.soLuongTon, 0)
  return `${totalStock} sản phẩm có sẵn`
})

const selectColor = (color) => {
  selectedColor.value = color
  if (selectedSize.value && isSizeDisabledForCurrentColor(selectedSize.value)) {
    selectedSize.value = null
  }
  quantity.value = 1
}

const selectSize = (size) => {
  selectedSize.value = size
  quantity.value = 1
}

const handleDecreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}
const handleIncreaseQty = () => {
  const maxStock = selectedVariantInfo.value ? selectedVariantInfo.value.soLuongTon : 99
  if (quantity.value < maxStock) quantity.value++
}

const showDetail = async (product) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${product.id}`)
    const variantsList = response.data

    if (variantsList && variantsList.length > 0) {
      const baseV = variantsList[0]
      selectedProduct.value = {
        id: product.id,
        name: baseV.tenSanPham || product.name,
        thuongHieu: baseV.tenThuongHieu || product.thuongHieu || 'Chưa cập nhật',
        desc: product.desc,
        coAo: baseV.tenCoAo,
        tayAo: baseV.tenTayAo,
        chatLieu: baseV.tenChatLieu,
        kieuDang: baseV.tenKieuDang,
        image: product.image 
      }
      availableVariants.value = variantsList
      selectedColor.value = baseV.tenMau 
    } else {
      selectedProduct.value = { ...product, thuongHieu: product.thuongHieu || 'Chưa cập nhật' }
      availableVariants.value = product.variants || []
      selectedColor.value = null
    }

    selectedSize.value = null
    currentView.value = 'PRODUCT_DETAIL'
    quantity.value = 1
    window.scrollTo(0, 0)
  } catch (error) {
    console.error("Lỗi lấy dữ liệu biến thể chi tiết:", error)
    selectedProduct.value = { ...product, thuongHieu: product.thuongHieu || 'Chưa cập nhật' }
    availableVariants.value = product.variants || []
    if (availableVariants.value.length > 0) {
      selectedColor.value = availableVariants.value[0].tenMau
    }
    selectedSize.value = null
    currentView.value = 'PRODUCT_DETAIL'
    quantity.value = 1
    window.scrollTo(0, 0)
  }
}

const handleAddToCart = () => {
  if (!selectedColor.value || !selectedSize.value) {
    alert('Vui lòng chọn đầy đủ cả Màu Sắc và Kích Cỡ áo!')
    return
  }
  const cartItem = {
    ...selectedProduct.value,
    name: `${selectedProduct.value.name} (${selectedColor.value})`,
    price: selectedVariantInfo.value.giaSauGiam
  }
  addToCart(cartItem, selectedSize.value, quantity.value)
  alert('Đã thêm sản phẩm vào giỏ hàng thành công!')
}

const handleBuyNow = () => {
  if (!selectedColor.value || !selectedSize.value) {
    alert('Vui lòng chọn đầy đủ phân loại để tiến hành mua hàng nhanh!')
    return
  }
  const cartItem = {
    ...selectedProduct.value,
    name: `${selectedProduct.value.name} (${selectedColor.value})`,
    price: selectedVariantInfo.value.giaSauGiam
  }
  addToCart(cartItem, selectedSize.value, quantity.value)
  router.push('/gio-hang')
}

const clearAllFilters = () => {
  searchKeyword.value = ''
  filterColor.value = ''
  currentCategory.value = 'Tất cả'
  filterBrand.value = 'Tất cả'
}

const goToProductsList = () => {
  currentView.value = 'PRODUCTS'
  clearAllFilters()
}

onMounted(() => {
  fetchFiltersData()
  loadAllProductsFromServer()
  
  if (route.query.category) {
    currentCategory.value = route.query.category
  }
})
</script>

<style scoped>
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

/* CARD SẢN PHẨM */
.product-card-v2 {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #f2edd9 !important;
  border-radius: 8px;
  overflow: hidden;
}
.product-card-v2:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(61, 33, 26, 0.08) !important;
}
.product-img {
  transition: transform 0.4s ease;
}
.product-card-v2:hover .product-img {
  transform: scale(1.03);
}

/* BIẾN THỂ MÀU NÂU */
.variant-brown-btn {
  background-color: #ffffff;
  color: #3d211a;
  border: 1px solid #dcd1c4;
  min-width: 4.5rem;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: all 0.15s ease;
}
.variant-brown-btn:hover:not(.disabled-brown) {
  border-color: #3D211A;
  color: #3D211A;
}
.variant-brown-btn.active {
  color: #ffffff !important;
  background-color: #3D211A !important;
  border-color: #3D211A !important;
}
.disabled-brown {
  background-color: #f5f5f5 !important;
  color: #b0b0b0 !important;
  cursor: not-allowed;
  border-style: dashed !important;
  text-decoration: line-through;
}

/* NÚT BẤM CHÍNH */
.btn-main-brown {
  background-color: #3D211A !important;
  color: #ffffff !important;
  border: 1px solid #3D211A;
  border-radius: 4px;
}
.btn-main-brown:hover {
  background-color: #522d23 !important;
}
.btn-outline-brown {
  background-color: #ffffff !important;
  color: #3D211A !important;
  border: 1px solid #3D211A !important;
  border-radius: 4px;
}
.btn-outline-brown:hover {
  background-color: #3D211A !important;
  color: #ffffff !important;
}

.quantity-selector {
  border: 1px solid #dcd1c4 !important;
}

/* THANH TIỆN ÍCH DỊCH VỤ DƯỚI NÚT THANH TOÁN */
.style-service-bar i {
  vertical-align: middle;
}
.vertical-divider {
  width: 1px;
  height: 18px;
  background-color: #dcd1c4;
}

/* CSS CHO TIÊU ĐỀ ÁO DÀI GIAI ĐÀI */
.title-cursive-elegant {
  font-family: 'Dancing Script', cursive !important;
  font-weight: 700;
}
</style>