<template>
  <div class="dashboard-employee-container p-4">
    <div class="main-card-wrapper mx-auto mt-4" style="max-width: 600px;">
      
      <div class="welcome-header mb-4 d-flex align-items-center gap-2 border-bottom pb-2">
        <span class="text-muted"><i class="bi bi-person-fill"></i> Xin chào,</span>
        <strong class="text-dark fw-bold fs-5">{{ currentEmployeeName }}</strong>
      </div>

      <div v-if="checking" class="card p-5 text-center shadow-sm border-0 bg-white">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <div class="text-muted small">Đang kiểm tra lịch trực...</div>
      </div>

      <div v-else class="animate-fade-in d-flex flex-column gap-4">
        
        <div v-if="!hasShift || shiftsList.length === 0" class="card p-5 text-center shadow-sm border rounded-3 bg-white">
          <div class="text-muted mb-3" style="font-size: 50px;"><i class="bi bi-calendar-x-fill text-secondary"></i></div>
          <h5 class="fw-bold text-dark mb-2">Không có lịch làm việc</h5>
          <p class="text-muted small mb-0">Hôm nay bạn không có lịch được phân công.</p>
        </div>

        <div v-else v-for="(shift, index) in shiftsList" :key="shift.id" class="w-100">
          
          <div v-if="shift.trangThai === 1" class="w-100">
            
            <div v-if="isOverdue(shift.caLamViec?.gioKetThuc || shift.caLamViec?.gio_ket_thuc)" class="card p-4 shadow-sm border border-danger rounded-3 bg-white">
              <h5 class="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-exclamation-triangle-fill"></i> Ca trực: {{ shift.caLamViec?.tenCa || 'Chưa rõ ca' }} (Quá giờ)
              </h5>
              <div class="mb-4 text-muted small">
                Thời gian ca làm việc lý thuyết: <b>{{ formatTime(shift.caLamViec?.gioBatDau) }}</b> đến <b>{{ formatTime(shift.caLamViec?.gioKetThuc) }}</b>
                <br><span class="text-danger fw-semibold mt-2 d-inline-block">⚠️ Ca làm việc này đã kết thúc, bạn không thể kích hoạt vào ca được nữa!</span>
              </div>
              <button type="button" class="btn btn-secondary fw-bold w-100 py-2.5 rounded-2 shadow-none" style="cursor: not-allowed;" disabled>
                CA TRỰC ĐÃ QUÁ GIỜ
              </button>
            </div>

            <div v-else class="card p-4 shadow-sm border border-brown rounded-3 bg-white">
              <h5 class="fw-bold text-brown mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-clock-fill"></i> Ca trực: {{ shift.caLamViec?.tenCa || 'Chưa rõ ca' }}
              </h5>
              <div class="mb-4 text-secondary small">
                Thời gian ca làm việc lý thuyết: <b>{{ formatTime(shift.caLamViec?.gioBatDau) }}</b> đến <b>{{ formatTime(shift.caLamViec?.gioKetThuc) }}</b>
              </div>
              <button type="button" class="btn btn-main-brown text-white fw-bold w-100 py-2.5 rounded-2 shadow-none" @click="handleCheckIn(shift)">
                VÀO CA LÀM VIỆC
              </button>
            </div>

          </div>

          <div v-else-if="shift.trangThai === 2" class="card p-4 shadow-sm border-0 rounded-3 bg-white text-center text-md-start">
            <h5 class="fw-bold text-success mb-4 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <span class="spinner-grow spinner-grow-sm text-success" role="status"></span> Ca làm việc đang mở
            </h5>

            <div class="time-details-box mb-4 px-3 py-2 bg-light rounded-2" style="font-size: 14px; line-height: 2;">
              <div class="text-dark">
                Giờ vào ca: <strong class="text-primary ms-1">{{ formatTime(shift.gioVaoThucTe || shift.gio_vao_thuc_te) }}</strong>
              </div>
              <div class="text-dark">
                Dự kiến kết thúc: <strong class="ms-1">{{ formatTime(shift.caLamViec?.gioKetThuc) || '--:--' }}</strong>
              </div>
            </div>

            <div class="d-flex flex-column flex-md-row gap-3">
              <button type="button" class="btn btn-primary fw-bold px-4 py-2.5 w-100 shadow-none text-white" style="font-size: 13px; letter-spacing: 0.5px;" @click="goToSalesScreen">
                ĐI ĐẾN MÀN HÌNH BÁN HÀNG
              </button>
              <button type="button" class="btn btn-danger fw-bold px-4 py-2.5 w-100 shadow-none text-white" style="font-size: 13px; letter-spacing: 0.5px;" @click="handleCheckOut(shift)">
                KẾT THÚC CA
              </button>
            </div>
          </div>

          <div v-else-if="shift.trangThai === 3" class="card p-4 shadow-sm border border-secondary rounded-3 bg-white">
            <h5 class="fw-bold text-secondary mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-lock-fill"></i> Ca trực: {{ shift.caLamViec?.tenCa || 'Chưa rõ ca' }} (Đã chốt)
            </h5>
            <div class="text-muted small">
              Giờ vào thực tế: {{ formatTime(shift.gioVaoThucTe || shift.gio_vao_thuc_te) }} | Giờ kết thúc thực tế: {{ formatTime(shift.gioRaThucTe || shift.gio_ra_thuc_te) }}
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const checking = ref(false)
const hasShift = ref(false)
const shiftsList = ref([])

