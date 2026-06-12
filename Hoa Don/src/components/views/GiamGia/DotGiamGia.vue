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
                <option :value="1">Đang hoạt động</option>
                <option :value="2">Sắp diễn ra</option>
                <option :value="0">Ngừng hoạt động / Kết thúc</option>
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
                  <th class="py-3 px-3 border-0 fw-semibold text-start" style="background-color: #dccbc0; color: #5a4031; width: 25%;">TÊN ĐỢT</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 15%;">GIÁ TRỊ GIẢM</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 15%;">NGÀY BẮT ĐẦU</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 15%;">NGÀY KẾT THÚC</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 8%;">TRẠNG THÁI</th>
                  <th class="py-3 px-3 border-0 rounded-end fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 5%;">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody class="border-top-0 text-secondary">
                <tr v-for="(item, index) in dotGiamGias" :key="item.id">
                  <td class="py-3 px-3 text-muted">{{ index + 1 + (pagination.page * pagination.size) }}</td>
                  <td class="py-3 px-3 text-start fw-medium text-secondary">{{ item.maDotGiamGia }}</td>
                  <td class="py-3 px-3 text-start fw-medium text-dark">{{ item.ten }}</td>
                  <td class="py-3 px-3 fw-bold text-danger">{{ item.giaTriGiam }} %</td>
                  <td class="py-3 px-3 text-muted small">{{ formatDate(item.ngayBatDau) }}</td>
                  <td class="py-3 px-3 text-muted small">{{ formatDate(item.ngayKetThuc) }}</td>
                  <td class="py-3 px-3 text-center">
                    <span :class="['custom-badge', getStatusData(item).class]">
                        {{ getStatusData(item).text }}
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
                          @change="triggerToggleConfirm($event, item)"
                          :title="isExpired(item.ngayKetThuc) ? 'Đợt giảm giá đã hết hạn' : ''"
                          :style="isExpired(item.ngayKetThuc) ? 'cursor: not-allowed; opacity: 0.5;' : ''"
                        />
                      </div>
                      <i class="bi bi-eye fs-5 text-primary cursor-pointer" @click="openForm(item)" title="Sửa/Xem chi tiết"></i>
                    </div>
                  </td>
                </tr>
                <tr v-if="dotGiamGias.length === 0">
                  <td colspan="8" class="text-center py-5 text-danger fw-medium">
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

      <form @submit.prevent="triggerSaveConfirm" novalidate>
        <div class="row g-4 mb-4">
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm rounded-3 h-100">
              <div class="card-body p-4 d-flex flex-column">
                <h6 class="fw-bold mb-4 text-dark border-bottom pb-2"><i class="bi bi-card-heading me-2"></i>Thông tin chung</h6>
                
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Tên đợt giảm giá <span class="text-danger">*</span></label>
                  <input type="text" 
                         class="form-control rounded-3 shadow-none border-secondary-subtle p-2" 
                         :class="{ 'is-invalid': errors.ten }"
                         v-model="form.ten" 
                         placeholder="Nhập tên đợt giảm giá...">
                  <div v-if="errors.ten" class="invalid-feedback d-block small mt-1">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.ten }}
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Giá trị giảm (%) <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <input type="text" 
                           class="form-control shadow-none border-secondary-subtle border-end-0 p-2" 
                           :class="{ 'is-invalid': errors.giaTriGiam }"
                           v-model="giaTriGiamDisplay" 
                           placeholder="Nhập %...">
                    <span class="input-group-text bg-light border-secondary-subtle text-muted fw-medium"
                          :class="{ 'border-danger': errors.giaTriGiam }">%</span>
                  </div>
                  <div v-if="errors.giaTriGiam" class="invalid-feedback d-block small mt-1">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.giaTriGiam }}
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Ngày bắt đầu <span class="text-danger">*</span></label>
                  <input type="datetime-local" 
                         class="form-control date-input rounded-3 shadow-none border-secondary-subtle p-2" 
                         :class="{ 'is-invalid': errors.ngayBatDau }"
                         v-model="form.ngayBatDau">
                  <div v-if="errors.ngayBatDau" class="invalid-feedback d-block small mt-1">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.ngayBatDau }}
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="form-label small fw-semibold">Ngày kết thúc <span class="text-danger">*</span></label>
                  <input type="datetime-local" 
                         class="form-control date-input rounded-3 shadow-none border-secondary-subtle p-2" 
                         :class="{ 'is-invalid': errors.ngayKetThuc }"
                         v-model="form.ngayKetThuc">
                  <div v-if="errors.ngayKetThuc" class="invalid-feedback d-block small mt-1">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.ngayKetThuc }}
                  </div>
                </div>
                
                <div class="d-flex gap-2 pt-3 border-top mt-auto">
                  <button v-if="!isEditMode" type="submit" class="btn rounded-pill text-white w-100 fw-medium py-2 shadow-none" style="background-color: #5a4031;" :disabled="isProcessing">
                    <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-floppy me-1"></i> Thêm mới
                  </button>
                  <button v-else type="submit" class="btn rounded-pill text-white w-100 fw-medium py-2 shadow-none" style="background-color: #5a4031;" :disabled="isProcessing">
                    <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-pencil-fill me-1"></i> Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-3 mb-4" :class="{ 'border border-danger': errors.sanPham }">
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

            <div v-if="errors.sanPham" class="text-danger small fw-medium mb-3 ms-2">
                <i class="bi bi-exclamation-circle me-1"></i>{{ errors.sanPham }}
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
                    <button type="button" class="btn btn-outline-secondary rounded-pill w-100 fw-medium shadow-none" @click="resetVariantFilters">
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
                          <img :src="variant.hinhanh ? `http://localhost:8080/uploads/${variant.hinhanh}` : 'https://via.placeholder.com/50'" 
                          class="rounded border" 
                        style="width: 45px; height: 45px; object-fit: cover;">
                        </td>
                        <td class="text-start fw-bold text-dark">
                          {{ variant.tenDetail }} 
                          <span class="badge border border-secondary text-secondary ms-2 small fw-normal">{{ variant.kichCo }} - {{ variant.mauSac }}</span>
                        </td>
                        <td class="fw-medium text-dark">{{ variant.soLuongTon }}</td>
                      <td class="fw-bold text-danger">
  <div v-if="form.giaTriGiam > 0 && form.giaTriGiam <= 100">
      <del class="text-muted small d-block">{{ formatCurrencyCustom(variant.giaBan) }} đ</del>
      <span class="text-danger">{{ calculateDiscountedPrice(variant.giaBan) }} đ</span>
  </div>
  <div v-else>
      {{ formatCurrencyCustom(variant.giaBan) }} đ
  </div>
