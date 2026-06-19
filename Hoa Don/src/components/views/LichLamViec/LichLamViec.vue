<template>
  <div class="schedule-page">
    <div class="card border-0 shadow-sm rounded-3 bg-white">
      <div class="card-body p-4">
       
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">
          <div class="d-flex flex-wrap align-items-center gap-2 group-controls">
            <div class="d-flex align-items-center rounded-pill border px-2 py-1 bg-light" style="height: 38px;">
              <button type="button" class="btn btn-link text-secondary p-0 px-2 border-0" @click="prevWeek" title="Tuần trước">
                <i class="bi bi-chevron-left"></i>
              </button>
             
              <input
                type="date"
                v-model="selectedDate"
                class="form-control form-control-sm border-0 bg-transparent text-center shadow-none text-dark fw-semibold px-1"
                style="width: 135px; cursor: pointer; font-size: 13px;"
              />
             
              <button type="button" class="btn btn-link text-secondary p-0 px-2 border-0" @click="nextWeek" title="Tuần sau">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>


            <button type="button" class="btn btn-sm rounded-pill px-3 border text-dark fw-medium btn-today" @click="goToToday" style="height: 38px;">
              <i class="bi bi-calendar2-event me-1"></i> Hôm nay
            </button>
          </div>


          <span class="badge px-3 text-dark rounded-pill border fw-normal bg-white d-inline-flex align-items-center" style="font-size: 12px; height: 38px; color: #5a4031 !important;">
            <i class="bi bi-calendar-range me-2 text-muted"></i> Tuần: <b>{{ currentWeekLabel }}</b>
          </span>
        </div>


        <div class="table-responsive schedule-table-wrapper">
          <table class="table table-sm schedule-table mb-0 align-middle text-nowrap small">
            <thead>
              <tr>
                <th class="py-3 rounded-start text-dark" style="background-color: #f3ece6; min-width: 120px;">Ca / Ngày</th>
                <th v-for="day in days" :key="day.dateStr"
                    class="py-3 text-center text-dark position-relative transition-all"
                    :class="{ 'today-header-highlight': isToday(day.dateStr) }"
                    style="background-color: #f3ece6; min-width: 130px; font-size: 13px;">
                 
                  <div v-if="isToday(day.dateStr)" class="today-top-line"></div>
                 
                  <div :class="isToday(day.dateStr) ? 'fw-bold text-highlight-dark' : 'fw-semibold'" style="font-size: 13px;">
                    {{ day.label }}
                  </div>
                  <div class="text-muted" style="font-size: 11px;">{{ day.shortDate }}</div>
                </th>
              </tr>
            </thead>


            <tbody>
              <tr v-for="shift in shifts" :key="shift.id">
                <th scope="row" class="py-3 align-middle text-nowrap text-dark" style="background-color: #faf3ed; min-width: 120px; font-size: 13px;">
                  <div class="fw-semibold" style="font-size: 13px;">{{ shift.tenCa || shift.ten_ca }}</div>
                  <div class="text-muted" style="font-size: 11px;">
                    {{ formatTime(shift.gioBatDau || shift.gio_bat_dau || shift.gioBatDat) }} -
                    {{ formatTime(shift.gioKetThuc || shift.gio_ket_thuc) }}
                  </div>
                </th>


                <td v-for="day in days" :key="day.dateStr" class="p-2 transition-all" :class="{ 'today-column-highlight': isToday(day.dateStr) }">
                  <div :class="['schedule-cell', getShiftClass(shift)]">
                    <div class="cell-inner">
                     
                      <div v-if="scheduled[day.dateStr] && scheduled[day.dateStr][shift.id]?.length" class="d-flex flex-column gap-2">
                        <div v-for="item in scheduled[day.dateStr][shift.id]" :key="item.id" class="assignment rounded-3 px-3 py-2 position-relative">
                          <span class="badge-dot"></span>
                          <span class="fw-medium" style="font-size: 12px;">{{ item.name }}</span>
                          <div class="text-muted" style="font-size: 10px;">{{ item.code }}</div>
                         
                          <button type="button" class="btn-remove-emp" @click="openDeleteConfirmModal(item.id)" title="Xóa nhân viên khỏi ca">
                            <i class="bi bi-dash"></i>
                          </button>
                        </div>
                      </div>


                      <div v-else class="text-muted mb-2 text-center pt-3" style="font-size: 12px;">Chưa có nhân viên</div>


                      <button type="button" class="btn btn-sm btn-outline-primary schedule-add-btn"
                              @click="openModal(day, shift)"
                              :disabled="loadingEmployees || employees.length === 0">
                        <i class="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
             
              <tr v-if="shifts.length === 0">
                <td :colspan="days.length + 1" class="text-center py-4 text-muted">Không tìm thấy dữ liệu ca làm việc hoặc đang tải...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
      <div class="custom-modal-content shadow-lg">
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
          <div>
            <h6 class="mb-1 fw-semibold text-dark" style="font-size: 15px;">Thêm nhân viên vào ca</h6>
            <div class="text-muted" style="font-size: 12px;">{{ selectedDay?.label }} • {{ selectedShift?.tenCa || selectedShift?.ten_ca }}</div>
          </div>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>


        <div class="p-4">
          <div class="mb-3">
            <label class="form-label fw-medium" style="font-size: 13px;">Ca & Ngày</label>
            <input type="text" class="form-control" :value="selectedCellTitle" readonly style="font-size: 13px;" />
          </div>


          <div class="mb-3">
            <label class="form-label fw-medium" style="font-size: 13px;">Chọn nhân viên</label>
            <select class="form-select" v-model="newEmployeeId" style="font-size: 13px;">
              <option value="">Chọn nhân viên</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.ho_ten || emp.hoTen }} ({{ emp.ma_nhan_vien || emp.maNhanVien }})
              </option>
            </select>
          </div>
        </div>


        <div class="modal-footer bg-light px-4 py-3 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary rounded-pill" @click="closeModal">Hủy</button>
          <button type="button" class="btn btn-primary rounded-pill" :disabled="!newEmployeeId || submitting" @click="addAssignment">
            {{ submitting ? 'Đang lưu...' : 'Xác nhận' }}
          </button>
        </div>
      </div>
    </div>


    <div v-if="showDeactivateConfirm" class="custom-modal-overlay" @click.self="showDeactivateConfirm = false">
      <div class="custom-modal-content shadow-lg border-0 text-center p-4 bg-white rounded-4 animate-fade-in" style="max-width: 440px;">
        <div class="mb-3 text-warning" style="font-size: 45px;">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h5 class="fw-bold text-dark mb-2" style="font-size: 16px;">Đồng Bộ Lịch Nhân Sự</h5>
        <p class="text-secondary px-2 mb-4" style="line-height: 1.6; white-space: pre-line; font-size: 13.5px;">
          {{ deactivateConfirmMsg }}
        </p>
        <div class="d-flex justify-content-center gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-4 py-2" @click="rejectDeactivateAction">
            Không
          </button>
          <button type="button" class="btn btn-sm text-white rounded-pill px-4 py-2 fw-semibold"
                  style="background-color: #8c6b5d;"
                  @click="executeDeactivateAction">
            Có, thêm ngay
          </button>
        </div>
      </div>
    </div>


    <div v-if="showDeleteConfirm" class="custom-modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="custom-modal-content shadow-lg border-0 text-center p-4 bg-white rounded-4 animate-fade-in" style="max-width: 400px;">
        <div class="mb-3 text-danger" style="font-size: 45px;">
          <i class="bi bi-trash3-fill"></i>
        </div>
        <h5 class="fw-bold text-dark mb-2" style="font-size: 16px;">Xác Nhận Gỡ Ca Trực</h5>
        <p class="text-muted mb-4" style="font-size: 13.5px;">
          Bạn có chắc chắn muốn xóa nhân viên này khỏi ca trực không?
        </p>
        <div class="d-flex justify-content-center gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-4 py-2" @click="showDeleteConfirm = false">Hủy bỏ</button>
          <button type="button" class="btn btn-sm btn-danger rounded-pill px-4 py-2 fw-semibold" @click="executeDeleteAssignment">
            Xóa ngay
          </button>
        </div>
      </div>
    </div>


  </div>
