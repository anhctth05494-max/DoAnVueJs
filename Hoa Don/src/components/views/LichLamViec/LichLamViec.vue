<template>
  <div class="schedule-page">
    <div class="card border-0 shadow-sm rounded-3 bg-white">
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h6 class="mb-1 text-dark fw-bold">Xếp lịch nhân viên</h6>
            <div class="text-muted small mb-1" style="font-size: 12px;">{{ currentWeekLabel }}</div>
            <p class="text-muted mb-0" style="font-size: 13px;">Xem nhanh lịch làm việc theo tuần và thêm nhân viên cho từng ca dễ dàng.</p>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <button type="button" class="btn rounded-pill text-white" style="background-color: #8c6b5d;" @click="prevWeek">
              <i class="bi bi-chevron-left"></i> Tuần trước
            </button>
            <button type="button" class="btn rounded-pill text-white" style="background-color: #8c6b5d;" @click="nextWeek">
              Tuần sau <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="table-responsive schedule-table-wrapper">
          <table class="table table-sm schedule-table mb-0 align-middle text-nowrap small">
            <thead>
              <tr>
                <th class="py-3 rounded-start text-dark" style="background-color: #f3ece6; min-width: 120px;">Ca / Ngày</th>
                <th v-for="day in days" :key="day.key" class="py-3 text-center text-dark" style="background-color: #f3ece6; min-width: 130px; font-size: 13px;">
                  <div class="fw-semibold" style="font-size: 13px;">{{ day.label }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ day.shortDate }}</div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="shift in shifts" :key="shift.key">
                <th scope="row" class="py-3 align-middle text-nowrap text-dark" style="background-color: #faf3ed; min-width: 120px; font-size: 13px;">
                  <div class="fw-semibold" style="font-size: 13px;">{{ shift.label }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ shift.time }}</div>
                </th>

                <td v-for="day in days" :key="day.key" class="p-2">
                  <div :class="['schedule-cell', shift.key]">
                    <div class="cell-inner">
                      <div v-if="scheduled[day.key] && scheduled[day.key][shift.key]?.length" class="d-flex flex-column gap-2">
                        <div v-for="item in scheduled[day.key][shift.key]" :key="item.id" class="assignment rounded-3 px-3 py-2">
                          <span class="badge-dot"></span>
                          <span class="fw-medium" style="font-size: 12px;">{{ item.name }}</span>
                          <div class="text-muted" style="font-size: 10px;">{{ item.code }}</div>
                        </div>
                      </div>

                      <div v-else class="text-muted" style="font-size: 12px;">Chưa có nhân viên</div>

                      <button type="button" class="btn btn-sm btn-outline-primary schedule-add-btn" @click="openModal(day, shift)" :disabled="loadingEmployees || employees.length === 0" :title="employees.length === 0 ? 'Không có nhân viên' : 'Thêm nhân viên'">
                        <i class="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </td>
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
            <div class="text-muted" style="font-size: 12px;">{{ selectedDay?.label }} • {{ selectedShift?.label }}</div>
          </div>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
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
                {{ emp.ho_ten || emp.ten_tai_khoan || emp.name || 'Nhân viên' }} ({{ emp.ma_nhan_vien || emp.code || emp.id }})
              </option>
            </select>
          </div>
        </div>

        <div class="modal-footer bg-light px-4 py-3 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary rounded-pill" @click="closeModal">Hủy</button>
          <button type="button" class="btn btn-primary rounded-pill" :disabled="!newEmployeeId" @click="addAssignment">Xác nhận</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'

const employees = ref([])
const loadingEmployees = ref(false)
const currentMonday = ref(new Date())
const selectedDay = ref(null)
const selectedShift = ref(null)
const newEmployeeId = ref('')
const showModal = ref(false)

const shifts = [
  { key: 'morning', label: 'Ca sáng', time: '08:00 - 12:00' },
  { key: 'afternoon', label: 'Ca chiều', time: '12:00 - 17:00' },
  { key: 'evening', label: 'Ca tối', time: '17:00 - 23:00' },
]

const days = ref([])

const scheduled = reactive({
  mon: {
    morning: [
      { id: 101, name: 'Dương Đức Tùng', code: 'NV2367' },
      { id: 102, name: 'Dương Đức Tùng', code: 'NV4257' },
    ],
    afternoon: [
      { id: 103, name: 'Dương Đức Tùng', code: 'NV2367' },
      { id: 104, name: 'Dương Đức Tùng', code: 'NV2427' },
    ],
    evening: [
      { id: 105, name: 'Vũ Thành Hải Phong', code: 'NV42022' },
    ],
  },
  tue: {
    morning: [
      { id: 106, name: 'Dương Đức Tùng', code: 'NV2367' },
      { id: 107, name: 'Dương Đức Tùng', code: 'NV55509' },
      { id: 108, name: 'Dương Đức Tùng', code: 'NV7291' },
    ],
    afternoon: [
      { id: 109, name: 'Dương Đức Tùng', code: 'NV2367' },
    ],
    evening: [
      { id: 110, name: 'Vũ Thành Hải Phong', code: 'NV42022' },
    ],
  },
  wed: {
    morning: [
      { id: 111, name: 'Khánh Chi', code: 'NV32512' },
      { id: 112, name: 'Vũ Thành Hải Phong', code: 'NV42022' },
    ],
    afternoon: [
      { id: 113, name: 'Dương Đức Tùng', code: 'NV2367' }],
    evening: [],
  },
  thu: {
    morning: [
      { id: 114, name: 'Khánh Chi', code: 'NV32512' }],
    afternoon: [
      { id: 115, name: 'Dương Đức Tùng', code: 'NV2367' }],
    evening: [],
  },
  fri: {
    morning: [
      { id: 116, name: 'Khánh Chi', code: 'NV32512' }],
    afternoon: [
      { id: 117, name: 'Dương Đức Tùng', code: 'NV2367' }],
    evening: [
      { id: 118, name: 'Anh Tuyết', code: 'NV98643' },
    ],
  },
  sat: {
    morning: [
      { id: 119, name: 'Anh Tuyết', code: 'NV98643' }],
    afternoon: [],
    evening: [
      { id: 120, name: 'Dương Đức Tùng', code: 'NV17775' },
    ],
  },
  sun: {
    morning: [
      { id: 121, name: 'Anh Tuyết', code: 'NV98643' }],
    afternoon: [],
    evening: [],
  },
})

