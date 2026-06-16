<template>
  <div class="client-home" style="background-color: #fbfaf8; min-height: 100vh">
    <!-- ==============================================
         NAVBAR 
         ============================================== -->
    <nav class="navbar navbar-expand-lg bg-white sticky-top py-3 border-bottom shadow-sm">
      <div class="container-fluid px-4 px-lg-5">
        <a
          class="navbar-brand d-flex align-items-center text-decoration-none"
          href="#"
          @click.prevent="router.push('/')"
        >
          <img src="/Logo.png" alt="Logo Giai Đài" style="height: 60px; object-fit: contain" />
        </a>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center align-items-center">
            <li class="nav-item">
              <a class="nav-link fw-medium nav-text" href="#" @click.prevent="router.push('/')"
                >Trang chủ</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link fw-medium nav-text"
                href="#"
                @click.prevent="router.push('/cua-hang')"
                >Sản phẩm</a
              >
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
        </div>
      </div>
    </nav>

    <!-- ==============================================
         MAIN CONTENT: GIỎ HÀNG
         ============================================== -->
    <div class="container py-5">
      <!-- TIÊU ĐỀ: ĐÃ CĂN GIỮA VÀ ĐỔI FONT CHỮ MỀM MẠI -->
      <div class="mb-5 text-center">
        <nav aria-label="breadcrumb" class="d-flex justify-content-center">
          <ol class="breadcrumb mb-2 small">
            <li class="breadcrumb-item">
              <a href="#" @click.prevent="router.push('/')" class="text-muted text-decoration-none"
                >Trang chủ</a
              >
            </li>
            <li class="breadcrumb-item fw-bold" style="color: #6f4d38" aria-current="page">
              Giỏ hàng
            </li>
          </ol>
        </nav>
        <h2 class="title-cursive-elegant" style="font-size: 3.5rem; color: #3d211a">Giỏ Hàng</h2>
        <p class="text-muted small fst-italic">Kiểm tra sản phẩm, số lượng và tiến hành đặt hàng</p>
      </div>

      <div class="row g-4">
        <!-- CỘT TRÁI: DANH SÁCH HOẶC TRẠNG THÁI TRỐNG -->
        <div class="col-lg-8">
          <!-- Trạng thái trống (Thiết kế mềm mại, bo góc sâu, đổ bóng nhẹ) -->
          <div
            v-if="cartState.items.length === 0"
            class="bg-white rounded-4 shadow-sm p-5 text-center d-flex flex-column align-items-center justify-content-center border-0"
            style="min-height: 400px"
          >
            <div class="mb-4 text-muted opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                fill="currentColor"
                class="bi bi-cart-x"
                viewBox="0 0 16 16"
              >
                <path
                  d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"
                />
                <path
                  d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                />
              </svg>
            </div>
            <h5 class="fw-bold mb-2" style="color: #3d211a">Giỏ hàng của bạn đang trống</h5>
            <p class="text-muted mb-4">Hãy chọn thêm sản phẩm vào giỏ hàng nhé!</p>
            <button
              class="btn btn-outline-elegant rounded-pill px-5 py-2"
              @click="router.push('/cua-hang')"
            >
              TIẾP TỤC MUA HÀNG
            </button>
          </div>

          <!-- Danh sách sản phẩm (Khi có hàng) -->
          <div v-else class="bg-white rounded-4 shadow-sm border-0 overflow-hidden mb-4">
            <div
              class="row g-0 bg-light p-3 border-bottom fw-bold text-center d-none d-md-flex"
              style="color: #6f4d38; font-size: 0.9rem"
            >
              <div class="col-5 text-start d-flex align-items-center">
                <input
                  type="checkbox"
                  v-model="isAllSelected"
                  class="form-check-input me-3 custom-checkbox"
                />
                Sản phẩm
              </div>
              <div class="col-2">Số lượng</div>
              <div class="col-2">Đơn giá</div>
              <div class="col-2">Tổng tiền</div>
              <div class="col-1"></div>
            </div>

            <div
              v-for="(item, index) in cartState.items"
              :key="index"
              class="row g-0 align-items-center p-3 border-bottom cart-item"
            >
              <div class="col-12 col-md-5 d-flex align-items-center mb-3 mb-md-0">
                <input
                  type="checkbox"
                  v-model="item.selected"
                  class="form-check-input me-3 custom-checkbox"
                />
                <img
                  :src="item.image"
                  class="rounded-3 me-3"
                  style="width: 75px; height: 95px; object-fit: cover; border: 1px solid #eee"
                />
                <div>
                  <h6 class="fw-bold mb-1" style="color: #3d211a; font-size: 0.95rem">
                    {{ item.name }}
                  </h6>
                  <div
                    class="variant-box d-inline-flex align-items-center px-2 py-1 rounded-1 mt-1"
                    @click="openVariantModal(item, index)"
                  >
                    <span class="small text-muted me-1"
                      >Size: <strong class="text-dark">{{ item.size }}</strong></span
                    >
                    <i class="bi bi-caret-down-fill small text-muted" style="font-size: 0.7rem"></i>
                  </div>
                  <div class="mt-1 small" style="color: #a82e3e">Còn lại: {{ getStock(item) }}</div>
                </div>
              </div>
              <div class="col-8 col-md-2 d-flex justify-content-md-center mb-2 mb-md-0">
                <div
                  class="input-group input-group-sm rounded-pill overflow-hidden border"
                  style="width: 90px; border-color: #cbb799 !important"
                >
                  <button class="btn btn-light px-2 border-0" @click="decreaseQty(item)">-</button>
                  <input
                    type="text"
                    class="form-control text-center px-1 border-0 bg-white fw-bold"
                    v-model="item.quantity"
                    readonly
                  />
                  <button class="btn btn-light px-2 border-0" @click="increaseQty(item)">+</button>
                </div>
              </div>
              <div class="col-2 d-none d-md-block text-center fw-medium" style="color: #6f4d38">
                {{ formatPrice(item.price) }}
              </div>
              <div class="col-6 col-md-2 text-md-center fw-bold" style="color: #a82e3e">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
              <div class="col-6 col-md-1 text-end text-md-center">
                <button class="btn btn-link text-danger p-0" @click="handleRemove(index)">
                  <i class="bi bi-trash fs-5"></i>
                </button>
              </div>
            </div>
            <div class="p-3 bg-white">
              <button
                class="btn btn-link text-decoration-none px-0"
                style="color: #a07856"
                @click="router.push('/cua-hang')"
              >
                <i class="bi bi-arrow-left"></i> Chọn thêm sản phẩm khác
              </button>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI: TÓM TẮT & VOUCHER -->
        <div class="col-lg-4" v-if="cartState.items.length > 0">
          <!-- KHỐI VOUCHER -->
          <div
            class="bg-white rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between"
            style="border: 1px dashed #cbb799"
          >
            <div class="d-flex align-items-center">
              <i class="bi bi-ticket-perforated fs-4 me-2" style="color: #a82e3e"></i>
              <span class="fw-medium" style="color: #3d211a">Giai Đài Voucher</span>
            </div>
            <div class="input-group input-group-sm" style="width: 150px">
              <input
                type="text"
                class="form-control border-secondary text-uppercase"
                placeholder="Nhập mã..."
                v-model="voucherInput"
              />
              <button class="btn btn-dark" type="button" @click="applyVoucher">Áp dụng</button>
            </div>
          </div>

          <!-- KHỐI THANH TOÁN -->
          <div class="bg-white rounded-4 shadow-sm border-0 p-4 sticky-top" style="top: 100px">
            <h5 class="fw-bold mb-4 pb-3 border-bottom" style="color: #3d211a">TÓM TẮT ĐƠN HÀNG</h5>
            <div class="d-flex justify-content-between mb-3 text-muted">
              <span>Tổng sản phẩm chọn</span>
              <span class="fw-bold text-dark">{{ totalSelectedItems }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3 text-muted">
              <span>Tạm tính</span>
              <span class="fw-bold text-dark">{{ formatPrice(subTotal) }}</span>
            </div>
            <div
              v-if="discount > 0"
              class="d-flex justify-content-between mb-3"
              style="color: #a82e3e"
            >
              <span>Voucher giảm giá</span>
              <span class="fw-bold">- {{ formatPrice(discount) }}</span>
            </div>
            <hr class="text-muted opacity-25" />
            <div class="d-flex justify-content-between mb-1 align-items-center">
              <span class="fw-bold fs-5" style="color: #3d211a">Thành tiền</span>
              <span class="fw-bold fs-3" style="color: #a82e3e">{{ formatPrice(finalTotal) }}</span>
            </div>
            <p class="small text-end text-muted mb-4 fst-italic">(Đã bao gồm VAT)</p>
            <button
              class="btn btn-checkout w-100 py-3 rounded-pill fw-bold text-white shadow-sm"
              :disabled="totalSelectedItems === 0"
            >
              TIẾN HÀNH ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>

      <!-- ==============================================
           SẢN PHẨM ĐỀ XUẤT 
           ============================================== -->
      <div class="mt-5 pt-5 border-top">
        <h3 class="title-cursive-elegant mb-4 text-center" style="font-size: 3rem; color: #3d211a">
          Có Thể Bạn Sẽ Thích
        </h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="(item, idx) in suggestedProducts" :key="idx">
            <div
              class="card border-0 bg-transparent product-card text-center"
              @click="router.push('/cua-hang')"
            >
              <div class="rounded-4 overflow-hidden mb-3 shadow-sm" style="height: 380px">
                <img :src="item.image" class="w-100 h-100 object-fit-cover" />
              </div>
              <h6 class="fw-bold mb-1" style="color: #3d211a">{{ item.name }}</h6>
              <p class="mb-0 fw-medium" style="color: #6f4d38">{{ item.priceFormatted }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==============================================
         FOOTER GIAI ĐÀI
         ============================================== -->
    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #eee">
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img
              src="/Logo.png"
              alt="Logo Giai Đài"
              style="height: 55px; object-fit: contain"
              class="mb-3"
            />
            <p class="small lh-lg text-muted">
              Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam.
            </p>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3" style="color: #3d211a">VỀ CHÚNG TÔI</h6>
            <ul class="list-unstyled footer-links small">
              <li>
                <a href="#" class="text-muted text-decoration-none">Câu chuyện thương hiệu</a>
              </li>
              <li><a href="#" class="text-muted text-decoration-none">Hệ thống cửa hàng</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3" style="color: #3d211a">LIÊN HỆ</h6>
            <ul class="list-unstyled text-muted small">
              <li class="mb-2"><i class="bi bi-telephone me-2"></i> 0123 456 789</li>
              <li><i class="bi bi-envelope me-2"></i> cskh@giaidai.vn</li>
            </ul>
          </div>
        </div>
        <div class="text-center pt-4 border-top text-muted small">
          &copy; 2026 Giai Đài. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- MODAL ĐỔI SIZE -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box bg-white rounded-4 shadow-lg p-4 position-relative">
        <button
          class="btn-close position-absolute top-0 end-0 m-3"
          @click="closeVariantModal"
        ></button>
        <h5 class="fw-bold mb-4" style="color: #3d211a">Thay đổi Kích cỡ</h5>
        <div class="d-flex gap-3 mb-4">
          <img
            :src="editingItem.image"
            style="width: 70px; height: 90px; object-fit: cover"
            class="rounded-3 border"
          />
          <div>
            <h6 class="fw-bold mb-1">{{ editingItem.name }}</h6>
            <p class="mb-0 text-danger fw-bold">{{ formatPrice(editingItem.price) }}</p>
          </div>
        </div>
        <div class="mb-4">
          <div class="d-flex gap-2 flex-wrap">
            <button
              v-for="(stock, size) in editingItem.variants"
              :key="size"
              class="btn size-btn"
              :class="{ active: tempSize === size, disabled: stock === 0 }"
              :disabled="stock === 0"
              @click="tempSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>
        <div class="d-grid">
          <button class="btn btn-checkout rounded-pill text-white py-2" @click="saveVariant">
            XÁC NHẬN
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cartState, removeFromCart } from '../../../store/cartStore.js'

const router = useRouter()

const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'
const getStock = (item) => (item.variants ? item.variants[item.size] : 0)

const increaseQty = (item) => {
  const max = getStock(item)
  if (item.quantity < max) item.quantity++
  else alert(`Kho chỉ còn ${max} sản phẩm.`)
}
const decreaseQty = (item) => {
  if (item.quantity > 1) item.quantity--
}

const totalSelectedItems = computed(() => cartState.items.filter((i) => i.selected).length)
const subTotal = computed(() =>
  cartState.items.filter((i) => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0),
)
const isAllSelected = computed({
  get: () => cartState.items.length > 0 && cartState.items.every((i) => i.selected),
  set: (val) => cartState.items.forEach((i) => (i.selected = val)),
})

const voucherInput = ref('')
const discount = ref(0)
const applyVoucher = () => {
  if (voucherInput.value.toUpperCase() === 'GIAIDAI') {
    discount.value = 50000
    alert('Áp dụng mã GIAIDAI thành công! Giảm 50.000đ')
  } else {
    discount.value = 0
    alert('Mã không hợp lệ hoặc đã hết hạn!')
  }
}
const finalTotal = computed(() => {
  let total = subTotal.value - discount.value
  return total > 0 ? total : 0
})

const handleRemove = (index) => {
  if (confirm('Xóa sản phẩm này?')) removeFromCart(index)
}

const showModal = ref(false)
const editingItem = ref(null)
const editingIndex = ref(-1)
const tempSize = ref('')
const openVariantModal = (item, index) => {
  editingItem.value = { ...item }
  editingIndex.value = index
  tempSize.value = item.size
  showModal.value = true
}
const closeVariantModal = () => {
  showModal.value = false
}
const saveVariant = () => {
  if (!tempSize.value) return
  const newStock = editingItem.value.variants[tempSize.value]
  if (cartState.items[editingIndex.value].quantity > newStock)
    cartState.items[editingIndex.value].quantity = newStock
  cartState.items[editingIndex.value].size = tempSize.value
  closeVariantModal()
}

const suggestedProducts = [
  {
    name: 'Áo Dài Giao Mùa',
    priceFormatted: '1.950.000 đ',
    image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_LzYroc7Cct.jpeg?v=1766745547',
  },
  {
    name: 'Áo Dài Yên Đan',
    priceFormatted: '2.100.000 đ',
    image: 'https://pos.nvncdn.com/22713a-176435/ps/20251226_rDsPZYagEU.jpeg?v=1766745494',
  },
  {
    name: 'Nam Phục Trúc Sơn',
    priceFormatted: '2.900.000 đ',
    image: 'https://i.pinimg.com/736x/44/8d/d6/448dd638cec05e40e3a34346205e2cab.jpg',
  },
  {
    name: 'Bạch Tuệ Nữ Sinh',
    priceFormatted: '850.000 đ',
    image: 'https://pos.nvncdn.com/22713a-176435/ps/20250905_kOB5RJ5r2E.jpeg?v=1757039795',
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

/* TIÊU ĐỀ NGHỆ THUẬT */
.title-cursive-elegant {
  font-family: 'Dancing Script', cursive !important;
  font-weight: 700;
}

.nav-text {
  color: #3d211a !important;
  text-transform: uppercase;
  transition: color 0.3s ease;
}
.custom-checkbox {
  width: 1.2rem;
  height: 1.2rem;
  border-color: #cbb799;
  cursor: pointer;
}
.custom-checkbox:checked {
  background-color: #6f4d38;
  border-color: #6f4d38;
}
.btn-outline-elegant {
  color: #6f4d38;
  border: 1px solid #cbb799;
  background: white;
  transition: 0.3s;
}
.btn-outline-elegant:hover {
  background: #6f4d38;
  color: white;
  border-color: #6f4d38;
}
.variant-box {
  background-color: #f8f9fa;
  border: 1px solid #eee;
  cursor: pointer;
  transition: 0.2s;
}
.variant-box:hover {
  border-color: #cbb799;
  background-color: white;
}
.btn-checkout {
  background-color: #6f4d38;
  transition: 0.3s;
  border: none;
}
.btn-checkout:hover:not(:disabled) {
  background-color: #3d211a;
  transform: translateY(-2px);
}
.btn-checkout:disabled {
  background-color: #cbb799;
  cursor: not-allowed;
}
.product-card {
  cursor: pointer;
  transition: 0.3s;
}
.product-card:hover {
  transform: translateY(-5px);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-box {
  width: 90%;
  max-width: 400px;
}
.size-btn {
  border: 1px solid #cbb799;
  color: #6f4d38;
  width: 60px;
  height: 40px;
  border-radius: 8px;
}
.size-btn.active {
  background-color: #6f4d38;
  color: white;
  border-color: #6f4d38;
}
.size-btn.disabled {
  background-color: #f1f1f1;
  opacity: 0.5;
}
</style>
