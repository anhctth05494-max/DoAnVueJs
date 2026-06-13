<template>
  <div class="mx-auto my-2 page-form-container" style="max-width: 1200px; padding: 0 10px">
    
    <div v-if="showToast" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin-top: 60px;">
      <div class="toast show shadow-lg border-0 rounded-3" 
           :style="toastType === 'success' ? 'background-color: #f4fbf7; border-left: 5px solid #2e7d32 !important;' : 'background-color: #fff5f5; border-left: 5px solid #ef4444 !important;'"
           role="alert" style="min-width: 320px;">
        <div class="d-flex align-items-center px-3 py-2">
          <i class="bi fs-4 me-3" 
             :class="toastType === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'"></i>
          
          <div class="d-flex flex-column py-1">
            <span class="fw-bold" :class="toastType === 'success' ? 'text-success' : 'text-danger'">
              {{ toastType === 'success' ? 'Thành công' : 'Thất bại' }}
            </span>
            <span class="small text-dark">{{ toastMessage }}</span>
          </div>

          <button type="button" class="btn-close ms-auto" @click="showToast = false"></button>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center mb-3">
      <button @click="$router.back()" class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2">
        <i class="bi bi-chevron-left"></i>
        <span class="fw-semibold text-dark" style="font-size: 14px">Danh sách sản phẩm</span>
      </button>
    </div>

    <div class="custom-card mb-4 bg-white">
      <h6 class="section-title text-uppercase">+ Thông tin chung sản phẩm</h6>
      <div class="row g-3 mt-1">
        <div class="col-md-4">
          <label class="form-label">Tên sản phẩm *</label>
          <input v-model="form.tenSanPham" :class="{ 'border-danger-input': form.hasErrorTen }" @input="form.hasErrorTen = false" class="form-control" placeholder="Nhập tên sản phẩm" />
        </div>
        
        <div class="col-md-4">
          <label class="form-label">Mã sản phẩm (Tự sinh) <i class="bi bi-lock text-warning"></i></label>
          <input v-model="form.maSanPham" class="form-control bg-light text-secondary fw-bold" readonly placeholder="Đang tự động sinh..." />
        </div>
        
        <div class="col-md-4">
          <label class="form-label fw-bold">Thương hiệu *</label>
          <SelectThongMinh v-model="form.idThuongHieu" :items="dataDB.thuongHieus" labelKey="tenThuongHieu" title="Thương hiệu" apiEndpoint="http://localhost:8080/api/thuong-hieu/active" @refresh="fetchThuongHieu" @toast="(msg, type) => triggerToast(msg, type)" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Danh mục *</label>
          <SelectThongMinh v-model="form.idDanhMuc" :items="dataDB.danhMucs" labelKey="tenDanhMuc" title="Danh mục" apiEndpoint="http://localhost:8080/api/danh-muc/active" @refresh="fetchDanhMuc" @toast="(msg, type) => triggerToast(msg, type)" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Chất liệu *</label>
          <SelectThongMinh v-model="form.idChatLieu" :items="dataDB.chatLieus" labelKey="tenChatLieu" title="Chất liệu" apiEndpoint="http://localhost:8080/api/chat-lieu/active" @refresh="fetchChatLieu" @toast="(msg, type) => triggerToast(msg, type)" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Kiểu dáng *</label>
          <SelectThongMinh v-model="form.idKieuDang" :items="dataDB.kieuDangs" labelKey="tenKieuDang" title="Kiểu dáng" apiEndpoint="http://localhost:8080/api/kieu-dang/active" @refresh="fetchKieuDang" @toast="(msg, type) => triggerToast(msg, type)" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Cổ áo *</label>
          <SelectThongMinh 
  v-model="form.idCoAo" 
  :items="dataDB.coAos" 
  labelKey="tenCoAo" 
  title="Cổ áo" 
  apiEndpoint="http://localhost:8080/api/co-ao/active" 
  @refresh="fetchCoAo" 
  @toast="(msg, type) => triggerToast(msg, type)" 
