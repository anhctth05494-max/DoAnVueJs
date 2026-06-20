<template>
  <div class="schedule-page">
    <div class="card border-0 shadow-sm rounded-3 bg-white">
      <div class="card-body p-4">
        
        <!-- Header điều khiển -->
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">
          <div class="d-flex flex-wrap align-items-center gap-2 group-controls">
            <div class="d-flex align-items-center rounded border px-1 bg-white" style="height: 38px;">
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

            <button type="button" class="btn btn-sm rounded px-3 border text-dark fw-medium btn-today" @click="goToToday" style="height: 38px;">
              Hôm nay
            </button>
          </div>

          <span class="badge px-3 text-dark rounded border fw-normal bg-white d-inline-flex align-items-center" style="font-size: 13px; height: 38px; color: #5a4031 !important;">
            Tuần từ: <b class="ms-1">{{ currentWeekLabel }}</b>
          </span>
        </div>

        <!-- Bảng lịch làm việc -->
        <div class="table-responsive schedule-table-wrapper">
          <table class="table table-sm schedule-table mb-0 align-middle text-nowrap small">
            <thead>
              <tr>
                <th class="py-3 text-dark ps-3" style="background-color: #f3ece6; min-width: 130px; border-top-left-radius: 8px; border-bottom-left-radius: 8px;">Ca / Ngày</th>
                <th v-for="(day, index) in days" :key="day.dateStr"
                    class="py-3 text-center text-dark position-relative transition-all"
                    :class="{ 
                      'today-header-highlight': isToday(day.dateStr),
                      'rounded-end-header': index === days.length - 1 
                    }"
                    style="background-color: #f3ece6; min-width: 140px; font-size: 13px;">
                  
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
                <th scope="row" class="py-3 align-middle text-nowrap text-dark ps-3" style="background-color: #faf3ed; min-width: 130px; font-size: 13px; border-top-left-radius: 8px; border-bottom-left-radius: 8px;">
                  <div class="fw-semibold" style="font-size: 13px;">{{ shift.tenCa || shift.ten_ca }}</div>
                  <div class="text-muted" style="font-size: 11px; font-weight: normal;">
                    {{ formatTime(shift.gioBatDau || shift.gio_bat_dau || shift.gioBatDat) }} -
                    {{ formatTime(shift.gioKetThuc || shift.gio_ket_thuc) }}
                  </div>
                </th>

                <td v-for="day in days" :key="day.dateStr" class="p-2 transition-all" :class="{ 'today-column-highlight': isToday(day.dateStr) }">
                  <div class="schedule-cell">
                    <div class="cell-inner">
                      
                      <!-- Danh sách nhân viên trong ca -->
                      <div v-if="scheduled[day.dateStr] && scheduled[day.dateStr][shift.id]?.length" class="d-flex flex-column gap-2">
                        <div v-for="item in scheduled[day.dateStr][shift.id]" :key="item.id" class="assignment rounded p-2 position-relative d-flex align-items-center gap-2">
                          
                          <!-- Hình tròn chứa ký tự đầu của tên -->
                          <div class="avatar-circle d-flex align-items-center justify-content-center fw-bold text-white text-uppercase">
                            {{ item.name ? item.name.trim().charAt(0) : '' }}
                          </div>
                          
                          <!-- Thông tin tên & mã -->
                          <div class="d-flex flex-column text-truncate logic-text-wrapper">
                            <span class="fw-medium text-dark text-truncate" style="font-size: 12px; line-height: 1.3;">{{ item.name }}</span>
                            <span class="text-muted text-truncate" style="font-size: 10px;">{{ item.code }}</span>
                          </div>
                          
                          <button type="button" class="btn-remove-emp" @click="openDeleteConfirmModal(item.id)" title="Xóa nhân viên khỏi ca">
                            <i class="bi bi-dash"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Đã bỏ chữ "Chưa có nhân viên" tại đây -->

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

    <!-- Hộp thoại Thêm nhân viên -->
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

    <!-- Hộp thoại Đồng bộ Lịch Nhân Sự -->
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

    <!-- Hộp thoại Xác nhận Gỡ Ca Trực -->
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

const showDeactivateConfirm = ref(false)
const deactivateConfirmMsg = ref('')
const queuedNotification = ref(null)
const pendingAffectedCells = ref([])

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
  return start && end ? `${formatDateString(start)} đến ${formatDateString(end)}` : ''
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

const prevWeek = () => {
  const d = new Date(currentMonday.value)
  d.setDate(d.getDate() - 7)
  currentMonday.value = d
  updateDays()
  fetchSchedule()
}

const nextWeek = () => {
  const d = new Date(currentMonday.value)
  d.setDate(d.getDate() + 7)
  currentMonday.value = d
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
    const params = { page: 0, size: 100, trangThai: 1 }
    const response = await axios.get('http://localhost:8080/api/employees', { params })
    const rawData = response.data.content || response.data || []
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
  pendingAffectedCells.value = []
}

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
    
    if (pendingAffectedCells.value && pendingAffectedCells.value.length > 0) {
      const nextCell = pendingAffectedCells.value.shift()
      selectedDay.value = nextCell.day
      selectedShift.value = nextCell.shift
      newEmployeeId.value = ''
      await fetchSchedule()
    } else {
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

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && queuedNotification.value) {
    deactivateConfirmMsg.value = queuedNotification.value.msg
    pendingAffectedCells.value = queuedNotification.value.cells
    showDeactivateConfirm.value = true
    queuedNotification.value = null
  }
}

