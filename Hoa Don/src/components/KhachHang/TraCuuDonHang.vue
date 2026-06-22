<template>
  <div class="client-home" style="background-color: #f5f5f5 !important; min-height: 100vh; padding-bottom: 50px;">
    
    <div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin: 20px;">
      <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3 bg-white" role="alert">
        <div class="d-flex align-items-center gap-2">
          <i :class="toast.type === 'error' ? 'bi bi-x-circle-fill text-danger' : 'bi bi-check-circle-fill text-success'" class="fs-5"></i>
          <div class="toast-body">
            <strong>{{ toast.title }}</strong>
            <div>{{ toast.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg sticky-top py-3 bg-white shadow-sm" style="z-index: 1050;">
      <div class="container-fluid px-4 px-lg-5">
        <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
          <img src="/Logo.png" alt="Logo" style="height: 50px; object-fit: contain" />
        </router-link>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-5 text-center align-items-center justify-content-center">
            <li class="nav-item"><router-link to="/" class="nav-link fw-medium nav-text" exact-active-class="active-link">TRANG CHỦ</router-link></li>
            <li class="nav-item"><router-link to="/gioi-thieu" class="nav-link fw-medium nav-text" exact-active-class="active-link">GIỚI THIỆU</router-link></li>
            <li class="nav-item"><router-link to="/cua-hang" class="nav-link fw-medium nav-text" active-class="active-link">SẢN PHẨM</router-link></li>
            <li class="nav-item"><router-link to="/don-hang" class="nav-link fw-medium nav-text" active-class="active-link">ĐƠN HÀNG</router-link></li>
            <li class="nav-item"><router-link to="/tra-cuu" class="nav-link fw-medium nav-text" active-class="active-link">TRA CỨU</router-link></li>
            <li class="nav-item"><router-link to="/lien-he" class="nav-link fw-medium nav-text" exact-active-class="active-link">LIÊN HỆ</router-link></li>
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
      <div class="row justify-content-center">
        <div class="col-lg-11 col-xl-10">
          
          <div class="text-center mb-4">
            <h2 class="fw-bold" style="color: #3d211a;">Tra Cứu Đơn Hàng</h2>
            <p class="text-muted">Kiểm tra trạng thái đơn hàng của bạn nhanh chóng (Real-time)</p>
          </div>

          <div class="card border-0 shadow-sm p-4 rounded-4 mb-4 bg-white mx-auto" style="max-width: 750px;">
            <form @submit.prevent="() => handleSearch(false)" class="row g-3">
              <div class="col-md-5">
                <label class="form-label small fw-bold text-muted">Mã đơn hàng <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none border-secondary-subtle px-3 py-2" v-model="searchForm.maHD" placeholder="VD: HD088" required>
              </div>
              <div class="col-md-5">
                <label class="form-label small fw-bold text-muted">Số điện thoại đặt hàng <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none border-secondary-subtle px-3 py-2" v-model="searchForm.sdt" placeholder="Nhập SĐT..." required>
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button type="submit" class="btn btn-main-brown w-100 py-2 fw-bold" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span v-else><i class="bi bi-search"></i> Tìm</span>
                </button>
              </div>
            </form>
          </div>

          <div v-if="orderData" class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden animate__animated animate__fadeInUp">
            
            <div class="p-4 border-bottom d-flex justify-content-between align-items-center" style="background-color: #fdfbf9;">
              <div>
                <span class="text-muted small">Mã đơn hàng:</span>
                <h5 class="fw-bold m-0" style="color: #a82e3e;">#{{ orderData.invoice.ma_hoa_don }}</h5>
              </div>
              <div class="text-end">
                <span class="badge px-3 py-2 rounded-pill" :class="getStatusBadgeClass(orderData.invoice.trang_thai)">
                  {{ getStatusName(orderData.invoice.trang_thai) }}
                </span>
              </div>
            </div>

            <div class="p-4">
              <div class="mb-5 mt-4 px-md-4" v-if="[1,2,3,4,5,6].includes(orderData.invoice.trang_thai)">
                <div class="position-relative d-flex justify-content-between text-center" style="z-index: 1;">
                  <div class="position-absolute top-0 start-0 w-100" style="height: 4px; background-color: #e9ecef; z-index: -1; margin-top: 23px;"></div>
                  <div class="position-absolute top-0 start-0" :style="{ width: getProgressWidth(orderData.invoice.trang_thai), height: '4px', backgroundColor: '#198754', zIndex: -1, transition: 'width 0.5s ease', marginTop: '23px' }"></div>
                  
                  <div class="step-item">
                    <div class="step-circle" :class="orderData.invoice.trang_thai >= 1 ? 'active' : ''"><i class="bi bi-hourglass-split"></i></div>
                    <div class="step-text mt-2 small fw-bold" :class="orderData.invoice.trang_thai >= 1 ? 'text-success' : 'text-muted'">Chờ xác nhận</div>
                    <div v-if="orderData.invoice.trang_thai >= 1" class="text-success mt-1" style="font-size: 0.75rem; line-height: 1.2" v-html="getHistoryDate(1)"></div>
                  </div>
                  <div class="step-item">
                    <div class="step-circle" :class="orderData.invoice.trang_thai >= 2 ? 'active' : ''"><i class="bi bi-check2"></i></div>
                    <div class="step-text mt-2 small fw-bold" :class="orderData.invoice.trang_thai >= 2 ? 'text-success' : 'text-muted'">Đã xác nhận</div>
                    <div v-if="orderData.invoice.trang_thai >= 2" class="text-success mt-1" style="font-size: 0.75rem; line-height: 1.2" v-html="getHistoryDate(2)"></div>
                  </div>
                  <div class="step-item">
                    <div class="step-circle" :class="orderData.invoice.trang_thai >= 3 ? 'active' : ''"><i class="bi bi-box-seam"></i></div>
                    <div class="step-text mt-2 small fw-bold" :class="orderData.invoice.trang_thai >= 3 ? 'text-success' : 'text-muted'">Chờ giao hàng</div>
                    <div v-if="orderData.invoice.trang_thai >= 3" class="text-success mt-1" style="font-size: 0.75rem; line-height: 1.2" v-html="getHistoryDate(3)"></div>
                  </div>
                  <div class="step-item">
                    <div class="step-circle" :class="orderData.invoice.trang_thai >= 4 ? 'active' : ''"><i class="bi bi-truck"></i></div>
                    <div class="step-text mt-2 small fw-bold" :class="orderData.invoice.trang_thai >= 4 ? 'text-success' : 'text-muted'">Đang giao hàng</div>
                    <div v-if="orderData.invoice.trang_thai >= 4" class="text-success mt-1" style="font-size: 0.75rem; line-height: 1.2" v-html="getHistoryDate(4)"></div>
                  </div>
                  <div class="step-item">
                    <div class="step-circle" :class="orderData.invoice.trang_thai >= 5 ? 'active' : ''"><i class="bi bi-archive"></i></div>
                    <div class="step-text mt-2 small fw-bold" :class="orderData.invoice.trang_thai >= 5 ? 'text-success' : 'text-muted'">Đã giao hàng</div>
                    <div v-if="orderData.invoice.trang_thai >= 5" class="text-success mt-1" style="font-size: 0.75rem; line-height: 1.2" v-html="getHistoryDate(5)"></div>
                  </div>
                  <div class="step-item">
                    <div class="step-circle" :class="orderData.invoice.trang_thai === 6 ? 'active' : ''"><i class="bi bi-flag"></i></div>
                    <div class="step-text mt-2 small fw-bold" :class="orderData.invoice.trang_thai === 6 ? 'text-success' : 'text-muted'">Hoàn thành</div>
                    <div v-if="orderData.invoice.trang_thai === 6" class="text-success mt-1" style="font-size: 0.75rem; line-height: 1.2" v-html="getHistoryDate(6)"></div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="[0, 7].includes(orderData.invoice.trang_thai)" class="alert alert-danger text-center fw-bold mb-4">
                <i class="bi bi-x-circle me-2"></i> Đơn hàng đã bị hủy
                <div v-if="orderData.invoice.ly_do_huy" class="small mt-1 text-muted fw-normal">Lý do: {{ orderData.invoice.ly_do_huy }}</div>
                <div class="small mt-1 text-muted fw-normal" v-html="getHistoryDate(orderData.invoice.trang_thai)"></div>
              </div>

              <div class="row g-4 mb-4">
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3 h-100 border">
                    <h6 class="fw-bold mb-3 text-dark"><i class="bi bi-geo-alt me-1"></i> Thông tin nhận hàng</h6>
                    <div class="small text-muted mb-2"><span class="fw-medium text-dark">Khách hàng:</span> {{ orderData.invoice.ten_nguoi_nhan }}</div>
                    <div class="small text-muted mb-2"><span class="fw-medium text-dark">SĐT:</span> {{ orderData.invoice.sdt_nguoi_nhan }}</div>
                    <div class="small text-muted mb-1"><span class="fw-medium text-dark">Địa chỉ:</span> {{ orderData.invoice.dia_chi_giao_hang || 'Tại quầy' }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3 h-100 border">
                    <h6 class="fw-bold mb-3 text-dark"><i class="bi bi-credit-card me-1"></i> Thanh toán</h6>
                    <div class="small text-muted mb-2"><span class="fw-medium text-dark">Hình thức:</span> {{ orderData.invoice.ten_pttt }}</div>
                    <div class="small text-muted mb-1">
                      <span class="fw-medium text-dark">Tình trạng:</span> 
                      <span :class="orderData.invoice.trang_thai_thanh_toan === 1 ? 'text-success fw-bold' : 'text-warning fw-bold'">
                        {{ orderData.invoice.trang_thai_thanh_toan === 1 ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mb-3 border-bottom pb-2 text-dark">Danh sách sản phẩm ({{ orderData.details.length }})</h6>
              <div class="d-flex flex-column gap-3 mb-4">
                <div v-for="(item, index) in orderData.details" :key="index" class="d-flex gap-3 align-items-center border-bottom pb-3">
                  <div class="position-relative" style="min-width: 60px;">
                    <img :src="getImage(item.hinh_anh)" class="rounded border object-fit-cover bg-light" style="width: 60px; height: 75px;">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary border border-white" style="font-size: 0.65rem;">
                      {{ item.so_luong }}
                    </span>
                  </div>
                  <div class="flex-grow-1 ps-2">
                    <div class="fw-bold text-dark mb-1" style="font-size: 0.9rem; line-height: 1.3;">{{ item.ten_san_pham }}</div>
                    <div class="text-muted small">Phân loại: {{ item.ten_mau || 'N/A' }} / {{ item.ten_kich_co || 'N/A' }}</div>
                  </div>
                  <div class="text-end">
                    <div class="text-muted small text-decoration-line-through mb-1" v-if="item.don_gia_goc > item.don_gia">{{ formatPrice(item.don_gia_goc) }}</div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">{{ formatPrice(item.tong_tien) }}</div>
                  </div>
                </div>
              </div>

              <div class="bg-light p-4 rounded-3 border ms-auto" style="max-width: 400px;">
                <div class="d-flex justify-content-between mb-2 small text-muted">
                  <span>Tổng tiền hàng:</span>
                  <span class="text-dark fw-medium">{{ formatPrice(tinhTongTienHang(orderData.details)) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 small text-muted">
                  <span>Phí vận chuyển:</span>
                  <span class="text-dark fw-medium">+ {{ formatPrice(orderData.invoice.phi_ship || orderData.invoice.tien_ship || 0) }}</span>
                </div>
                
                <div class="d-flex justify-content-between mb-3 small" style="color: #27ae60;">
                  <span>Giảm giá (Voucher):</span>
                  <span class="fw-bold">- {{ formatPrice(getExactDiscount()) }}</span>
                </div>
                
                <hr class="opacity-25 my-2 border-secondary">
                <div class="d-flex justify-content-between align-items-end mt-3">
                  <span class="fw-bold text-dark fs-6">Thành tiền:</span>
                  <h4 class="fw-bold m-0" style="color: #a82e3e;">{{ formatPrice(orderData.invoice.tong_tien_thanh_toan) }}</h4>
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
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { cartCount } from '../../store/cartStore.js' 

const router = useRouter()

const currentUsername = ref(localStorage.getItem('username') || sessionStorage.getItem('username') || 'Guest')
const isLoggedIn = computed(() => currentUsername.value && currentUsername.value !== 'Guest')

const toast = ref({ show: false, message: '', type: 'success', title: '' });
const showToast = (title, message, type = 'success') => {
  toast.value = { show: true, title, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const handleLogout = () => { 
  localStorage.removeItem('username')
  localStorage.removeItem('userRole')
  localStorage.removeItem('token')
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('token')
  currentUsername.value = 'Guest'
  cartCount.value = 0
  showToast('Đăng xuất', 'Đăng xuất thành công!', 'success')
  setTimeout(() => { window.location.href = '/' }, 500)
}

// FORMAT TIỀN & ẢNH
const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0).replace('₫', 'đ')
const getImage = (link) => {
  if (!link) return 'https://via.placeholder.com/60x75?text=No+Image';
  if (link.startsWith('http') || link.startsWith('data:')) return link;
  return `http://localhost:8080/images/${link}`;
}

// ===============================================
// TÌM KIẾM ĐƠN HÀNG (KÈM POLLING REAL-TIME)
// ===============================================
const searchForm = ref({ maHD: '', sdt: '' })
const isLoading = ref(false)
const orderData = ref(null)
let pollingInterval = null

const handleSearch = async (isSilent = false) => {
  if (!searchForm.value.maHD || !searchForm.value.sdt) {
    if(!isSilent) showToast('Lỗi', 'Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại', 'error')
    return
  }

  if(!isSilent) isLoading.value = true

  try {
    const maHDTrim = searchForm.value.maHD.trim().toUpperCase()
    const sdtTrim = searchForm.value.sdt.trim()

    const res = await axios.get(`http://localhost:8080/api/hoadon/${maHDTrim}`);
    
    if (res.data && res.data.invoice) {
      // BẢO MẬT: Phải khớp đúng số điện thoại mới cho xem
      const dbPhone = res.data.invoice.sdt_nguoi_nhan || res.data.invoice.sdt || '';
      
      if (dbPhone.trim() !== sdtTrim) {
        if(!isSilent) showToast('Truy cập từ chối', 'Số điện thoại không khớp với thông tin đơn hàng này!', 'error')
        if (pollingInterval) clearInterval(pollingInterval);
      } else {
        orderData.value = res.data;
        if(!isSilent) showToast('Thành công', 'Đã tìm thấy đơn hàng', 'success')
        
        // BẬT RADAR QUÉT THỜI GIAN THỰC SAU KHI TÌM THẤY
        if (!pollingInterval) {
           pollingInterval = setInterval(() => {
              if(searchForm.value.maHD && searchForm.value.sdt) {
                 handleSearch(true); // isSilent = true để không chớp giật màn hình
              }
           }, 2000); // 2 giây cập nhật 1 lần y hệt Admin
        }
      }
    } else {
      if(!isSilent) showToast('Lỗi', 'Không tìm thấy mã đơn hàng này!', 'error')
      if (pollingInterval) clearInterval(pollingInterval);
    }
  } catch (error) {
    if(!isSilent) showToast('Lỗi', 'Không tìm thấy đơn hàng hoặc hệ thống đang bận!', 'error')
    if (pollingInterval) clearInterval(pollingInterval);
  } finally {
    if(!isSilent) isLoading.value = false
  }
}

// XÓA RADAR KHI KHÁCH CHUYỂN SANG TRANG KHÁC
onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
})

// ===============================================
// LOGIC HIỂN THỊ DỮ LIỆU
// ===============================================
const tinhTongTienHang = (details) => {
  return details.reduce((sum, item) => sum + (item.tong_tien || 0), 0);
}

// THUẬT TOÁN DỊCH NGƯỢC: Tính số tiền GIẢM GIÁ 100% chuẩn xác
// Vì giảm giá = (Tiền hàng + Phí ship) - Thành Tiền
const getExactDiscount = () => {
  if (!orderData.value) return 0;
  
  const detailsTotal = tinhTongTienHang(orderData.value.details);
  const ship = orderData.value.invoice.phi_ship || orderData.value.invoice.tien_ship || 0;
  const finalTotal = orderData.value.invoice.tong_tien_thanh_toan || 0;
  
  let calcDiscount = (detailsTotal + ship) - finalTotal;
  
  // Nếu vì lý do nào đó tính ra âm, ta lấy trường trong DB để backup
  if (calcDiscount < 0) calcDiscount = 0;
  
  const dbDiscount = orderData.value.invoice.tien_giam_gia || orderData.value.invoice.giam_gia || 0;
  
  return calcDiscount > 0 ? calcDiscount : dbDiscount;
}

const getStatusName = (status) => {
  switch(Number(status)) {
    case 1: return "Chờ xác nhận";
    case 2: return "Đã xác nhận";
    case 3: return "Chờ giao hàng";
    case 4: return "Đang giao hàng";
    case 5: return "Đã giao hàng";
    case 6: return "Hoàn thành";
    case 0: case 7: return "Đã hủy";
    case 8: return "Giao thất bại";
    default: return "Chưa rõ";
  }
}

const getStatusBadgeClass = (status) => {
  switch(Number(status)) {
    case 1: return "bg-warning text-dark";
    case 2: case 3: return "bg-info text-dark";
    case 4: case 5: return "bg-primary";
    case 6: return "bg-success";
    case 0: case 7: case 8: return "bg-danger";
    default: return "bg-secondary";
  }
}

// THANH TRẠNG THÁI (TIMELINE 6 BƯỚC)
const getProgressWidth = (status) => {
  const st = Number(status);
  if (st === 1) return '0%';
  if (st === 2) return '20%';
  if (st === 3) return '40%';
  if (st === 4) return '60%';
  if (st === 5) return '80%';
  if (st === 6) return '100%';
  return '0%';
}

// BÓC TÁCH THỜI GIAN THEO LỊCH SỬ THAO TÁC CỦA ADMIN
const getHistoryDate = (status) => {
  if (!orderData.value || !orderData.value.history) return '';
  
  // Tìm lịch sử đầu tiên (hoặc mới nhất) tương ứng với mã trạng thái
  // Mảng history được Backend trả về sắp xếp theo ngày DESC (mới nhất lên đầu)
  const log = orderData.value.history.find(h => h.trang_thai === status);
  if (!log || !log.ngay_tao) return '';
  
  const d = new Date(log.ngay_tao);
  if (isNaN(d.getTime())) return '';
  
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  
  // Format hiển thị: 03:05:59 \n 22/06/2026 (y hệt màn Admin)
  return `${hh}:${mm}:${ss}<br><span style="font-size: 0.7rem; color: #888;">${dd}/${mo}/${yyyy}</span>`;
}
</script>

<style scoped>
/* CSS Menu Active Link Thông Minh */
.nav-text { 
  color: #6f4d38 !important; 
  font-size: 1rem; 
  text-transform: uppercase; 
  transition: all 0.3s ease; 
  padding: 10px 0 !important; 
  position: relative; 
  display: inline-block; 
  border-bottom: 2px solid transparent; 
}
.nav-text:hover, .active-link { 
  color: #3d211a !important; 
  font-weight: 700 !important; 
  border-bottom: 2px solid #3d211a !important; 
}
.custom-dropdown { border-top: 3px solid #6f4d38 !important; }
.btn-main-brown { background-color: #3d211a; border: 1px solid #3d211a; color: white; transition: all 0.3s; }
.btn-main-brown:hover { background-color: #523b2e; border-color: #523b2e; color: white; }

/* Timeline 6 Bước CSS - Căn chỉnh chuẩn tỉ lệ */
.step-circle {
  width: 50px; height: 50px; border-radius: 50%; background-color: #e9ecef;
  display: flex; align-items: center; justify-content: center;
  color: #adb5bd; font-size: 1.4rem; transition: all 0.5s ease; margin: 0 auto;
}
.step-circle.active { 
  background-color: #198754; color: white; 
  box-shadow: 0 0 0 4px rgba(25, 135, 84, 0.2); 
}
.step-item { width: 100px; }

.custom-toast { animation: slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>