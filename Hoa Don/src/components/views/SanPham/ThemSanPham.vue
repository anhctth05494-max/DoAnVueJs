<template>
  <div class="mx-auto my-2 page-form-container" style="max-width: 1200px; padding: 0 10px">
    <div
      v-if="showToast"
      class="position-fixed top-0 end-0 p-3"
      style="z-index: 1055; margin-top: 60px"
    >
      <div
        class="toast show align-items-center text-white border-0 shadow-lg"
        :class="toastType === 'success' ? 'bg-success' : 'bg-danger'"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body fw-medium px-3 py-2">
            <i
              :class="
                toastType === 'success'
                  ? 'bi bi-check-circle-fill'
                  : 'bi bi-exclamation-triangle-fill'
              "
              class="me-2 fs-5 align-middle"
            ></i>
            {{ toastMessage }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-3 m-auto"
            @click="showToast = false"
          ></button>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center mb-3">
      <button
        @click="$router.back()"
        class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
      >
        <i class="bi bi-chevron-left"></i>
        <span class="fw-semibold text-dark" style="font-size: 14px">Danh sách sản phẩm</span>
      </button>
    </div>

    <div class="custom-card mb-4 bg-white">
      <h6 class="section-title text-uppercase">+ Thông tin chung sản phẩm</h6>
      <div class="row g-3 mt-1">
        <div class="col-md-4">
          <label class="form-label">Tên sản phẩm *</label>
          <input
            v-model="form.tenSanPham"
            :class="{ 'border-danger-input': form.hasErrorTen }"
            @input="form.hasErrorTen = false"
            class="form-control"
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Mã sản phẩm *</label>
          <input
            v-model="form.maSanPham"
            :class="{ 'border-danger-input': form.hasErrorMa }"
            @input="form.hasErrorMa = false"
            class="form-control"
            placeholder="Nhập mã sản phẩm"
          />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-bold">Thương hiệu *</label>
         <SelectThongMinh
  v-model="productForm.idThuongHieu"
  :items="dataDB.thuongHieus"
  labelKey="tenThuongHieu"
  title="Thương hiệu"
  apiEndpoint="http://localhost:8080/api/thuong-hieu"
  @refresh="fetchThuongHieu"
  @toast="(msg, type) => triggerToast(msg, type)" 
/>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-bold">Danh mục *</label>
         <SelectThongMinh
  v-model="productForm.idDanhMuc"
  :items="dataDB.danhMucs"
  labelKey="tenDanhMuc"
  title="Danh mục"
  apiEndpoint="http://localhost:8080/api/danh-muc"
  @refresh="fetchDanhMuc"
  @toast="(msg, type) => triggerToast(msg, type)" 
/>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-bold">Chất liệu *</label>
        <SelectThongMinh
  v-model="productForm.idChatLieu"
  :items="dataDB.chatLieus"
  labelKey="tenChatLieu"
  title="Chất liệu"
  apiEndpoint="http://localhost:8080/api/chat-lieu"
  @refresh="fetchChatLieu"
  @toast="(msg, type) => triggerToast(msg, type)" 
/>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-bold">Kiểu dáng *</label>
         <SelectThongMinh
  v-model="productForm.idKieuDang"
  :items="dataDB.kieuDangs"
  labelKey="tenKieuDang"
  title="Kiểu dáng"
  apiEndpoint="http://localhost:8080/api/kieu-dang"
  @refresh="fetchKieuDang"
  @toast="(msg, type) => triggerToast(msg, type)" 
/>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-bold">Cổ áo *</label>
          <SelectThongMinh
  v-model="productForm.idCoAo"
  :items="dataDB.coAos"
  labelKey="tenCoAo"
  title="Cổ áo"
  apiEndpoint="http://localhost:8080/api/co-ao"
  @refresh="fetchCoAo"
  @toast="(msg, type) => triggerToast(msg, type)" 
/>

        </div>

        <div class="col-md-4">
          <label class="form-label fw-bold">Tay áo *</label>
         
<SelectThongMinh
  v-model="productForm.idTayAo"
  :items="dataDB.tayAos"
  labelKey="tenTayAo"
  title="Tay áo"
  apiEndpoint="http://localhost:8080/api/tay-ao"
  @refresh="fetchTayAo"
  @toast="(msg, type) => triggerToast(msg, type)" 
/>
        </div>

        <div class="col-md-12">
          <label class="form-label">Mô tả chi tiết</label>
          <textarea
            v-model="form.moTa"
            class="form-control"
            rows="3"
            placeholder="Nhập mô tả chi tiết cho sản phẩm áo dài..."
          ></textarea>
        </div>
      </div>
    </div>

    <div class="custom-card mb-4 bg-white">
      <h6 class="section-title text-uppercase">+ Màu sắc & Kích thước biến thể</h6>
      <div class="row mt-3 align-items-center">
        <div class="col-md-8">
          <div class="d-flex align-items-center mb-3">
            <label class="form-label me-3 mb-0 fw-semibold text-secondary" style="width: 80px"
              >Màu sắc *</label
            >
            <div class="d-flex flex-wrap gap-2 align-items-center position-relative">
              <button
                v-for="c in selected.colors"
                :key="c.id"
                @click="toggleSelection('colors', c)"
                class="btn pill-btn active"
              >
                {{ c.tenMau }} <i class="bi bi-x ms-1"></i>
              </button>
              <div class="dropdown-wrapper">
                <button
                  @click="uiState.showColorDrop = !uiState.showColorDrop"
                  class="btn pill-btn-add"
                >
                  <i class="bi bi-plus-lg"></i>
                </button>
                <div
                  v-if="uiState.showColorDrop"
                  class="custom-dropdown shadow rounded border bg-white"
                >
                  <div
                    v-for="item in dataDB.mauSacs"
                    :key="item.id"
                    @click="toggleSelection('colors', item)"
                    class="dropdown-item-custom"
                  >
                    <input
                      type="checkbox"
                      :checked="isItemSelected('colors', item)"
                      class="me-2 pointer-events-none"
                    />
                    {{ item.tenMau }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <label class="form-label me-3 mb-0 fw-semibold text-secondary" style="width: 80px"
              >Kích cỡ *</label
            >
            <div class="d-flex flex-wrap gap-2 align-items-center position-relative">
              <button
                v-for="s in selected.sizes"
                :key="s.id"
                @click="toggleSelection('sizes', s)"
                class="btn pill-btn active"
              >
                {{ s.tenKichCo }} <i class="bi bi-x ms-1"></i>
              </button>
              <div class="dropdown-wrapper">
                <button
                  @click="uiState.showSizeDrop = !uiState.showSizeDrop"
                  class="btn pill-btn-add"
                >
                  <i class="bi bi-plus-lg"></i>
                </button>
                <div
                  v-if="uiState.showSizeDrop"
                  class="custom-dropdown shadow rounded border bg-white"
                >
                  <div
                    v-for="item in dataDB.kichCos"
                    :key="item.id"
                    @click="toggleSelection('sizes', item)"
                    class="dropdown-item-custom"
                  >
                    <input
                      type="checkbox"
                      :checked="isItemSelected('sizes', item)"
                      class="me-2 pointer-events-none"
                    />
                    {{ item.tenKichCo }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex justify-content-end align-items-center mt-3 mt-md-0">
          <button @click="generateTable" class="btn btn-tao-bien-the shadow-sm">
            || TẠO BIẾN THỂ
          </button>
        </div>
      </div>
    </div>

    <div v-if="isTableGenerated">
      <div v-for="(group, colorId) in tableData" :key="colorId" class="variant-group mb-4 bg-white">
        <div class="variant-header d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <span class="color-indicator"></span>
            <span class="fw-bold text-dark">Danh sách sản phẩm màu: {{ group.color.tenMau }}</span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-light border small-btn" @click="resetGroup(colorId)">
              <i class="bi bi-arrow-counterclockwise"></i> Đặt lại
            </button>
            <button class="btn btn-sm btn-light border small-btn" @click="openQuickEdit(group)">
              <i class="bi bi-pencil-square"></i> Sửa nhanh
            </button>
          </div>
        </div>

        <div class="variant-body d-flex p-3 gap-4 flex-wrap flex-md-nowrap">
          <div class="flex-grow-1 table-responsive">
            <table class="table custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th style="width: 40px">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      v-model="group.selectAll"
                      @change="toggleAllSizes(group)"
                    />
                  </th>
                  <th>Kích cỡ</th>
                  <th>Số lượng</th>
                  <th>Giá bán (VNĐ)</th>
                  <th>Giá nhập (VNĐ)</th>
                  <th class="text-center">Xoá</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(variant, index) in group.variants" :key="variant.size.id">
                  <td>
                    <input type="checkbox" class="form-check-input" v-model="variant.selected" />
                  </td>
                  <td class="fw-medium">
                    <span class="border rounded px-3 py-1 bg-white" style="font-size: 13px">{{
                      variant.size.tenKichCo
                    }}</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control text-center custom-table-input"
                      v-model="variant.soLuong"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      :value="formatCurrency(variant.giaBan)"
                      @input="handleInput($event, variant, 'giaBan')"
                      class="form-control text-center custom-table-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      :value="formatCurrency(variant.giaNhap)"
                      @input="handleInput($event, variant, 'giaNhap')"
                      class="form-control text-center custom-table-input"
                    />
                  </td>
                  <td class="text-center">
                    <i
                      @click="group.variants.splice(index, 1)"
                      class="bi bi-trash3 text-danger cursor-pointer"
                    ></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="upload-section mt-3 mt-md-0">
            <div class="d-flex justify-content-between mb-2">
              <span class="fw-medium small">Ảnh sản phẩm</span>
              <span class="text-muted small">{{ group.images.length }} / 5 ảnh</span>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <div
                v-for="(img, idx) in group.images"
                :key="idx"
                class="img-preview rounded"
                :style="{ backgroundImage: 'url(' + img + ')' }"
              ></div>
              <div
                v-if="group.images.length < 5"
                @click="openImageModal(group)"
                class="upload-box rounded d-flex justify-content-center align-items-center border-dashed"
              >
                <i class="bi bi-plus-lg fs-4 text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-3 mt-4 mb-5">
      <button
        class="btn btn-outline-secondary px-4 rounded-pill bg-white"
        style="height: 38px; font-size: 14px"
        @click="$router.back()"
      >
        Huỷ bỏ
      </button>
      <button
        type="button"
        class="btn btn-hoan-tat px-4 rounded-pill"
        style="height: 38px; font-size: 14px"
        @click.prevent="submitToBackend"
      >
        Hoàn tất lưu sản phẩm
      </button>
    </div>

    <div v-if="modal.type === 'quickEdit'" class="custom-modal-overlay">
      <div class="custom-modal-content quick-edit-modal">
        <div class="custom-modal-header">
          <h6 class="m-0 fw-bold">Sửa nhanh màu: {{ modal.activeGroup.color.tenMau }}</h6>
        </div>
        <div class="modal-body p-4 bg-white">
          <p class="text-muted small mb-3 fw-medium">
            Đang áp dụng cho {{ selectedCount(modal.activeGroup) }} /
            {{ modal.activeGroup.variants.length }} phân loại size đã chọn
          </p>

          <div class="mb-3">
            <label class="form-label small">Số lượng *</label>
            <input type="number" v-model="quickEditForm.soLuong" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Giá nhập *</label>
            <input
              type="text"
              :value="formatCurrency(quickEditForm.giaNhap)"
              @input="handleInput($event, quickEditForm, 'giaNhap')"
              class="form-control"
            />
          </div>
          <div class="mb-4">
            <label class="form-label small">Giá bán *</label>
            <input
              type="text"
              :value="formatCurrency(quickEditForm.giaBan)"
              @input="handleInput($event, quickEditForm, 'giaBan')"
              class="form-control"
            />
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button @click="closeModal" class="btn btn-outline-secondary px-4 rounded-pill">
              Huỷ bỏ
            </button>
            <button @click="applyQuickEdit" class="btn btn-hoan-tat px-4 rounded-pill">
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'imageUpload'" class="custom-modal-overlay">
      <div class="custom-modal-content image-upload-modal">
        <div class="custom-modal-header">
          <h6 class="m-0 fw-bold">Quản lý ảnh cho màu: {{ modal.activeGroup.color.tenMau }}</h6>
        </div>
        <div class="modal-body p-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted small fw-medium"
              >Ảnh đã chọn ({{ modal.activeGroup.images.length }}/5)</span
            >

            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              multiple
              accept="image/*"
              class="d-none"
            />
            <button
              @click="triggerFileInput"
              class="btn btn-sm btn-hoan-tat rounded-pill"
              style="font-size: 12px; padding: 4px 12px"
            >
              <i class="bi bi-cloud-arrow-up"></i> Tải ảnh lên
            </button>
          </div>

          <div
            class="image-drop-zone border rounded p-3 mb-4 d-flex gap-2 flex-wrap bg-light"
            style="min-height: 150px"
          >
            <div
              v-for="(img, idx) in modal.activeGroup.images"
              :key="idx"
              class="img-preview rounded position-relative"
              :style="{ backgroundImage: 'url(' + img + ')' }"
            >
              <i
                @click="modal.activeGroup.images.splice(idx, 1)"
                class="bi bi-x-circle-fill text-danger position-absolute top-0 start-100 translate-middle cursor-pointer bg-white rounded-circle"
              ></i>
            </div>
            <div
              class="text-muted small w-100 text-center py-4"
              v-if="modal.activeGroup.images.length === 0"
            >
              Chưa có ảnh nào. Bấm "Tải ảnh lên" để cập nhật hình ảnh sản phẩm.
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button @click="closeModal" class="btn btn-hoan-tat px-4 rounded-pill">
              Đóng hoàn tất
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import SelectThongMinh from './SelectThongMinh.vue'

const refreshData = async (stateKey, url) => {
  try {
    const res = await axios.get(url)
    dataDB[stateKey] = res.data
  } catch (error) {
    console.error(`Lỗi refresh thuộc tính ${stateKey}:`, error)
  }
}

const refreshDataDanhMuc = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/danh-muc')
    danhMucList.value = res.data
  } catch (error) {
    console.error('Lỗi refresh danh mục:', error)
  }
}

const danhMucList = ref([])
const fetchDanhMuc = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/danh-muc')
    danhMucList.value = await response.json()
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error)
  }
}