</td>
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
      </form>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-4" style="z-index: 1060;">
      <transition name="toast-slide">
        <div v-if="toast.show" class="d-flex align-items-center bg-white shadow rounded-3 px-3 py-3 border-start border-4 border-success" style="min-width: 300px;">
          <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
          <span class="fw-medium text-dark">{{ toast.message }}</span>
        </div>
      </transition>
    </div>

    <Teleport to="body" v-if="isShowConfirmModal">
      <div class="confirm-overlay">
        <div class="confirm-modal-card">
          <div class="confirm-icon-area">
            <i v-if="confirmActionType === 'toggle'" class="bi bi-box-seam-fill"></i>
            <i v-else class="bi bi-floppy-fill"></i>
          </div>
          <h5 class="confirm-title">{{ confirmTitle }}</h5>
          <p class="confirm-message" v-html="confirmMessage"></p>
          <div class="confirm-actions">
            <button @click="closeConfirmModal" class="btn-cancel-custom">
              Hủy bỏ
            </button>
            <button @click="executeConfirmAction" class="btn-confirm-custom" :disabled="isProcessing">
              <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>

  

</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';

// ==========================================
// 1. KHAI BÁO CÁC BIẾN STATE 
// ==========================================
const apiBaseUrl = 'http://localhost:8080/api/dot-giam-gia';

const toast = reactive({ show: false, message: '' });
const isProcessing = ref(false);
const isShowConfirmModal = ref(false);
const isFormOpen = ref(false);
const isEditMode = ref(false);

const confirmActionType = ref('');
const confirmTitle = ref('');
const confirmMessage = ref('');
const pendingItem = ref(null);
const pendingEventTarget = ref(null);

