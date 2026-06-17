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

    <div class="mb-4">
      <h4 class="fw-bold mb-1" style="color: #3d211a">Quản Lý Ca Làm Việc</h4>
      <span class="text-muted small">Trang chủ | Lịch làm việc | Quản lý ca</span>
    </div>

    <template v-if="viewState === 'LIST'">
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
                  v-model="filters.search"
                  type="text"
                  class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle py-2"
                  placeholder="Tìm theo tên ca..."
                />
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label text-muted small mb-1">Trạng thái</label>
              <select
                v-model="filters.status"
                class="form-select rounded-pill shadow-none border-secondary-subtle text-muted py-2 px-3"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label text-muted small mb-1">Thời gian bắt đầu</label>
              <input
                type="time"
                class="form-control rounded-pill shadow-none border-secondary-subtle text-muted py-2 px-3"
                v-model="filters.startTime"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label text-muted small mb-1">Thời gian kết thúc</label>
              <input
                type="time"
                class="form-control rounded-pill shadow-none border-secondary-subtle text-muted py-2 px-3"
                v-model="filters.endTime"
              />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-3 mt-4 pt-2">
            <button
              @click="resetFilters"
              class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-none small fw-medium d-flex align-items-center gap-2"
              style="border-color: #d1d5db; color: #4b5563"
            >
              <i class="bi bi-arrow-clockwise"></i> Đặt lại bộ lọc
            </button>
            <button
              class="btn rounded-pill px-4 py-2 shadow-none small fw-medium d-flex align-items-center gap-2 text-dark"
              style="background-color: #dfd1c4"
              data-bs-toggle="modal"
              data-bs-target="#addShiftModal"
              @click="openAddModule"
            >
              <i class="bi bi-plus-lg"></i> Thêm ca làm việc
            </button>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table
              class="table align-middle text-nowrap custom-table mb-0"
              style="font-size: 0.9rem"
            >
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
                <tr v-if="paginatedShifts.length === 0">
                  <td colspan="6" class="text-center py-5 text-danger fw-medium">
                    <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không tìm thấy ca làm việc nào phù hợp với bộ lọc.
                  </td>
                </tr>

                <tr v-for="(shift, index) in paginatedShifts" :key="shift.id">
                  <td class="py-3 px-3 text-center text-dark">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="py-3 px-3 text-dark fw-bold">{{ shift.name }}</td>
                  <td class="py-3 px-3 text-center text-dark">{{ shift.startTime }}</td>
                  <td class="py-3 px-3 text-center text-dark">{{ shift.endTime }}</td>
                  <td class="py-3 px-3 text-center">
                    <span
                      v-if="shift.status === 'Đang hoạt động'"
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
                          :checked="shift.status === 'Đang hoạt động'"
                          @click.prevent="triggerToggleStatus(shift)"
                          style="cursor: pointer"
                        />
                      </div>
                      <i
                        class="bi bi-eye fs-5 text-primary action-icon"
                        title="Xem chi tiết & Cập nhật"
                        @click="openEditPage(shift)"
                      ></i>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="filteredShifts.length > 0"
            class="d-flex justify-content-between align-items-center p-4 border-top text-muted small flex-wrap gap-3"
          >
            <div>
              Hiển thị <span class="fw-bold text-dark">{{ paginatedShifts.length }}</span> /
              <span class="fw-bold text-dark">{{ filteredShifts.length }}</span> bản ghi
            </div>

            <div class="d-flex gap-1 align-items-center">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="btn btn-sm btn-light border shadow-none px-2 rounded"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
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
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="btn btn-sm btn-light border shadow-none px-2 rounded"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <div class="d-flex align-items-center gap-2">
              <select
                v-model="itemsPerPage"
                @change="currentPage = 1"
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
    </template>

    <template v-else>
      <div class="mb-4">
        <a
          href="#"
          @click.prevent="goBack"
          class="text-decoration-none text-secondary small fw-bold d-flex align-items-center gap-2"
        >
          <i class="bi bi-chevron-left"></i> Quay lại danh sách ca làm việc
        </a>
      </div>

      <div class="row g-4">
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="card-body p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom"
              >
                <h6 class="fw-bold m-0" style="color: #5a4031">
                  <i class="bi bi-clock-history me-2"></i>THÔNG TIN CA LÀM VIỆC
                </h6>
                <div class="form-check form-switch mb-0 d-flex align-items-center gap-2">
                  <label
                    class="form-check-label small fw-medium"
                    :class="editForm.status === 'Đang hoạt động' ? 'text-primary' : 'text-danger'"
                  >
                    {{ editForm.status }}
                  </label>
                  <input
                    class="form-check-input shadow-none custom-switch"
                    type="checkbox"
                    role="switch"
                    :checked="editForm.status === 'Đang hoạt động'"
                    @change="
                      editForm.status =
                        editForm.status === 'Đang hoạt động' ? 'Ngừng hoạt động' : 'Đang hoạt động'
                    "
                  />
                </div>
              </div>

              <div class="row g-4">
                <div class="col-12">
                  <label class="form-label small fw-bold mb-1 text-muted"
                    >Tên ca làm việc <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control rounded-3 shadow-none py-2"
                    :class="{ 'is-invalid': errors.name }"
                    placeholder="VD: Ca sáng..."
                    v-model="editForm.name"
                    @input="clearError('name')"
                  />
                  <div class="invalid-feedback">{{ errors.name }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-1 text-muted"
                    >Giờ bắt đầu <span class="text-danger">*</span></label
                  >
                  <input
                    type="time"
                    class="form-control rounded-3 shadow-none py-2"
                    :class="{ 'is-invalid': errors.startTime }"
                    v-model="editForm.startTime"
                    @input="clearError('startTime')"
                  />
                  <div class="invalid-feedback">{{ errors.startTime }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-1 text-muted"
                    >Giờ kết thúc <span class="text-danger">*</span></label
                  >
                  <input
                    type="time"
                    class="form-control rounded-3 shadow-none py-2"
                    :class="{ 'is-invalid': errors.endTime }"
                    v-model="editForm.endTime"
                    @input="clearError('endTime')"
                  />
                  <div class="invalid-feedback">{{ errors.endTime }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold mb-1 text-muted">Mô tả / Ghi chú</label>
                  <textarea
                    class="form-control rounded-3 shadow-none border-secondary-subtle py-2"
                    rows="4"
                    placeholder="Nhập thông tin mô tả chi tiết ca làm việc..."
                    v-model="editForm.description"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h6 class="fw-bold m-0" style="color: #5a4031">
                <i class="bi bi-people-fill me-2"></i>NHÂN VIÊN THƯỜNG TRỰC CA NÀY
              </h6>
            </div>
            <div class="card-body p-0">
              <table class="table mb-0 align-middle">
                <thead class="bg-light text-muted small">
                  <tr>
                    <th class="border-0 px-4 py-2">Mã NV</th>
                    <th class="border-0 py-2 w-75">Họ và Tên</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="assignedEmployees.length === 0">
                    <td colspan="2" class="text-center py-4 text-muted small">
                      Chưa có nhân viên nào được phân công.
                    </td>
                  </tr>
                  <tr v-for="emp in assignedEmployees" :key="emp.code">
                    <td class="px-4 py-3 fw-bold text-secondary">{{ emp.code }}</td>
                    <td class="py-3 fw-medium text-dark">
                      <div class="d-flex align-items-center gap-2">
                        <div
                          class="rounded-circle bg-secondary"
                          style="width: 25px; height: 25px; display: inline-block"
                        ></div>
                        {{ emp.name }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer bg-white text-center border-top-0 pb-4">
              <button
                class="btn btn-sm btn-outline-secondary rounded-pill px-4"
                @click="router.push('/lich-lam-viec')"
              >
                <i class="bi bi-calendar-week me-1"></i> Tới trang Xếp lịch để cấu hình
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-3 mt-4 mb-5 pb-5">
        <button
          type="button"
          class="btn btn-light border px-4 py-2 rounded-pill fw-medium shadow-none text-muted"
          @click="goBack"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          class="btn text-dark px-5 py-2 rounded-pill fw-bold shadow-sm"
          style="background-color: #dfd1c4"
          @click="triggerEditShift"
        >
          Lưu cập nhật
        </button>
      </div>
    </template>

    <div class="modal fade" id="addShiftModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 bg-white">
          <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
            <h5 class="modal-title fw-bold" style="color: #3d211a">Thêm mới ca làm việc</h5>
            <button
              type="button"
              class="btn-close shadow-none"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="closeModalBtn"
            ></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="triggerAddShift">
              <div class="mb-3">
                <label class="form-label fw-bold small text-muted"
                  >Tên ca <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control shadow-none py-2 rounded-3"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="VD: Ca Sáng, Ca Chiều..."
                  v-model="newShift.name"
                  @input="clearError('name')"
                />
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label fw-bold small text-muted"
                    >Thời gian bắt đầu <span class="text-danger">*</span></label
                  >
                  <input
                    type="time"
                    class="form-control shadow-none py-2 rounded-3"
                    :class="{ 'is-invalid': errors.startTime }"
                    v-model="newShift.startTime"
                    @input="clearError('startTime')"
                  />
                  <div class="invalid-feedback">{{ errors.startTime }}</div>
                </div>
                <div class="col-6">
                  <label class="form-label fw-bold small text-muted"
                    >Thời gian kết thúc <span class="text-danger">*</span></label
                  >
                  <input
                    type="time"
                    class="form-control shadow-none py-2 rounded-3"
                    :class="{ 'is-invalid': errors.endTime }"
                    v-model="newShift.endTime"
                    @input="clearError('endTime')"
                  />
                  <div class="invalid-feedback">{{ errors.endTime }}</div>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold small text-muted">Mô tả</label>
                <textarea
                  class="form-control shadow-none border-secondary-subtle py-2 rounded-3"
                  rows="3"
                  placeholder="Ghi chú thêm về ca làm việc này..."
                  v-model="newShift.description"
                ></textarea>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary rounded-pill px-4 shadow-none fw-medium"
                  data-bs-dismiss="modal"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="btn px-4 py-2 fw-medium rounded-pill text-dark"
                  style="background-color: #dccbc0; border: none"
                >
                  Lưu ca làm việc
                </button>
              </div>
            </form>
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ==============================================
// 1. TOAST & CONFIRM MODAL (CHUẨN ẢNH GỬI)
// ==============================================
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

const executeConfirm = () => {
  showConfirmModal.value = false
  if (confirmConfig.value.action) confirmConfig.value.action()
}

// ==============================================
// 2. DỮ LIỆU & QUẢN LÝ VIEW STATE
// ==============================================
const viewState = ref('LIST') // 'LIST' hoặc 'EDIT'

const shifts = ref([
  {
    id: 1,
    name: 'Ca sáng',
    startTime: '08:00',
    endTime: '12:00',
    status: 'Đang hoạt động',
    description: 'Ca làm việc buổi sáng hành chính.',
  },
  {
    id: 2,
    name: 'Ca chiều',
    startTime: '12:00',
    endTime: '17:00',
    status: 'Đang hoạt động',
    description: 'Ca làm việc buổi chiều hành chính.',
  },
  {
    id: 3,
    name: 'Ca tối',
    startTime: '17:00',
    endTime: '23:00',
    status: 'Đang hoạt động',
    description: 'Ca tăng cường buổi tối.',
  },
  {
    id: 4,
    name: 'Ca gãy sáng (T7, CN)',
    startTime: '12:15',
    endTime: '15:15',
    status: 'Ngừng hoạt động',
    description: 'Dành riêng cho nhân viên Part-time.',
  },
])

const filters = reactive({ search: '', status: '', startTime: '', endTime: '' })
const currentPage = ref(1)
const itemsPerPage = ref(5)

const newShift = reactive({ name: '', startTime: '', endTime: '', description: '' })
const editForm = reactive({
  id: null,
  name: '',
  startTime: '',
  endTime: '',
  status: '',
  description: '',
})
const assignedEmployees = ref([])

const errors = ref({})
const clearError = (field) => {
  if (errors.value[field]) delete errors.value[field]
}

// ==============================================
// 3. LOGIC XỬ LÝ DANH SÁCH & PHÂN TRANG
// ==============================================
const filteredShifts = computed(() => {
  return shifts.value.filter((shift) => {
    const matchSearch =
      !filters.search || shift.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchStatus = !filters.status || shift.status === filters.status
    const matchStartTime = !filters.startTime || shift.startTime === filters.startTime
    const matchEndTime = !filters.endTime || shift.endTime === filters.endTime
    return matchSearch && matchStatus && matchStartTime && matchEndTime
  })
})

const totalPages = computed(() => Math.ceil(filteredShifts.value.length / itemsPerPage.value) || 1)
const paginatedShifts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredShifts.value.slice(start, start + itemsPerPage.value)
})

const resetFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.startTime = ''
  filters.endTime = ''
  currentPage.value = 1
}

// ==============================================
// 4. HÀNH ĐỘNG GIAO DIỆN
// ==============================================

// Nút Đổi trạng thái trực tiếp ở bảng
const triggerToggleStatus = (shift) => {
  const isActivating = shift.status === 'Ngừng hoạt động'
  const newStatusText = isActivating ? 'đang hoạt động' : 'ngừng hoạt động'

  openConfirm(
    'Xác Nhận Đổi Trạng Thái',
    `Bạn có chắc chắn muốn đổi trạng thái thành <strong>${newStatusText}</strong> cho ca làm việc:<br><strong class="text-dark">[${shift.name}] (${shift.startTime} - ${shift.endTime})</strong> không?`,
    'bi-person-gear', // Icon khớp file ảnh
    () => {
      shift.status = isActivating ? 'Đang hoạt động' : 'Ngừng hoạt động'
      displayToast(`Cập nhật trạng thái thành công!`, 'success')
    },
  )
}

// Mở Module Thêm Mới
const closeModalBtn = ref(null)
const openAddModule = () => {
  errors.value = {}
  newShift.name = ''
  newShift.startTime = ''
  newShift.endTime = ''
  newShift.description = ''
}

// Validate & Lưu Thêm mới
const triggerAddShift = () => {
  errors.value = {}
  let isValid = true
  if (!newShift.name) {
    errors.value.name = 'Vui lòng nhập tên ca làm việc'
    isValid = false
  }
  if (!newShift.startTime) {
    errors.value.startTime = 'Vui lòng chọn giờ bắt đầu'
    isValid = false
  }
  if (!newShift.endTime) {
    errors.value.endTime = 'Vui lòng chọn giờ kết thúc'
    isValid = false
  }

  if (!isValid) return

  // Nếu hợp lệ, đóng modal bootstrap trước khi gọi confirm modal
  if (closeModalBtn.value) closeModalBtn.value.click()

  openConfirm(
    'Xác Nhận Thêm Ca',
    `Bạn có chắc chắn muốn thêm mới ca làm việc:<br><strong class="text-dark">${newShift.name} (${newShift.startTime} - ${newShift.endTime})</strong> không?`,
    'bi-calendar-plus',
    () => {
      shifts.value.unshift({ id: Date.now(), ...newShift, status: 'Đang hoạt động' })
      displayToast('Đã lưu thành công ca làm việc mới!', 'success')
    },
  )
}

// Mở Trang Cập nhật (View 2)
const openEditPage = (shift) => {
  errors.value = {}
  Object.assign(editForm, shift)

  // Fake data nhân viên để demo giống Lịch Làm Việc
  if (shift.name.includes('sáng')) {
    assignedEmployees.value = [
      { code: 'NV2367', name: 'Dương Đức Tùng' },
      { code: 'NV32512', name: 'Khánh Chi' },
    ]
  } else if (shift.name.includes('chiều')) {
    assignedEmployees.value = [{ code: 'NV2367', name: 'Dương Đức Tùng' }]
  } else {
    assignedEmployees.value = [
      { code: 'NV42022', name: 'Vũ Thành Hải Phong' },
      { code: 'NV98643', name: 'Anh Tuyết' },
    ]
  }

  viewState.value = 'EDIT'
  window.scrollTo(0, 0)
}

const goBack = () => {
  viewState.value = 'LIST'
}

// Validate & Lưu Cập nhật
const triggerEditShift = () => {
  errors.value = {}
  let isValid = true
  if (!editForm.name) {
    errors.value.name = 'Vui lòng nhập tên ca làm việc'
    isValid = false
  }
  if (!editForm.startTime) {
    errors.value.startTime = 'Vui lòng chọn giờ bắt đầu'
    isValid = false
  }
  if (!editForm.endTime) {
    errors.value.endTime = 'Vui lòng chọn giờ kết thúc'
    isValid = false
  }

  if (!isValid) {
    displayToast('Vui lòng kiểm tra lại các trường bắt buộc (*)', 'danger')
    return
  }

  openConfirm(
    'Xác Nhận Cập Nhật',
    `Bạn có chắc chắn muốn lưu các thay đổi cho ca làm việc <strong>${editForm.name}</strong> không?`,
    'bi-pencil-square',
    () => {
      const index = shifts.value.findIndex((s) => s.id === editForm.id)
      if (index !== -1) shifts.value[index] = { ...editForm }
      displayToast('Cập nhật thông tin ca làm việc thành công!', 'success')
      goBack()
    },
  )
}
</script>

<style scoped>
/* ==============================================
   CSS CHO BẢNG & COMPONENT CHUNG
   ============================================== */
.custom-table thead th {
  background-color: #dfd1c4 !important;
  color: #5a4031 !important;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
}
.custom-table tbody tr:nth-child(even) {
  background-color: #f6f6f6;
}
.custom-table tbody tr:hover {
  background-color: #f1f5f9;
}

.custom-switch {
  width: 2.5em;
  height: 1.25em;
}
.custom-switch:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.custom-switch:focus {
  box-shadow: none;
}

.action-icon {
  transition: transform 0.2s;
  cursor: pointer;
}
.action-icon:hover {
  transform: scale(1.2);
}

/* Bổ sung viền input khi lỗi */
.is-invalid {
  border-color: #dc3545 !important;
  background-image: none !important;
}

/* ==============================================
   CSS TOAST THÔNG BÁO
   ============================================== */
.custom-toast-container {
  position: fixed;
  top: 70px;
  right: 20px;
  z-index: 9999;
}
.custom-toast {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  border-left: 4px solid transparent;
}
.custom-toast.border-success {
  border-left-color: #198754;
}
.custom-toast.border-danger {
  border-left-color: #dc3545;
}
.toast-message-text {
  color: #333333;
  font-size: 14px;
}

/* ==============================================
   CSS HỘP THOẠI CONFIRM MODAL (Chuẩn ảnh gửi)
   ============================================== */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(3px);
}
.confirm-modal-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.25s ease-out;
}
.confirm-icon-area {
  font-size: 45px;
  color: #8a6d5b;
  margin-bottom: 15px;
}
.confirm-title {
  font-weight: 700;
  color: #5a4031;
  margin-bottom: 10px;
}
.confirm-message {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 25px;
}
.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn-cancel-custom {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel-custom:hover {
  background: #e2e8f0;
}
.btn-confirm-custom {
  background-color: #ebdcd0;
  color: #5a4031;
  border: 1px solid #cbb3a1;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-custom:hover {
  background-color: #dccbc0;
  transform: translateY(-1px);
}
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