onMounted(() => {
  fetchDanhMuc()
})

const router = useRouter()
const uiState = reactive({ showColorDrop: false, showSizeDrop: false })
const isTableGenerated = ref(false)
const dataDB = reactive({
  thuongHieus: [],
  chatLieus: [],
  danhMucs: [],
  kieuDangs: [],
  coAos: [],
  tayAos: [],
  mauSacs: [],
  kichCos: [],
})
const selected = reactive({ colors: [], sizes: [] })
const tableData = ref({})

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const strValue = value.toString().replace(/\./g, '')
  return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
const parseCurrency = (value) => {
  if (!value) return 0
  return parseInt(value.toString().replace(/\D/g, ''), 10) || 0
}

const fileInput = ref(null)
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach((file) => {
    if (modal.activeGroup.images.length < 5) {
      const reader = new FileReader()
      reader.onload = (e) => {
        modal.activeGroup.images.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  })
  event.target.value = null
}
const showToast = ref(false);
const toastType = ref('success');
const toastMessage = ref('');

const triggerToast = (message, type = 'danger') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000); // Tự ẩn sau 3 giây
};
onMounted(async () => {
  try {
    const [th, cl, dm, kd, ca, ta, ms, kc] = await Promise.all([
      axios.get('http://localhost:8080/api/thuong-hieu'),
      axios.get('http://localhost:8080/api/chat-lieu'),
      axios.get('http://localhost:8080/api/danh-muc'),
      axios.get('http://localhost:8080/api/kieu-dang'),
      axios.get('http://localhost:8080/api/co-ao'),
      axios.get('http://localhost:8080/api/tay-ao'),
      axios.get('http://localhost:8080/api/mau-sac'),
      axios.get('http://localhost:8080/api/kich-co'),
    ])

    dataDB.thuongHieus = th.data
    dataDB.chatLieus = cl.data
    dataDB.danhMucs = dm.data
    dataDB.kieuDangs = kd.data
    dataDB.coAos = ca.data
    dataDB.tayAos = ta.data
    dataDB.mauSacs = ms.data
    dataDB.kichCos = kc.data

    fetchAllProductsToCheck();
  } catch (error) {
    console.error('Lỗi kết nối Backend:', error)
  }
})

