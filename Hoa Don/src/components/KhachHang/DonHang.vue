<template>
  <div class="client-home" style="background-color: #f5f5f5 !important; min-height: 100vh; padding-bottom: 50px;">
    
    <div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin: 20px;">
      <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3 bg-white" role="alert">
        <div class="d-flex align-items-center gap-2">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-triangle-fill text-danger'" class="fs-5"></i>
          <div class="toast-body">
            <strong>{{ toast.title }}</strong>
            <div>{{ toast.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg sticky-top py-3 bg-white shadow-sm">
      <div class="container-fluid px-4 px-lg-5">
        <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
          <img src="/Logo.png" alt="Logo" style="height: 50px; object-fit: contain" />
        </router-link>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-5 text-center align-items-center justify-content-center">
            <li class="nav-item"><router-link to="/" class="nav-link fw-medium nav-text">TRANG CHỦ</router-link></li>
            <li class="nav-item"><router-link to="/gioi-thieu" class="nav-link fw-medium nav-text">GIỚI THIỆU</router-link></li>
            <li class="nav-item"><router-link to="/cua-hang" class="nav-link fw-medium nav-text">SẢN PHẨM</router-link></li>
            <li class="nav-item"><router-link to="/don-hang" class="nav-link fw-medium nav-text active-link">ĐƠN HÀNG</router-link></li>
            <li class="nav-item"><router-link to="/lien-he" class="nav-link fw-medium nav-text">LIÊN HỆ</router-link></li>
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

    <div class="container py-4" style="max-width: 1100px;">
      <div class="row g-4">
        
        <div class="col-lg-3">
          <div class="d-flex align-items-center gap-3 pb-3 mb-3">
            <div class="rounded-circle d-flex align-items-center justify-content-center bg-white border shadow-sm" style="width: 50px; height: 50px;">
              <i class="bi bi-person fs-3 text-secondary"></i>
            </div>
            <div class="overflow-hidden">
              <div class="fw-bold text-truncate text-dark">{{ currentUsername }}</div>
            </div>
          </div>
          <ul class="list-unstyled mb-0 sidebar-menu">
            <li class="p-2 mb-1 rounded fw-medium cursor-pointer d-flex align-items-center gap-2" 
                style="color: #8c5a35;" @click="closeDetail">
              <i class="bi bi-file-earmark-text"></i> Đơn mua
            </li>
          </ul>
        </div>

        <div class="col-lg-9">
          
          <div v-if="!selectedOrderMaHD" class="card border-0 shadow-sm rounded-2 bg-white overflow-hidden">
            <div class="d-flex align-items-center border-bottom text-nowrap overflow-x-auto bg-white sticky-tabs custom-scrollbar pb-1 pt-1">
              <button v-for="tab in statusTabs" :key="tab.id" @click="activeTab = tab.id"
                class="btn px-4 py-3 position-relative fw-medium rounded-0 tab-btn flex-shrink-0"
                :class="activeTab === tab.id ? 'active-tab' : 'text-dark'">
                {{ tab.name }}
              </button>
            </div>

            <div v-if="filteredOrders.length === 0" class="card-body p-5 text-center my-5 bg-white">
              <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712b96488590b8f781f.png" alt="Empty" style="width: 100px; opacity: 0.8;" class="mb-3">
              <div class="text-muted">Chưa có đơn hàng</div>
            </div>

            <div v-else class="p-3 bg-transparent">
              <div v-for="order in filteredOrders" :key="order.id" class="card border-0 shadow-sm mb-3 rounded-2 overflow-hidden order-card">
                <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                  <div class="fw-bold text-dark">
                    MÃ ĐƠN HÀNG: #{{ order.ma_hoa_don }}
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small border-end pe-2">{{ formatDate(order.ngay_tao) }}</span>
                    <span class="fw-bold text-uppercase" style="font-size: 0.85rem;" :class="order.trang_thai === 7 || order.trang_thai === 0 ? 'text-danger' : 'text-brown'">
                      {{ getStatusText(order.trang_thai) }}
                    </span>
                  </div>
                </div>

                <div class="card-body px-4 py-3 cursor-pointer" @click="openDetail(order.ma_hoa_don)">
                  <div class="d-flex gap-3 align-items-start">
                    <img :src="getProductImage(order.hinh_anh_dau)" 
                         @error="handleImageError"
                         class="border rounded object-fit-cover bg-light" style="width: 80px; height: 80px;">
                    <div class="flex-grow-1">
                      <div class="fw-medium text-dark fs-6">{{ order.ten_sp_dau || 'Sản phẩm áo dài' }}</div>
                      <div class="text-muted small mt-1" v-if="order.tong_so_luong > 1">
                        ...và {{ order.tong_so_luong - 1 }} sản phẩm khác
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card-footer bg-light bg-opacity-50 border-top py-3 px-4 d-flex justify-content-end align-items-center gap-4">
                  <div class="d-flex align-items-center gap-2">
                    <span class="text-dark">Thành tiền:</span>
                    <span class="fw-bold fs-5" style="color: #8c5a35;">{{ formatPrice(order.tong_tien_thanh_toan) }}</span>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-shopee px-4 py-2" @click="openDetail(order.ma_hoa_don)">Xem chi tiết</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="card border-0 shadow-sm rounded-2 bg-white pb-4">
            
            <div class="p-3 border-bottom d-flex align-items-center justify-content-between bg-white sticky-top rounded-top-2">
              <div class="d-flex align-items-center gap-2 cursor-pointer text-muted custom-back" @click="closeDetail">
                <i class="bi bi-chevron-left"></i> <span>TRỞ LẠI</span>
              </div>
              <div class="d-flex align-items-center gap-3">
                <span class="text-dark">MÃ ĐƠN HÀNG: <strong>#{{ selectedOrderMaHD }}</strong></span>
                <span class="text-muted">|</span>
                <span class="text-uppercase fw-bold" :class="currentDetailStatus === 7 || currentDetailStatus === 0 ? 'text-danger' : 'text-brown'">
                  {{ getStatusText(orderDetail.invoice?.trang_thai) }}
                </span>
              </div>
            </div>

            <div class="p-4 border-bottom bg-white">
              <div class="timeline-wrapper position-relative mx-auto" style="max-width: 800px; padding: 20px 0;">
                
                <div v-if="currentDetailStatus !== 7 && currentDetailStatus !== 0 && currentDetailStatus !== 8" class="timeline-line"></div>
                
                <div class="d-flex justify-content-between position-relative z-1" :class="currentDetailStatus === 7 || currentDetailStatus === 0 || currentDetailStatus === 8 ? 'justify-content-center' : ''">
                  
                  <div v-for="step in activeTimelineSteps" :key="step.step" class="timeline-step text-center">
                    <div class="step-icon mx-auto mb-2 d-flex align-items-center justify-content-center"
                         :class="{
                           'current-step': currentDetailStatus >= step.step && currentDetailStatus < 7,
                           'cancelled-step': step.step === 7 || step.step === 8,
                           'future-step': currentDetailStatus < step.step && currentDetailStatus < 7
                         }">
                      <div v-html="step.svg" class="d-flex align-items-center justify-content-center w-100 h-100"></div>
                    </div>
                    
                    <div class="step-label"
                         :class="{
                           'active-label': currentDetailStatus >= step.step && currentDetailStatus < 7,
                           'cancelled-label': step.step === 7 || step.step === 8,
                           'future-label': currentDetailStatus < step.step && currentDetailStatus < 7
                         }">
                      {{ step.label }}
                    </div>
                    
                    <div class="step-date mt-1" v-if="(currentDetailStatus >= step.step && currentDetailStatus < 7 && step.step === 1) || step.step === 7 || step.step === 8">
                      {{ formatDateLine(orderDetail.invoice?.ngay_tao) }}
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            <div class="px-4 py-3 d-flex justify-content-end bg-light bg-opacity-50 border-bottom" v-if="currentDetailStatus === 1">
              <button class="btn btn-outline-danger px-4 py-2 me-2 fw-medium" @click="cancelOrder(selectedOrderMaHD)">
                <i class="bi bi-x-circle me-1"></i> Hủy Đơn Hàng
              </button>
            </div>

            <div class="p-4 border-bottom bg-white">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-dark m-0 text-uppercase">Địa Chỉ Nhận Hàng</h6>
                <button v-if="currentDetailStatus === 1 && !isEditingInfo" class="btn btn-sm text-primary fw-medium" @click="startEditInfo">
                  <i class="bi bi-pencil me-1"></i> Sửa
                </button>
              </div>

              <div v-if="!isEditingInfo" class="d-flex flex-column gap-1 text-dark" style="font-size: 0.95rem;">
                <div class="fw-bold">{{ orderDetail.invoice?.ten_nguoi_nhan }} <span class="fw-normal text-muted ms-2">{{ orderDetail.invoice?.sdt_nguoi_nhan }}</span></div>
                <div class="text-muted">{{ orderDetail.invoice?.dia_chi_giao_hang }}</div>
              </div>

              <div v-else class="p-3 bg-light border rounded-2">
                <div class="text-danger small mb-3" v-if="!canEditAddress">
                  <i class="bi bi-info-circle me-1"></i> Đơn đã thanh toán trực tuyến. Bạn chỉ có thể cập nhật Tên và SĐT.
                </div>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small text-muted mb-1">Tên người nhận</label>
                    <input type="text" class="form-control" v-model="editForm.ten">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small text-muted mb-1">Số điện thoại</label>
                    <input type="text" class="form-control" v-model="editForm.sdt">
                  </div>
                  <div class="col-12">
                    <label class="form-label small text-muted mb-1">Địa chỉ chi tiết</label>
                    <textarea class="form-control" v-model="editForm.diaChi" rows="2" :disabled="!canEditAddress"></textarea>
                  </div>
                </div>
                <div class="d-flex gap-2 justify-content-end mt-3">
                  <button class="btn btn-light px-4 border" @click="isEditingInfo = false">Trở lại</button>
                  <button class="btn btn-shopee px-4" @click="saveEditedInfo" :disabled="isSaving">Hoàn thành</button>
                </div>
              </div>
            </div>

            <div class="p-4 border-bottom bg-white">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-dark m-0 text-uppercase">Sản Phẩm</h6>
                <button v-if="currentDetailStatus === 1 && canEditAddress && !isEditingQty" class="btn btn-sm text-primary fw-medium" @click="startEditQty">
                  <i class="bi bi-pencil me-1"></i> Sửa số lượng
                </button>
                <div v-if="isEditingQty" class="d-flex gap-2">
                  <button class="btn btn-sm btn-light border" @click="cancelEditQty">Trở lại</button>
                  <button class="btn btn-sm btn-shopee px-3" @click="saveEditedQty" :disabled="isSaving">Lưu</button>
                </div>
              </div>

              <div class="text-danger small mb-3 bg-danger bg-opacity-10 p-2 rounded" v-if="isEditingQty">
                Giảm số lượng về 0 để bỏ sản phẩm khỏi đơn. <strong>Bắt buộc giữ lại ít nhất 1 sản phẩm.</strong>
              </div>

              <div class="d-flex flex-column gap-3">
                <div v-for="(item, index) in draftDetails" :key="index" class="d-flex align-items-center justify-content-between pb-3 border-bottom border-light last-border-none">
                  <div class="d-flex gap-3 align-items-center">
                    <div class="border rounded bg-light overflow-hidden" style="width: 80px; height: 80px;">
                      <img :src="getProductImage(item.hinh_anh)" 
                           @error="handleImageError"
                           class="w-100 h-100 object-fit-cover">
                    </div>
                    <div>
                      <div class="fw-medium text-dark fs-6 mb-1">{{ item.ten_san_pham }}</div>
                      <div class="text-muted small">Phân loại: {{ item.ten_mau }} - {{ item.ten_kich_co }}</div>
                      <div v-if="!isEditingQty" class="text-dark mt-1 fw-medium">x{{ item.so_luong }}</div>
                      
                      <div v-else class="d-flex align-items-center border rounded mt-2 bg-white" style="width: 100px; height: 32px;">
                        <button class="btn btn-sm text-dark px-2 py-0 border-0 h-100" @click="decreaseQty(index)"><i class="bi bi-dash"></i></button>
                        <span class="flex-grow-1 text-center fw-medium small border-start border-end h-100 d-flex align-items-center justify-content-center">{{ item.so_luong }}</span>
                        <button class="btn btn-sm text-dark px-2 py-0 border-0 h-100" @click="increaseQty(index)"><i class="bi bi-plus"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="text-dark mb-1" v-if="!isEditingQty">{{ formatPrice(item.don_gia) }}</div>
                    <div class="fw-bold" style="color: #8c5a35;" v-if="!isEditingQty">{{ formatPrice(item.don_gia * item.so_luong) }}</div>
                    <div v-else class="fw-medium text-dark">{{ formatPrice(item.don_gia) }}</div>
                    <div v-if="item.so_luong === 0" class="badge bg-danger mt-1">Sẽ xóa</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-light bg-opacity-50">
              <div class="row">
                <div class="col-md-7">
                  <div class="text-muted small mb-1">Phương thức thanh toán</div>
                  <div class="fw-medium text-dark">{{ orderDetail.invoice?.ten_pttt || 'Thanh toán khi nhận hàng (COD)' }}</div>
                </div>
                <div class="col-md-5">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Tổng tiền hàng</span>
                    <span class="text-dark small">{{ formatPrice(calculateTotalGoods()) }}</span>
                  </div>
                  <div v-if="orderDetail.invoice?.tien_giam_gia > 0" class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Giảm giá <span v-if="orderDetail.invoice?.ma_voucher">(Mã: {{ orderDetail.invoice?.ma_voucher }})</span></span>
                    <span class="text-success small">- {{ formatPrice(orderDetail.invoice?.tien_giam_gia) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                    <span class="text-muted small d-flex align-items-center gap-1">
                      Phí vận chuyển <img src="/logo_ghn.png" alt="GHN" style="height: 14px; margin-bottom: 2px;" />
                    </span>
                    <span class="text-dark small">+ {{ formatPrice(orderDetail.invoice?.phi_ship || orderDetail.invoice?.tien_ship) }}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted fw-medium">Thành tiền</span>
                    <span class="fw-bold fs-4" style="color: #8c5a35;">{{ formatPrice(orderDetail.invoice?.tong_tien_thanh_toan) }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartCount } from '../../store/cartStore.js' 
import axios from 'axios'

const router = useRouter()
const currentUsername = ref(localStorage.getItem('username') || 'Guest')
const BASE_URL = 'http://localhost:8080/api'

// HÀM ĐĂNG XUẤT
const handleLogout = () => {
  localStorage.removeItem('userRole')
  localStorage.removeItem('username') 
  alert('Đăng xuất thành công!')
  setTimeout(() => { router.push('/dang-nhap') }, 500)
}

const handleImageError = (e) => {
  e.target.src = '/Logo.png';
  e.target.style.objectFit = 'contain';
  e.target.classList.add('p-2');
}

const getProductImage = (imgName) => {
  if (!imgName || imgName === 'null' || imgName === 'undefined') return '/Logo.png';
  if (imgName.startsWith('http') || imgName.startsWith('data:')) return imgName;
  return `${BASE_URL}/sanpham-chitiet/images/${imgName}`;
}

const toast = ref({ show: false, message: '', type: 'success', title: '' })
const showToast = (title, message, type = 'success') => {
  toast.value = { show: true, title, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const activeTab = ref('all')
const orders = ref([])

const statusTabs = [
  { id: 'all', name: 'Tất cả' }, 
  { id: 'pending', name: 'Chờ xác nhận' }, 
  { id: 'confirmed', name: 'Đã xác nhận' }, 
  { id: 'waiting_ship', name: 'Chờ giao hàng' },
  { id: 'shipping', name: 'Đang giao hàng' },
  { id: 'delivered', name: 'Đã giao hàng' },
  { id: 'completed', name: 'Hoàn thành' }, 
  { id: 'cancelled', name: 'Đã hủy' },
  { id: 'returned', name: 'Hoàn trả' }
]

const statusMap = { 
  1: 'pending', 2: 'confirmed', 3: 'waiting_ship', 4: 'shipping', 
  5: 'delivered', 6: 'completed', 7: 'cancelled', 0: 'cancelled', 8: 'returned' 
}

const fetchOrders = async () => {
  if (currentUsername.value === 'Guest') return;
  try {
    const res = await axios.get(`${BASE_URL}/hoadon/khach-hang/${currentUsername.value}`)
    orders.value = res.data
  } catch (e) { console.error(e) }
}

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value;
  return orders.value.filter(o => (statusMap[o.trang_thai] || 'pending') === activeTab.value)
})

const getStatusText = (status) => {
  const m = { 1: 'Chờ xác nhận', 2: 'Đã xác nhận', 3: 'Chờ giao hàng', 4: 'Đang giao hàng', 5: 'Đã giao hàng', 6: 'Hoàn thành', 7: 'Đã hủy', 0: 'Đã hủy', 8: 'Hoàn trả' }
  return m[status] || 'Đang xử lý'
}

const selectedOrderMaHD = ref('')
const orderDetail = ref({ invoice: {}, details: [] })

const isEditingInfo = ref(false)
const isSaving = ref(false)
const editForm = ref({ ten: '', sdt: '', diaChi: '' })

const isEditingQty = ref(false)
const draftDetails = ref([])

const openDetail = async (maHD) => {
  selectedOrderMaHD.value = maHD
  isEditingInfo.value = false
  isEditingQty.value = false
  await fetchOrderDetail()
}

const closeDetail = () => {
  selectedOrderMaHD.value = ''
}

const fetchOrderDetail = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}`)
    orderDetail.value = res.data
    draftDetails.value = JSON.parse(JSON.stringify(res.data.details))
  } catch (e) { showToast('Lỗi', 'Không tải được chi tiết đơn hàng', 'danger') }
}

const currentDetailStatus = computed(() => Number(orderDetail.value.invoice?.trang_thai) || 1)

// ĐÃ FIX: HÀM QUẢN LÝ THAY ĐỔI TIMELINE DỰA VÀO TRẠNG THÁI
const activeTimelineSteps = computed(() => {
  const status = currentDetailStatus.value;
  if (status === 7 || status === 0) {
    return [{ step: 7, label: 'Đã Hủy', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>` }];
  }
  if (status === 8) {
    return [{ step: 8, label: 'Đã Hoàn Trả', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>` }];
  }
  return [
    { step: 1, label: 'Chờ xác nhận', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h14M5 22h14M19 2v4c0 3.3-2.7 6-6 6M5 2v4c0 3.3 2.7 6 6 6M13 12c3.3 0 6 2.7 6 6v4M11 12c-3.3 0-6 2.7-6 6v4"/></svg>` },
    { step: 2, label: 'Đã xác nhận', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` },
    { step: 3, label: 'Chờ giao hàng', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>` },
    { step: 4, label: 'Đang giao hàng', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
    { step: 5, label: 'Đã giao hàng', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"></path><polyline points="1 3 23 3 23 8 1 8 1 3"></polyline><path d="M10 12l2 2 4-4"></path></svg>` },
    { step: 6, label: 'Hoàn thành', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>` }
  ];
})

const canEditAddress = computed(() => {
  const isPaid = orderDetail.value.invoice?.trang_thai_thanh_toan === 1;
  const pttt = (orderDetail.value.invoice?.ten_pttt || '').toLowerCase();
  return !isPaid && !pttt.includes('chuyển khoản');
})

const startEditInfo = () => {
  editForm.value = {
    ten: orderDetail.value.invoice.ten_nguoi_nhan,
    sdt: orderDetail.value.invoice.sdt_nguoi_nhan,
    diaChi: orderDetail.value.invoice.dia_chi_giao_hang
  }
  isEditingInfo.value = true
}

const saveEditedInfo = async () => {
  if(!editForm.value.ten || !editForm.value.sdt) {
    showToast('Cảnh báo', 'Vui lòng điền đủ Tên và Số điện thoại', 'danger'); return;
  }
  isSaving.value = true;
  try {
    await axios.put(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/thong-tin`, {
      ten_nguoi_nhan: editForm.value.ten,
      sdt_nguoi_nhan: editForm.value.sdt,
      dia_chi_giao_hang: canEditAddress.value ? editForm.value.diaChi : undefined 
    });
    showToast('Thành công', 'Cập nhật thông-tin thành công');
    isEditingInfo.value = false;
    fetchOrderDetail(); 
  } catch(e) {
    showToast('Lỗi', 'Không thể lưu thông tin', 'danger')
  }
  isSaving.value = false;
}

const startEditQty = () => {
  draftDetails.value = JSON.parse(JSON.stringify(orderDetail.value.details));
  isEditingQty.value = true;
}

const cancelEditQty = () => {
  isEditingQty.value = false;
  draftDetails.value = JSON.parse(JSON.stringify(orderDetail.value.details));
}

const increaseQty = (idx) => { draftDetails.value[idx].so_luong++; }
const decreaseQty = (idx) => { 
  if(draftDetails.value[idx].so_luong > 0) draftDetails.value[idx].so_luong--; 
}

const saveEditedQty = async () => {
  const totalItemsLeft = draftDetails.value.reduce((sum, item) => sum + item.so_luong, 0);
  if(totalItemsLeft === 0) {
    showToast('Cảnh báo', 'Không thể xóa hết sản phẩm. Hãy dùng nút Hủy Đơn Hàng!', 'danger'); return;
  }

  isSaving.value = true;
  try {
    for (let i = 0; i < draftDetails.value.length; i++) {
      const draft = draftDetails.value[i];
      const original = orderDetail.value.details[i];

      if (draft.so_luong === 0) {
        await axios.delete(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/sanpham/${draft.ma_sp}`);
      } else if (draft.so_luong !== original.so_luong) {
        await axios.post(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/sanpham`, {
          ma_sp: draft.ma_sp,
          so_luong: draft.so_luong,
          don_gia: draft.don_gia
        });
      }
    }
    showToast('Thành công', 'Cập nhật số lượng sản phẩm thành công');
    isEditingQty.value = false;
    await fetchOrderDetail();
    await fetchOrders(); 
  } catch(e) {
    showToast('Lỗi', e.response?.data?.message || 'Cập nhật thất bại do kho không đủ', 'danger')
  }
  isSaving.value = false;
}

const cancelOrder = async (maHD) => {
  if(confirm(`Bạn chắc chắn muốn hủy đơn hàng ${maHD}?`)) {
    try {
      await axios.put(`${BASE_URL}/hoadon/${maHD}/status`, { trang_thai: 7, ly_do_huy: "Khách hàng yêu cầu hủy" })
      showToast('Thành công', 'Hủy đơn hàng thành công')
      if (selectedOrderMaHD.value) fetchOrderDetail();
      fetchOrders();
    } catch(e) { showToast('Lỗi', 'Không thể hủy đơn', 'danger') }
  }
}

const calculateTotalGoods = () => {
  return orderDetail.value.details.reduce((sum, item) => sum + (item.so_luong * item.don_gia), 0)
}

const formatPrice = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0).replace('₫', 'đ')
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}
const formatDateLine = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')} \n ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
}

