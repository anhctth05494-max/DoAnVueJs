<template>
  <div class="container-fluid p-0">
    
    <div v-if="!isFormOpen">
      
      <div class="card border-0 shadow-sm mb-4 rounded-3">
        <div class="card-body p-4">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-funnel text-dark me-2 fs-5"></i>
            <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm</h6>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-3">
              <label class="form-label text-muted small mb-1">Tìm kiếm</label>
              <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  v-model="filters.keyword" 
                  type="text" 
                  class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle" 
                  placeholder="Nhập mã / tên đợt..." 
                  @keyup.enter="applyFilter"
                >
              </div>
            </div>
            
            <div class="col-md-3">
              <label class="form-label text-muted small mb-1">Trạng thái</label>
              <select v-model="filters.trangThai" @change="applyFilter" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted">
                <option :value="null">Tất cả</option>
                <option :value="1">Đang diễn ra</option>
                <option :value="2">Sắp diễn ra</option>
                <option :value="0">Đã kết thúc / Ngừng</option>
              </select>
            </div>
            
            <div class="col-md-3">
              <label class="form-label text-muted small mb-1">Từ ngày</label>
              <input type="date" class="form-control rounded-pill shadow-none border-secondary-subtle text-muted" v-model="filters.tuNgay" @change="applyFilter">
            </div>
            
            <div class="col-md-3">
              <label class="form-label text-muted small mb-1">Đến ngày</label>
              <input type="date" class="form-control rounded-pill shadow-none border-secondary-subtle text-muted" v-model="filters.denNgay" @change="applyFilter">
            </div>
          </div>

          <div class="d-flex flex-wrap justify-content-end align-items-end mt-4 gap-2 border-top pt-3">
            
            <button @click="openForm(null)" class="btn rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2" style="background-color: #dccbc0; color: #5a4031">
              <i class="bi bi-plus-lg"></i> Thêm đợt giảm giá
            </button>
            <button @click="resetFilter" class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2">
              <i class="bi bi-arrow-clockwise"></i> Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <div class="table-responsive">
            <table class="table table-hover align-middle text-nowrap text-center" style="font-size: 0.9rem">
              <thead>
                <tr>
                  <th class="py-3 px-3 border-0 rounded-start fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 5%;">STT</th>
                  <th class="py-3 px-3 border-0 fw-semibold text-start" style="background-color: #dccbc0; color: #5a4031; width: 12%;">MÃ ĐỢT</th>
                  <th class="py-3 px-3 border-0 fw-semibold text-start" style="background-color: #dccbc0; color: #5a4031; width: 20%;">TÊN ĐỢT</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 12%;">GIÁ TRỊ</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 10%;">LOẠI GIẢM</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 13%;">NGÀY BẮT ĐẦU</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 13%;">NGÀY KẾT THÚC</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 10%;">TRẠNG THÁI</th>
                  <th class="py-3 px-3 border-0 rounded-end fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 5%;">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody class="border-top-0 text-secondary">
                <tr v-for="(item, index) in dotGiamGias" :key="item.id">
                  <td class="py-3 px-3 text-muted">{{ index + 1 + (pagination.page * pagination.size) }}</td>
                  <td class="py-3 px-3 text-start fw-medium text-secondary">{{ item.maDotGiamGia }}</td>
                  <td class="py-3 px-3 text-start fw-medium text-dark">{{ item.ten }}</td>
                  <td class="py-3 px-3 fw-bold text-danger">
                      {{ item.loaiGiam === 1 ? item.giaTriGiam + ' %' : formatCurrencyDisplay(item.giaTriGiam) + ' đ' }}</td>
                    <td class="py-3 px-3 text-muted">{{ item.loaiGiam === 1 ? '%' : 'VNĐ' }}</td>
                  <td class="py-3 px-3 text-muted small">{{ formatDate(item.ngayBatDau) }}</td>
                  <td class="py-3 px-3 text-muted small">{{ formatDate(item.ngayKetThuc) }}</td>
                  <td class="py-3 px-3 text-center">
                    <span class="badge rounded-pill px-3 py-2 fw-medium" :class="getStatusBadge(item)" style="opacity: 0.85">
                      {{ getStatusText(item) }}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="d-flex flex-row justify-content-center align-items-center gap-3">
                      <div class="form-check form-switch mb-0">
                        <input
                          class="form-check-input shadow-none cursor-pointer"
                          type="checkbox"
                          role="switch"
                          :checked="item.trangThai === 1 && !isExpired(item.ngayKetThuc)"
                          :disabled="isExpired(item.ngayKetThuc)"
                          @change="toggleStatus(item)"
                        />
                      </div>
                      <i class="bi bi-eye fs-5 text-primary cursor-pointer" @click="openForm(item)"></i>
                    </div>
                  </td>
                </tr>
                <tr v-if="dotGiamGias.length === 0">
                  <td colspan="9" class="text-center py-5 text-danger fw-medium">
                    <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không tìm thấy đợt giảm giá nào phù hợp với bộ lọc.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="dotGiamGias.length > 0" class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small flex-wrap gap-3">
            <div>
              Hiển thị <span class="fw-bold text-dark">{{ dotGiamGias.length }}</span> /
              <span class="fw-bold text-dark">{{ pagination.totalElements }}</span> bản ghi
            </div>

            <div class="d-flex gap-1 align-items-center">
              <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 0" class="btn btn-sm btn-light border shadow-none px-2 rounded">
                <i class="bi bi-chevron-left"></i>
              </button>

              <button v-for="p in pagination.totalPages" :key="p" @click="changePage(p - 1)" 
                class="btn btn-sm shadow-none px-3 rounded fw-medium"
                :class="pagination.page === p - 1 ? 'btn-secondary text-white' : 'btn-light border text-muted'"
                :style="pagination.page === p - 1 ? 'background-color: #8c6b5d; border-color: #8c6b5d;' : ''"
              >
                {{ p }}
              </button>

              <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages - 1" class="btn btn-sm btn-light border shadow-none px-2 rounded">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <div class="d-flex align-items-center gap-2">
              <select v-model="pagination.size" @change="changePage(0)" class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted pe-4" style="width: auto">
                <option :value="5">Hiển thị 5 bản ghi / trang</option>
                <option :value="10">Hiển thị 10 bản ghi / trang</option>
                <option :value="20">Hiển thị 20 bản ghi / trang</option>
                <option :value="30">Hiển thị 30 bản ghi / trang</option>
              </select>
            </div>
          </div>
          </div>
      </div>
    </div>

    <div v-else class="animation-fade-in">
      
      <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h5 class="fw-bold m-0 text-dark">
          <i class="bi bi-tags-fill me-2"></i>{{ isEditMode ? 'Cập nhật đợt giảm giá' : 'Thêm mới đợt giảm giá' }}
        </h5>
        <button class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium" @click="closeForm">
          <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
        </button>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-3 h-100">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-4 text-dark border-bottom pb-2"><i class="bi bi-card-heading me-2"></i>Thông tin chung</h6>
              
              <div class="mb-3">
                <label class="form-label small fw-semibold">Tên đợt giảm giá <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3 shadow-none border-secondary-subtle p-2" v-model="form.ten" placeholder="Nhập tên đợt giảm giá...">
              </div>

              <div class="mb-3">
                <label class="form-label small fw-semibold">Loại giảm giá <span class="text-danger">*</span></label>
                <select class="form-select rounded-3 shadow-none border-secondary-subtle p-2" v-model="form.loaiGiam">
                  <option :value="1">Giảm theo Phần trăm (%)</option>
                  <option :value="2">Giảm theo Tiền mặt (VNĐ)</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label class="form-label small fw-semibold">Giá trị giảm <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input v-if="form.loaiGiam === 1" 
                         key="percent-input" 
                         type="number" 
                         class="form-control shadow-none border-secondary-subtle border-end-0 p-2" 
                         v-model="form.giaTriGiam" 
                         placeholder="Nhập %..." min="1" max="100">
                         
                  <input v-else 
       key="vnd-input" 
       type="text" 
       class="form-control shadow-none border-secondary-subtle border-end-0 p-2" 
       v-model="giaTriGiamDisplay" 
       required placeholder="Nhập số tiền...">
                         
                  <span class="input-group-text bg-light border-secondary-subtle text-muted fw-medium">{{ form.loaiGiam === 1 ? '%' : 'VNĐ' }}</span>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label small fw-semibold">Ngày bắt đầu <span class="text-danger">*</span></label>
                <input type="datetime-local" class="form-control rounded-3 shadow-none border-secondary-subtle p-2" v-model="form.ngayBatDau">
              </div>
              
              <div class="mb-4">
                <label class="form-label small fw-semibold">Ngày kết thúc <span class="text-danger">*</span></label>
                <input type="datetime-local" class="form-control rounded-3 shadow-none border-secondary-subtle p-2" v-model="form.ngayKetThuc">
              </div>
              
              <div class="d-flex gap-2 pt-3 border-top mt-auto">
                <button v-if="!isEditMode" class="btn rounded-pill text-white w-100 fw-medium py-2 shadow-none" style="background-color: #5a4031;" @click="saveData(false)" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-floppy me-1"></i> Thêm mới
                </button>
                <button v-else class="btn rounded-pill text-white w-100 fw-medium py-2 shadow-none" style="background-color: #5a4031;" @click="saveData(true)" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-pencil-fill me-1"></i> Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          
          <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body p-4 flex-column d-flex">
              <h6 class="fw-bold mb-3 text-dark border-bottom pb-2"><i class="bi bi-box-seam me-2"></i>Chọn Sản Phẩm</h6>
              
              <div class="input-group mb-3 w-50">
                <span class="input-group-text bg-white border-end-0 border-secondary-subtle rounded-start-pill text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle" v-model="productKeyword" placeholder="Tìm kiếm sản phẩm theo tên..." @input="fetchProducts">
              </div>
              
              <div class="table-responsive border border-secondary-subtle rounded-3" style="max-height: 250px; overflow-y: auto;">
                <table class="table table-hover align-middle mb-0 text-center">
                  <thead class="sticky-top shadow-sm" style="background-color: #dccbc0; color: #5a4031; z-index: 1;">
                    <tr>
                      <th class="py-3 border-0">
                        <input class="form-check-input shadow-none cursor-pointer" type="checkbox" :checked="isAllProductsSelected" @change="toggleSelectAllProducts">
                      </th>
                      <th class="py-3 border-0 fw-semibold">STT</th>
                      <th class="py-3 border-0 text-start fw-semibold">Tên sản phẩm</th>
                      <th class="py-3 border-0 fw-semibold">Thương hiệu</th>
                      <th class="py-3 border-0 fw-semibold">Chất liệu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in products" :key="item.id" :class="{'table-light': selectedProductIds.includes(item.id)}">
                      <td>
                        <input class="form-check-input shadow-none cursor-pointer" type="checkbox" :value="item.id" :checked="selectedProductIds.includes(item.id)" @change="handleProductSelect(item.id)">
                      </td>
                      <td>{{ index + 1 }}</td>
                      <td class="text-start fw-bold text-dark">{{ item.tenSanPham }}</td>
                      <td class="text-muted">{{ item.thuongHieu || 'Giai Đài' }}</td>
                      <td class="text-muted">{{ item.chatLieu || 'Lụa tơ tằm' }}</td>
                    </tr>
                    <tr v-if="products.length === 0"><td colspan="5" class="py-4 text-muted">Không tìm thấy sản phẩm nào.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4 border-top border-4 rounded-3" style="border-top-color: #5a4031 !important; background-color: #faf9f7;">
              <h6 class="fw-bold mb-3 text-dark border-bottom pb-2">
                <i class="bi bi-list-check me-2"></i> Chi Tiết Biến Thể 
                <span class="badge bg-secondary rounded-pill fw-medium ms-2">Đã chọn: {{ selectedVariantIds.length }}/{{ variants.length }}</span>
              </h6>
              
              <div class="row g-3 mb-3">
                <div class="col-md-4">
                  <label class="form-label small fw-semibold text-muted">Tìm kiếm chi tiết</label>
                  <input type="text" class="form-control rounded-pill shadow-none border-secondary-subtle" v-model="variantKeyword" placeholder="Nhập tên biến thể...">
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-semibold text-muted">Kích cỡ</label>
                  <select class="form-select rounded-pill shadow-none border-secondary-subtle" v-model="filterSize">
                    <option value="">Tất cả</option>
                    <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-semibold text-muted">Màu sắc</label>
                  <select class="form-select rounded-pill shadow-none border-secondary-subtle" v-model="filterColor">
                    <option value="">Tất cả</option>
                    <option v-for="color in colorOptions" :key="color" :value="color">{{ color }}</option>
                  </select>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                  <button class="btn btn-outline-secondary rounded-pill w-100 fw-medium shadow-none" @click="resetVariantFilters">
                    <i class="bi bi-arrow-clockwise"></i> Đặt lại
                  </button>
                </div>
              </div>

              <div class="table-responsive border border-secondary-subtle rounded-3" style="max-height: 280px; overflow-y: auto;">
                <table class="table table-hover align-middle text-center mb-0 bg-white">
                  <thead class="sticky-top shadow-sm" style="background-color: #dccbc0; color: #5a4031; z-index: 1;">
                    <tr>
                      <th class="py-3 border-0">
                        <input class="form-check-input shadow-none cursor-pointer" type="checkbox" :checked="isAllVariantsSelected" @change="toggleSelectAllVariants">
                      </th>
                      <th class="py-3 border-0 fw-semibold">STT</th>
                      <th class="py-3 border-0 text-start fw-semibold">Ảnh</th>
                      <th class="py-3 border-0 text-start fw-semibold">Tên sản phẩm chi tiết</th>
                      <th class="py-3 border-0 fw-semibold">Tồn kho</th>
                      <th class="py-3 border-0 fw-semibold">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(variant, index) in filteredVariants" :key="variant.id" :class="{'table-light': selectedVariantIds.includes(variant.id)}">
                      <td>
                        <input class="form-check-input shadow-none cursor-pointer" type="checkbox" :value="variant.id" :checked="selectedVariantIds.includes(variant.id)" @change="handleVariantSelect(variant.id)">
                      </td>
                      <td>{{ index + 1 }}</td>
                      <td class="text-start">
                        <img :src="variant.hinhanh || 'https://via.placeholder.com/50'" class="rounded border" style="width: 45px; height: 45px; object-fit: cover;">
                      </td>
                      <td class="text-start fw-bold text-dark">
                        {{ variant.tenDetail }} 
                        <span class="badge border border-secondary text-secondary ms-2 small fw-normal">{{ variant.kichCo }} - {{ variant.mauSac }}</span>
                      </td>
                      <td class="fw-medium text-dark">{{ variant.soLuongTon }}</td>
                      <td class="fw-bold text-danger">{{ formatCurrencyDisplay(variant.giaBan) }} đ</td>
                    </tr>
                    <tr v-if="filteredVariants.length === 0">
                      <td colspan="6" class="py-5 text-muted">Chưa có sản phẩm biến thể nào thỏa mãn hoặc chưa chọn sản phẩm cha.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