const handleInput = (event, object, key) => {
  const rawValue = event.target.value
  object[key] = parseCurrency(rawValue)
  event.target.value = formatCurrency(object[key])
}

const isItemSelected = (type, item) => selected[type].some((i) => i.id === item.id)
const toggleSelection = (type, item) => {
  const index = selected[type].findIndex((i) => i.id === item.id)
  if (index > -1) selected[type].splice(index, 1)
  else selected[type].push(item)
}

const generateTable = () => {
  if (selected.colors.length === 0 || selected.sizes.length === 0)
    return alert('Vui lòng chọn Màu và Size!')
  const newData = {}
  selected.colors.forEach((c) => {
    newData[c.id] = {
      color: c,
      images: [],
      selectAll: true,
      variants: selected.sizes.map((s) => ({
        size: s,
        selected: true,
        soLuong: '',
        giaNhap: '',
        giaBan: '',
      })),
    }
  })
  tableData.value = newData
  isTableGenerated.value = true
}

const modal = reactive({ type: null, activeGroup: null })
const quickEditForm = reactive({ soLuong: '', giaNhap: '', giaBan: '' })

const toggleAllSizes = (group) => {
  group.variants.forEach((v) => (v.selected = group.selectAll))
}
const selectedCount = (group) => group.variants.filter((v) => v.selected).length
const resetGroup = (colorId) => {
  tableData.value[colorId].variants.forEach((v) => {
    v.soLuong = ''
    v.giaNhap = ''
    v.giaBan = ''
  })
}