</template>


<script setup>
import axios from 'axios'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'


const employees = ref([])
const shifts = ref([])
const scheduled = reactive({})


const loadingEmployees = ref(false)
const submitting = ref(false)
const currentMonday = ref(new Date())
const selectedDay = ref(null)
const selectedShift = ref(null)
const newEmployeeId = ref('')
const showModal = ref(false)
const days = ref([])


// State quản lý hộp thoại đồng bộ chéo trang khi chuyển tab
const showDeactivateConfirm = ref(false)
const deactivateConfirmMsg = ref('')
const queuedNotification = ref(null)


// Mảng chứa DANH SÁCH CÁC CA BỊ ẢNH HƯỞNG (Phục vụ vòng lặp tự động bù ca)
const pendingAffectedCells = ref([])


// State dành riêng cho hộp thoại xóa nhân viên custom
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)


const formatDateString = (date) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}


const todayStr = formatDateString(new Date())
const isToday = (dateStr) => dateStr === todayStr


const selectedDate = computed({
  get: () => formatDateString(currentMonday.value),
  set: (val) => {
    if (val) {
      currentMonday.value = new Date(val)
      updateDays()
      fetchSchedule()
    }
  }
})


const formatDate = (date) => {
  const d = new Date(date)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}


const formatTime = (time) => {
  if (!time) return ''
  if (Array.isArray(time)) {
    return `${String(time[0]).padStart(2, '0')}:${String(time[1]).padStart(2, '0')}`
  }
  return typeof time === 'string' ? time.substring(0, 5) : time
}


