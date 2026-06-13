<template>
  <div class="container-fluid p-0">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h5 class="fw-bold mb-1" style="color: #5a4031">Chi tiết sản phẩm | {{ maSanPhamHienTai }}</h5>
        <RouterLink to="/san-pham" class="text-decoration-none small" style="color: #8c6b5d">
          <i class="bi bi-chevron-left"></i> Danh sách sản phẩm
        </RouterLink>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4 rounded-3">
      <div class="card-body p-4">
        <div class="row g-3 align-items-end justify-content-between">
          <div class="col-md-3">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 border-secondary-subtle rounded-start-pill"><i class="bi bi-search"></i></span>
              <input v-model="filter.keyword" class="form-control border-start-0 shadow-none border-secondary-subtle rounded-end-pill" placeholder="Mã SKU / Tên..." />
            </div>
          </div>

          <div class="col-md-3">
            <label class="small text-muted mb-1 d-flex justify-content-between">
              <span>Giá từ 0đ</span> <span>đến {{ formatCurrency(filter.maxPrice) }}</span>
            </label>
            <input type="range" class="form-range" v-model="filter.maxPrice" min="0" max="5000000" step="50000" />
          </div>

          <div class="col-md-6 d-flex gap-2 justify-content-end align-items-center flex-wrap">
            <button 
              @click="moCameraScan" 
              class="btn btn-outline-dark rounded-pill px-3 shadow-sm fw-medium d-flex align-items-center gap-2 text-nowrap"
            >
              <i class="bi bi-qr-code-scan"></i> Quét QR
            </button>

            <button 
              @click="resetFilter" 
              class="btn btn-outline-secondary rounded-pill px-3 shadow-sm fw-medium d-flex align-items-center gap-2 text-nowrap"
            >
              <i class="bi bi-arrow-clockwise"></i> Đặt lại
            </button>

            <button 
              @click="openModal('ADD')" 
              class="btn text-white rounded-pill px-3 shadow-sm fw-medium d-flex align-items-center gap-2 text-nowrap" 
              style="background-color: #8c6b5d; border-color: #8c6b5d;"
            >
              <i class="bi bi-plus-lg"></i> Thêm biến thể
            </button>

            <RouterLink 
              to="/san-pham/danh-sach-chi-tiet" 
              class="btn btn-outline-secondary rounded-pill px-3 shadow-sm fw-medium d-flex align-items-center gap-2 text-nowrap"
            >
              <i class="bi bi-list-ul"></i> Xem toàn bộ
            </RouterLink>
          </div>
        </div>

        <div class="row g-3 mt-3 border-top pt-3">
          <div class="col-md-2">
            <select v-model="filter.thuongHieu" class="form-select rounded-pill shadow-none">
              <option value="">Tất cả Thương hiệu</option>
              <option v-for="th in listThuongHieu" :key="th.id" :value="th.tenThuongHieu">{{ th.tenThuongHieu }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <select v-model="filter.mauSac" class="form-select rounded-pill shadow-none">
              <option value="">Tất cả Màu sắc</option>
              <option v-for="mau in listMauSac" :key="mau.id" :value="mau.tenMau">{{ mau.tenMau }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <select v-model="filter.kichCo" class="form-select rounded-pill shadow-none">
              <option value="">Tất cả Kích cỡ</option>
              <option v-for="size in listKichCo" :key="size.id" :value="size.tenKichCo">{{ size.tenKichCo }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <select v-model="filter.coAo" class="form-select rounded-pill shadow-none">
              <option value="">Tất cả Cổ áo</option>
              <option v-for="co in listCoAo" :key="co.id" :value="co.tenCoAo">{{ co.tenCoAo }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <select v-model="filter.tayAo" class="form-select rounded-pill shadow-none">
              <option value="">Tất cả Tay áo</option>
              <option v-for="tay in listTayAo" :key="tay.id" :value="tay.tenTayAo">{{ tay.tenTayAo }}</option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-center">
            <div class="form-check form-switch mb-0">
              <input v-model="filter.conHang" class="form-check-input shadow-none" type="checkbox" role="switch" id="switchConHang" />
              <label class="form-check-label small text-muted" for="switchConHang">Chỉ tồn kho > 0</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-2" v-if="selectedSkus.length > 0">
      <span class="small text-muted">Đã chọn <strong>{{ selectedSkus.length }}</strong> biến thể.</span>
      <button 
        @click="downloadBulkQR" 
        class="btn text-white rounded-pill px-3 shadow-sm d-flex align-items-center gap-2"
        style="background-color: #5a4031; font-size: 13.5px;"
      >
        <i class="bi bi-qr-code"></i> Tải QR nhanh ({{ selectedSkus.length }})
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-3">
      <div class="card-body p-0">
     <table class="table table-hover align-middle mb-0 text-nowrap" style="font-size: 0.85rem;">
          <thead style="background-color: #fcfaf8;">
            <tr>
              <th class="py-3 px-3 text-center" style="width: 40px">
                <input type="checkbox" class="form-check-input shadow-none cursor-pointer" v-model="isAllSelected" @change="toggleSelectAll" />
              </th>
              <th class="py-3 px-3 fw-bold">STT</th>
              <th class="py-3 px-3 fw-bold">MÃ SP</th>
              <th class="py-3 px-3 fw-bold">MÃ SKU</th>
              <th class="py-3 px-3 fw-bold text-center">ẢNH</th>
              <th class="py-3 px-3 fw-bold">THƯƠNG HIỆU</th>
              <th class="py-3 px-3 fw-bold">MÀU SẮC</th>
              <th class="py-3 px-3 fw-bold">KÍCH CỠ</th>
              <th class="py-3 px-3 text-end fw-bold">GIÁ BÁN</th>
              <th class="py-3 px-3 text-center fw-bold">GIẢM</th>
              <th class="py-3 px-3 text-center fw-bold">TỒN KHO</th>
              <th class="py-3 px-3 text-center fw-bold">TRẠNG THÁI</th>
              <th class="py-3 px-3 text-center fw-bold">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredProducts" :key="item.id">
              <td class="text-center">
                <input type="checkbox" class="form-check-input shadow-none cursor-pointer" :value="item.maSku" v-model="selectedSkus" />
              </td>
              <td class="px-3">{{ idx + 1 }}</td>
              <td class="px-3">{{ maSanPhamHienTai }}</td>
              <td class="px-3">{{ item.maSku }}</td>
              <td class="px-3 text-center">
                <img 
                  :src="getSingleImage(item.hinhAnh)" 
                  class="rounded border shadow-sm" 
                  width="40" 
                  height="40" 
                  style="object-fit: cover" 
                  @error="$event.target.src = 'https://placehold.co/40x40?text=No+Img'"
                />
              </td>
              <td class="px-3">{{ item.tenThuongHieu || 'Mặc định' }}</td>
              <td class="px-3">{{ item.tenMau }}</td>
              <td class="px-3">{{ item.tenKichCo }}</td>
              
              <td class="px-3 text-end">
                <div v-if="getPhanTramGiam(item) > 0" class="d-flex flex-column align-items-end">
                  <span class="text-danger fw-medium">{{ formatCurrency(tinhGiaSauGiam(item.giaBan, getPhanTramGiam(item))) }}</span>
                  <span class="text-muted text-decoration-line-through" style="font-size: 11px;">{{ formatCurrency(item.giaBan) }}</span>
                </div>
                <div v-else>
                  <span>{{ formatCurrency(item.giaBan) }}</span>
                </div>
              </td>
              
              <td class="px-3 text-center">
                <span v-if="getPhanTramGiam(item) > 0" class="badge rounded px-2 py-1 fw-normal" style="background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;">
                  <i class="bi bi-tag-fill me-1" style="font-size: 10px;"></i>{{ getPhanTramGiam(item) }}%
                </span>
                <span v-else class="text-muted">-</span>
              </td>

              <td class="px-3 text-center">{{ item.soLuongTon }}</td>
              <td class="px-3 text-center">
                <span class="badge rounded-pill fw-normal" :class="item.trangThai === 1 ? 'bg-primary' : 'bg-danger'">
                  {{ item.trangThai === 1 ? 'Kinh doanh' : 'Ngừng KD' }}
                </span>
              </td>
              <td class="px-3 text-center">
                <i @click="openModal('EDIT', item)" class="bi bi-eye fs-5 text-dark" style="cursor: pointer" title="Cập nhật"></i>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="13" class="text-center py-4 text-muted">Không có dữ liệu phù hợp.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0" style="background-color: #f8f5f2">
            <h5 class="modal-title fw-bold" style="color: #5a4031">{{ modalMode === 'ADD' ? 'Thêm biến thể mới' : 'Cập nhật biến thể' }}</h5>
            <button type="button" class="btn-close shadow-none" @click="closeModal"></button>
          </div>

          <div class="modal-body p-4">
            <div v-if="errorMessage" class="alert alert-danger py-2 small fw-medium">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success py-2 small fw-medium">{{ successMessage }}</div>

            <div v-if="modalMode === 'EDIT'" class="row g-3 mb-4 pb-3 border-bottom">
              <div class="col-12"><h6 class="fw-bold mb-0 text-muted">Thông tin gốc (Không thể sửa)</h6></div>
              <div class="col-md-3"><label class="form-label small text-muted">Danh mục</label><input :value="formInfo.tenDanhMuc" class="form-control bg-light" readonly /></div>
              <div class="col-md-3"><label class="form-label small text-muted">Thương hiệu</label><input :value="formInfo.tenThuongHieu" class="form-control bg-light" readonly /></div>
              <div class="col-md-3"><label class="form-label small text-muted">Kiểu dáng</label><input :value="formInfo.tenKieuDang" class="form-control bg-light" readonly /></div>
              <div class="col-md-3"><label class="form-label small text-muted">Chất liệu</label><input :value="formInfo.tenChatLieu" class="form-control bg-light" readonly /></div>
            </div>

            <div class="row g-3">
              <div class="col-12" v-if="modalMode === 'EDIT'"><h6 class="fw-bold mb-0 text-muted">Thuộc tính biến thể</h6></div>
              
              <div class="col-md-6">
                <label class="form-label small text-muted">Mã SKU (Tự động)</label>
                <input :value="modalMode === 'ADD' ? generateSku : form.maSku" type="text" class="form-control bg-light" readonly />
              </div>
              <div class="col-md-6">
                <label class="form-label small text-muted">Trạng thái *</label>
                <select v-model="form.trangThai" class="form-select">
                  <option :value="1">Kinh doanh</option>
                  <option :value="0">Ngừng kinh doanh</option>
                </select>
              </div>

              <div class="col-md-3">
                <label class="form-label small text-muted">Màu sắc *</label>
                <select v-model="form.idMauSac" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="mau in listMauSac" :key="mau.id" :value="mau.id">{{ mau.tenMau }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small text-muted">Kích cỡ *</label>
                <select v-model="form.idKichCo" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="size in listKichCo" :key="size.id" :value="size.id">{{ size.tenKichCo }}</option>
                </select>
              </div>

              <div v-if="modalMode === 'EDIT'" class="col-md-3">
                <label class="form-label small text-muted">Cổ áo *</label>
                <select v-model="form.idCoAo" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="co in listCoAo" :key="co.id" :value="co.id">{{ co.tenCoAo }}</option>
                </select>
              </div>
              <div v-if="modalMode === 'EDIT'" class="col-md-3">
                <label class="form-label small text-muted">Tay áo *</label>
                <select v-model="form.idTayAo" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="tay in listTayAo" :key="tay.id" :value="tay.id">{{ tay.tenTayAo }}</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label small text-muted">Giá nhập *</label>
                <input :value="formatInput(form.giaNhap)" @input="handleMoneyInput($event, 'giaNhap')" type="text" class="form-control" placeholder="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label small text-muted">Giá bán *</label>
                <input :value="formatInput(form.giaBan)" @input="handleMoneyInput($event, 'giaBan')" type="text" class="form-control" placeholder="0" />
              </div> 
              <div class="col-md-4">
                <label class="form-label small text-muted">Số lượng tồn *</label>
                <input v-model.number="form.soLuongTon" type="number" class="form-control" min="0" placeholder="0" />
              </div>

              <div class="col-12 mt-3 border-top pt-3">
                <div class="row">
                  <div class="col-md-8">
                    <label class="form-label small fw-bold text-muted">Hình ảnh đại diện *</label>
                    <input type="file" @change="handleFileUpload" class="form-control mb-2" accept="image/*" />
                    
                    <div v-if="previewImage" class="mt-2">
                      <img 
                        :src="getSingleImage(previewImage)" 
                        class="shadow-sm"
                        style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #ccc" 
                        @error="$event.target.src = 'https://placehold.co/120x120?text=Loi+Anh'"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 text-center" v-if="modalMode === 'EDIT' && form.maSku">
                    <label class="form-label small fw-bold text-muted">Mã QR Nhận Diện</label>
                    <div class="p-3 border rounded shadow-sm bg-white d-inline-flex flex-column align-items-center">
                      <img 
                        :src="`http://localhost:8080/api/sanpham-chitiet/qr/${form.maSku}`" 
                        style="width: 110px; height: 110px; object-fit: contain;" 
                        alt="QR Code"
                        id="qr-image"
                      />
                      <div class="small fw-bold mt-2 text-primary">{{ form.maSku }}</div>
                      
                      <button @click.prevent="downloadQR(form.maSku)" class="btn btn-sm btn-outline-secondary mt-2 rounded-pill px-3 shadow-none d-flex align-items-center gap-1" style="font-size: 0.8rem;">
                        <i class="bi bi-download"></i> Tải QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer border-0">
            <button @click="closeModal" class="btn btn-light rounded-pill px-4 shadow-none">Hủy</button>
            <button @click="validateAndTriggerConfirm" class="btn text-white rounded-pill px-4 shadow-none" style="background-color: #8c6b5d">
              {{ modalMode === 'ADD' ? 'Thêm mới' : 'Cập nhật' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body" v-if="isShowModalSuaCuaTuanAnh">
      <div class="confirm-overlay">
        <div class="confirm-modal-card animate__animated animate__fadeInDown animate__faster">
          <div class="confirm-icon-area" style="color: #5a4031 !important;">
            <i class="bi bi-pencil-square"></i>
          </div>
          <h5 class="confirm-title" style="color: #5a4031;">Xác Nhận Thay Đổi</h5>
          <p class="confirm-message">
            Hệ thống sẽ ghi nhận những thay đổi này của biến thể sản phẩm. Bạn có chắc chắn muốn tiến hành lưu không?
          </p>
          <div class="confirm-actions">
            <button @click="isShowModalSuaCuaTuanAnh = false" class="btn-cancel-custom">Xem lại</button>
            <button @click="confirmUpdateDetails" class="btn-confirm-custom" style="background-color: #ebdcd0; color: #5a4031;">Xác nhận lưu</button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="isScanning" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1055;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-dark text-white border-0">
            <h5 class="modal-title"><i class="bi bi-camera-video"></i> Đưa mã QR vào khung hình</h5>
            <button type="button" class="btn-close btn-close-white shadow-none" @click="dongCameraScan"></button>
          </div>
          <div class="modal-body text-center p-4">
            <div id="qr-reader" style="width: 100%; border-radius: 8px; overflow: hidden;"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showToast" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin-top: 60px;">
      <div class="toast show shadow-lg border-0 rounded-3" :style="toastType === 'success' ? 'background-color: #f4fbf7; border-left: 5px solid #2e7d32;' : 'background-color: #fff5f5; border-left: 5px solid #ef4444;'">
        <div class="d-flex align-items-center px-3 py-2">
          <i class="bi fs-4 me-3" :class="toastType === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'"></i>
          <div class="d-flex flex-column py-1">
            <span class="fw-bold" :class="toastType === 'success' ? 'text-success' : 'text-danger'">{{ toastType === 'success' ? 'Thành công' : 'Thất bại' }}</span>
            <span class="small text-dark">{{ toastMessage }}</span>
          </div>
          <button type="button" class="btn-close ms-auto" @click="showToast = false"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';

// ==================== QUẢN LÝ CHECKBOX & TẢI MÃ QR HÀNG LOẠT ====================
const selectedSkus = ref([]);
const isAllSelected = ref(false);

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedSkus.value = filteredProducts.value.map(item => item.maSku);
  } else {
    selectedSkus.value = [];
  }
};

watch(selectedSkus, (newVal) => {
  if (filteredProducts.value.length > 0) {
    isAllSelected.value = newVal.length === filteredProducts.value.length;
  }
});

const downloadBulkQR = async () => {
  if (selectedSkus.value.length === 0) return;
  try {
    triggerToast("Hệ thống đang đóng gói file ZIP, vui lòng đợi giây lát...", "success");
    const response = await axios.post(
      'http://localhost:8080/api/sanpham-chitiet/qr/download-zip', 
      selectedSkus.value, 
      { responseType: 'blob' }
    );
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QRCodes_Bulk_${Date.now().toString().slice(-4)}.zip`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    triggerToast(`Đã tải thành công ${selectedSkus.value.length} mã QR!`, "success");
    selectedSkus.value = [];
    isAllSelected.value = false;
  } catch (error) {
    console.error("Lỗi khi tải zip QR:", error);
    triggerToast("Lỗi khi đóng gói file ZIP! Vui lòng thử lại.", "danger");
  }
};

// ==================== LOGIC QUÉT MÃ QR ====================
const isScanning = ref(false);
let html5QrcodeScanner = null;

const moCameraScan = async () => {
  isScanning.value = true;
  await nextTick(); 
  html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { 
    fps: 10, 
    qrbox: { width: 250, height: 250 } 
  }, false);
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
};

const onScanSuccess = async (decodedText) => {
  let maSkuCanTim = decodedText;
  if (decodedText.includes("SKU: ")) {
    maSkuCanTim = decodedText.split("SKU: ")[1].trim();
  }
  filter.keyword = maSkuCanTim; 
  dongCameraScan();
  try {
    await fetchChiTietMaSP(); 
  } catch (error) {
    console.error("Lỗi khi tự động lọc dữ liệu:", error);
  }
};

const onScanFailure = (error) => {};

const dongCameraScan = () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(error => console.error("Lỗi khi tắt camera", error));
  }
  isScanning.value = false;
};

// ==========================================================
const route = useRoute();
const isShowModalSuaCuaTuanAnh = ref(false);

const confirmUpdateDetails = async () => {
  isShowModalSuaCuaTuanAnh.value = false;
  await saveData(); 
};

const filter = reactive({
  keyword: '', maxPrice: 5000000, thuongHieu: '', mauSac: '',
  kichCo: '', coAo: '', tayAo: '', conHang: false
});

const resetFilter = () => {
  filter.keyword = ''; filter.maxPrice = 5000000; filter.thuongHieu = '';
  filter.mauSac = ''; filter.kichCo = ''; filter.coAo = ''; filter.tayAo = ''; filter.conHang = false;
};

const listProducts = ref([]);
const showModal = ref(false);
const modalMode = ref('ADD'); 
const errorMessage = ref('');
const successMessage = ref(''); 
const previewImage = ref(null);
const maSanPhamHienTai = ref('Đang tải...'); 

const showToast = ref(false);
const toastType = ref('success');
const toastMessage = ref('');
const triggerToast = (msg, type = 'danger') => {
  toastMessage.value = msg; toastType.value = type; showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};

const listMauSac = ref([]); const listKichCo = ref([]); const listCoAo = ref([]); 
const listTayAo = ref([]); const listThuongHieu = ref([]);

const form = reactive({
  id: null, maSku: '', idMauSac: '', idKichCo: '', idCoAo: '', idTayAo: '',
  soLuongTon: 0, giaNhap: 0, giaBan: 0, trangThai: 1, fileAnh: null
});

const formInfo = reactive({
  tenDanhMuc: '', tenThuongHieu: '', tenKieuDang: '', tenChatLieu: ''
});

// ==================== TÍNH TOÁN GIẢM GIÁ (GIẢ LẬP THEO SHOPEE) ====================
// Hàm lấy % giảm giá từ object (nếu backend chưa có, mình giả lập hoặc gọi ra từ item)
const getPhanTramGiam = (item) => {
  // Giả định backend trả về phanTramGiam, nếu không có thì trả về 0 (hoặc thay bằng số fix như 10 để test UI)
  return item.phanTramGiam || 10; // Thay 10 thành 0 nếu muốn ẩn khi không có giảm giá
};

const tinhGiaSauGiam = (giaGoc, phanTram) => {
  if (!giaGoc) return 0;
  // Làm tròn tuyệt đối về số nguyên (Đơn vị Đồng)
  return Math.round(giaGoc * (1 - phanTram / 100)); 
};

const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '') return '0đ';
  const cleanVal = val.toString().replace(/\./g, '').replace(/đ/g, '');
  return cleanVal.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
};

const formatInput = (val) => {
  if (val === null || val === undefined || val === '') return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const handleMoneyInput = (e, key) => {
  const clean = e.target.value.replace(/\D/g, ''); 
  form[key] = parseInt(clean, 10) || 0;
};

const filteredProducts = computed(() => {
  return listProducts.value.filter(item => {
    const matchKeyword = !filter.keyword || 
      (item.maSku && item.maSku.toLowerCase().includes(filter.keyword.toLowerCase())) ||
      (item.tenMau && item.tenMau.toLowerCase().includes(filter.keyword.toLowerCase())) ||
      (item.tenKichCo && item.tenKichCo.toLowerCase().includes(filter.keyword.toLowerCase()));
      
    const matchPrice = !item.giaBan || item.giaBan <= filter.maxPrice;
    const matchThuongHieu = !filter.thuongHieu || item.tenThuongHieu === filter.thuongHieu;
    const matchMau = !filter.mauSac || item.tenMau === filter.mauSac;
    const matchSize = !filter.kichCo || item.tenKichCo === filter.kichCo;
    const matchCoAo = !filter.coAo || item.tenCoAo === filter.coAo;
    const matchTayAo = !filter.tayAo || item.tenTayAo === filter.tayAo;
    const matchStock = !filter.conHang || item.soLuongTon > 0;

    return matchKeyword && matchPrice && matchThuongHieu && matchMau && matchSize && matchCoAo && matchTayAo && matchStock;
  });
});

const validateAndTriggerConfirm = () => {
  errorMessage.value = ''; successMessage.value = '';

  if (!form.idMauSac || !form.idKichCo) {
    errorMessage.value = "Vui lòng chọn đầy đủ thông tin Màu sắc và Kích cỡ!"; return;
  }
  if (modalMode.value === 'EDIT' && (!form.idCoAo || !form.idTayAo)) {
    errorMessage.value = "Vui lòng nhập đầy đủ thông tin thuộc tính Cổ áo và Tay áo!"; return;
  }
  if (form.soLuongTon === '' || form.soLuongTon === null || form.giaNhap === '' || form.giaBan === '') {
    errorMessage.value = "Vui lòng điền đầy đủ Giá nhập, Giá bán và Số lượng tồn kho!"; return;
  }
  if (parseInt(form.soLuongTon, 10) < 0 || parseFloat(form.giaNhap) < 0 || parseFloat(form.giaBan) <= 0) {
    errorMessage.value = "Số lượng/Giá nhập không được nhỏ hơn 0 và Giá bán ra phải lớn hơn 0đ!"; return;
  }
  if (parseFloat(form.giaBan) < parseFloat(form.giaNhap)) {
    errorMessage.value = "Cảnh báo: Giá bán ra đang nhỏ hơn Giá nhập vào (Bán lỗ)!"; return;
  }
  if (modalMode.value === 'ADD' && !form.fileAnh) {
    errorMessage.value = "Vui lòng tải tệp hình ảnh đại diện từ máy tính lên!"; return;
  }
  isShowModalSuaCuaTuanAnh.value = true;
};

const getSingleImage = (imageString) => {
  if (!imageString) return 'https://placehold.co/50x50?text=No+Image';
  if (imageString.startsWith('data:image') || imageString.startsWith('http')) return imageString.trim();
  let singleName = imageString.includes(',') ? imageString.split(',')[0].trim() : imageString.trim();
  return `http://localhost:8080/api/sanpham-chitiet/images/${singleName}`;
};

const generateSku = computed(() => `${maSanPhamHienTai.value}_SKU_${Date.now().toString().slice(-4)}`);

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.fileAnh = file;
    const reader = new FileReader();
    reader.onload = (event) => { previewImage.value = event.target.result; };
    reader.readAsDataURL(file);
  }
};

const fetchChiTietMaSP = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${route.params.id}`);
    // Đảo ngược mảng để sản phẩm mới nhất lên đầu (sắp xếp ID giảm dần)
    listProducts.value = res.data.sort((a, b) => b.id - a.id);
    if (listProducts.value.length > 0) {
      const sku = listProducts.value[0].maSku || '';
      maSanPhamHienTai.value = sku.split('_')[0] || `SP${route.params.id}`; 
    } else {
      maSanPhamHienTai.value = `SP${route.params.id}`;
    }
  } catch (err) { 
    console.error(err);
    maSanPhamHienTai.value = `SP${route.params.id}`; 
  }
};

const fetchThuocTinh = async () => {
  try {
    const [resMau, resSize, resCo, resTay, resThuongHieu] = await Promise.all([
      axios.get('http://localhost:8080/api/mau-sac'), axios.get('http://localhost:8080/api/kich-co'),
      axios.get('http://localhost:8080/api/co-ao'), axios.get('http://localhost:8080/api/tay-ao'),
      axios.get('http://localhost:8080/api/thuong-hieu')
    ]);
    listMauSac.value = resMau.data; listKichCo.value = resSize.data;
    listCoAo.value = resCo.data; listTayAo.value = resTay.data; listThuongHieu.value = resThuongHieu.data;
  } catch (err) { console.error(err); }
};

const openModal = (mode, data = null) => {
  modalMode.value = mode; errorMessage.value = ''; successMessage.value = ''; previewImage.value = null;
  if (mode === 'EDIT' && data) {
    Object.assign(form, {
      id: data.id, maSku: data.maSku, soLuongTon: data.soLuongTon, 
      giaNhap: data.giaNhap, giaBan: data.giaBan, trangThai: data.trangThai, fileAnh: null,
      idMauSac: data.idMauSac || data.mauSac?.id || '', idKichCo: data.idKichCo || data.kichCo?.id || '', 
      idCoAo: data.idCoAo || data.coAo?.id || '', idTayAo: data.idTayAo || data.tayAo?.id || ''
    });
    Object.assign(formInfo, {
      tenDanhMuc: data.tenDanhMuc || 'Áo dài', tenThuongHieu: data.tenThuongHieu || 'Mặc định', 
      tenKieuDang: data.tenKieuDang || 'Truyền thống', tenChatLieu: data.tenChatLieu || 'Lụa'
    });
    previewImage.value = getSingleImage(data.hinhAnh);
  } else {
    Object.assign(form, { 
      id: null, maSku: '', idMauSac: '', idKichCo: '', idCoAo: '', idTayAo: '', 
      soLuongTon: '', giaNhap: '', giaBan: '', trangThai: 1, fileAnh: null 
    });
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const saveData = async () => {
  const formData = new FormData();
  if (form.fileAnh) {
    formData.append("file", form.fileAnh);
  } else {
    const emptyBlob = new Blob([""], { type: "image/jpeg" });
    formData.append("file", emptyBlob, "default.jpg");
  }
  
  const giaNhapSo = Number(form.giaNhap.toString().replace(/\D/g, '')) || 0;
  const giaBanSo = Number(form.giaBan.toString().replace(/\D/g, '')) || 0;
  const soLuongSo = parseInt(form.soLuongTon.toString().replace(/\D/g, ''), 10) || 0;

  const submitData = {
    id: form.id ? Number(form.id) : null, maSku: form.maSku || generateSku.value,
    giaNhap: giaNhapSo, giaBan: giaBanSo, soLuongTon: soLuongSo, trangThai: Number(form.trangThai),
    sanPham: { id: Number(route.params.id) }, mauSac: { id: Number(form.idMauSac) },
    kichCo: { id: Number(form.idKichCo) }, hinhAnh: !form.fileAnh ? (previewImage.value || '') : ''
  };
  
  if (modalMode.value === 'EDIT') {
    submitData.coAo = form.idCoAo ? { id: Number(form.idCoAo) } : null;
    submitData.tayAo = form.idTayAo ? { id: Number(form.idTayAo) } : null;
  }

  formData.append("data", JSON.stringify(submitData));

  try {
    const url = modalMode.value === 'ADD' ? '/api/sanpham-chitiet/them' : `/api/sanpham-chitiet/cap-nhat/${form.id}`;
    await axios.post(`http://localhost:8080${url}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    successMessage.value = "Hệ thống đã ghi nhận và lưu dữ liệu thành công!";
    errorMessage.value = '';
    await fetchChiTietMaSP();
    setTimeout(() => { closeModal(); }, 800);
  } catch (err) {
    console.error("Lỗi sập 500/400 từ Backend:", err);
    const errorMsgFromServer = err.response?.data;
    errorMessage.value = typeof errorMsgFromServer === 'string' 
      ? errorMsgFromServer 
      : "Lỗi 500: Hãy kiểm tra xem mã SKU này có bị trùng hoặc lỗi khóa ngoại ở Database không!";
  }
};

onMounted(() => {
  fetchChiTietMaSP();
  fetchThuocTinh();
});

const computedPreviewImage = computed(() => {
  if (!previewImage.value) return '';
  if (previewImage.value.startsWith('data:') || previewImage.value.startsWith('http')) return previewImage.value;
  return `http://localhost:8080/api/sanpham-chitiet/images/${previewImage.value}`;
});

const downloadQR = async (sku) => {
  try {
    const imageUrl = `http://localhost:8080/api/sanpham-chitiet/qr/${sku}`;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QR_${sku}.png`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Lỗi khi tải mã QR:", error);
    errorMessage.value = "Không thể tải mã QR, vui lòng thử lại!";
  }
};
</script>

<style scoped>
.form-select, .form-control { border-color: #dee2e6; font-size: 0.9rem; }
.form-control:focus, .form-select:focus { box-shadow: none; border-color: #8c6b5d; }
.table thead th { font-size: 0.8rem; color: #5a4031; font-weight: 600; white-space: nowrap; }
.form-range { accent-color: #8c6b5d; }
.bg-light { background-color: #f8f9fa !important; pointer-events: none; }
.cursor-pointer { cursor: pointer; }

/* CSS Hộp thoại Confirm Sản phẩm Custom */
.confirm-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4); display: flex; align-items: center;
  justify-content: center; z-index: 99999; backdrop-filter: blur(3px);
}

.confirm-modal-card {
  background: white; padding: 30px; border-radius: 16px; width: 100%;
  max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.25s ease-out;
}

.confirm-icon-area { font-size: 45px; color: #8a6d5b; margin-bottom: 15px; }
.confirm-title { font-weight: 700; color: #5a4031; margin-bottom: 10px; }
.confirm-message { font-size: 14px; color: #6c757d; line-height: 1.6; margin-bottom: 25px; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }

.btn-cancel-custom {
  background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6;
  padding: 8px 24px; border-radius: 50px; font-weight: 500; cursor: pointer; transition: all 0.2s;
}
.btn-cancel-custom:hover { background: #e2e8f0; }

.btn-confirm-custom {
  background-color: #ebdcd0; color: #5a4031; border: 1px solid #cbb3a1;
  padding: 8px 24px; border-radius: 50px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-confirm-custom:hover { background-color: #dccbc0; transform: translateY(-1px); }

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>