const dotGiamGias = ref([]);
const filters = ref({ keyword: '', trangThai: null, tuNgay: '', denNgay: '' });
const pagination = ref({ page: 0, size: 10, totalElements: 0, totalPages: 0 }); 

const form = ref({ id: null, ten: '', giaTriGiam: '', ngayBatDau: '', ngayKetThuc: '', trangThai: 1 });

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

const errors = reactive({
  ten: '', giaTriGiam: '', ngayBatDau: '', ngayKetThuc: '', sanPham: ''
});

// ==========================================
// 2. WATCHERS
// ==========================================
watch(() => form.value.ten, () => errors.ten = '');
watch(() => form.value.ngayBatDau, () => errors.ngayBatDau = '');
watch(() => form.value.ngayKetThuc, () => errors.ngayKetThuc = '');

watch(selectedVariantIds, (newVal) => {
  if (newVal.length > 0) errors.sanPham = '';
}, { deep: true });

// ==========================================
// 3. COMPUTED & FORMAT DATA
// ==========================================
const parsePercentInput = (val) => {
  if (val === null || val === undefined) return '';
  const rawValue = typeof val === 'string' ? val : (val.target ? val.target.value : '');
  const cleanValue = rawValue.toString().replace(/[^0-9]/g, '');
  if (cleanValue === '') {
     if (rawValue.trim() !== '') return 'INVALID';
     return ''; 
  }
  return parseInt(cleanValue, 10);
};


const calculateDiscountedPrice = (originalPrice) => {
  const discount = parseFloat(form.value.giaTriGiam);
  // Nếu không nhập % hoặc % không hợp lệ thì trả về giá gốc
  if (!discount || discount <= 0 || discount > 100) return formatCurrencyCustom(originalPrice);
  
  // Công thức: Giá * (1 - %giảm/100)
  const discounted = originalPrice * (1 - discount / 100);
  return formatCurrencyCustom(Math.round(discounted)); // Làm tròn để hiển thị đẹp
};
const giaTriGiamDisplay = computed({
  get: () => {
    if (form.value.giaTriGiam === null || form.value.giaTriGiam === '' || form.value.giaTriGiam === 'INVALID') return '';
    return form.value.giaTriGiam;
  },
  set: (val) => {
    form.value.giaTriGiam = parsePercentInput(val);
    if (form.value.giaTriGiam === 'INVALID') {
        errors.giaTriGiam = 'Vui lòng chỉ nhập số hợp lệ.';
    } else {
        errors.giaTriGiam = ''; 
    }
  }
});

const filteredVariants = computed(() => {
  return variants.value.filter(v => {
    const matchMatchKeyword = !variantKeyword.value || v.tenDetail.toLowerCase().includes(variantKeyword.value.toLowerCase());
    const matchSize = !filterSize.value || v.kichCo === filterSize.value;
    const matchColor = !filterColor.value || v.mauSac === filterColor.value;
    return matchMatchKeyword && matchSize && matchColor;
  });
});

const isAllProductsSelected = computed(() => products.value.length > 0 && selectedProductIds.value.length === products.value.length);
const isAllVariantsSelected = computed(() => filteredVariants.value.length > 0 && selectedVariantIds.value.length === filteredVariants.value.length);