const getShiftClass = (shift) => {
  const name = (shift.tenCa || shift.ten_ca || '').toLowerCase()
  if (name.includes('sáng') || name.includes('morning')) return 'morning'
  if (name.includes('chiều') || name.includes('afternoon')) return 'afternoon'
  if (name.includes('tối') || name.includes('evening') || name.includes('đêm')) return 'evening'
  return ''
}


const updateDays = () => {
  const firstDay = new Date(currentMonday.value)
  firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7))
  const labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']


  days.value = labels.map((label, index) => {
    const date = new Date(firstDay)
    date.setDate(firstDay.getDate() + index)
    return {
      label,
      shortDate: formatDate(date),
      dateStr: formatDateString(date),
      fullDate: date,
    }
  })
}


const currentWeekLabel = computed(() => {
  const start = days.value[0]?.fullDate
  const end = days.value[6]?.fullDate
  return start && end ? `${formatDate(start)} - ${formatDate(end)}` : ''
})


const selectedCellTitle = computed(() => {
  const shiftName = selectedShift.value?.tenCa || selectedShift.value?.ten_ca || ''
  return selectedDay.value && selectedShift.value ? `${selectedDay.value.label} • ${shiftName}` : ''
})


const goToToday = () => {
  currentMonday.value = new Date()
  updateDays()
  fetchSchedule()
}


const fetchShifts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/ca-lam-viec/all')
    shifts.value = response.data || []
  } catch (error) {
    console.error('Lỗi tải danh sách ca làm việc:', error)
  }
}


const fetchEmployees = async () => {
  loadingEmployees.value = true
  try {
    // Truyền trực tiếp param trangThai = 1 lên API của NhanVienController
    const params = { page: 0, size: 100, trangThai: 1 }
    const response = await axios.get('http://localhost:8080/api/employees', { params })
   
    const rawData = response.data.content || response.data || []
   
    // Đề phòng mọi trường hợp, lọc thêm một lần nữa ở Frontend cho chắc chắn 100%
    employees.value = rawData.filter(emp => emp.trang_thai === 1 || emp.trangThai === 1)
  } catch (error) {
    console.error('Lỗi tải danh sách nhân viên:', error)
  } finally {
    loadingEmployees.value = false
  }
}


const fetchSchedule = async () => {
  if (days.value.length === 0) return
  const startDate = days.value[0].dateStr
  const endDate = days.value[6].dateStr


  try {
    const response = await axios.get('http://localhost:8080/api/lich-lam-viec', {
      params: { startDate, endDate }
    })
   
    Object.keys(scheduled).forEach(key => delete scheduled[key])


    const data = response.data || []
    data.forEach(item => {
      const dateKey = item.ngay_lam_viec || item.ngayLamViec
      const shiftId = item.ca_lam_viec_id || item.caLamViecId
      const empName = item.ho_ten_nhan_vien || item.hoTenNhanVien
      const empCode = item.ma_nhan_vien || item.maNhanVien


      if (!dateKey || !shiftId) return


      if (!scheduled[dateKey]) scheduled[dateKey] = {}
      if (!scheduled[dateKey][shiftId]) scheduled[dateKey][shiftId] = []


      scheduled[dateKey][shiftId].push({
        id: item.id,
        name: empName,
        code: empCode
      })
    })
  } catch (error) {
    console.error('Lỗi tải dữ liệu lịch làm việc:', error)
  }
}


const openModal = (day, shift) => {
  selectedDay.value = day
  selectedShift.value = shift
  newEmployeeId.value = ''
  showModal.value = true
}


const closeModal = () => {
  showModal.value = false
  pendingAffectedCells.value = [] // Reset hàng chờ nếu đóng thủ công
}


