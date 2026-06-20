<template>
  <div class="client-home" style="background-color: #ffffff !important; min-height: 100vh">
    
    <div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin: 20px;">
      <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3 bg-white" role="alert">
        <div class="d-flex align-items-center gap-2">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill text-success' : toast.type === 'warning' ? 'bi bi-exclamation-circle-fill text-warning' : 'bi bi-exclamation-triangle-fill text-danger'" class="fs-5"></i>
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
            <li class="nav-item"><router-link to="/" class="nav-link fw-medium nav-text menu-underline" exact-active-class="active-link">Trang chủ</router-link></li>
            <li class="nav-item"><router-link to="/gioi-thieu" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Giới Thiệu</router-link></li>
            <li class="nav-item"><router-link to="/cua-hang" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Sản phẩm</router-link></li>
            <li class="nav-item"><router-link to="/don-hang" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Đơn Hàng</router-link></li>
            <li class="nav-item"><router-link to="/lien-he" class="nav-link fw-medium nav-text menu-underline" active-class="active-link">Liên hệ</router-link></li>
          </ul>

          <div class="d-flex align-items-center justify-content-center gap-4 fs-5 nav-text mt-3 mt-lg-0">
            <div class="dropdown">
              <i class="bi bi-bell icon-btn position-relative" data-bs-toggle="dropdown" style="cursor: pointer"></i>
              <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3 rounded-3 text-center custom-dropdown" style="background-color: #ffffff !important">
                <i class="bi bi-bell-slash fs-3 mb-2 d-block" style="color: #a07856"></i>
                <span class="small" style="color: #6f4d38">Không có thông báo mới</span>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <i class="bi bi-bag position-relative" @click="router.push('/gio-hang')" style="cursor: pointer; font-size: 1.3rem; color: #a82e3e">
                <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background-color: #a82e3e; font-size: 0.65rem">
                  {{ cartCount }}
                </span>
              </i>
            </div>
            
            <div class="dropdown">
              <i class="bi bi-person-circle icon-btn" data-bs-toggle="dropdown" style="cursor: pointer"></i>
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

    <div class="container py-5 mt-2" style="min-height: 65vh;">
      
      <h2 class="title-cursive-elegant text-center mb-1" style="font-size: 3rem; color: #3d211a">Giỏ Hàng</h2>
      <p class="text-center text-muted small mb-5">Kiểm tra sản phẩm, số lượng trước khi tiến hành đặt hàng</p>

      <div v-if="cartItems.length === 0" class="card border-0 shadow-sm p-5 text-center rounded-3 mx-auto" style="max-width: 850px;">
        <div class="py-4">
          <i class="bi bi-cart-x text-muted opacity-50 mb-3 d-block" style="font-size: 4rem;"></i>
          <h5 class="fw-bold mb-2" style="color: #3d211a;">Giỏ hàng của bạn đang trống</h5>
          <button class="btn btn-outline-secondary px-4 py-2 mt-3 rounded-1 text-uppercase fw-medium small btn-back-shop" @click="router.push('/cua-hang')">
            Tiếp tục mua hàng
          </button>
        </div>
      </div>

      <div v-else class="row g-4">
        
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm p-4 rounded-3 bg-white">
            
            <div class="d-flex align-items-center pb-3 border-bottom mb-3 fw-bold text-muted small text-uppercase">
              <div style="width: 40%" class="d-flex align-items-center gap-2">
                <input type="checkbox" class="form-check-input custom-checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                <span>Sản phẩm</span>
              </div>
              <div style="width: 15%" class="text-center">Đơn giá</div>
              <div style="width: 15%" class="text-center">Giảm giá</div>
              <div style="width: 15%" class="text-center">Số lượng</div>
              <div style="width: 10%" class="text-end">Tổng tiền</div>
              <div style="width: 5%"></div> 
            </div>

            <div v-for="(item, index) in cartItems" :key="index" class="d-flex align-items-center py-3 border-bottom cart-item-row">
              
              <div style="width: 40%" class="d-flex align-items-center gap-3">
                <input type="checkbox" class="form-check-input custom-checkbox flex-shrink-0" v-model="item.selected" />
                <div class="rounded-2 overflow-hidden border flex-shrink-0 bg-light" style="width: 75px; height: 90px;">
                  <img :src="item.image || '/Logo.png'" :alt="item.name" class="w-100 h-100 object-fit-cover" />
                </div>
                <div class="overflow-hidden">
                  <h6 class="fw-bold mb-1 text-truncate" style="color: #3d211a; font-size: 0.95rem;">
                    {{ item.name }} 
                    <span v-if="item.color" class="fw-normal">({{ item.color }})</span>
                  </h6>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="badge bg-light text-dark border small py-1 px-2">Size: {{ item.size }}</span>
                  </div>
                  <div v-if="item.stock" class="small text-muted">Còn lại: {{ item.stock }}</div>
                </div>
              </div>

              <div style="width: 15%" class="text-center">
                <div class="fw-bold text-dark">{{ formatPrice(item.price) }}</div>
                <div v-if="item.originalPrice" class="text-decoration-line-through text-muted small" style="font-size: 0.8rem; opacity: 0.7;">
                  {{ formatPrice(item.originalPrice) }}
                </div>
              </div>

              <div style="width: 15%" class="text-center">
                <span v-if="item.discountPercent" class="badge-discount-tag px-2 py-1 rounded small fw-medium d-inline-flex align-items-center gap-1">
                  <i class="bi bi-tag-fill"></i> {{ item.discountPercent }}%
                </span>
                <span v-else class="text-muted small">-</span>
              </div>

              <div style="width: 15%" class="text-center d-flex justify-content-center">
                <div class="d-flex align-items-center border rounded bg-light quantity-wrapper">
                  <button class="btn btn-sm qty-btn border-0 shadow-none d-flex align-items-center justify-content-center fw-bold fs-5" @click="decreaseQty(item)" :disabled="item.quantity <= 1">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="text-center fw-medium qty-number" style="color: #3d211a;">{{ item.quantity }}</span>
                  <button class="btn btn-sm qty-btn border-0 shadow-none d-flex align-items-center justify-content-center fw-bold fs-5" @click="increaseQty(item)" :disabled="item.quantity >= (item.stock || 99)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              <div style="width: 10%" class="text-end ps-0 pe-1">
                <span class="fw-bold" style="color: #a82e3e;">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>

              <div style="width: 5%" class="text-end">
                <i class="bi bi-trash3 text-muted delete-icon fs-5" @click="removeItem(index)" title="Xóa sản phẩm"></i>
              </div>

            </div>

            <div class="pt-3">
              <span class="small text-muted text-decoration-none custom-back-link" style="cursor: pointer;" @click="router.push('/cua-hang')">
                <i class="bi bi-arrow-left me-1"></i> Chọn thêm sản phẩm khác
              </span>
            </div>

          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
            <h5 class="fw-bold mb-4 text-uppercase" style="color: #3d211a; font-size: 1rem; letter-spacing: 0.5px;">Tóm tắt đơn hàng</h5>
            
            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
              <span class="text-muted small">Tổng sản phẩm chọn:</span>
              <span class="fw-bold text-dark">{{ selectedItemsCount }}</span>
            </div>
            
            <div class="d-flex justify-content-between mb-4">
              <span class="text-muted small">Tạm tính:</span>
              <span class="fw-bold text-dark">{{ formatPrice(totalSelectedPrice) }}</span>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
              <span class="fw-bold text-dark">Thành tiền</span>
              <div class="text-end">
                <h4 class="fw-bold m-0" style="color: #a82e3e;">{{ formatPrice(totalSelectedPrice) }}</h4>
              </div>
            </div>

            <button class="btn w-100 py-25 text-white text-uppercase fw-bold rounded-1 btn-checkout" :disabled="selectedItemsCount === 0" @click="proceedToCheckout">
              Tiến hành thanh toán
            </button>
          </div>
        </div>

      </div>
    </div>

    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #cbb799">
      <div class="container px-4 px-lg-5">
        <div class="text-center">
          <p class="small mb-0" style="color: #a07856">&copy; 2026 Giai Đài. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, reactive, computed } from 'vue'

