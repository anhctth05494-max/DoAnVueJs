<template>
  <div class="client-home bg-light" style="min-height: 100vh">
    
    <div class="position-fixed" style="top: 80px; right: 0; z-index: 9999; margin-right: 15px;">
      <div v-if="toast.show" 
           class="custom-toast shadow-lg bg-white rounded-3 d-flex align-items-center gap-2" 
           style="padding: 12px 20px; min-width: 250px; border: 1px solid #eee;">
        
        <i class="fs-4" 
           :class="toast.type === 'error' ? 'bi bi-x-circle-fill text-danger' : 'bi bi-check-circle-fill text-success'"></i>
        
        <div class="fw-medium text-dark" style="font-size: 0.95rem;">
          {{ toast.message }}
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
              <router-link to="/" class="nav-link fw-medium nav-text menu-underline">Trang chủ</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/gioi-thieu" class="nav-link fw-medium nav-text menu-underline">Giới Thiệu</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/cua-hang" class="nav-link fw-medium nav-text menu-underline">Sản phẩm</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/don-hang" class="nav-link fw-medium nav-text menu-underline">Đơn Hàng</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/lien-he" class="nav-link fw-medium nav-text menu-underline">Liên hệ</router-link>
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

    <div class="container py-5">
      <h2 class="fw-bold mb-4" style="color: #3d211a; font-size: 2rem;">Thanh toán</h2>

      <div v-if="checkoutItems.length === 0" class="text-center bg-white p-5 rounded-3 shadow-sm mx-auto" style="max-width: 600px;">
        <i class="bi bi-bag-x fs-1 text-muted mb-3"></i>
        <h5 class="fw-bold text-dark">Bạn chưa chọn sản phẩm nào để thanh toán</h5>
        <button class="btn btn-main-brown mt-3 px-4 py-2" @click="router.push('/gio-hang')">Quay lại Giỏ hàng</button>
      </div>

      <div v-else class="row g-4">
        
        <div class="col-lg-7 col-xl-8">
          
          <div class="card border-0 shadow-sm p-4 rounded-3 mb-4 bg-white" v-if="savedAddresses.length > 0">
            <h6 class="fw-bold mb-3" style="color: #3d211a;">Chọn địa chỉ đã lưu</h6>
            <div class="d-flex flex-column gap-3">
              <div v-for="addr in savedAddresses" :key="addr.id" 
                   class="address-card p-3 border rounded-2 position-relative"
                   :class="{'border-brown bg-light-brown': selectedAddressId === addr.id}"
                   @click="selectSavedAddress(addr)">
                <div class="form-check m-0 d-flex align-items-start gap-2">
                  <input class="form-check-input custom-radio mt-1" type="radio" :value="addr.id" v-model="selectedAddressId">
                  <label class="form-check-label w-100" style="cursor: pointer;">
                    <div class="d-flex justify-content-start align-items-center gap-2 mb-1">
                      <span class="fw-bold text-dark small">{{ addr.hoTen }} • {{ addr.soDienThoai }}</span>
                      <span v-if="addr.laMacDinh || addr.macDinh === true || addr.trangThai === 1" class="badge bg-success bg-opacity-10 text-success border border-success" style="font-size: 0.65rem;">Mặc định</span>
                    </div>
                    <div class="text-muted small">{{ addr.diaChiChiTiet }}, {{ addr.phuongXa }}, {{ addr.quanHuyen }}, {{ addr.tinhThanh }}</div>
                  </label>
                </div>
              </div>
              
              <div class="form-check mt-1 ms-1 d-flex align-items-center gap-2" @click="resetAddressForm">
                <input class="form-check-input custom-radio m-0" type="radio" value="NEW" v-model="selectedAddressId">
                <label class="form-check-label small text-muted" style="cursor: pointer;">Giao đến địa chỉ khác...</label>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 rounded-3 mb-4 bg-white">
            <h6 class="fw-bold mb-4" style="color: #3d211a;">Thông tin người nhận</h6>
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label small fw-medium">Họ và tên người nhận <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.hoTen" placeholder="Nhập họ tên">
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-medium">Số điện thoại <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.soDienThoai" placeholder="Nhập số điện thoại">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-medium">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.tinhThanh" placeholder="Ví dụ: Hà Nội" @input="calculateShippingFee">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-medium">Quận/Huyện <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.quanHuyen" placeholder="Ví dụ: Cầu Giấy">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-medium">Phường/Xã <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.phuongXa" placeholder="Ví dụ: Dịch Vọng">
              </div>
              <div class="col-12">
                <label class="form-label small fw-medium">Địa chỉ cụ thể <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.diaChiChiTiet" placeholder="Số nhà, ngõ, ngách, đường...">
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-light rounded-2 small text-muted d-flex align-items-center gap-2">
              <span class="fw-medium text-dark">Giao đến:</span>
              <span v-if="fullAddressString">{{ fullAddressString }}</span>
              <span v-else class="fst-italic">Vui lòng điền đầy đủ địa chỉ...</span>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
            <h6 class="fw-bold mb-3" style="color: #3d211a;">Phương thức thanh toán <span class="text-danger">*</span></h6>
            <div class="d-flex flex-column gap-3">
              <label class="payment-method border p-3 rounded-2 d-flex align-items-center gap-3" :class="{'border-brown bg-light-brown': paymentMethod === 'COD'}">
                <input type="radio" class="form-check-input custom-radio m-0" value="COD" v-model="paymentMethod">
                <div>
                  <div class="fw-bold text-dark small">Thanh toán khi nhận hàng (COD)</div>
                  <div class="text-muted" style="font-size: 0.75rem;">Khách hàng thanh toán bằng tiền mặt khi shipper giao hàng tới.</div>
                </div>
              </label>
              
              <label class="payment-method border p-3 rounded-2 d-flex align-items-center gap-3" :class="{'border-brown bg-light-brown': paymentMethod === 'TRANSFER'}">
                <input type="radio" class="form-check-input custom-radio m-0" value="TRANSFER" v-model="paymentMethod">
                <div>
                  <div class="fw-bold text-dark small">Chuyển khoản VietQR (Napas)</div>
                  <div class="text-muted" style="font-size: 0.75rem;">Chuyển khoản tự động qua mã QR code. Đơn hàng sẽ được xác nhận tức thì.</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        <div class="col-lg-5 col-xl-4">
          <div class="card border-0 shadow-sm p-4 rounded-3 bg-white sticky-top" style="top: 100px">
            
            <h6 class="fw-bold mb-3 border-bottom pb-3" style="color: #3d211a;">Đơn hàng ({{ checkoutItems.length }} sản phẩm)</h6>
            
            <div class="d-flex flex-column gap-3 mb-4 max-height-cart overflow-auto pt-2 pe-3">
              <div v-for="(item, index) in checkoutItems" :key="index" class="d-flex gap-3 align-items-center">
                <div class="position-relative ms-1" style="min-width: 55px;">
                  <img :src="item.image" class="rounded border object-fit-cover bg-light" style="width: 55px; height: 70px;">
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary border border-white" style="font-size: 0.65rem; z-index: 2;">
                    {{ item.quantity }}
                  </span>
                </div>
                <div class="flex-grow-1 ps-2">
                  <div class="fw-bold text-dark" style="font-size: 0.85rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    {{ item.name }}
                  </div>
                  <div class="text-muted mt-1" style="font-size: 0.7rem;">Size: {{ item.size }} <span v-if="item.color">| Màu: {{ item.color }}</span></div>
                </div>
                <div class="fw-bold text-dark text-end" style="font-size: 0.85rem; white-space: nowrap;">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div class="mb-4 position-relative">
              <div class="input-group">
                <input type="text" class="form-control shadow-none border-end-0 small" 
                       style="font-size: 0.85rem;"
                       placeholder="Nhập hoặc chọn mã giảm giá" 
                       v-model="voucherCodeInput"
                       @focus="showVoucherList = true">
                <button class="btn btn-dark" style="font-size: 0.85rem;" @click="applyVoucherInput">Áp dụng</button>
              </div>
              
              <div v-if="showVoucherList" class="voucher-dropdown bg-white border rounded-2 shadow position-absolute w-100 mt-1 p-2" style="z-index: 100;">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2 px-2">
                  <span class="small text-muted fw-medium">Voucher có thể dùng</span>
                  <span class="small text-primary" style="cursor:pointer" @click="showVoucherList = false">Đóng</span>
                </div>
                
                <div v-if="dbVouchers.length === 0" class="text-center p-3 small text-muted">Không có mã nào phù hợp</div>
                
                <div v-for="vc in dbVouchers" :key="vc.id" class="voucher-item p-2 rounded-2 mb-1" @click="selectVoucher(vc)">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <div class="fw-bold text-dark small" v-if="vc.phanTramGiam">Giảm {{ vc.phanTramGiam }}% (Tối đa {{ formatPrice(vc.giamToiDa) }})</div>
                      <div class="fw-bold text-dark small" v-else>Giảm {{ formatPrice(vc.giamToiDa) }}</div>
                      <div class="text-muted mt-1" style="font-size: 0.7rem;">Mã: {{ vc.maVoucher || vc.tenPgg }}</div>
                      <div class="text-muted" style="font-size: 0.7rem;">Đơn tối thiểu {{ formatPrice(vc.dieuKienToiThieu || 0) }}</div>
                    </div>
                    <div class="fw-bold text-success small">-{{ formatPrice(previewDiscount(vc)) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between mb-2 small text-muted">
              <span>Tạm tính</span>
              <span class="text-dark fw-medium">{{ formatPrice(subTotal) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2 small text-muted align-items-center">
              <span class="d-flex align-items-center gap-2">
                Phí vận chuyển 
                <img src="/logo_ghn.png" alt="GHN" style="height: 25px; object-fit: contain; vertical-align: middle; margin-bottom: 2px;">
              </span>
              <span class="text-dark fw-medium">{{ formatPrice(shippingFee) }}</span>
            </div>
            <div v-if="appliedVoucher" class="d-flex justify-content-between mb-3 small text-success align-items-center">
              <span>Mã giảm giá ({{ appliedVoucher.maVoucher || appliedVoucher.tenPgg }}) <i class="bi bi-x-circle text-danger ms-1" style="cursor:pointer" @click="removeVoucher"></i></span>
              <span class="fw-bold">-{{ formatPrice(discountAmount) }}</span>
            </div>

            <hr class="opacity-25">

            <div class="d-flex justify-content-between align-items-end mb-4">
              <span class="fw-bold text-dark">Tổng cộng</span>
              <div class="text-end">
                <h4 class="fw-bold m-0 text-dark">{{ formatPrice(finalTotal) }}</h4>
              </div>
            </div>

            <button class="btn btn-main-brown w-100 py-3 rounded-2 fw-bold fs-6 shadow-sm text-uppercase" @click="handlePlaceOrder">
              ĐẶT HÀNG
            </button>
            <div class="text-center mt-3">
              <span class="small text-muted" style="cursor:pointer; text-decoration: underline;" @click="router.push('/gio-hang')">Quay lại giỏ hàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showQRModal" class="modal-overlay d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100" style="background: rgba(0,0,0,0.6); z-index: 1050;">
      <div class="modal-content bg-white p-4 rounded-4 shadow-lg text-center position-relative" style="max-width: 400px; width: 90%;">
        <button class="btn-close position-absolute top-0 end-0 m-3" @click="cancelPayment"></button>
        
        <div class="d-flex align-items-center justify-content-center gap-2 mb-3 text-primary fw-bold fs-5">
          <i class="bi bi-qr-code-scan"></i>
          CHUYỂN KHOẢN NGÂN HÀNG
        </div>
        
        <div class="qr-container border rounded-3 p-3 mb-3 bg-light">
          <img :src="qrCodeUrl" alt="QR Thanh Toán" class="img-fluid rounded" style="max-height: 250px;">
        </div>

        <div class="mb-3">
          <h3 class="text-danger fw-bold mb-1">{{ formatPrice(finalTotal) }}</h3>
          <p class="text-muted small mb-0">Nội dung CK: <span class="fw-bold text-dark">{{ transferContent }}</span></p>
        </div>

        <div class="d-flex gap-2 mt-4">
          <button class="btn btn-outline-secondary w-50 rounded-pill" @click="cancelPayment">Hủy bỏ</button>
          <button class="btn btn-success w-50 rounded-pill fw-bold" @click="submitFinalOrder">
            Tôi đã thanh toán
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { cartState, cartCount, removeFromCart } from '../../store/cartStore.js' 

const router = useRouter()
const currentUsername = ref(localStorage.getItem('username') || 'Guest')

// ===== TOAST NOTIFICATION =====
const toast = ref({ show: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const handleLogout = () => {
  localStorage.removeItem('userRole')
  localStorage.removeItem('username') 
  showToast('Đăng xuất thành công!', 'success')
  setTimeout(() => { router.push('/dang-nhap') }, 500)
}

// ===== DỮ LIỆU TỪ GIỎ HÀNG =====
const checkoutItems = computed(() => {
  return cartState.items.filter(item => item.selected)
})

// ===== QUẢN LÝ ĐỊA CHỈ & FORM =====
const savedAddresses = ref([])
const selectedAddressId = ref(null)

const form = ref({
  hoTen: '', soDienThoai: '', tinhThanh: '', quanHuyen: '', phuongXa: '', diaChiChiTiet: ''
})

const fullAddressString = computed(() => {
  const parts = [form.value.diaChiChiTiet, form.value.phuongXa, form.value.quanHuyen, form.value.tinhThanh].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '';
})

const fetchAddresses = async () => {
  try {
    const username = localStorage.getItem('username'); 
    if(username && username !== 'Guest') {
      const res = await axios.get(`http://localhost:8080/api/dia-chi/khach-hang/${username}`);
      if(res.data && res.data.length > 0) {
        savedAddresses.value = res.data;
        const defaultAddr = res.data.find(a => a.laMacDinh === true || a.macDinh === true || a.trangThai === 1) || res.data[0];
        selectSavedAddress(defaultAddr);
      } else {
        selectedAddressId.value = 'NEW';
      }
    } else {
      selectedAddressId.value = 'NEW';
    }
  } catch (error) {
    savedAddresses.value = [
      { 
        id: 1, hoTen: 'Nguyễn Thu Thảo', soDienThoai: '0912345671', tinhThanh: 'Thành phố Hà Nội', 
        quanHuyen: 'Quận Cầu Giấy', phuongXa: 'Phường Dịch Vọng', diaChiChiTiet: 'Số 5 Ngõ 12', laMacDinh: true 
      },
      { 
        id: 2, hoTen: 'Nguyễn Thu Thảo', soDienThoai: '0912345671', tinhThanh: 'Tỉnh Hà Giang', 
        quanHuyen: 'Huyện Vị Xuyên', phuongXa: 'Xã Minh Tân', diaChiChiTiet: '123 abc', laMacDinh: false 
      }
    ];
    selectSavedAddress(savedAddresses.value[0]);
  }
}

const selectSavedAddress = (addr) => {
  selectedAddressId.value = addr.id;
  form.value = {
    hoTen: addr.hoTen, soDienThoai: addr.soDienThoai, tinhThanh: addr.tinhThanh,
    quanHuyen: addr.quanHuyen, phuongXa: addr.phuongXa, diaChiChiTiet: addr.diaChiChiTiet
  };
  calculateShippingFee();
}

const resetAddressForm = () => {
  selectedAddressId.value = 'NEW';
  form.value = { hoTen: '', soDienThoai: '', tinhThanh: '', quanHuyen: '', phuongXa: '', diaChiChiTiet: '' }
  calculateShippingFee();
}

// ===== QUẢN LÝ VOUCHER TỪ SQL CÔNG KHAI =====
const showVoucherList = ref(false)
const dbVouchers = ref([])
const voucherCodeInput = ref('')
const appliedVoucher = ref(null)

const fetchVouchers = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/phieu-giam-gia'); 
    dbVouchers.value = res.data.filter(v => 
      (v.loaiPhieu === 'Công khai' || v.loaiPhieu === 0 || v.loaiPhieu === 1 || v.ma_voucher || v.maVoucher) && 
      (v.trangThai === 'Đang hoạt động' || v.trangThai === 1 || v.trangThai === 0)
    );
  } catch (error) {
    dbVouchers.value = [
      { id: 1, tenPgg: 'PGGTT01', maVoucher: 'PGGTT01', phanTramGiam: 30, giamToiDa: 100000, dieuKienToiThieu: 500000, loaiPhieu: 'Công khai', trangThai: 'Đang hoạt động' },
      { id: 2, tenPgg: 'FREESHIP', maVoucher: 'FREESHIP', phanTramGiam: 0, giamToiDa: 30000, dieuKienToiThieu: 0, loaiPhieu: 'Công khai', trangThai: 'Đang hoạt động' },
      { id: 3, tenPgg: 'NEW2026', maVoucher: 'NEW2026', phanTramGiam: 10, giamToiDa: 200000, dieuKienToiThieu: 1000000, loaiPhieu: 'Công khai', trangThai: 'Đang hoạt động' },
      { id: 4, tenPgg: 'VC-074S65', maVoucher: 'VC-074S65', phanTramGiam: 0, giamToiDa: 50000, dieuKienToiThieu: 500000, loaiPhieu: 'Công khai', trangThai: 'Đang hoạt động' }
    ];
  }
}

const previewDiscount = (vc) => {
  const dk = vc.dieuKienToiThieu || 0;
  if (subTotal.value < dk) return 0;
  
  if (vc.phanTramGiam && vc.phanTramGiam > 0) {
    let rawDiscount = (subTotal.value * vc.phanTramGiam) / 100;
    return rawDiscount > vc.giamToiDa ? vc.giamToiDa : rawDiscount;
  }
  return vc.giamToiDa || 0; 
}

const selectVoucher = (vc) => {
  const dk = vc.dieuKienToiThieu || 0;
  if (subTotal.value < dk) {
    showToast(`Đơn hàng chưa đạt tối thiểu ${formatPrice(dk)} để dùng mã này!`, 'error');
    return;
  }
  appliedVoucher.value = vc;
  voucherCodeInput.value = vc.maVoucher || vc.tenPgg;
  showVoucherList.value = false;
}

const applyVoucherInput = () => {
  const vc = dbVouchers.value.find(v => 
    (v.maVoucher || v.tenPgg || '').toUpperCase() === voucherCodeInput.value.toUpperCase()
  );
  if (vc) {
    selectVoucher(vc);
  } else {
    showToast('Mã giảm giá không tồn tại hoặc đã hết hạn!', 'error');
    appliedVoucher.value = null;
  }
}

const removeVoucher = () => {
  appliedVoucher.value = null;
  voucherCodeInput.value = '';
}

const paymentMethod = ref('') 
const shippingFee = ref(30000) 

const calculateShippingFee = () => {
  const tinh = form.value.tinhThanh.toLowerCase();
  if (!tinh) {
    shippingFee.value = 0; 
  } else if (tinh.includes('hà nội')) {
    shippingFee.value = 16500; 
  } else {
    shippingFee.value = 30000; 
  }
}

const subTotal = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const discountAmount = computed(() => {
  if (!appliedVoucher.value) return 0;
  return previewDiscount(appliedVoucher.value);
})

const finalTotal = computed(() => {
  const total = subTotal.value + shippingFee.value - discountAmount.value;
  return total > 0 ? total : 0;
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

// ===== CÁC BIẾN QUẢN LÝ MODAL QR & POLLING =====
const showQRModal = ref(false)
const qrCodeUrl = ref('')
const transferContent = ref('')

// ===== HÀM KIỂM TRA TỒN KHO MỚI NHẤT (ĐÃ FIX) =====
const validateStockBeforeOrder = async () => {
  if (!checkoutItems.value || checkoutItems.value.length === 0) {
    showToast('Không có sản phẩm nào để thanh toán!', 'error');
    return false;
  }

  for (let item of checkoutItems.value) {
    try {
      const spctId = item.idSpct || item.idSanPhamChiTiet || item.id;
      
      // Gọi API lấy thông tin sản phẩm chi tiết để lấy tồn kho mới nhất
      const res = await axios.get(`http://localhost:8080/api/san-pham-chi-tiet/${spctId}`);
      
      // Backend có thể trả về nhiều field khác nhau, mình kiểm tra nhiều khả năng
      const currentStock = res.data?.soLuong || res.data?.tonKho || res.data?.soLuongTon || res.data?.stock || 0;

      if (item.quantity > currentStock) {
        showToast(
          `Sản phẩm "${item.name}" (Size: ${item.size || ''}) chỉ còn ${currentStock} sản phẩm trong kho!`, 
          'error'
        );
        return false;
      }
    } catch (error) {
      console.error('Lỗi kiểm tra tồn kho:', error);
      // Nếu không lấy được thông tin, vẫn cho phép đặt (để backend xử lý)
    }
  }
  
  return true;
}

const buildOrderPayload = () => {
  return {
    username: localStorage.getItem('username'), 
    hoTenNguoiNhan: form.value.hoTen,
    soDienThoai: form.value.soDienThoai,
    diaChiGiaoHang: fullAddressString.value,
    phuongThucThanhToan: paymentMethod.value,
    tongTienHang: subTotal.value,
    phiVanChuyen: shippingFee.value,
    tienGiamGia: discountAmount.value,
    tongThanhToan: finalTotal.value,
    maVoucherApDung: appliedVoucher.value ? (appliedVoucher.value.maVoucher || appliedVoucher.value.tenPgg) : null,
    
    chiTietDonHang: checkoutItems.value.map(item => ({
      sanPhamChiTietId: item.idSpct || item.idSanPhamChiTiet || item.id,
      maSku: item.maSku || item.sku || item.ma_sku || '',
      soLuong: item.quantity,
      donGia: item.price
    }))
  }
}

// ===== XỬ LÝ ĐẶT HÀNG (ĐÃ BỔ SUNG KIỂM TRA TỒN KHO) =====
const handlePlaceOrder = async () => {
  if (!form.value.hoTen || !form.value.soDienThoai || !form.value.tinhThanh || !form.value.diaChiChiTiet) {
    showToast('Vui lòng điền đầy đủ các ô địa chỉ có dấu * đỏ!', 'error');
    return;
  }
  
  if (!paymentMethod.value) {
    showToast('Vui lòng chọn Phương thức thanh toán!', 'error');
    return;
  }

  // === KIỂM TRA TỒN KHO TRƯỚC KHI ĐẶT HÀNG ===
  const isStockValid = await validateStockBeforeOrder();
  if (!isStockValid) {
    return; // Dừng lại nếu có sản phẩm không đủ hàng
  }

  if (paymentMethod.value === 'TRANSFER') {
    transferContent.value = 'GD' + Date.now().toString().slice(-8);
    
    const bankId = 'MB'; 
    const accountNo = '00903082610'; 
    const accountName = 'TRINH XUAN BACH'; 
    const amount = finalTotal.value;
    
    qrCodeUrl.value = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${transferContent.value}&accountName=${accountName}`;
    
    showQRModal.value = true;
  } else {
    submitFinalOrder();
  }
}

const submitFinalOrder = async () => {
  const orderPayload = buildOrderPayload();
  if(paymentMethod.value === 'TRANSFER') {
    orderPayload.maGiaoDich = transferContent.value;
  }

  try {
    const res = await axios.post('http://localhost:8080/api/hoadon/tao-don-truc-tuyen', orderPayload);
    
    if(res.data && res.data.success) {
      showToast('🎉 ĐẶT HÀNG THÀNH CÔNG! Mã: ' + res.data.ma_hoa_don, 'success');
      showQRModal.value = false;

      // Xóa giỏ hàng
      for (let i = cartState.items.length - 1; i >= 0; i--) {
        if (cartState.items[i].selected) {
          removeFromCart(i);
        }
      }

      setTimeout(() => {
        router.push('/don-hang');
      }, 1500);
    } else {
      showToast(res.data.message || 'Lỗi đặt hàng', 'error');
    }

  } catch (error) {
    const msg = error.response?.data?.message || 'Lỗi kết nối Máy chủ / Lỗi SQL!';
    showToast(msg, 'error');
  }
}

const cancelPayment = () => {
  showQRModal.value = false;
}

onMounted(() => {
  if (checkoutItems.value.length > 0) {
    fetchAddresses();
    fetchVouchers();
    calculateShippingFee(); 
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

/* Các css trang thanh toán */
.btn-main-brown {
  background-color: #3d211a;
  border: 1px solid #3d211a;
  color: white;
  transition: all 0.3s;
}
.btn-main-brown:hover {
  background-color: #523b2e;
  border-color: #523b2e;
  color: white;
}

.border-brown {
  border-color: #3d211a !important;
}
.bg-light-brown {
  background-color: #faf8f5 !important;
}

.custom-radio {
  width: 1.1rem;
  height: 1.1rem;
}
.custom-radio:checked {
  background-color: #3d211a;
  border-color: #3d211a;
}

.address-card {
  transition: all 0.2s ease;
  cursor: pointer;
}
.address-card:hover {
  border-color: #cbb799 !important;
}

.payment-method {
  cursor: pointer;
  transition: all 0.2s ease;
}
.payment-method:hover {
  border-color: #cbb799 !important;
}

.max-height-cart {
  max-height: 280px;
}

.voucher-dropdown {
  max-height: 250px;
  overflow-y: auto;
}
.voucher-item {
  border: 1px solid transparent;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: 0.2s;
}
.voucher-item:hover {
  border-color: #cbb799;
  background-color: #faf8f5;
}

.form-control:focus {
  border-color: #cbb799;
  box-shadow: 0 0 0 0.2rem rgba(203, 183, 153, 0.25);
}

/* CSS cho QR Modal */
.modal-overlay {
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
}
.qr-container img {
  border: 1px solid #e0e0e0;
}

/* CSS cho Toast chuẩn màu xanh đỏ */
.custom-toast {
  animation: slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>