/> </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Tay áo *</label>
          <SelectThongMinh v-model="form.idTayAo" :items="dataDB.tayAos" labelKey="tenTayAo" title="Tay áo" apiEndpoint="http://localhost:8080/api/tay-ao/active" @refresh="fetchTayAo" @toast="(msg, type) => triggerToast(msg, type)" />
        </div>
        <div class="col-md-12">
          <label class="form-label">Mô tả chi tiết</label>
          <textarea v-model="form.moTa" class="form-control" rows="3" placeholder="Nhập mô tả chi tiết cho sản phẩm áo dài..."></textarea>
        </div>
      </div>
    </div>

    <div class="custom-card mb-4 bg-white">
      <h6 class="section-title text-uppercase">+ Màu sắc & Kích thước biến thể</h6>
      <div class="row mt-3 align-items-center">
        <div class="col-md-8">
          
          <div class="d-flex align-items-center mb-3">
            <label class="form-label me-3 mb-0 fw-semibold text-secondary" style="width: 80px">Màu sắc *</label>
            <div class="d-flex flex-wrap gap-2 align-items-center position-relative">
              <button v-for="c in selected.colors" :key="c.id" @click="toggleSelection('colors', c)" class="btn pill-btn active">
                {{ c.tenMau }} <i class="bi bi-x ms-1"></i>
              </button>
              <button type="button" class="btn pill-btn-add" data-bs-toggle="modal" data-bs-target="#modalChonMau">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <label class="form-label me-3 mb-0 fw-semibold text-secondary" style="width: 80px">Kích cỡ *</label>
            <div class="d-flex flex-wrap gap-2 align-items-center position-relative">
              <button v-for="s in selected.sizes" :key="s.id" @click="toggleSelection('sizes', s)" class="btn pill-btn active">
                {{ s.tenKichCo }} <i class="bi bi-x ms-1"></i>
              </button>
              <button type="button" class="btn pill-btn-add" data-bs-toggle="modal" data-bs-target="#modalChonSize">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          
        </div>
        <div class="col-md-4 d-flex justify-content-end align-items-center mt-3 mt-md-0">
          <button @click="generateTable" class="btn btn-tao-bien-the shadow-sm">|| TẠO BIẾN THỂ</button>
        </div>
      </div>
    </div>

    <div v-if="isTableGenerated">
      
      <div v-for="(group, colorId) in tableData" :key="colorId" class="variant-group mb-4 bg-white">
        <div class="variant-header d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <span class="color-indicator"></span>
            <span class="fw-bold text-dark">Danh sách biến thể màu: {{ group.color.tenMau }}</span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-light border small-btn" @click="resetGroup(colorId)"><i class="bi bi-arrow-counterclockwise"></i> Đặt lại</button>
            <button class="btn btn-sm btn-light border small-btn" @click="openQuickEdit(group)"><i class="bi bi-pencil-square"></i> Sửa nhanh</button>
          </div>
        </div>

        <div class="variant-body p-3">
          <div class="table-responsive">
            <table class="table custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;"><input type="checkbox" class="form-check-input" v-model="group.selectAll" @change="toggleAllSizes(group)" /></th>
                  <th>Kích cỡ</th>
                  <th class="text-center">Số lượng</th>
                  <th class="text-center">Giá nhập (VNĐ)</th>
                  <th class="text-center">Giá bán (VNĐ)</th>
                  <th class="text-center">Xoá</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(variant, index) in group.variants" :key="variant.size.id">
                  <td class="text-center"><input type="checkbox" class="form-check-input" v-model="variant.selected" /></td>
                  <td class="fw-medium">
                    <span class="border rounded px-3 py-1 bg-white" style="font-size: 13px">{{ variant.size.tenKichCo }}</span>
                  </td>
                  <td class="text-center">
                    <input type="number" class="form-control text-center custom-table-input mx-auto" v-model="variant.soLuong" />
                  </td>
                  <td class="text-center">
                    <input type="text" :value="formatCurrency(variant.giaNhap)" @input="handleInput($event, variant, 'giaNhap')" class="form-control text-center custom-table-input mx-auto" />
                  </td>
                  <td class="text-center">
                    <input type="text" :value="formatCurrency(variant.giaBan)" @input="handleInput($event, variant, 'giaBan')" class="form-control text-center custom-table-input mx-auto" />
                  </td>
                  <td class="text-center">
                    <i @click="group.variants.splice(index, 1)" class="bi bi-trash3 text-danger cursor-pointer"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="custom-card mb-4 mt-4" style="background-color: #fcfaf8;">
        <h6 class="fw-bold text-dark mb-1">Ảnh sản phẩm chi tiết</h6>
        <p class="small text-muted mb-4">Thêm ảnh cho từng màu sắc (biến thể đại diện) để tự động đồng bộ cho toàn bộ kích cỡ.</p>
        
        <div class="row g-3">
          <div class="col-md-6" v-for="(group, colorId) in tableData" :key="'img-' + colorId">
            <div class="card border-0 shadow-sm h-100 rounded-3">
              <div class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="fw-bold mb-0 text-dark" style="font-size: 15px;">Ảnh sản phẩm màu {{ group.color.tenMau }}</h6>
                  <span class="small text-muted" style="font-size: 12px;">Áp dụng cho {{ group.variants.length }} kích cỡ cùng màu</span>
                </div>
                
                <button @click="triggerFileInputColor(colorId)" class="btn text-white rounded-pill px-3 shadow-sm" style="background-color: #8c6b5d; font-size: 13px;">
                  <i class="bi bi-plus"></i> Thêm ảnh
                </button>
                <input type="file" :id="'file-upload-' + colorId" class="d-none" multiple accept="image/*" @change="handleFileUploadTheoMau($event, colorId)" />
              </div>
              
              <div class="card-body bg-light m-3 mt-2 rounded-3 border d-flex flex-column align-items-center justify-content-center" style="min-height: 160px;">
                <div class="d-flex gap-2 flex-wrap justify-content-center w-100" v-if="group.images && group.images.length > 0">
                  <div v-for="(img, idx) in group.images" :key="idx" class="rounded position-relative border shadow-sm" style="width: 80px; height: 80px; background-size: cover; background-position: center;" :style="{ backgroundImage: 'url(' + img + ')' }">
                    <i @click="group.images.splice(idx, 1)" class="bi bi-x-circle-fill text-danger position-absolute top-0 start-100 translate-middle bg-white rounded-circle cursor-pointer fs-6"></i>
                  </div>
                </div>
                <div v-else class="text-center text-muted">
                  <i class="bi bi-image fs-2 opacity-25 mb-1 d-block"></i>
                  <h6 class="fw-bold text-dark mb-1" style="font-size: 14px;">Nhóm màu này chưa có ảnh</h6>
                  <span class="small opacity-75" style="font-size: 12px;">Thêm một bộ ảnh để áp dụng cho toàn bộ kích cỡ cùng màu.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="d-flex justify-content-end gap-3 mt-4 mb-5">
      <button class="btn btn-outline-secondary px-4 rounded-pill bg-white" style="height: 38px; font-size: 14px" @click="$router.back()">
        Huỷ bỏ
      </button>
       <button type="button" class="btn btn-hoan-tat px-4 rounded-pill" style="height: 38px; font-size: 14px;" @click.prevent="handleSaveClick">
  <i class="bi bi-save me-1"></i> Lưu sản phẩm và CTSP