import { cartState, removeFromCart, cartCount } from '../../store/cartStore.js'

const router = useRouter()
const currentUsername = ref(localStorage.getItem('username') || 'Guest')

const cartItems = computed(() => cartState.items)

const toast = reactive({ show: false, title: '', message: '', type: 'success' })
const showToast = (message, type = 'success', title = 'Hệ thống') => {
  toast.title = title; toast.message = message; toast.type = type; toast.show = true
  setTimeout(() => { toast.show = false }, 2500)
}

const formatPrice = (value) => {
  if (value === undefined || value === null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

const isAllSelected = computed(() => cartItems.value.length > 0 && cartItems.value.every(item => item.selected))
const toggleSelectAll = (e) => { cartItems.value.forEach(item => item.selected = e.target.checked) }

const increaseQty = (item) => {
  const maxStock = item.stock || 99 
  if (item.quantity < maxStock) {
    item.quantity++
    showToast(`Đã tăng số lượng sản phẩm lên ${item.quantity}!`, 'success', 'Cập nhật')
  } else {
    showToast(`Kho hàng chỉ còn tối đa ${maxStock} sản phẩm!`, 'warning', 'Tồn kho giới hạn')
  }
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    showToast(`Đã giảm số lượng sản phẩm xuống ${item.quantity}!`, 'success', 'Cập nhật')
  }
}

const removeItem = (idx) => {
  const removedName = cartItems.value[idx].name
  removeFromCart(idx)
  showToast(`Đã xóa "${removedName}" khỏi giỏ hàng!`, 'success', 'Xóa thành công')
}

const selectedItemsCount = computed(() => cartItems.value.filter(item => item.selected).reduce((t, i) => t + i.quantity, 0))
const totalSelectedPrice = computed(() => cartItems.value.filter(item => item.selected).reduce((t, i) => t + (i.price * i.quantity), 0))

const proceedToCheckout = () => { router.push('/thanh-toan') }
const handleLogout = () => { localStorage.clear(); router.push('/dang-nhap') }
</script>

<style scoped>
.client-home { font-family: 'Segoe UI', sans-serif; }
.nav-text { color: #3d211a !important; font-size: 1rem; text-transform: uppercase; padding: 10px 0 !important; }
.menu-underline { border-bottom: 2px solid transparent; }
.menu-underline:hover, .active-link { border-bottom: 2px solid #3d211a !important; }
.title-cursive-elegant { font-family: 'Dancing Script', cursive !important; font-weight: 700; }

.py-25 { padding-top: 0.7rem; padding-bottom: 0.7rem; }

/* CSS KHUNG TĂNG GIẢM SỐ LƯỢNG */
.quantity-wrapper {
  height: 34px;
  width: 105px;
  overflow: hidden;
}
.qty-btn {
  width: 32px;
  height: 100%;
  padding: 0;
  color: #3d211a;
  background-color: transparent;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qty-btn:hover:not(:disabled) {
  background-color: #e2dbd0;
}
.qty-btn:disabled {
  color: #cccccc;
  cursor: not-allowed;
}
.qty-number {
  flex: 1;
  font-size: 0.95rem;
  user-select: none;
}

/* BADGE GIẢM GIÁ */
.badge-discount-tag {
  background-color: #eaf7f2 !important;
  color: #1a8754 !important;
  border: 1px solid #d1edd0;
  font-size: 0.8rem;
}

.custom-checkbox:checked { background-color: #6f4d38; border-color: #6f4d38; }
.delete-icon { cursor: pointer; transition: color 0.15s; }
.delete-icon:hover { color: #dc3545 !important; }
.btn-checkout { background-color: #6f4d38; border: 1px solid #6f4d38; }
.btn-checkout:hover:not(:disabled) { background-color: #3d211a; }
.btn-back-shop:hover { background-color: #6f4d38; color: white; border-color: #6f4d38; }
</style>