// ==========================================
// 4. HỆ THỐNG VALIDATE
// ==========================================
const clearErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '');
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!form.value.ten || !form.value.ten.toString().trim()) {
    errors.ten = 'Vui lòng nhập tên đợt giảm giá.';
    isValid = false;
  }

  const giaTri = form.value.giaTriGiam;
  if (giaTri === 'INVALID') {
    errors.giaTriGiam = 'Vui lòng chỉ nhập số hợp lệ.';
    isValid = false;
  } else if (giaTri === null || giaTri === '' || isNaN(giaTri)) {
    errors.giaTriGiam = 'Vui lòng nhập giá trị giảm.';
    isValid = false;
  } else if (giaTri <= 0 || giaTri > 100) {
    errors.giaTriGiam = 'Giá trị giảm (%) phải nằm trong khoảng từ 1% đến 100%.';
    isValid = false;
  }

  if (!form.value.ngayBatDau) {
    errors.ngayBatDau = 'Vui lòng chọn ngày bắt đầu.';
    isValid = false;
  }
  if (!form.value.ngayKetThuc) {
    errors.ngayKetThuc = 'Vui lòng chọn ngày kết thúc.';
    isValid = false;
  }

  if (form.value.ngayBatDau && form.value.ngayKetThuc) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 1); 
    const start = new Date(form.value.ngayBatDau);
    const end = new Date(form.value.ngayKetThuc);

    if (!isEditMode.value && start < now) {
      errors.ngayBatDau = 'Ngày bắt đầu không được nằm trong quá khứ.';
      isValid = false;
    }
    if (end <= now) {
      errors.ngayKetThuc = 'Ngày kết thúc phải nằm ở tương lai.';
      isValid = false;
    }
    if (start >= end) {
      errors.ngayKetThuc = 'Ngày kết thúc phải diễn ra SAU ngày bắt đầu.';
      isValid = false;
    }
  }

  if (selectedVariantIds.value.length === 0) {
    errors.sanPham = 'Vui lòng tích chọn ít nhất 1 sản phẩm chi tiết ở bảng bên dưới.';
    isValid = false;
  }

  return isValid;
};

// ==========================================
// 5. CÁC HÀM XỬ LÝ SỰ KIỆN VÀ API
// ==========================================
const showToast = (msg) => {
  toast.message = msg;
  toast.show = true;
  setTimeout(() => { toast.show = false; }, 3000);
};

const triggerToggleConfirm = (event, item) => {
  confirmActionType.value = 'toggle';
  pendingItem.value = item;
  pendingEventTarget.value = event.target;
  confirmTitle.value = 'Xác Nhận Thay Đổi';
  confirmMessage.value = `Cậu có chắc chắn muốn thay đổi trạng thái hoạt động của đợt giảm giá:<br><strong class="text-dark">[${item.maDotGiamGia}] - ${item.ten}</strong> không?`;
  isShowConfirmModal.value = true;
};

const triggerSaveConfirm = () => {
  if (!validateForm()) return;
  form.value.ten = form.value.ten.trim();
  confirmActionType.value = 'save';
  confirmTitle.value = isEditMode.value ? 'Xác Nhận Cập Nhật' : 'Xác Nhận Thêm Mới';
  confirmMessage.value = `Cậu có chắc chắn muốn ${isEditMode.value ? 'cập nhật' : 'lưu mới'} đợt giảm giá <br><strong class="text-dark">${form.value.ten}</strong> không?`;
  isShowConfirmModal.value = true;
};

const closeConfirmModal = () => {
  isShowConfirmModal.value = false;
  if (confirmActionType.value === 'toggle' && pendingEventTarget.value) {
    pendingEventTarget.value.checked = !pendingEventTarget.value.checked;
  }
};

const executeConfirmAction = async () => {
  if (confirmActionType.value === 'toggle') {
    await executeToggle();
  } else if (confirmActionType.value === 'save') {
    await performSaveData();
  }
};

const executeToggle = async () => {
  isProcessing.value = true;
  const item = pendingItem.value;
  const newStatus = (item.trangThai === 1) ? 0 : 1;
  
  try {
    await axios.patch(`${apiBaseUrl}/${item.id}/toggle-status?newStatus=${newStatus}`);
    item.trangThai = newStatus;
    isShowConfirmModal.value = false;
    showToast(`Cập nhật trạng thái đợt giảm giá thành công!`);
  } catch (error) {
    console.error("Lỗi:", error);
    if (pendingEventTarget.value) {
      pendingEventTarget.value.checked = !pendingEventTarget.value.checked;
    }
    alert("Có lỗi xảy ra khi cập nhật trạng thái trên máy chủ!");
    isShowConfirmModal.value = false;
  } finally {
    isProcessing.value = false;
  }
};