</button>
    </div>

    <div v-if="modal.type === 'quickEdit'" class="custom-modal-overlay">
      <div class="custom-modal-content quick-edit-modal">
        <div class="custom-modal-header">
          <h6 class="m-0 fw-bold">Sửa nhanh màu: {{ modal.activeGroup.color.tenMau }}</h6>
        </div>        
        <div class="modal-body p-4 bg-white">
          <p class="text-muted small mb-3 fw-medium">
            Đang áp dụng cho {{ selectedCount(modal.activeGroup) }} / {{ modal.activeGroup.variants.length }} phân loại size đã chọn
          </p>
          <div class="mb-3">
            <label class="form-label small">Số lượng *</label>
            <input type="number" v-model="quickEditForm.soLuong" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label small">Giá nhập *</label>
            <input type="text" :value="formatCurrency(quickEditForm.giaNhap)" @input="handleInput($event, quickEditForm, 'giaNhap')" class="form-control" />
          </div>
          <div class="mb-4">
            <label class="form-label small">Giá bán *</label>
            <input type="text" :value="formatCurrency(quickEditForm.giaBan)" @input="handleInput($event, quickEditForm, 'giaBan')" class="form-control" />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button @click="closeModal" class="btn btn-outline-secondary px-4 rounded-pill">Huỷ bỏ</button>
            <button @click="applyQuickEdit" class="btn btn-hoan-tat px-4 rounded-pill">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body" v-if="isShowAddConfirm">
      <div class="confirm-overlay">
        <div class="confirm-modal-card">
          <div class="confirm-icon-area" style="color: #8c6b5d !important;">
            <i class="bi bi-plus-circle-fill"></i>
          </div>
          <h5 class="confirm-title" style="color: #5a4031;">Xác Nhận Thêm Mới</h5>
          <p class="confirm-message">
            Cậu có chắc chắn rằng toàn bộ thông tin sản phẩm đã chính xác và muốn <strong>lưu chính thức</strong> sản phẩm này không?
          </p>
          <div class="confirm-actions">
            <button @click="isShowAddConfirm = false" class="btn-cancel-custom">
              Kiểm tra lại
            </button>
            <button @click="confirmCreateProduct" class="btn-confirm-custom" style="background-color: #5a4031; color: white; border: none;">
              Xác nhận lưu
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="modal fade" id="modalChonMau" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header border-bottom-0">
            <h6 class="fw-bold mb-0">Tích Chọn Màu Sắc</h6>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4 d-flex flex-wrap gap-2">
            <div v-for="mau in dataDB.mauSacs" :key="mau.id" class="form-check form-check-inline border rounded-pill px-3 py-2 m-0" :class="isItemSelected('colors', mau) ? 'bg-primary-subtle border-primary' : 'bg-light'">
              <input type="checkbox" :checked="isItemSelected('colors', mau)" @change="toggleSelection('colors', mau)" class="form-check-input mt-1 shadow-none cursor-pointer" :id="`modal-mau-${mau.id}`">
              <label class="form-check-label small ms-2 text-dark cursor-pointer fw-medium" :for="`modal-mau-${mau.id}`">{{ mau.tenMau }}</label>
            </div>
          </div>
          <div class="modal-footer border-top-0 bg-light">
           <button type="button" class="btn text-white rounded-pill px-4" style="background-color: #5a4031;" data-bs-dismiss="modal">Hoàn tất</button>
        
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalChonSize" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header border-bottom-0">
            <h6 class="fw-bold mb-0">Tích Chọn Kích Cỡ</h6>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4 d-flex flex-wrap gap-2">
            <div v-for="size in dataDB.kichCos" :key="size.id" class="form-check form-check-inline border rounded-pill px-3 py-2 m-0" :class="isItemSelected('sizes', size) ? 'bg-primary-subtle border-primary' : 'bg-light'">
              <input type="checkbox" :checked="isItemSelected('sizes', size)" @change="toggleSelection('sizes', size)" class="form-check-input mt-1 shadow-none cursor-pointer" :id="`modal-size-${size.id}`">
              <label class="form-check-label small ms-2 text-dark cursor-pointer fw-medium" :for="`modal-size-${size.id}`">{{ size.tenKichCo }}</label>
            </div>
          </div>
          <div class="modal-footer border-top-0 bg-light">
            <button type="button" class="btn text-white rounded-pill px-4" style="background-color: #5a4031;" data-bs-dismiss="modal">Hoàn tất</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import SelectThongMinh from './SelectThongMinh.vue'