// HÀM XẾP LỊCH / BÙ CA (ĐÃ ĐƯỢC THÊM VÒNG LẶP AUTO THẾ CHỖ)
const addAssignment = async () => {
  if (!selectedDay.value || !selectedShift.value || !newEmployeeId.value) return


  submitting.value = true
  try {
    const payload = {
      nhan_vien_id: Number(newEmployeeId.value),
      ca_lam_viec_id: selectedShift.value.id,
      ngay_lam_viec: selectedDay.value.dateStr
    }


    await axios.post('http://localhost:8080/api/lich-lam-viec', payload)
   
    // Kiểm tra xem trong danh sách hàng chờ còn ca nào cần bổ sung tiếp hay không
    if (pendingAffectedCells.value && pendingAffectedCells.value.length > 0) {
      // Lấy ca tiếp theo ra khỏi mảng hàng chờ
      const nextCell = pendingAffectedCells.value.shift()
     
      // Đổi dữ liệu tiêu đề và cấu hình của Modal sang ca mới
      selectedDay.value = nextCell.day
      selectedShift.value = nextCell.shift
      newEmployeeId.value = '' // Reset ô chọn để Admin chọn người mới cho ca này
     
      // Cập nhật lại lịch chạy ngầm phía dưới nền bảng để hiển thị ô vừa được bù
      await fetchSchedule()
    } else {
      // Nếu đã bù hết toàn bộ các ca trống, tiến hành đóng Modal
      await fetchSchedule()
      showModal.value = false
    }
  } catch (error) {
    console.error('Lỗi khi xếp lịch:', error)
  } finally {
    submitting.value = false
  }
}


const openDeleteConfirmModal = (id) => {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}


const executeDeleteAssignment = async () => {
  showDeleteConfirm.value = false
  if (!deleteTargetId.value) return
  try {
    await axios.delete(`http://localhost:8080/api/lich-lam-viec/${deleteTargetId.value}`)
    await fetchSchedule()
  } catch (error) {
    console.error('Lỗi khi xóa lịch làm việc:', error)
  } finally {
    deleteTargetId.value = null
  }
}


// Kiểm tra và hiển thị cảnh báo hàng chờ khi người dùng click quay trở lại tab Lịch
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && queuedNotification.value) {
    deactivateConfirmMsg.value = queuedNotification.value.msg
    pendingAffectedCells.value = queuedNotification.value.cells
    showDeactivateConfirm.value = true
    queuedNotification.value = null
  }
}


// Khi người dùng bấm "Có, thêm ngay" trên hộp thoại cảnh báo đồng bộ
const executeDeactivateAction = async () => {
  showDeactivateConfirm.value = false
 
  // Tải lại danh sách nhân viên đang làm việc thực tế từ SQL Server lập tức
  await fetchEmployees()
 
  if (pendingAffectedCells.value && pendingAffectedCells.value.length > 0) {
    // Bốc ca bị trống đầu tiên ra để gán vào Modal chọn người thay thế
    const firstCell = pendingAffectedCells.value.shift()
    openModal(firstCell.day, firstCell.shift)
  }
}


const rejectDeactivateAction = () => {
  showDeactivateConfirm.value = false
  pendingAffectedCells.value = [] // Giải phóng hàng chờ bù ca
 
  // Tải lại danh sách nhân viên mới để danh sách dropdown luôn sạch sẽ
  fetchEmployees()
}


onMounted(async () => {
  updateDays()
  await Promise.all([
    fetchShifts(),
    fetchEmployees(),
    fetchSchedule()
  ])


  document.addEventListener('visibilitychange', handleVisibilityChange)


  // LẮNG NGHE TÍN HIỆU ĐỒNG BỘ REAL-TIME TỪ TAB QUẢN LÝ NHÂN VIÊN
  const authChannel = new BroadcastChannel('auth-channel')
  authChannel.onmessage = (event) => {
    if (event.data.action === 'employee_deactivated') {
      const { employeeId, employeeName, employeeCode } = event.data
     
      let temporaryCells = []


      // 1. Quét tìm TOÀN BỘ các ô ca làm việc trong tuần hiện tại bị ảnh hưởng
      Object.keys(scheduled).forEach(dateKey => {
        Object.keys(scheduled[dateKey]).forEach(shiftId => {
          const isAssigned = scheduled[dateKey][shiftId].some(
            emp => emp.id === employeeId || emp.code === employeeCode
          )
         
          if (isAssigned) {
            const targetDay = days.value.find(d => d.dateStr === dateKey)
            const targetShift = shifts.value.find(s => String(s.id) === String(shiftId))
            if (targetDay && targetShift) {
              temporaryCells.push({ day: targetDay, shift: targetShift })
            }
          }
        });
      });


      // 2. THỰC HIỆN ĐÚNG YÊU CẦU: Xoá nhân viên đã nghỉ khỏi TẤT CẢ các ô ca lập tức trên màn hình (Frontend)
      Object.keys(scheduled).forEach(dateKey => {
        Object.keys(scheduled[dateKey]).forEach(shiftId => {
          scheduled[dateKey][shiftId] = scheduled[dateKey][shiftId].filter(
            emp => emp.id !== employeeId && emp.code !== employeeCode
          )
        });
      });


      // Kéo ngầm dữ liệu mới sạch từ DB về để chuẩn hóa đồng bộ
      fetchEmployees()
      fetchSchedule()


      // 3. Nếu nhân sự này có ca bị trống, kích hoạt thông báo và chuẩn bị mảng hàng chờ điều hướng
      if (temporaryCells.length > 0) {
        const messageText = `Nhân viên ${employeeName} có lịch làm việc trong tuần đã ngừng hoạt động.\n\nCó muốn thêm nv khác vào những CA ĐẤY KHÔNG?`
       
        if (document.visibilityState === 'visible') {
          deactivateConfirmMsg.value = messageText
          pendingAffectedCells.value = temporaryCells // Lưu toàn bộ danh sách ca trống vào hàng chờ loop
          showDeactivateConfirm.value = true
        } else {
          // Nếu Admin đang đứng ở tab Nhân viên, đẩy thông tin vào bộ lưu tạm chờ chuyển tab
          queuedNotification.value = { msg: messageText, cells: temporaryCells }
        }
      }
    }
  }
})


onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>


<style scoped>
.schedule-page { width: 100%; max-width: 1140px; margin: 0 auto; }
.schedule-table-wrapper { overflow-x: auto; padding: 0.75rem 0 0; }
.schedule-table { width: 100%; max-width: 100%; table-layout: auto; border-collapse: separate; border-spacing: 0 10px; }
.schedule-table th, .schedule-table td { border: none; padding: 10px 8px; }
.schedule-cell { background: #fcfaf8; border: 1px solid #f0e5da; border-radius: 18px; min-height: 140px; position: relative; transition: all 0.2s ease; }
.schedule-cell.morning { background: #eef7ff; border-color: #d6e8ff; }
.schedule-cell.afternoon { background: #f9f3ec; border-color: #ead5c2; }
.schedule-cell.evening { background: #f3f0f9; border-color: #d9d1e8; }
.schedule-cell:hover { transform: translateY(-1px); box-shadow: 0 16px 30px rgba(0, 0, 0, 0.06); }


.cell-inner { min-height: 160px; padding: 10px 10px 42px 10px; position: relative; font-size: 13px; }
.assignment { display: flex; align-items: flex-start; gap: 0.5rem; background: #e8d6ca; color: #4e382b; padding: 0.6rem 2rem 0.6rem 0.8rem; font-size: 0.85rem; line-height: 1.2; position: relative; }
.badge-dot { width: 0.6rem; height: 0.6rem; border-radius: 50%; background: #7a5f4d; margin-top: 6px; flex-shrink: 0; }


.schedule-add-btn { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 32px; height: 32px; border-radius: 50%; opacity: 0; visibility: hidden; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; }
.schedule-cell:hover .schedule-add-btn { opacity: 1; visibility: visible; }


.btn-remove-emp { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; border-radius: 50%; background-color: #e06a55; border: none; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 14px; opacity: 0; visibility: hidden; transition: all 0.15s ease; cursor: pointer; padding: 0; }
.assignment:hover .btn-remove-emp { opacity: 1; visibility: visible; }
.btn-remove-emp:hover { background-color: #c94b34; }


.custom-modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(1px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.custom-modal-content { width: min(560px, 100%); background: #ffffff; border-radius: 18px; overflow: hidden; }
.btn-primary { background-color: #8c6b5d; border-color: #8c6b5d; }
.btn-primary:hover { background-color: #755347; border-color: #755347; }
.btn-today { background-color: #f2ebe5; border-color: #d7c0b2; color: #5a4031 !important; transition: all 0.2s ease; }
.btn-today:hover { background-color: #e8d6ca; border-color: #8c6b5d; }


.transition-all { transition: background-color 0.3s ease, border-color 0.3s ease; }
.today-header-highlight { background-color: #ebdcd0 !important; }
.text-highlight-dark { color: #755347 !important; }
.today-top-line { position: absolute; top: 0; left: 0; right: 0; height: 4px; background-color: #8c6b5d; border-top-left-radius: 4px; border-top-right-radius: 4px; }
.today-column-highlight { background-color: rgba(140, 107, 93, 0.04) !important; }


/* CSS Hiệu ứng trồi lên mượt mà cho Hộp thoại hẳn hoi */
.animate-fade-in {
  animation: modalPopIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalPopIn {
  from { opacity: 0; transform: scale(0.93) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>