const performSaveData = async () => {
  isProcessing.value = true;
  try {
    const payload = {
      ten: form.value.ten, 
      giaTriGiam: form.value.giaTriGiam,
      ngayBatDau: form.value.ngayBatDau, 
      ngayKetThuc: form.value.ngayKetThuc, 
      trangThai: form.value.trangThai,
      idSanPhamChiTiets: selectedVariantIds.value
    };

    if (isEditMode.value) {
      await axios.put(`${apiBaseUrl}/${form.value.id}`, payload);
    } else {
      await axios.post(apiBaseUrl, payload);
    }
    
    closeForm();
    isShowConfirmModal.value = false;
    showToast(`${isEditMode.value ? 'Cập nhật' : 'Thêm mới'} đợt giảm giá thành công!`);
    
  } catch (err) { 
    if (err.response && err.response.data && typeof err.response.data === 'string') {
        alert(err.response.data);
    } else {
        alert('Có lỗi xảy ra khi lưu trên Server!');
    }
    console.error(err);
    isShowConfirmModal.value = false;
  } finally {
    isProcessing.value = false;
  }
};

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
const changePage = (p) => { if (p >= 0 && p < pagination.value.totalPages) { pagination.value.page = p; fetchData(); } };

const isExpired = (endDateStr) => {
  if (!endDateStr) return false;
  return new Date() > new Date(endDateStr);
};