const openQuickEdit = (group) => {
  if (selectedCount(group) === 0) return alert('Vui lòng chọn ít nhất 1 size!')
  quickEditForm.soLuong = ''
  quickEditForm.giaNhap = ''
  quickEditForm.giaBan = ''
  modal.activeGroup = group
  modal.type = 'quickEdit'
}

const applyQuickEdit = () => {
  modal.activeGroup.variants.forEach((v) => {
    if (v.selected) {
      if (quickEditForm.soLuong !== '') v.soLuong = quickEditForm.soLuong
      if (quickEditForm.giaNhap !== '') v.giaNhap = quickEditForm.giaNhap
      if (quickEditForm.giaBan !== '') v.giaBan = quickEditForm.giaBan
    }
  })
  closeModal()
}

const openImageModal = (group) => {
  modal.activeGroup = group
  modal.type = 'imageUpload'
}
const closeModal = () => {
  modal.type = null
  modal.activeGroup = null
}
// Khai báo biến products để sửa lỗi "products is not defined"
const products = ref([])

// Hàm fetch danh sách sản phẩm hiện tại từ database về để đối chiếu
const fetchAllProductsToCheck = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/sanpham')
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách sản phẩm để kiểm tra trùng mã:', error)
  }
}

const submitToBackend = async () => {
  form.hasErrorTen = !form.tenSanPham
  form.hasErrorMa = !form.maSanPham
  form.hasErrorDanhMuc = !productForm.idDanhMuc

  // 1. Kiểm tra trống thông tin chung
  if (form.hasErrorTen || form.hasErrorMa || form.hasErrorDanhMuc) {
    triggerToast('Vui lòng nhập đủ các trường thông tin bắt buộc!')
    return
  }

  // 🔥 2. BỔ SUNG: Check trùng Mã sản phẩm ngay tại Frontend trước khi gọi API
  // Chuẩn hóa chữ thường và xóa khoảng trắng để so sánh chính xác tuyệt đối
  const maNhap = form.maSanPham.trim().toLowerCase();
  const isMaTrung = products.value.some(p => p.maSanPham && p.maSanPham.trim().toLowerCase() === maNhap);

  if (isMaTrung) {
    triggerToast('Mã sản phẩm đã tồn tại trên hệ thống! Vui lòng đổi mã khác.', 'danger');
    form.hasErrorMa = true; // Báo đỏ ô nhập mã sản phẩm
    return;
  }

  // 3. Kiểm tra mảng biến thể
  if (Object.keys(tableData.value).length === 0) {
    triggerToast('Vui lòng click tạo bảng sản phẩm biến thể!')
    return
  }

  const chiTietSanPhams = []
  let isInvalid = false

  Object.values(tableData.value).forEach((group) => {
    group.variants.forEach((v) => {
      if (v.selected) {
        const soLuongSo = v.soLuong !== '' && v.soLuong != null ? parseInt(v.soLuong.toString().replace(/\D/g, ''), 10) : NaN;
        const giaBanSo = v.giaBan !== '' && v.giaBan != null ? parseFloat(v.giaBan.toString().replace(/\./g, '')) : NaN;
        const giaNhapSo = v.giaNhap !== '' && v.giaNhap != null ? parseFloat(v.giaNhap.toString().replace(/\./g, '')) : 0;

        if (isNaN(soLuongSo) || soLuongSo < 0 || isNaN(giaBanSo) || giaBanSo < 0) {
          v.hasError = true
          isInvalid = true
        } else {
          v.hasError = false
          const maMau = group.color.maMau || 'M'
          const maSize = v.size.tenKichCo || 'S'

          chiTietSanPhams.push({
            mauSac: { id: group.color.id },
            kichCo: { id: v.size.id },
            coAo: productForm.idCoAo ? { id: productForm.idCoAo } : null, 
            tayAo: productForm.idTayAo ? { id: productForm.idTayAo } : null,
            soLuongTon: soLuongSo,
            giaBan: giaBanSo,
            giaNhap: giaNhapSo,
            maSku: `${form.maSanPham}_${maMau}_${maSize}`,
            hinhAnh: group.images.join(','),
            trangThai: 1,
          })
        }
      }
    })
  })

  if (isInvalid || chiTietSanPhams.length === 0) {
    triggerToast('Vui lòng nhập số lượng và giá bán hợp lệ trong bảng biến thể!')
    return
  }

  const payload = {
    tenSanPham: form.tenSanPham,
    maSanPham: form.maSanPham,
    moTaChiTiet: form.moTa,
    danhMuc: productForm.idDanhMuc ? { id: productForm.idDanhMuc } : null,
    thuongHieu: productForm.idThuongHieu ? { id: productForm.idThuongHieu } : null,
    chatLieu: productForm.idChatLieu ? { id: productForm.idChatLieu } : null,
    kieuDang: productForm.idKieuDang ? { id: productForm.idKieuDang } : null,
    trangThai: 1,
    chiTietSanPhams: chiTietSanPhams,
  }

  // 4. Tiến hành gửi request lên Server sau khi đã qua hết các vòng check độc lập
  try {
    const response = await axios.post('http://localhost:8080/api/sanpham/them', payload)
    triggerToast('Thêm sản phẩm thành công!', 'success')
    setTimeout(() => {
      router.push('/san-pham')
    }, 1000)
  } catch (error) {
    console.error(error)
    const errorData = error.response?.data;
    const errorString = typeof errorData === 'string' ? errorData : JSON.stringify(errorData) || '';

    // Dự phòng trường hợp lỗi trùng mã lọt lưới lên tận Backend
    if (errorString.includes('Duplicate entry') || error.response?.status === 400) {
      triggerToast('Mã sản phẩm đã tồn tại trên hệ thống! Vui lòng đổi mã khác.', 'danger')
    } else {
      triggerToast(errorData || 'Không thể lưu sản phẩm, vui lòng kiểm tra lại!')
    }
  }
}


    // 🔥 TUYỆT ĐỐI KHÔNG reset hay clear tableData ở đây để giữ nguyên giá tiền/số lượng cậu đã nhập