// --- HÀM ĐỊNH DẠNG TIỀN TỆ ---
const formatCurrencyDisplay = (val) => {
  if (val === null || val === undefined || val === '') return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const parseCurrencyInput = (val) => {
  const rawValue = typeof val === 'string' ? val : (val.target ? val.target.value : '');
  // Chỉ lấy các chữ số, loại bỏ mọi chữ cái và ký tự đặc biệt
  const digitsOnly = rawValue.toString().replace(/[^0-9]/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
};
// ----------------------------

// ==========================================
// STATE QUẢN LÝ MÀN HÌNH DANH SÁCH
// ==========================================
const apiBaseUrl = 'http://localhost:8080/api/dot-giam-gia';
const dotGiamGias = ref([]);
const filters = ref({ keyword: '', trangThai: null, tuNgay: '', denNgay: '' });
const pagination = ref({ page: 0, size: 10, totalElements: 0, totalPages: 0 }); // Thêm total
const isFormOpen = ref(false); 

const fetchData = async () => {
  try {
    const params = { page: pagination.value.page, size: pagination.value.size };
    if (filters.value.keyword) params.keyword = filters.value.keyword;
    if (filters.value.trangThai !== null) params.trangThai = filters.value.trangThai;
    if (filters.value.tuNgay) params.tuNgay = `${filters.value.tuNgay}T00:00:00`;
    if (filters.value.denNgay) params.denNgay = `${filters.value.denNgay}T23:59:59`;

    const res = await axios.get(apiBaseUrl, { params });

    dotGiamGias.value = res.data.content; 
    pagination.value.totalElements = res.data.totalElements;
    pagination.value.totalPages = res.data.totalPages;
  } catch (error) { console.error(error); }
};

const applyFilter = () => { pagination.value.page = 0; fetchData(); };
const resetFilter = () => { filters.value = { keyword: '', trangThai: null, tuNgay: '', denNgay: '' }; fetchData(); };

// ĐOẠN MỚI: Hàm chuyển trang
const changePage = (p) => { 
  if (p >= 0 && p < pagination.value.totalPages) { 
    pagination.value.page = p; 
    fetchData(); 
  } 
};

// VALIDATE 1: Hiển thị Alert khi gạt trạng thái
const toggleStatus = async (item) => {
  const isConfirm = confirm(`Bạn có chắc chắn muốn thay đổi trạng thái của đợt giảm giá "${item.ten}" không?`);
  if(isConfirm) {
    try { 
      await axios.patch(`${apiBaseUrl}/${item.id}/toggle-status`); 
      alert(`Đã thay đổi trạng thái đợt giảm giá "${item.ten}" thành công!`);
      fetchData(); 
    } 
    catch (error) { alert('Lỗi cập nhật trạng thái!'); }
  } else { 
    fetchData(); 
  }
};

const isExpired = (endDateStr) => {
  if (!endDateStr) return false;
  return new Date() > new Date(endDateStr);
};
const getStatusText = (item) => {
  const now = new Date();
  const start = new Date(item.ngayBatDau);
  const end = new Date(item.ngayKetThuc);
  if (now > end) return 'Đã kết thúc'; 
  if (item.trangThai === 0) return 'Đã kết thúc'; 
  if (now < start) return 'Sắp diễn ra';
  return 'Đang diễn ra';
};
const getStatusBadge = (item) => {
  const text = getStatusText(item);
  if (text === 'Sắp diễn ra') return 'badge-sap-dien-ra';
  if (text === 'Đang diễn ra') return 'badge-dang-dien-ra';
  return 'badge-da-ket-thuc';
};
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

// ==========================================
// STATE QUẢN LÝ MÀN HÌNH FORM THÊM/SỬA
// ==========================================
const isEditMode = ref(false);
const isSaving = ref(false);

const form = ref({ id: null, ten: '', loaiGiam: 1, giaTriGiam: '', ngayBatDau: '', ngayKetThuc: '', trangThai: 1 });

// ĐOẠN MỚI: Watch reset giaTriGiam khi đổi loại giảm & Computed Property hiển thị VNĐ
watch(() => form.value.loaiGiam, () => {
  form.value.giaTriGiam = 0;
});

const giaTriGiamDisplay = computed({
  get: () => formatCurrencyDisplay(form.value.giaTriGiam),
  set: (val) => form.value.giaTriGiam = parseCurrencyInput(val)
});
// ----------------------------------------

const products = ref([]);
const variants = ref([]);
const selectedProductIds = ref([]);
const selectedVariantIds = ref([]);

const productKeyword = ref('');
const variantKeyword = ref('');
const filterSize = ref('');
const filterColor = ref('');
const sizeOptions = ref(['S', 'M', 'L', 'XL', 'XXL']);
const colorOptions = ref(['Đỏ', 'Xanh', 'Vàng', 'Trắng', 'Đen']);

const openForm = (item) => {
  isFormOpen.value = true;
  if (item) {
    isEditMode.value = true;
    // Ép kiểu number cho giaTriGiam để computed làm việc đúng
    form.value = { ...item, 
                   giaTriGiam: Number(item.giaTriGiam || 0),
                   ngayBatDau: item.ngayBatDau ? item.ngayBatDau.substring(0, 16) : '', 
                   ngayKetThuc: item.ngayKetThuc ? item.ngayKetThuc.substring(0, 16) : '' };
  } else {
    isEditMode.value = false;
    form.value = { id: null, ten: '', loaiGiam: 1, giaTriGiam: 0, ngayBatDau: '', ngayKetThuc: '', trangThai: 1 };
    selectedProductIds.value = [];
    selectedVariantIds.value = [];
  }
  fetchProducts(); 
};

const closeForm = () => { isFormOpen.value = false; fetchData(); };

const fetchProducts = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/sanpham`, { 
      params: { keyword: productKeyword.value } 
    });
    products.value = res.data.content || res.data; 
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
  }
};

const fetchVariants = async () => {
  if (selectedProductIds.value.length === 0) { 
    variants.value = []; 
    selectedVariantIds.value = []; 
    return; 
  }
  try {
    const res = await axios.get(`http://localhost:8080/api/sanpham-chitiet`, { 
      params: { idSanPhams: selectedProductIds.value.join(',') } 
    });
    
    // Ép kiểu an toàn: Nếu Backend có bọc data thì cũng tự động rã ra thành Array
    const dataArray = Array.isArray(res.data) ? res.data : (res.data.content || res.data.data || []);
    
    // Đổi lại tên biến cho khớp hoàn toàn với thẻ {{ }} trên giao diện HTML của bạn
    variants.value = dataArray.map(item => ({
      ...item,
      tenDetail: item.tenSanPham,
      kichCo: item.tenKichCo,
      mauSac: item.tenMau,
      hinhanh: item.hinhAnh
    }));
    
  } catch (error) {
    console.error("Lỗi tải biến thể:", error);
    variants.value = []; // Reset về mảng rỗng nếu lỗi, tránh văng App
  }
};