const getStatusData = (item) => {
    if (item.trangThai === 0) return { text: 'Ngừng hoạt động', class: 'badge-inactive' };
    const now = new Date();
    const start = new Date(item.ngayBatDau);
    const end = new Date(item.ngayKetThuc);
    if (now > end) return { text: 'Ngừng hoạt động', class: 'badge-inactive' };
    if (now < start) return { text: 'Sắp diễn ra', class: 'badge-upcoming' };
    return { text: 'Đang hoạt động', class: 'badge-active' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const formatCurrencyCustom = (val) => {
  if (!val) return '0';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// ==========================================
// 🔴 THUẬT TOÁN MỞ FORM & DÒ TÌM SIÊU CẤP (BẢN CUỐI - DÒ THEO TÊN SP)
// ==========================================
const openForm = async (item) => {
  clearErrors();
  isFormOpen.value = true;
  
  // 1. Reset sạch bảng
  selectedProductIds.value = [];
  selectedVariantIds.value = [];
  variants.value = [];
  
  // 2. Tải TẤT CẢ Sản Phẩm Cha
  await fetchProducts(); 

  if (item) {
    isEditMode.value = true;
    form.value = { ...item, 
                   giaTriGiam: Number(item.giaTriGiam || 0),
                   ngayBatDau: item.ngayBatDau ? item.ngayBatDau.substring(0, 16) : '', 
                   ngayKetThuc: item.ngayKetThuc ? item.ngayKetThuc.substring(0, 16) : '' };
                   
    try {
        // GỌI API ĐỂ LẤY CHÍNH XÁC ID TỪ DATABASE
        const resIds = await axios.get(`${apiBaseUrl}/${item.id}/san-pham-chi-tiet-ids`);
        let vIds = resIds.data || [];
        
        if (vIds.length > 0) {
           let allProductIds = products.value.map(p => p.id).join(',');
           
           if (allProductIds) {
               const res = await axios.get(`http://localhost:8080/api/sanpham-chitiet`, { 
                   params: { idSanPhams: allProductIds, size: 9999 } 
               });
               
               const allVariants = Array.isArray(res.data) ? res.data : (res.data.content || res.data.data || []);
               
               let pIds = new Set();
               
               // DUYỆT TỪNG BIẾN THỂ ĐỂ DÒ TÌM CHA CỦA CHÚNG
               allVariants.forEach(v => {
                   if (vIds.some(selectedId => selectedId == v.id)) {
                       let parentId = null;
                       
                       // Cách 1: Tìm qua các cấu trúc phổ biến
                       if (v.sanPham && v.sanPham.id) parentId = v.sanPham.id;
                       else if (v.idSanPham) parentId = v.idSanPham;
                       else if (v.sanPhamId) parentId = v.sanPhamId;
                       
                       // Cách 2: MẸO TỐI THƯỢNG - NẾU KHÔNG CÓ ID CHA, DÙNG TÊN ĐỂ DÒ NGƯỢC
                       if (!parentId && v.tenSanPham) {
                           let matchedProduct = products.value.find(p => p.tenSanPham === v.tenSanPham);
                           if (matchedProduct) parentId = matchedProduct.id;
                       }
                       
                       if (parentId) pIds.add(parentId);
                   }
               });
               
               // BƯỚC 1: Tích xanh Sản phẩm cha (cái này sẽ kéo theo việc hiển thị list dưới)
               selectedProductIds.value = Array.from(pIds);
               
               // BƯỚC 2: Gọi fetch để đổ dữ liệu ra bảng dưới
               if (selectedProductIds.value.length > 0) {
                   await fetchVariants();
               }
               
               // BƯỚC 3: Tích xanh Biến thể con
               selectedVariantIds.value = [...vIds];
           }
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm đã chọn:", error);
    }
  } else {
    isEditMode.value = false;
    form.value = { id: null, ten: '', giaTriGiam: '', ngayBatDau: '', ngayKetThuc: '', trangThai: 1 };
  }
};

const closeForm = () => { isFormOpen.value = false; fetchData(); };

const fetchProducts = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/sanpham`, { params: { keyword: productKeyword.value, size: 1000 } });
    products.value = res.data.content || res.data; 
  } catch (error) { console.error("Lỗi tải sản phẩm:", error); }
};

const fetchVariants = async () => {
  if (selectedProductIds.value.length === 0) { 
    variants.value = []; selectedVariantIds.value = []; return; 
  }
  try {
    const res = await axios.get(`http://localhost:8080/api/sanpham-chitiet`, { params: { idSanPhams: selectedProductIds.value.join(',') } });
    const dataArray = Array.isArray(res.data) ? res.data : (res.data.content || res.data.data || []);
    variants.value = dataArray.map(item => ({
      ...item, tenDetail: item.tenSanPham, kichCo: item.tenKichCo, mauSac: item.tenMau, hinhanh: item.hinhAnh
    }));
  } catch (error) { console.error("Lỗi tải biến thể:", error); variants.value = []; }
};

const handleProductSelect = async (id) => {
  const index = selectedProductIds.value.indexOf(id);
  if (index > -1) selectedProductIds.value.splice(index, 1);
  else selectedProductIds.value.push(id);
  
  await fetchVariants(); 
};

const toggleSelectAllProducts = async () => {
  if (isAllProductsSelected.value) selectedProductIds.value = [];
  else selectedProductIds.value = products.value.map(p => p.id);
  
  await fetchVariants();
};

const handleVariantSelect = (id) => {
  const index = selectedVariantIds.value.indexOf(id);
  if (index > -1) selectedVariantIds.value.splice(index, 1);
  else selectedVariantIds.value.push(id);
};

const toggleSelectAllVariants = () => {
  if (isAllVariantsSelected.value) selectedVariantIds.value = [];
  else selectedVariantIds.value = filteredVariants.value.map(v => v.id);
};

const resetVariantFilters = () => { variantKeyword.value = ''; filterSize.value = ''; filterColor.value = ''; };

// ==========================================
// 6. LIFECYCLE HOOKS
// ==========================================
onMounted(() => { fetchData(); });
</script>
<style scoped>
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

/* ========================================== */
/* BỘ CSS MỚI CHO TRẠNG THÁI CHUẨN PASTEL     */
/* ========================================== */
.custom-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  min-width: 140px; 
}

.badge-active {
  background-color: #ebf1fa; 
  color: #3b82f6; 
}

.badge-inactive {
  background-color: #fcebeb; 
  color: #d23f3f; 
}

.badge-upcoming {
  background-color: #fef3c7; 
  color: #b45309; 
}

input[type="checkbox"].form-check-input:not([role="switch"]) { width: 1.2rem; height: 1.2rem; }
.form-check-input:disabled { opacity: 0.4; cursor: not-allowed; }

/* FIX LỖI ICON CHẤM THAN ĐỎ ĐÈ LÊN LỊCH */
input[type="datetime-local"].date-input.is-invalid {
  background-image: none !important;
}

/* ========================================== */
/* HIỆU ỨNG CHO TOAST THÔNG BÁO               */
/* ========================================== */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s ease;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* ========================================== */
/* CSS CHO CUSTOM CONFIRM MODAL               */
/* ========================================== */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
</style>