import { listenUpdate } from '@/utils/BroadcastService';

const isShowConfirm = ref(false);
const router = useRouter()

// STATE ĐIỀU KHIỂN GIAO DIỆN
const showToast = ref(false)
const toastType = ref('success')
const toastMessage = ref('')
const isShowAddConfirm = ref(false)
const isTableGenerated = ref(false)

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
})

const dataDB = reactive({
  thuongHieus: [], chatLieus: [], danhMucs: [], kieuDangs: [],
  coAos: [], tayAos: [], mauSacs: [], kichCos: [],
})

const products = ref([])
const selected = reactive({ colors: [], sizes: [] })
const tableData = ref({})

const modal = reactive({ type: null, activeGroup: null })
const quickEditForm = reactive({ soLuong: '', giaNhap: '', giaBan: '' })

// HÀM HIỂN THỊ TOAST THÔNG BÁO
const triggerToast = (message, type = 'danger') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

// XỬ LÝ TIỀN TỆ VÀ NHẬP LIỆU
const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const strValue = value.toString().replace(/\D/g, '')
  return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
const parseCurrency = (value) => {
  if (!value) return 0
  return parseInt(value.toString().replace(/\D/g, ''), 10) || 0
}

const handleInput = (event, object, key) => {
  const rawValue = event.target.value
  object[key] = parseCurrency(rawValue)
  event.target.value = formatCurrency(object[key])
}