watch(selectedProductIds, () => { fetchVariants(); }, { deep: true });

const filteredVariants = computed(() => {
  return variants.value.filter(v => {
    const matchMatchKeyword = !variantKeyword.value || v.tenDetail.toLowerCase().includes(variantKeyword.value.toLowerCase());
    const matchSize = !filterSize.value || v.kichCo === filterSize.value;
    const matchColor = !filterColor.value || v.mauSac === filterColor.value;
    return matchMatchKeyword && matchSize && matchColor;
  });
});

const handleProductSelect = (id) => {
  const index = selectedProductIds.value.indexOf(id);
  if (index > -1) selectedProductIds.value.splice(index, 1);
  else selectedProductIds.value.push(id);
};
const toggleSelectAllProducts = () => {
  if (isAllProductsSelected.value) selectedProductIds.value = [];
  else selectedProductIds.value = products.value.map(p => p.id);
};
const isAllProductsSelected = computed(() => products.value.length > 0 && selectedProductIds.value.length === products.value.length);

const handleVariantSelect = (id) => {
  const index = selectedVariantIds.value.indexOf(id);
  if (index > -1) selectedVariantIds.value.splice(index, 1);
  else selectedVariantIds.value.push(id);
};
const toggleSelectAllVariants = () => {
  if (isAllVariantsSelected.value) selectedVariantIds.value = [];
  else selectedVariantIds.value = filteredVariants.value.map(v => v.id);
};
const isAllVariantsSelected = computed(() => filteredVariants.value.length > 0 && selectedVariantIds.value.length === filteredVariants.value.length);
const resetVariantFilters = () => { variantKeyword.value = ''; filterSize.value = ''; filterColor.value = ''; };