const fetchThuongHieu = () => refreshData('thuongHieus', 'http://localhost:8080/api/thuong-hieu')
const fetchChatLieu = () => refreshData('chatLieus', 'http://localhost:8080/api/chat-lieu')

const fetchKieuDang = () => refreshData('kieuDangs', 'http://localhost:8080/api/kieu-dang')
const fetchCoAo = () => refreshData('coAos', 'http://localhost:8080/api/co-ao')
const fetchTayAo = () => refreshData('tayAos', 'http://localhost:8080/api/tay-ao')
const fetchMauSac = () => refreshData('mauSacs', 'http://localhost:8080/api/mau-sac')
const fetchKichCo = () => refreshData('kichCos', 'http://localhost:8080/api/kich-co')
const productForm = reactive({
  tenSanPham: '',
  maSanPham: '',
  idThuongHieu: '',
  idDanhMuc: '',
  idChatLieu: '',
  idKieuDang: '',
  idCoAo: '',
  idTayAo: '',
  moTaChiTiet: ''
});

const form = reactive({
  tenSanPham: '',
  maSanPham: '',
  moTa: '',
  idThuongHieu: '',
  idChatLieu: '',
  idDanhMuc: '',
  idKieuDang: '',
  idCoAo: '',
  idTayAo: '',
  hasErrorTen: false,
  hasErrorMa: false,
  hasErrorDanhMuc: false,
})