const fetchAllProductsToCheck = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/sanpham')
    if (response.ok) products.value = await response.json()
  } catch (error) {
    console.error('Lỗi khi tải danh sách sản phẩm để kiểm tra trùng mã:', error)
  }
}

// YÊU CẦU 1: HÀM TỰ SINH MÃ VÀ HIỂN THỊ
const fetchMaSanPhamTiepTheo = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/sanpham'); 
    const listSP = res.data;
    if(listSP.length === 0) {
      form.maSanPham = "SP1";
    } else {
      const maxId = Math.max(...listSP.map(sp => parseInt(sp.maSanPham.replace(/\D/g, ''), 10) || 0));
      form.maSanPham = `SP${maxId + 1}`;
    }
  } catch (error) {
    form.maSanPham = `SP${Date.now().toString().slice(-5)}`;
  }
};

const fetchChiTietMaSP = async () => {
  await fetchMaSanPhamTiepTheo();
};

const fetchThuocTinh = async () => {
  try {
    const [th, cl, dm, kd, ca, ta, ms, kc] = await Promise.all([
      axios.get('http://localhost:8080/api/thuong-hieu/active'),
      axios.get('http://localhost:8080/api/chat-lieu/active'),
      axios.get('http://localhost:8080/api/danh-muc/active'),
      axios.get('http://localhost:8080/api/kieu-dang/active'),
      axios.get('http://localhost:8080/api/co-ao/active'),
      axios.get('http://localhost:8080/api/tay-ao/active'),
      axios.get('http://localhost:8080/api/mau-sac/active'),
      axios.get('http://localhost:8080/api/kich-co/active'),
    ])
    dataDB.thuongHieus = th.data; dataDB.chatLieus = cl.data;
    dataDB.danhMucs = dm.data; dataDB.kieuDangs = kd.data;
    dataDB.coAos = ca.data; dataDB.tayAos = ta.data;
    dataDB.mauSacs = ms.data; dataDB.kichCos = kc.data;
  } catch (err) { console.error("Lỗi tải thuộc tính:", err); }
};

// LOGIC XỬ LÝ CHỌN MÀU / SIZE VÀ TẠO BẢNG
const isItemSelected = (type, item) => selected[type].some((i) => i.id === item.id)

const toggleSelection = (type, item) => {
  const index = selected[type].findIndex((i) => i.id === item.id)
  if (index > -1) selected[type].splice(index, 1)
  else selected[type].push(item)
}

const generateTable = () => {
  if (selected.colors.length === 0 || selected.sizes.length === 0) return triggerToast('Vui lòng chọn ít nhất 1 Màu và 1 Size!', 'danger')
  
  const newData = { ...tableData.value } 

  selected.colors.forEach((c) => {
    if (!newData[c.id]) {
      newData[c.id] = { color: c, images: [], selectAll: true, variants: [] }
    }
    const currentVariants = newData[c.id].variants
    selected.sizes.forEach(s => {
      const exists = currentVariants.find(v => v.size.id === s.id)
      if (!exists) {
        currentVariants.push({ size: s, selected: true, soLuong: '', giaNhap: '', giaBan: '', hasError: false })
      }
    })
    newData[c.id].variants = currentVariants.filter(v => selected.sizes.some(sz => sz.id === v.size.id))
  })

  Object.keys(newData).forEach(colorId => {
    if (!selected.colors.some(c => c.id.toString() === colorId.toString())) delete newData[colorId]
  })

  tableData.value = newData
  isTableGenerated.value = true
}

