<template>
  <div class="container-fluid px-4 py-3" style="min-height: 100vh; background-color: #f8f9fa">
    <div v-if="showToast" class="custom-toast-container">
      <div
        class="custom-toast"
        :class="toastType === 'success' ? 'border-success' : 'border-danger'"
      >
        <i
          class="fs-5"
          :class="
            toastType === 'success'
              ? 'bi bi-check-circle-fill text-success'
              : 'bi bi-exclamation-triangle-fill text-danger'
          "
        ></i>
        <span class="toast-message-text fw-medium">{{ toastMessage }}</span>
      </div>
    </div>
    <div class="card border-0 shadow-sm mb-4 rounded-4 bg-white">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-4">
          <i class="bi bi-funnel text-dark me-2 fs-5"></i>
          <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm</h6>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Tìm kiếm ca làm việc</label>
            <div class="input-group">
              <span
                class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted px-3"
              >
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="filters.keyword"
                type="text"
                class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle py-2"
                placeholder="Tìm theo tên ca..."
              />
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Trạng thái</label>
            <select
              v-model="filters.trangThai"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted py-2 px-3"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Ngừng hoạt động</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label text-muted small mb-1"
              >Thời gian bắt đầu (Tìm chính xác)</label
            >
            <input
              type="time"
              class="form-control rounded-pill shadow-none border-secondary-subtle text-muted py-2 px-3"
              v-model="filters.gioBatDau"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label text-muted small mb-1"
              >Thời gian kết thúc (Tìm chính xác)</label
            >
            <input
              type="time"
              class="form-control rounded-pill shadow-none border-secondary-subtle text-muted py-2 px-3"
              v-model="filters.gioKetThuc"
            />
          </div>
        </div>

        <div class="d-flex justify-content-end gap-3 mt-4 pt-2">
          <button
            @click="clearFilter"
            class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-none small fw-medium d-flex align-items-center gap-2"
            style="border-color: #d1d5db; color: #4b5563"
          >
            <i class="bi bi-arrow-clockwise"></i> Đặt lại bộ lọc
          </button>
          <button
            class="btn rounded-pill px-4 py-2 shadow-none small fw-medium d-flex align-items-center gap-2 text-dark"
            style="background-color: #dfd1c4"
            data-bs-toggle="modal"
            data-bs-target="#shiftModal"
            @click="openAddModal"
          >
            <i class="bi bi-plus-lg"></i> Thêm ca làm việc
          </button>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table align-middle text-nowrap custom-table mb-0" style="font-size: 0.9rem">
            <thead>
              <tr>
                <th class="py-3 px-3 border-0 text-center fw-semibold" style="width: 5%">STT</th>
                <th class="py-3 px-3 border-0 fw-semibold">TÊN CA</th>
                <th class="py-3 px-3 border-0 text-center fw-semibold">GIỜ BẮT ĐẦU</th>
                <th class="py-3 px-3 border-0 text-center fw-semibold">GIỜ KẾT THÚC</th>
                <th class="py-3 px-3 border-0 text-center fw-semibold">TRẠNG THÁI</th>
                <th class="py-3 px-3 border-0 text-center fw-semibold" style="width: 15%">
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody class="border-top-0 text-secondary">
              <tr v-if="shifts.length === 0">
                <td colspan="6" class="text-center py-5 text-danger fw-medium">
                  <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                  Không tìm thấy ca làm việc nào phù hợp với bộ lọc.
                </td>
              </tr>

              <tr v-for="(shift, index) in shifts" :key="shift.id">
                <td class="py-3 px-3 text-center text-dark">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="py-3 px-3 text-dark fw-bold">{{ shift.tenCa }}</td>
                <td class="py-3 px-3 text-center text-dark">{{ formatTime(shift.gioBatDau) }}</td>
                <td class="py-3 px-3 text-center text-dark">{{ formatTime(shift.gioKetThuc) }}</td>
                <td class="py-3 px-3 text-center">
                  <span
                    v-if="shift.trangThai === 1 || shift.trangThai === true"
                    class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-normal"
                  >
                    Đang hoạt động
                  </span>
                  <span
                    v-else
                    class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-normal"
                  >
                    Ngừng hoạt động
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <div class="d-flex justify-content-center gap-3 align-items-center">
                    <div class="form-check form-switch mb-0" title="Bật/Tắt trạng thái">
                      <input
                        class="form-check-input shadow-none custom-switch"
                        type="checkbox"
                        role="switch"
                        :checked="shift.trangThai === 1 || shift.trangThai === true"
                        @click.prevent="triggerToggleStatus(shift)"
                        style="cursor: pointer"
                      />
                    </div>
                    <i
                      class="bi bi-pencil-square fs-5 text-primary action-icon"
                      title="Xem & Cập nhật"
                      data-bs-toggle="modal"
                      data-bs-target="#shiftModal"
                      @click="openEditModal(shift)"
                    ></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="totalElements > 0"
          class="d-flex justify-content-between align-items-center p-4 border-top text-muted small flex-wrap gap-3"
        >
          <div>
            Hiển thị <span class="fw-bold text-dark">{{ shifts.length }}</span> /
            <span class="fw-bold text-dark">{{ totalElements }}</span> bản ghi
          </div>

          <div class="d-flex gap-1 align-items-center">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn btn-sm btn-light border shadow-none px-2 rounded"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              class="btn btn-sm shadow-none px-3 rounded fw-medium"
              :class="
                currentPage === page ? 'btn-secondary text-white' : 'btn-light border text-muted'
              "
              :style="
                currentPage === page ? 'background-color: #8c6b5d; border-color: #8c6b5d;' : ''
              "
            >
              {{ page }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn btn-sm btn-light border shadow-none px-2 rounded"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <div class="d-flex align-items-center gap-2">
            <select
              v-model="itemsPerPage"
              class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted px-3"
              style="width: auto"
            >
              <option :value="5">Hiển thị 5 bản ghi / trang</option>
              <option :value="10">Hiển thị 10 bản ghi / trang</option>
              <option :value="20">Hiển thị 20 bản ghi / trang</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="shiftModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" :class="isEditMode ? 'modal-lg' : ''">
        <div class="modal-content border-0 shadow-lg rounded-4 bg-white">
          <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 align-items-center">
            <h5 class="modal-title fw-bold" style="color: #3d211a">
              <i class="bi bi-clock-history me-2"></i
              >{{ isEditMode ? 'Xem Chi Tiết & Cập Nhật Ca' : 'Thêm Mới Ca Làm Việc' }}
            </h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body p-4">
            <div class="row g-4">
              <div :class="isEditMode ? 'col-lg-6 border-end pe-4' : 'col-12'">
                <form @submit.prevent="triggerSaveShift">
                  <div class="mb-3">
                    <label class="form-label fw-bold small text-muted"
                      >Tên ca <span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      class="form-control shadow-none py-2 rounded-3"
                      :class="{ 'is-invalid': errors.tenCa }"
                      placeholder="VD: Ca Sáng, Ca Chiều..."
                      v-model="shiftForm.tenCa"
                      @input="clearError('tenCa')"
                    />
                    <div class="invalid-feedback">{{ errors.tenCa }}</div>
                  </div>

                  <div class="row g-3 mb-3">
                    <div class="col-6">
                      <label class="form-label fw-bold small text-muted"
                        >Giờ bắt đầu <span class="text-danger">*</span></label
                      >
                      <input
                        type="time"
                        class="form-control shadow-none py-2 rounded-3"
                        :class="{ 'is-invalid': errors.gioBatDau }"
                        v-model="shiftForm.gioBatDau"
                        @input="clearError('gioBatDau')"
                      />
                      <div class="invalid-feedback">{{ errors.gioBatDau }}</div>
                    </div>
                    <div class="col-6">
                      <label class="form-label fw-bold small text-muted"
                        >Giờ kết thúc <span class="text-danger">*</span></label
                      >
                      <input
                        type="time"
                        class="form-control shadow-none py-2 rounded-3"
                        :class="{ 'is-invalid': errors.gioKetThuc }"
                        v-model="shiftForm.gioKetThuc"
                        @input="clearError('gioKetThuc')"
                      />
                      <div class="invalid-feedback">{{ errors.gioKetThuc }}</div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-bold small text-muted">Mô tả chi tiết</label>
                    <textarea
                      class="form-control shadow-none border-secondary-subtle py-2 rounded-3"
                      rows="3"
                      placeholder="Nhập thông tin mô tả chi tiết ca làm việc..."
                      v-model="shiftForm.moTa"
                    ></textarea>
                  </div>

                  <div
                    v-if="isEditMode"
                    class="mb-4 d-flex align-items-center gap-3 p-3 rounded-3"
                    style="background-color: #f8f9fa; border: 1px solid #e9ecef"
                  >
                    <label class="form-label fw-bold small text-muted mb-0"
                      >Trạng thái hoạt động:</label
                    >
                    <div class="form-check form-switch mb-0">
                      <input
                        class="form-check-input shadow-none custom-switch"
                        type="checkbox"
                        role="switch"
                        v-model="shiftForm.trangThai"
                        :true-value="1"
                        :false-value="0"
                      />
                      <label
                        class="form-check-label ms-2 small fw-medium"
                        :class="shiftForm.trangThai === 1 ? 'text-primary' : 'text-danger'"
                      >
                        {{ shiftForm.trangThai === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                      </label>
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-end gap-2 mt-4 pt-3"
                    :class="!isEditMode ? 'border-top' : ''"
                  >
                    <button
                      type="button"
                      id="hiddenCloseModalBtn"
                      class="d-none"
                      data-bs-dismiss="modal"
                    ></button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-none fw-medium"
                      data-bs-dismiss="modal"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      class="btn px-4 py-2 fw-medium rounded-pill text-dark"
                      style="background-color: #dccbc0; border: none"
                    >
                      {{ isEditMode ? 'Lưu cập nhật' : 'Tạo ca làm việc' }}
                    </button>
                  </div>
                </form>
              </div>

              <div v-if="isEditMode" class="col-lg-6">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold m-0 small" style="color: #5a4031">
                    <i class="bi bi-people-fill me-2"></i>NHÂN VIÊN ĐANG TRỰC HÔM NAY
                  </h6>
                </div>

                <div class="border rounded-3 overflow-hidden">
                  <table class="table mb-0 align-middle">
                    <thead class="bg-light text-muted small">
                      <tr>
                        <th class="border-0 px-3 py-2">Mã NV</th>
                        <th class="border-0 py-2 w-75">Họ và Tên</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loadingAssigned">
                        <td colspan="2" class="text-center py-4 text-muted small">
                          <span class="spinner-border spinner-border-sm me-2"></span> Đang tải nhân sự...
                        </td>
                      </tr>
                      <tr v-else-if="assignedEmployees.length === 0">
                        <td colspan="2" class="text-center py-4 text-muted small">
                          Chưa có nhân viên nào được phân vào ca này hôm nay.
                        </td>
                      </tr>
                      <tr v-else v-for="emp in assignedEmployees" :key="emp.code">
                        <td class="px-3 py-2 fw-bold text-secondary small">{{ emp.code }}</td>
                        <td class="py-2 fw-medium text-dark small">
                          <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-person-circle fs-5 text-secondary"></i>
                            {{ emp.name }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="mt-3 text-muted" style="font-size: 12px; line-height: 1.5">
                  <i class="bi bi-info-circle text-primary me-1"></i>
                  <b>Gợi ý Admin:</b> Để thêm mới, xóa, thay thế người trực hoặc xử lý đơn xin nghỉ
                  phép/đổi ca, vui lòng chuyển sang tính năng
                  <span class="text-primary fw-bold">"Xếp lịch nhân viên"</span>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body" v-if="showConfirmModal">
      <div class="confirm-overlay">
        <div class="confirm-modal-card">
          <div class="confirm-icon-area">
            <i class="bi" :class="confirmConfig.icon"></i>
          </div>
          <h5 class="confirm-title">{{ confirmConfig.title }}</h5>
          <p class="confirm-message" v-html="confirmConfig.message"></p>
          <div class="confirm-actions">
            <button @click="showConfirmModal = false" class="btn-cancel-custom">Hủy bỏ</button>
            <button @click="executeConfirm" class="btn-confirm-custom">Xác nhận</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

// --- TOAST & CONFIRM MODAL LOGIC ---
const toastMessage = ref('')
const toastType = ref('success')
const showToast = ref(false)

const displayToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const showConfirmModal = ref(false)
const confirmConfig = ref({ title: '', message: '', icon: '', action: null })

const openConfirm = (title, message, icon, actionFunc) => {
  confirmConfig.value = { title, message, icon, action: actionFunc }
  showConfirmModal.value = true
}

const executeConfirm = async () => {
  showConfirmModal.value = false
  if (confirmConfig.value.action) {
    await confirmConfig.value.action()
  }
}

// --- STATE & API FETCH LOGIC ---
const shifts = ref([])
const filters = reactive({ keyword: '', trangThai: '', gioBatDau: '', gioKetThuc: '' })

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)

onMounted(() => {
  fetchShifts()
})

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return timeStr.substring(0, 5)
}

// Lấy dữ liệu từ Backend SQL
const fetchShifts = async () => {
  try {
    const url = new URL('http://localhost:8080/api/ca-lam-viec')
    url.searchParams.append('page', currentPage.value - 1)
    url.searchParams.append('size', itemsPerPage.value)

    if (filters.keyword) url.searchParams.append('keyword', filters.keyword)
    if (filters.trangThai !== '') url.searchParams.append('trangThai', filters.trangThai)
    if (filters.gioBatDau) url.searchParams.append('gioBatDau', filters.gioBatDau)
    if (filters.gioKetThuc) url.searchParams.append('gioKetThuc', filters.gioKetThuc)

    const response = await fetch(url)
    if (!response.ok) throw new Error('Lỗi tải dữ liệu')
    const data = await response.json()

    if (data && data.content) {
      shifts.value = data.content
      totalPages.value = data.totalPages
      totalElements.value = data.totalElements
    } else if (Array.isArray(data)) {
      shifts.value = data
      totalElements.value = data.length
      totalPages.value = 1
    } else {
      shifts.value = []
    }
  } catch (error) {
    console.error('Lỗi khi fetch API:', error)
  }
}

// Lắng nghe thay đổi bộ lọc
let filterTimeout = null
watch(
  () => filters,
  () => {
    if (filters.gioBatDau && filters.gioKetThuc) {
      if (filters.gioBatDau >= filters.gioKetThuc) {
        displayToast('Giờ kết thúc của bộ lọc phải lớn hơn giờ bắt đầu!', 'danger')
        filters.gioKetThuc = ''
        return
      }
    }

    clearTimeout(filterTimeout)
    filterTimeout = setTimeout(() => {
      currentPage.value = 1
      fetchShifts()
    }, 400)
  },
  { deep: true },
)

const clearFilter = () => {
  filters.keyword = ''
  filters.trangThai = ''
  filters.gioBatDau = ''
  filters.gioKetThuc = ''
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchShifts()
  }
}

watch(itemsPerPage, () => {
  currentPage.value = 1
  fetchShifts()
})

// --- THAY ĐỔI TRẠNG THÁI CA (CALL API PUT) ---
const triggerToggleStatus = (shift) => {
  const isActivating = shift.trangThai === 0 || shift.trangThai === false
  const newStatusText = isActivating ? 'đang hoạt động' : 'ngừng hoạt động'

  let msg = `Bạn có chắc chắn muốn đổi trạng thái thành <strong class="${isActivating ? 'text-success' : 'text-danger'}">${newStatusText}</strong> cho ca làm việc: <strong class="text-dark">[${shift.tenCa}]</strong> không?`

  if (!isActivating) {
    msg += `<br><br><span class="text-danger small"><i class="bi bi-exclamation-triangle"></i> <b>Lưu ý hệ thống:</b> Khi ca này ngừng hoạt động, Admin sẽ <b>không thể phân công</b> nhân viên vào ca này trong tương lai.</span>`
  }

  openConfirm('Xác Nhận Đổi Trạng Thái', msg, 'bi-person-gear', () =>
    toggleStatusApi(shift, isActivating ? 1 : 0),
  )
}

const toggleStatusApi = async (shift, newStatus) => {
  try {
    const payload = { ...shift, trangThai: newStatus }
    const res = await fetch(`http://localhost:8080/api/ca-lam-viec/${shift.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      displayToast(`Cập nhật trạng thái thành công! Dữ liệu đã lưu vào hệ thống.`, 'success')
      fetchShifts()
    } else {
      displayToast('Thao tác thất bại!', 'danger')
    }
  } catch (error) {
    console.error(error)
  }
}

// --- MODULE THÊM & SỬA CA LÀM VIỆC ---
const isEditMode = ref(false)
const loadingAssigned = ref(false)
const errors = ref({})
const shiftForm = ref({
  id: null,
  tenCa: '',
  gioBatDau: '',
  gioKetThuc: '',
  moTa: '',
  trangThai: 1,
})
const assignedEmployees = ref([])

const clearError = (field) => {
  if (errors.value[field]) delete errors.value[field]
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!shiftForm.value.tenCa?.trim()) {
    errors.value.tenCa = 'Vui lòng nhập tên ca làm việc'
    isValid = false
  }

  if (!shiftForm.value.gioBatDau) {
    errors.value.gioBatDau = 'Vui lòng chọn giờ bắt đầu'
    isValid = false
  }

  if (!shiftForm.value.gioKetThuc) {
    errors.value.gioKetThuc = 'Vui lòng chọn giờ kết thúc'
    isValid = false
  }

  if (shiftForm.value.gioBatDau && shiftForm.value.gioKetThuc) {
    if (shiftForm.value.gioBatDau >= shiftForm.value.gioKetThuc) {
      errors.value.gioKetThuc = 'Giờ kết thúc phải lớn hơn giờ bắt đầu (Ca làm trong ngày)'
      isValid = false
    }
  }

  return isValid
}

const openAddModal = () => {
  isEditMode.value = false
  errors.value = {}
  shiftForm.value = { id: null, tenCa: '', gioBatDau: '', gioKetThuc: '', moTa: '', trangThai: 1 }
}

// Gọi API động lấy danh sách người trực hôm nay khi mở Modal xem chi tiết
const fetchAssignedEmployees = async (shiftId) => {
  loadingAssigned.value = true
  assignedEmployees.value = []
  try {
    // Lấy ngày hiện tại hệ thống theo chuẩn YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]
    
    const res = await fetch(`http://localhost:8080/api/lich-lam-viec/employees-by-shift?shiftId=${shiftId}&date=${today}`)
    if (res.ok) {
      const data = await res.json()
      // Map khớp chính xác với cấu trúc hiển thị { code, name }
      assignedEmployees.value = data.map(item => ({
        code: item.ma_nhan_vien || item.maNhanVien,
        name: item.ho_ten_nhan_vien || item.hoTenNhanVien
      }))
    }
  } catch (error) {
    console.error('Lỗi tải danh sách nhân viên trực ca:', error)
  } finally {
    loadingAssigned.value = false
  }
}

const openEditModal = (shift) => {
  isEditMode.value = true
  errors.value = {}
  shiftForm.value = {
    ...shift,
    gioBatDau: formatTime(shift.gioBatDau),
    gioKetThuc: formatTime(shift.gioKetThuc),
  }

  // Chạy hàm lấy danh sách nhân sự thực tế từ DB
  fetchAssignedEmployees(shift.id)
}

const triggerSaveShift = () => {
  if (!validateForm()) return

  const actionText = isEditMode.value ? 'cập nhật thay đổi' : 'thêm mới'
  let warningMsg = `Bạn có chắc chắn muốn ${actionText} ca làm việc <strong class="text-dark">${shiftForm.value.tenCa}</strong> không?`

  if (isEditMode.value) {
    warningMsg += `<br><br><span class="text-danger small"><i class="bi bi-exclamation-triangle"></i> <b>Lưu ý hệ thống:</b> Việc thay đổi cấu trúc giờ của ca này sẽ được cập nhật đồng loạt lên toàn bộ lịch phân ca của nhân viên!</span>`
  }

  openConfirm(
    isEditMode.value ? 'Xác Nhận Cập Nhật' : 'Xác Nhận Thêm Mới',
    warningMsg,
    isEditMode.value ? 'bi-pencil-square' : 'bi-calendar-plus',
    () => saveShiftApi(),
  )
}

const saveShiftApi = async () => {
  const method = isEditMode.value ? 'PUT' : 'POST'
  const url = isEditMode.value
    ? `http://localhost:8080/api/ca-lam-viec/${shiftForm.value.id}`
    : 'http://localhost:8080/api/ca-lam-viec'

  try {
    const payload = { ...shiftForm.value }
    if (payload.gioBatDau.length === 5) payload.gioBatDau += ':00'
    if (payload.gioKetThuc.length === 5) payload.gioKetThuc += ':00'

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      displayToast(
        isEditMode.value
          ? 'Cập nhật thành công! Dữ liệu đã lưu vào DB.'
          : 'Thêm mới thành công! Dữ liệu đã lưu vào DB.',
        'success',
      )
      document.getElementById('hiddenCloseModalBtn').click()
      fetchShifts()
    } else {
      displayToast('Thao tác thất bại, vui lòng kiểm tra lại!', 'danger')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
/* Giữ nguyên phần CSS ban đầu của bạn */
.custom-table thead th { background-color: #dfd1c4 !important; color: #5a4031 !important; letter-spacing: 0.5px; font-size: 0.85rem; }
.custom-table tbody tr:nth-child(even) { background-color: #f6f6f6; }
.custom-table tbody tr:hover { background-color: #f1f5f9; }
.custom-switch { width: 2.5em; height: 1.25em; }
.custom-switch:checked { background-color: #0d6efd; border-color: #0d6efd; }
.custom-switch:focus { box-shadow: none; }
.action-icon { transition: transform 0.2s; cursor: pointer; }
.action-icon:hover { transform: scale(1.2); }
.is-invalid { border-color: #dc3545 !important; background-image: none !important; }
.custom-toast-container { position: fixed; top: 70px; right: 20px; z-index: 9999; }
.custom-toast { background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; gap: 12px; min-width: 280px; border-left: 4px solid transparent; }
.custom-toast.border-success { border-left-color: #198754; }
.custom-toast.border-danger { border-left-color: #dc3545; }
.toast-message-text { color: #333333; font-size: 14px; font-weight: 400; }
.confirm-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 99999; backdrop-filter: blur(3px); }
.confirm-modal-card { background: white; padding: 30px; border-radius: 16px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); animation: modalFadeIn 0.25s ease-out; }
.confirm-icon-area { font-size: 45px; color: #8a6d5b; margin-bottom: 15px; }
.confirm-title { font-weight: 700; color: #5a4031; margin-bottom: 10px; }
.confirm-message { font-size: 14px; color: #6c757d; line-height: 1.6; margin-bottom: 25px; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }
.btn-cancel-custom { background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; padding: 8px 24px; border-radius: 50px; font-weight: 500; cursor: pointer; }
.btn-confirm-custom { background-color: #ebdcd0; color: #5a4031; border: 1px solid #cbb3a1; padding: 8px 24px; border-radius: 50px; font-weight: 600; cursor: pointer; }
.btn-confirm-custom:hover { background-color: #dccbc0; transform: translateY(-1px); }
@keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
</style>