const formatDate = (date) => {
  const d = new Date(date)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

const updateDays = () => {
  const firstDay = new Date(currentMonday.value)
  firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7))
  const names = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']

  days.value = names.map((key, index) => {
    const date = new Date(firstDay)
    date.setDate(firstDay.getDate() + index)
    return {
      key,
      label: labels[index],
      shortDate: formatDate(date),
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
  return selectedDay.value && selectedShift.value
    ? `${selectedDay.value.label} • ${selectedShift.value.label}`
    : ''
})

const openModal = (day, shift) => {
  selectedDay.value = day
  selectedShift.value = shift
  newEmployeeId.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const fetchEmployees = async () => {
  loadingEmployees.value = true
  try {
    const params = { page: 0, size: 100 }
    const response = await axios.get('http://localhost:8080/api/employees', { params })
    employees.value = response.data.content || []
  } catch (error) {
    console.error('Lỗi tải danh sách nhân viên:', error)
    employees.value = []
  } finally {
    loadingEmployees.value = false
  }
}

const addAssignment = () => {
  if (!selectedDay.value || !selectedShift.value || !newEmployeeId.value) return

  const employee = employees.value.find((item) => item.id === Number(newEmployeeId.value))
  if (!employee) return

  const row = scheduled[selectedDay.value.key][selectedShift.value.key]
  const nextId = Math.max(0, ...Object.values(scheduled).flatMap((m) => Object.values(m).flatMap((arr) => arr.map((x) => x.id)))) + 1
  row.push({
    id: nextId,
    name: employee.ho_ten || employee.ten_tai_khoan || employee.name || 'Nhân viên',
    code: employee.ma_nhan_vien || employee.code || employee.id,
  })
  showModal.value = false
}

const prevWeek = () => {
  currentMonday.value.setDate(currentMonday.value.getDate() - 7)
  currentMonday.value = new Date(currentMonday.value)
  updateDays()
}

const nextWeek = () => {
  currentMonday.value.setDate(currentMonday.value.getDate() + 7)
  currentMonday.value = new Date(currentMonday.value)
  updateDays()
}

onMounted(() => {
  updateDays()
  fetchEmployees()
})
</script>

<style scoped>
.schedule-page {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
}
.schedule-table-wrapper {
  overflow-x: auto;
  padding: 0.75rem 0 0;
}
.schedule-table {
  width: 100%;
  max-width: 100%;
  table-layout: auto;
  border-collapse: separate;
  border-spacing: 0 10px;
}
.schedule-table thead th,
.schedule-table tbody th,
.schedule-table td {
  border: none;
}
.schedule-table thead th,
.schedule-table tbody th {
  padding: 10px 8px;
}
.schedule-table td {
  padding: 6px 8px;
  vertical-align: top;
  word-wrap: break-word;
}
.schedule-table thead th:first-child {
  min-width: 110px;
}
.schedule-table thead th:not(:first-child) {
  min-width: 110px;
}
.schedule-cell {
  background: #fcfaf8;
  border: 1px solid #f0e5da;
  border-radius: 18px;
  min-height: 140px;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.schedule-cell.morning {
  background: #eef7ff;
  border-color: #d6e8ff;
}
.schedule-cell.afternoon {
  background: #f9f3ec;
  border-color: #ead5c2;
}
.schedule-cell.evening {
  background: #f3f0f9;
  border-color: #d9d1e8;
}
.schedule-cell:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.06);
}
.cell-inner {
  min-height: 160px;
  padding: 10px;
  position: relative;
  font-size: 13px;
}
.assignment {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: #e8d6ca;
  color: #4e382b;
  padding: 0.6rem 0.8rem;
  font-size: 0.85rem;
  line-height: 1.2;
}
.badge-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: #7a5f4d;
  margin-top: 6px;
  flex-shrink: 0;
}
.d-flex.flex-column.gap-2 {
  gap: 0.5rem !important;
}
.schedule-add-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.schedule-cell:hover .schedule-add-btn {
  opacity: 1;
  visibility: visible;
}
.schedule-add-btn i {
  font-size: 1rem;
}
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}
.custom-modal-content {
  width: min(560px, 100%);
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
}
.custom-modal-content .btn-close {
  border: none;
}
.modal-footer {
  border-top: 1px solid #f0e0d6;
}
.btn-primary {
  background-color: #8c6b5d;
  border-color: #8c6b5d;
}
.btn-primary:hover {
  background-color: #755347;
  border-color: #755347;
}
.btn-outline-secondary {
  color: #5a4031;
  border-color: #d7c0b2;
}
.btn-outline-secondary:hover {
  background-color: #f2ebe5;
}
</style>