// Đọc tên tài khoản để map với cột ten_tai_khoan trong SQL Server
const currentUsername = ref(localStorage.getItem('username') || '')
const currentEmployeeName = ref(localStorage.getItem('username') || 'Nhân viên')

const formatTime = (time) => {
  if (!time) return ''
  if (Array.isArray(time)) {
    return `${String(time[0]).padStart(2, '0')}:${String(time[1]).padStart(2, '0')}`
  }
  return typeof time === 'string' ? time.substring(0, 5) : ''
}

// 🌟 THM HÀM MỚI: Tự động so sánh kiểm tra ca trực quá giờ thực tế hay chưa
const isOverdue = (gioKetThuc) => {
  if (!gioKetThuc) return false
  
  // 1. Chuẩn hóa dữ liệu giờ kết thúc về chuỗi định dạng "HH:mm"
  let endStr = ''
  if (Array.isArray(gioKetThuc)) {
    endStr = `${String(gioKetThuc[0]).padStart(2, '0')}:${String(gioKetThuc[1]).padStart(2, '0')}`
  } else if (typeof gioKetThuc === 'string') {
    endStr = gioKetThuc.substring(0, 5)
  } else {
    return false
  }
  
  // 2. Lấy giờ hiện tại của máy tính nhân viên dạng "HH:mm"
  const now = new Date()
  const currentStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  
  // 3. So sánh chuỗi trực tiếp (Ví dụ: "13:00" > "12:00" => true -> Quá giờ)
  return currentStr > endStr
}

// Gọi API lấy toàn bộ danh sách ca làm việc hôm nay
const fetchShiftStatusToday = async () => {
  if (!currentUsername.value) {
    hasShift.value = false
    return
  }
  checking.value = true
  try {
    const res = await axios.get(`http://localhost:8080/api/lich-lam-viec/status-by-username/${currentUsername.value}`)
    if (Array.isArray(res.data)) {
      shiftsList.value = res.data
      hasShift.value = true
    } else {
      shiftsList.value = []
      hasShift.value = false
    }
  } catch (error) {
    console.error('Lỗi kết nối API lịch trực:', error)
    hasShift.value = false
  } finally {
    checking.value = false
  }
}

// Bấm nút Vào Ca
const handleCheckIn = async (shift) => {
  const gioHienTaiClient = new Date().toTimeString().substring(0, 5)
  try {
    const res = await axios.post(`http://localhost:8080/api/lich-lam-viec/vao-ca/${shift.id}`, {
      gioVaoThucTe: gioHienTaiClient
    })
    if (res.data) {
      await fetchShiftStatusToday() // Tải lại danh sách ca để cập nhật trạng thái giao diện tức thì
    }
  } catch (error) {
    console.error(error)
  }
}

// Bấm nút Kết thúc ca
const handleCheckOut = async (shift) => {
  const gioRaHienTaiClient = new Date().toTimeString().substring(0, 5)
  if (!confirm(`Bạn có chắc chắn muốn kết thúc ca [${shift.caLamViec?.tenCa || ''}] không?`)) return
  try {
    await axios.post(`http://localhost:8080/api/lich-lam-viec/ket-thuc-ca/${shift.id}`, {
      gioRaThucTe: gioRaHienTaiClient
    })
    await fetchShiftStatusToday()
  } catch (error) {
    console.error(error)
  }
}

// Điều hướng sang màn hình bán hàng tại quầy
const goToSalesScreen = () => {
  router.push('/ban-hang')
}

onMounted(() => {
  fetchShiftStatusToday()
})
</script>

<style scoped>
.dashboard-employee-container {
  min-height: 85vh;
  background-color: transparent;
}
.main-card-wrapper {
  width: 100%;
}
.card {
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}
.bg-light {
  background-color: #f8fafc !important;
}
.btn-primary {
  background-color: #0d6efd !important;
  border-color: #0d6efd !important;
}
.btn-danger {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Brown theme used across other Vue pages */
.text-brown { color: #8c5a35 !important; }
.border-brown { border-color: #3d211a !important; }
.btn-main-brown {
  background-color: #3d211a !important;
  border-color: #3d211a !important;
}
.btn-main-brown:hover {
  background-color: #523b2e !important;
  border-color: #523b2e !important;
}
</style>