</script>

<style scoped>
.form-control:focus,
.form-select:focus,
textarea:focus {
  border-color: #cbb3a1 !important;
  box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25) !important;
  outline: none;
}

.custom-card {
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.section-title {
  color: #5a4031;
  font-weight: 700;
  font-size: 14.5px;
  margin-bottom: 15px;
}

.form-label {
  font-size: 13px;
  color: #495057;
  font-weight: 500;
  margin-bottom: 6px;
}

.form-control {
  height: 38px;
  border-radius: 6px;
  font-size: 13.5px;
  border: 1px solid #dee2e6;
}

textarea.form-control {
  height: auto !important;
}

.pill-btn {
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 5px 16px;
  font-size: 13px;
  background: white;
  color: #495057;
  font-weight: 600;
}

.pill-btn.active {
  border: 1px solid #5a4031;
  background-color: #f7ede6;
  color: #5a4031;
}

.pill-btn-add {
  border: 1px dashed #ccc;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.2s;
}

.pill-btn-add:hover {
  border-color: #5a4031;
  color: #5a4031;
}

.dropdown-wrapper {
  position: relative;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  width: 180px;
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 6px;
}

.dropdown-item-custom {
  padding: 8px 16px;
  font-size: 13.5px;
  cursor: pointer;
  color: #333;
  border-bottom: 1px solid #f8f9fa;
  display: flex;
  align-items: center;
}

.dropdown-item-custom:hover {
  background-color: #fdfaf8;
  color: #5a4031;
}

.btn-tao-bien-the {
  background-color: #e5d4c8;
  color: #5a4031;
  font-weight: 600;
  border-radius: 20px;
  padding: 8px 24px;
  font-size: 13px;
  border: none;
  transition: all 0.2s;
}

.btn-tao-bien-the:hover {
  background-color: #dccbc0;
}

.variant-group {
  border: 1px solid #eef0f2;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
}

.variant-header {
  background-color: #f7ede6;
  padding: 12px 16px;
  border-bottom: 1px solid #eef0f2;
  color: #5a4031;
}

.color-indicator {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-color: #5a4031;
  border-radius: 50%;
}

.custom-table th {
  font-size: 13px;
  color: #6c757d;
  font-weight: 600;
  background-color: #fbfbfc;
  padding: 10px;
}

.custom-table-input {
  height: 34px;
  font-size: 13px;
  border-radius: 4px;
  max-width: 140px;
  margin: 0 auto;
}

.form-check-input:checked {
  background-color: #5a4031;
  border-color: #5a4031;
}

.upload-section {
  width: 260px;
  border-left: 1px dashed #dee2e6;
  padding-left: 20px;
}

.upload-box {
  width: 65px;
  height: 85px;
  border: 1px dashed #ced4da;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-box:hover {
  border-color: #5a4031;
}

.img-preview {
  width: 65px;
  height: 85px;
  background-size: cover;
  background-position: center;
  border: 1px solid #dee2e6;
}

.btn-hoan-tat {
  background-color: #dccbc0;
  color: #5a4031;
  font-weight: 600;
  border: none;
  transition: all 0.2s;
}

.btn-hoan-tat:hover {
  background-color: #cbb8ac;
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.custom-modal-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.quick-edit-modal {
  width: 420px;
}

.image-upload-modal {
  width: 550px;
}

.custom-modal-header {
  background-color: #f8ece3;
  color: #5a4031;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  border-top: 4px solid #5a4031;
}

.cursor-pointer {
  cursor: pointer;
}

.small-btn {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
}

.border-danger-input {
  border: 2px solid #dc3545 !important;
}
</style>