// VALIDATE 2: Kiểm tra dữ liệu Form Thêm/Sửa
const saveData = async (isUpdate = false) => {
  // 1. Kiểm tra Tên
  if (!form.value.ten || form.value.ten.trim() === '') {
    alert("Vui lòng nhập tên đợt giảm giá!"); return;
  }

  // 2. Kiểm tra Giá trị giảm
  if (!form.value.giaTriGiam || form.value.giaTriGiam <= 0) {
    alert("Giá trị giảm phải lớn hơn 0!"); return;
  }
  if (form.value.loaiGiam === 1 && form.value.giaTriGiam > 100) {
    alert("Mức giảm theo phần trăm (%) không được vượt quá 100%!"); return;
  }

  // 3. Kiểm tra Thời gian
  if (!form.value.ngayBatDau) {
    alert("Vui lòng chọn ngày bắt đầu!"); return;
  }
  if (!form.value.ngayKetThuc) {
    alert("Vui lòng chọn ngày kết thúc!"); return;
  }
  
  const start = new Date(form.value.ngayBatDau);
  const end = new Date(form.value.ngayKetThuc);
  const now = new Date();
  now.setMinutes(now.getMinutes() - 1); // Trừ hao 1 phút
  
  // ĐOẠN MỚI: Validate thời gian bắt đầu ở Tương lai (Chỉ áp dụng khi tạo mới)
  if (!isEditMode.value && start < now) {
    alert("Lỗi: Ngày bắt đầu phải được chọn ở thời điểm tương lai!"); return;
  }
  
  if (end <= start) {
    alert("Lỗi: Ngày kết thúc phải diễn ra sau ngày bắt đầu!"); return;
  }

  // 4. Kiểm tra chọn Sản phẩm chi tiết
  if (selectedVariantIds.value.length === 0) {
    alert("Bạn chưa chọn sản phẩm nào! Vui lòng tích chọn ít nhất một sản phẩm chi tiết ở bảng phía dưới."); return;
  }

  // Vượt qua tất cả Validate -> Tiến hành gọi API
  isSaving.value = true;
  const payload = {
    ten: form.value.ten, loaiGiam: form.value.loaiGiam, giaTriGiam: form.value.giaTriGiam,
    ngayBatDau: form.value.ngayBatDau, ngayKetThuc: form.value.ngayKetThuc, trangThai: form.value.trangThai,
    idSanPhamChiTiets: selectedVariantIds.value
  };

  try {
    if (isUpdate) {
      await axios.put(`${apiBaseUrl}/${form.value.id}`, payload);
      alert("Cập nhật đợt giảm giá thành công!");
    } else {
      await axios.post(apiBaseUrl, payload);
      alert("Thêm mới đợt giảm giá thành công!");
    }
    closeForm();
  } catch (error) { alert("Lỗi khi lưu dữ liệu vào hệ thống!"); } 
  finally { isSaving.value = false; }
};

onMounted(() => { fetchData(); });
</script>

<style scoped>
/* ================= CSS ĐỒNG BỘ TỪ FILE SẢN PHẨM ================= */
.table-hover tbody tr:hover {
  background-color: #fcfaf8;
}
.form-control:focus,
.form-select:focus {
  border-color: #cbb3a1;
  box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25);
}
.form-check-input:checked {
  background-color: #8c6b5d;
  border-color: #8c6b5d;
}
.badge {
  font-weight: 500;
}
.cursor-pointer { 
  cursor: pointer; 
}
.animation-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Các badge trạng thái đợt giảm giá */
.badge-sap-dien-ra { background-color: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; }
.badge-dang-dien-ra { background-color: #2e7d32; color: white; }
.badge-da-ket-thuc { background-color: #c62828; color: white; }

input[type="checkbox"].form-check-input:not([role="switch"]) { width: 1.2rem; height: 1.2rem; }
.form-check-input:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