let pollingInterval = null;

onMounted(() => { 
  fetchOrders() 
  pollingInterval = setInterval(() => {
    if (selectedOrderMaHD.value) {
      fetchOrderDetail();
    } else {
      fetchOrders();
    }
  }, 3000);
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
})
</script>

<style scoped>
.client-home { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.cursor-pointer { cursor: pointer; }
.nav-text { color: #000 !important; font-size: 1rem; text-transform: uppercase; padding: 10px 0 !important; }
.active-link { border-bottom: 2px solid #8c5a35 !important; color: #8c5a35 !important; }

/* Sidebar */
.sidebar-menu li:hover { background-color: #ebebeb; }

/* Tabs - Kéo dài thanh cuộn và làm dày lên để bấm trúng dễ dàng */
.sticky-tabs { position: sticky; top: 0; z-index: 10; overflow-y: hidden; }
.tab-btn { color: #555; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
.tab-btn:hover { color: #8c5a35; }
.active-tab { color: #8c5a35 !important; border-bottom: 2px solid #8c5a35 !important; }

.custom-scrollbar::-webkit-scrollbar { height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbb8ac; border-radius: 4px; border: 1px solid #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a67c52; }

/* Buttons */
.btn-shopee { background-color: #8c5a35; color: white; border: none; transition: 0.2s; }
.btn-shopee:hover { background-color: #6a4428; color: white; }

/* Timeline Shopee Đồng bộ Admin */
.timeline-wrapper { position: relative; }
.timeline-line { position: absolute; top: 38px; left: 8%; right: 8%; height: 2px; background-color: #e5e7eb; z-index: 0; }

.timeline-step { position: relative; flex: 1; max-width: 95px; }

/* Vòng tròn cơ bản */
.step-icon { 
  width: 48px; 
  height: 48px; 
  border-radius: 50%; 
  border: 2px solid #e5e7eb; 
  background-color: #fff; 
  color: #9ca3af; 
  position: relative; 
  z-index: 2; 
  transition: all 0.3s ease; 
}

/* Đang ở bước này: Nền xanh lá, icon trắng, viền xanh lá */
.step-icon.current-step {
  background-color: #279f53;
  border-color: #279f53;
  color: #fff;
}

/* ĐÃ FIX: Màu Hủy Đơn / Hoàn trả (Cam Đỏ) */
.step-icon.cancelled-step {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
  transform: scale(1.1);
}
.step-label.cancelled-label { color: #dc3545; font-weight: bold; }

/* Đã qua bước này: Nền trắng, icon xanh lá, viền xanh lá */
.step-icon.past-step {
  background-color: #fff;
  border-color: #279f53;
  color: #279f53;
}

/* Text dưới timeline */
.step-label { font-size: 0.85rem; margin-top: 8px; transition: color 0.3s ease; }
.step-label.active-label { color: #279f53; font-weight: 600; }
.step-label.past-label { color: #4b5563; font-weight: 500; }
.step-label.future-label { color: #9ca3af; }

.step-date { font-size: 0.75rem; color: #9ca3af; white-space: pre-line; line-height: 1.2; }
.text-brown { color: #8c5a35 !important; }

.custom-back:hover { color: #8c5a35 !important; }
.last-border-none:last-child { border-bottom: none !important; padding-bottom: 0 !important; }
</style>