const executeDeactivateAction = async () => {
  showDeactivateConfirm.value = false
  await fetchEmployees()
  if (pendingAffectedCells.value && pendingAffectedCells.value.length > 0) {
    const firstCell = pendingAffectedCells.value.shift()
    openModal(firstCell.day, firstCell.shift)
  }
}

const rejectDeactivateAction = () => {
  showDeactivateConfirm.value = false
  pendingAffectedCells.value = []
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

  const authChannel = new BroadcastChannel('auth-channel')
  authChannel.onmessage = (event) => {
    if (event.data.action === 'employee_deactivated') {
      const { employeeId, employeeName, employeeCode } = event.data
      let temporaryCells = []

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

      Object.keys(scheduled).forEach(dateKey => {
        Object.keys(scheduled[dateKey]).forEach(shiftId => {
          scheduled[dateKey][shiftId] = scheduled[dateKey][shiftId].filter(
            emp => emp.id !== employeeId && emp.code !== employeeCode
          )
        });
      });

      fetchEmployees()
      fetchSchedule()

      if (temporaryCells.length > 0) {
        const messageText = `Nhân viên ${employeeName} có lịch làm việc trong tuần đã ngừng hoạt động.\n\nCó muốn thêm nv khác vào những CA ĐẤY KHÔNG?`
        if (document.visibilityState === 'visible') {
          deactivateConfirmMsg.value = messageText
          pendingAffectedCells.value = temporaryCells
          showDeactivateConfirm.value = true
        } else {
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
.schedule-page { width: 100%; max-width: 1200px; margin: 0 auto; }
.schedule-table-wrapper { overflow-x: auto; padding: 0.5rem 0 0; }
.schedule-table { width: 100%; max-width: 100%; table-layout: auto; border-collapse: separate; border-spacing: 0; }
.schedule-table th, .schedule-table td { border: 1px solid #e9ecef; padding: 12px 8px; vertical-align: top; }
.schedule-table thead th { border-bottom: 2px solid #dee2e6; text-align: center; }

/* Ô chứa danh sách ca làm việc - Đã chuyển về nền trắng đồng bộ giống ảnh mẫu */
.schedule-cell { background: #ffffff; min-height: 140px; position: relative; transition: all 0.2s ease; border-radius: 6px; }
.cell-inner { min-height: 140px; padding: 4px 4px 38px 4px; position: relative; font-size: 13px; }

/* Khối nhân viên dạng dải trắng, viền ấm kèm thanh accent bên trái */
.assignment { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  background: #ffffff; 
  border: 1px solid #e2d7cd;
  border-left: 4px solid #8c6b5d;
  color: #4e382b; 
  padding: 6px 24px 6px 8px; 
  position: relative; 
  box-shadow: 0 2px 4px rgba(140, 107, 93, 0.05);
}

.avatar-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #8c6b5d;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
}

.logic-text-wrapper {
  min-width: 0;
  flex: 1;
}

.schedule-add-btn { position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); width: 28px; height: 28px; border-radius: 50%; opacity: 0; visibility: hidden; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
.schedule-cell:hover .schedule-add-btn { opacity: 1; visibility: visible; }

.btn-remove-emp { position: absolute; right: 4px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border-radius: 50%; background-color: #e06a55; border: none; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 12px; opacity: 0; visibility: hidden; transition: all 0.15s ease; cursor: pointer; padding: 0; }
.assignment:hover .btn-remove-emp { opacity: 1; visibility: visible; }
.btn-remove-emp:hover { background-color: #c94b34; }

.custom-modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(1px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.custom-modal-content { width: min(520px, 100%); background: #ffffff; border-radius: 12px; overflow: hidden; }
.btn-primary { background-color: #8c6b5d; border-color: #8c6b5d; }
.btn-primary:hover { background-color: #755347; border-color: #755347; }
.btn-today { background-color: #f2ebe5; border-color: #d7c0b2; color: #5a4031 !important; transition: all 0.2s ease; border-radius: 6px; }
.btn-today:hover { background-color: #e8d6ca; border-color: #8c6b5d; }

.transition-all { transition: background-color 0.3s ease, border-color 0.3s ease; }
.today-header-highlight { background-color: #ebdcd0 !important; }
.text-highlight-dark { color: #755347 !important; }
.today-top-line { position: absolute; top: 0; left: 0; right: 0; height: 4px; background-color: #8c6b5d; }
.today-column-highlight { background-color: rgba(140, 107, 93, 0.02) !important; }
.rounded-end-header { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }

.animate-fade-in {
  animation: modalPopIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalPopIn {
  from { opacity: 0; transform: scale(0.93) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>