// CÁC HÀM XỬ LÝ BẢNG TÍNH
const toggleAllSizes = (group) => { group.variants.forEach((v) => (v.selected = group.selectAll)) }
const selectedCount = (group) => group.variants.filter((v) => v.selected).length
const resetGroup = (colorId) => {
  tableData.value[colorId].variants.forEach((v) => { v.soLuong = ''; v.giaNhap = ''; v.giaBan = ''; v.hasError = false })
}

const openQuickEdit = (group) => {
  if (selectedCount(group) === 0) return triggerToast('Vui lòng chọn ít nhất 1 size!', 'danger')
  quickEditForm.soLuong = ''; quickEditForm.giaNhap = ''; quickEditForm.giaBan = ''
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

const closeModal = () => { modal.type = null; modal.activeGroup = null }

const triggerFileInputColor = (colorId) => {
  const fileInput = document.getElementById('file-upload-' + colorId);
  if (fileInput) {
    fileInput.click();
  }
};

const handleFileUploadTheoMau = (event, colorId) => {
  const files = Array.from(event.target.files)
  files.forEach((file) => {
    if (tableData.value[colorId].images.length < 5) {
      const reader = new FileReader()
      reader.onload = (e) => {
        tableData.value[colorId].images.push(e.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      triggerToast('Mỗi nhóm màu chỉ tải tối đa 5 ảnh!', 'danger')
    }
  })
  event.target.value = null
}

// LƯU SẢN PHẨM LÊN BACKEND
const triggerAddProduct = () => { isShowAddConfirm.value = true }
const confirmCreateProduct = async () => { isShowAddConfirm.value = false; await submitToBackend() }

const submitToBackend = async () => {
  form.hasErrorTen = !form.tenSanPham?.trim()
  if (form.hasErrorTen || !form.idDanhMuc || !form.idThuongHieu || !form.idChatLieu) {
    triggerToast('Vui lòng nhập Tên Sản Phẩm và các Trường bắt buộc (*)!', 'danger')
    return
  }

  if (Object.keys(tableData.value).length === 0) {
    triggerToast('Vui lòng tạo ít nhất một Biến Thể Sản Phẩm!', 'danger')
    return
  }

  const chiTietSanPhams = []
  let hasEmptyOrInvalid = false; let hasNegativeError = false; let hasPriceConflict = false

  Object.values(tableData.value).forEach((group) => {
    group.variants.forEach((v) => {
      if (v.selected) {
        const soLuongSo = parseCurrency(v.soLuong)
        const giaNhapSo = parseCurrency(v.giaNhap)
        const giaBanSo = parseCurrency(v.giaBan)

        if (v.soLuong === '' || v.giaBan === '') { v.hasError = true; hasEmptyOrInvalid = true } 
        else if (soLuongSo < 0 || giaNhapSo < 0 || giaBanSo <= 0) { v.hasError = true; hasNegativeError = true } 
        else if (giaBanSo < giaNhapSo) { v.hasError = true; hasPriceConflict = true } 
        else {
          v.hasError = false
          chiTietSanPhams.push({
            mauSac: { id: group.color.id },
            kichCo: { id: v.size.id },
            coAo: form.idCoAo ? { id: form.idCoAo } : null, 
            tayAo: form.idTayAo ? { id: form.idTayAo } : null,
            soLuongTon: soLuongSo,
            giaNhap: giaNhapSo,
            giaBan: giaBanSo,
            maSku: `${form.maSanPham.trim()}_${group.color.maMau || group.color.id}_${v.size.tenKichCo || v.size.id}`,
            hinhAnh: group.images.length > 0 ? group.images[0] : null,
            trangThai: 1,
          })
        }
      }
    })
  })

  if (hasEmptyOrInvalid) return triggerToast('Vui lòng điền đầy đủ Số lượng và Giá bán cho biến thể đã chọn!', 'danger')
  if (hasNegativeError) return triggerToast('Số lượng/Giá nhập không được âm và Giá bán phải lớn hơn 0!', 'danger')
  if (hasPriceConflict) return triggerToast('Giá bán không được nhỏ hơn Giá nhập!', 'danger')
  if (chiTietSanPhams.length === 0) return triggerToast('Vui lòng tích chọn ít nhất một biến thể để lưu!', 'danger')

  const payload = {
    tenSanPham: form.tenSanPham.trim(),
    maSanPham: form.maSanPham.trim(),
    moTaChiTiet: form.moTa ? form.moTa.trim() : '',
    danhMuc: form.idDanhMuc ? { id: form.idDanhMuc } : null,
    thuongHieu: form.idThuongHieu ? { id: form.idThuongHieu } : null,
    chatLieu: form.idChatLieu ? { id: form.idChatLieu } : null,
    kieuDang: form.idKieuDang ? { id: form.idKieuDang } : null,
    trangThai: 1,
    chiTietSanPhams: chiTietSanPhams,
  }

  try {
    await axios.post('http://localhost:8080/api/sanpham/them', payload)
    triggerToast('Thêm mới sản phẩm thành công!', 'success')
    setTimeout(() => { router.push('/san-pham') }, 1500)
  } catch (error) {
    const errorData = error.response?.data
    if (typeof errorData === 'string' && errorData.includes('Duplicate entry')) {
      triggerToast('Mã sản phẩm đã tồn tại trên hệ thống! Vui lòng làm mới trang.', 'danger')
    } else {
      triggerToast('Lỗi Server: ' + (errorData || 'Không thể lưu sản phẩm!'), 'danger')
    }
  }
}

// TẤT CẢ VÀO 1 ONMOUNTED DUY NHẤT
onMounted(async () => {
  await fetchChiTietMaSP();
  await fetchThuocTinh();
  await fetchAllProductsToCheck();

  // Lắng nghe tín hiệu đồng bộ từ TẤT CẢ các tab thuộc tính
  listenUpdate(async (data) => {
    if (!data || !data.type) return;

    // 1. NẾU NGỪNG KINH DOANH (STATUS = 0)
    if (data.status === 0) {
      triggerToast(`"${data.ten}" đã ngừng kinh doanh, hệ thống đã cập nhật!`, "warning");

      // Reset ô chọn nếu đang chọn trúng cái vừa bị ngừng
      if (data.type === 'CO_AO_UPDATE' && form.idCoAo === data.id) form.idCoAo = '';
      if (data.type === 'TAY_AO_UPDATE' && form.idTayAo === data.id) form.idTayAo = '';
      if (data.type === 'DANH_MUC_UPDATE' && form.idDanhMuc === data.id) form.idDanhMuc = '';
      if (data.type === 'THUONG_HIEU_UPDATE' && form.idThuongHieu === data.id) form.idThuongHieu = '';
      if (data.type === 'CHAT_LIEU_UPDATE' && form.idChatLieu === data.id) form.idChatLieu = '';
      if (data.type === 'KIEU_DANG_UPDATE' && form.idKieuDang === data.id) form.idKieuDang = '';

      // Bỏ tích chọn nếu Màu/Size bị ngừng
      if (data.type === 'MAU_SAC_UPDATE') {
        selected.colors = selected.colors.filter(c => c.id !== data.id);
      }
      if (data.type === 'KICH_CO_UPDATE') {
        selected.sizes = selected.sizes.filter(s => s.id !== data.id);
      }

      // Cập nhật lại bảng biến thể nếu màu/size vừa bị xóa
      if (isTableGenerated.value && (data.type === 'MAU_SAC_UPDATE' || data.type === 'KICH_CO_UPDATE')) {
         generateTable(); 
      }
    } 
    // 2. NẾU KINH DOANH TRỞ LẠI (STATUS = 1)
    else if (data.status === 1) {
      triggerToast(`"${data.ten}" đã kinh doanh trở lại!`, "success");
    }

    // 3. BẤT KỂ LÀ 0 HAY 1, GỌI LẠI HÀM NÀY ĐỂ TẢI LẠI TOÀN BỘ DANH SÁCH MỚI NHẤT
    await fetchThuocTinh(); 
  });
});
</script>

<style scoped>
/* CSS HIỆU ỨNG VÀ TRANG TRÍ CHUNG */
.toast { animation: slideInRight 0.4s ease-out; }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

.form-control:focus, .form-select:focus, textarea:focus {
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

.section-title { color: #5a4031; font-weight: 700; font-size: 14.5px; margin-bottom: 15px; }
.form-label { font-size: 13px; color: #495057; font-weight: 500; margin-bottom: 6px; }
.form-control { height: 38px; border-radius: 6px; font-size: 13.5px; border: 1px solid #dee2e6; }
textarea.form-control { height: auto !important; }

/* CSS NÚT CHỌN THUỘC TÍNH (MÀU/SIZE) */
.pill-btn { border: 1px solid #dee2e6; border-radius: 20px; padding: 5px 16px; font-size: 13px; background: white; color: #495057; font-weight: 600; }
.pill-btn.active { border: 1px solid #5a4031; background-color: #f7ede6; color: #5a4031; }
.pill-btn-add { border: 1px dashed #ccc; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; background: white; transition: all 0.2s; }
.pill-btn-add:hover { border-color: #5a4031; color: #5a4031; }

.btn-tao-bien-the { background-color: #e5d4c8; color: #5a4031; font-weight: 600; border-radius: 20px; padding: 8px 24px; font-size: 13px; border: none; transition: all 0.2s; }
.btn-tao-bien-the:hover { background-color: #dccbc0; }

/* CSS BẢNG BIẾN THỂ */
.variant-group { border: 1px solid #eef0f2; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01); }
.variant-header { background-color: #f7ede6; padding: 12px 16px; border-bottom: 1px solid #eef0f2; color: #5a4031; }
.color-indicator { display: inline-block; width: 14px; height: 14px; background-color: #5a4031; border-radius: 50%; }

.custom-table th { font-size: 13px; color: #6c757d; font-weight: 600; background-color: #fbfbfc; padding: 10px; }
.custom-table-input { height: 34px; font-size: 13px; border-radius: 4px; max-width: 140px; margin: 0 auto; }

.form-check-input:checked { background-color: #5a4031; border-color: #5a4031; }

/* CSS CÁC NÚT & MODAL */
.btn-hoan-tat { background-color: #dccbc0; color: #5a4031; font-weight: 600; border: none; transition: all 0.2s; }
.btn-hoan-tat:hover { background-color: #cbb8ac; }

.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.quick-edit-modal { width: 420px; }
.custom-modal-header { background-color: #f8ece3; color: #5a4031; padding: 16px 20px; border-bottom: 1px solid #e0e0e0; border-top: 4px solid #5a4031; }
.cursor-pointer { cursor: pointer; }
.small-btn { font-size: 12px; padding: 4px 10px; border-radius: 4px; }
.border-danger-input { border: 2px solid #dc3545 !important; }

/* CSS HỘP THOẠI CONFIRM LƯU */
.confirm-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 99999; backdrop-filter: blur(3px); }
.confirm-modal-card { background: white; padding: 30px; border-radius: 16px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); animation: modalFadeIn 0.25s ease-out; }
.confirm-icon-area { font-size: 45px; color: #8a6d5b; margin-bottom: 15px; }
.confirm-title { font-weight: 700; color: #5a4031; margin-bottom: 10px; }
.confirm-message { font-size: 14px; color: #6c757d; line-height: 1.6; margin-bottom: 25px; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }

.btn-cancel-custom { background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; padding: 8px 24px; border-radius: 50px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-cancel-custom:hover { background: #e2e8f0; }
.btn-confirm-custom { background-color: #ebdcd0; color: #5a4031; border: 1px solid #cbb3a1; padding: 8px 24px; border-radius: 50px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-confirm-custom:hover { background-color: #dccbc0; transform: translateY(-1px); }

@keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
</style>