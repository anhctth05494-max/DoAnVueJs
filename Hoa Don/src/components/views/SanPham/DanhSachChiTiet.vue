<template>
  <div class="container-fluid p-0">
    <div
      v-if="showToast"
      class="position-fixed top-0 end-0 p-3"
      style="z-index: 2100; margin-top: 60px"
    >
      <div
        class="toast show shadow-lg border-0 rounded-3"
        :style="
          toastType === 'success'
            ? 'background-color: #f4fbf7; border-left: 5px solid #2e7d32 !important;'
            : 'background-color: #fff5f5; border-left: 5px solid #ef4444 !important;'
        "
        role="alert"
        style="min-width: 320px"
      >
        <div class="d-flex align-items-center px-3 py-2">
          <i
            class="bi fs-4 me-3"
            :class="
              toastType === 'success'
                ? 'bi-check-circle-fill text-success'
                : 'bi-exclamation-triangle-fill text-danger'
            "
          ></i>

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

    <div class="card border-0 shadow-sm mb-4 rounded-3">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-3">
          <i class="bi bi-funnel text-dark me-2 fs-5"></i>
          <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm chi tiết</h6>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Tìm kiếm</label>
            <div class="input-group">
              <span
                class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted"
              >
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="searchMaTen"
                type="text"
                class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle"
                placeholder="Tìm theo mã / tên SP..."
              />
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Danh mục</label>
            <select
              v-model="searchDanhMuc"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả danh mục</option>
              <option v-for="dm in listDanhMuc" :key="dm.id" :value="dm.tenDanhMuc || dm.ten">
                {{ dm.tenDanhMuc || dm.ten }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Thương hiệu</label>
            <select
              v-model="searchThuongHieu"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả thương hiệu</option>
              <option v-for="th in listThuongHieu" :key="th.id" :value="th.tenThuongHieu || th.ten">
                {{ th.tenThuongHieu || th.ten }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Chất liệu</label>
            <select
              v-model="searchChatLieu"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả chất liệu</option>
              <option v-for="cl in listChatLieu" :key="cl.id" :value="cl.tenChatLieu">
                {{ cl.tenChatLieu }}
              </option>
            </select>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-2">
            <label class="form-label text-muted small mb-1">Kiểu dáng</label>
            <select
              v-model="searchKieuDang"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả</option>
              <option v-for="kd in listKieuDang" :key="kd.id" :value="kd.tenKieuDang">
                {{ kd.tenKieuDang }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label text-muted small mb-1">Cổ áo</label>
            <select
              v-model="searchCoAo"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả</option>
              <option v-for="ca in listCoAo" :key="ca.id" :value="ca.tenCoAo">
                {{ ca.tenCoAo }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label text-muted small mb-1">Tay áo</label>
            <select
              v-model="searchTayAo"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả</option>
              <option v-for="ta in listTayAo" :key="ta.id" :value="ta.tenTayAo">
                {{ ta.tenTayAo }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Màu sắc</label>
            <select
              v-model="searchMauSac"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả màu</option>
              <option v-for="ms in listMauSac" :key="ms.id" :value="ms.tenMau">
                {{ ms.tenMau }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Kích cỡ</label>
            <select
              v-model="searchKichCo"
              class="form-select rounded-pill shadow-none border-secondary-subtle text-muted custom-select-filter"
            >
              <option value="">Tất cả size</option>
              <option v-for="kc in listKichCo" :key="kc.id" :value="kc.tenKichCo">
                {{ kc.tenKichCo }}
              </option>
            </select>
          </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between align-items-end">
          <div class="d-flex gap-4 align-items-center flex-wrap">
            <div>
              <label class="form-label text-muted small mb-2 d-block">Trạng thái</label>
              <div class="d-flex gap-3 px-3 py-2 border border-secondary-subtle rounded-pill">
                <div class="form-check mb-0">
                  <input
                    v-model="searchStatus"
                    class="form-check-input shadow-none"
                    type="radio"
                    value="Đang bán"
                    id="statusKinhDoanh"
                  />
                  <label class="form-check-label small text-dark" for="statusKinhDoanh"
                    >Kinh doanh</label
                  >
                </div>
                <div class="form-check mb-0">
                  <input
                    v-model="searchStatus"
                    class="form-check-input shadow-none"
                    type="radio"
                    value="Ngừng bán"
                    id="statusNgung"
                  />
                  <label class="form-check-label small text-dark" for="statusNgung">Ngừng KD</label>
                </div>
                <div class="form-check mb-0">
                  <input
                    v-model="searchStatus"
                    class="form-check-input shadow-none"
                    type="radio"
                    value="Tất cả"
                    id="statusTatCa"
                  />
                  <label class="form-check-label small text-dark" for="statusTatCa">Tất cả</label>
                </div>
              </div>
            </div>

            <div>
              <label class="form-label text-muted small mb-2 d-block">Tồn kho</label>
              <div
                class="form-check form-switch px-4 py-2 border border-secondary-subtle rounded-pill d-flex align-items-center gap-2"
              >
                <input
                  v-model="onlyInStock"
                  class="form-check-input shadow-none m-0"
                  type="checkbox"
                  id="stockSwitch"
                  style="cursor: pointer"
                />
                <label
                  class="form-check-label small text-dark"
                  for="stockSwitch"
                  style="cursor: pointer"
                  >Chỉ hiển thị tồn kho > 0</label
                >
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-3 mt-md-0">
            <RouterLink
              to="/san-pham"
              class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
            >
              <i class="bi bi-arrow-left"></i> Về danh sách tổng
            </RouterLink>
            <button
              @click="resetFilter"
              class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
            >
              <i class="bi bi-arrow-clockwise"></i> Đặt lại
            </button>
            <button
              data-bs-toggle="modal"
              data-bs-target="#qrScanModal"
              @click="startScanner"
              class="btn btn-dark rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
              style="background-color: #5a4031; border: none"
            >
              <i class="bi bi-qr-code-scan"></i> Quét QR
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-3">
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle text-nowrap" style="font-size: 0.9rem">
            <thead>
              <tr>
                <th
                  class="py-3 px-3 border-0 rounded-start fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  STT
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  MÃ SKU
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  TÊN SẢN PHẨM
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  MÀU SẮC
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  KÍCH THƯỚC
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold text-end"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  GIÁ BÁN
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold text-center"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  SL TỒN
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold text-center"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  TRẠNG THÁI
                </th>
                <th
                  class="py-3 px-3 border-0 rounded-end text-center fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody class="border-top-0 text-secondary">
              <tr v-for="(item, index) in paginatedProducts" :key="item.id">
                <td class="py-3 px-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-3 px-3 text-dark fw-medium">{{ item.maSku }}</td>
                <td class="py-3 px-3 text-dark">{{ item.tenSanPham }}</td>
                <td class="py-3 px-3">{{ item.tenMau }}</td>
                <td class="py-3 px-3">{{ item.tenKichCo }}</td>
                <td class="py-3 px-3 text-end fw-medium text-dark">
                  {{ formatCurrency(item.giaBan) }}
                </td>
                <td class="py-3 px-3 text-center fw-bold text-dark">{{ item.soLuongTon }}</td>
                <td class="py-3 px-3 text-center">
                  <span
                    :class="[
                      'badge rounded-pill px-3 py-2 fw-medium',
                      item.soLuongTon > 0 ? 'bg-primary text-white' : 'bg-danger text-white',
                    ]"
                    style="opacity: 0.85"
                  >
                    {{ item.soLuongTon > 0 ? 'Kinh doanh' : 'Ngừng KD' }}
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <i
                    class="bi bi-eye text-dark fs-5"
                    style="cursor: pointer"
                    title="Xem chi tiết"
                    data-bs-toggle="modal"
                    data-bs-target="#detailModal"
                    @click="selectItem(item)"
                  ></i>
                </td>
              </tr>
              <tr v-if="paginatedProducts.length === 0">
                <td colspan="9" class="text-center py-5 text-danger fw-medium">
                  <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                  Không tìm thấy biến thể nào phù hợp với bộ lọc.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="filteredProducts.length > 0"
          class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small flex-wrap gap-3"
        >
          <div>
            Hiển thị <span class="fw-bold text-dark">{{ paginatedProducts.length }}</span> /
            <span class="fw-bold text-dark">{{ filteredProducts.length }}</span> bản ghi
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
              class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted pe-4"
              style="width: auto"
            >
              <option :value="5">Hiển thị 5 bản ghi / trang</option>
              <option :value="10">Hiển thị 10 bản ghi / trang</option>
              <option :value="20">Hiển thị 20 bản ghi / trang</option>
              <option :value="30">Hiển thị 30 bản ghi / trang</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold" style="color: #5a4031">Chi tiết biến thể</h5>
            <button
              type="button"
              class="btn-close shadow-none"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedProduct">
            <div class="text-center mb-4">
              <img
                v-if="selectedProduct && selectedProduct.hinhAnh"
                :src="getImageUrl(selectedProduct.hinhAnh)"
                alt="Ảnh sản phẩm"
                class="img-fluid rounded-3 shadow-sm"
                style="max-height: 250px; object-fit: cover"
              />
              <div v-else class="p-5 bg-light rounded-3 text-muted">
                <i cl ass="bi bi-image fs-1 d-block mb-2"></i> Chưa có hình ảnh
              </div>
            </div>
            <div class="row g-3">
              <div class="col-12">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Tên sản phẩm</span
                  ><span class="fw-bold text-dark">{{ selectedProduct.tenSanPham }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Mã SKU</span
                  ><span class="fw-medium text-dark">{{ selectedProduct.maSku }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Danh mục</span
                  ><span class="fw-medium text-dark">{{
                    selectedProduct.tenDanhMuc || 'N/A'
                  }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Kiểu dáng</span
                  ><span class="fw-medium text-dark">{{
                    selectedProduct.tenKieuDang || 'N/A'
                  }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Chất liệu</span
                  ><span class="fw-medium text-dark">{{
                    selectedProduct.tenChatLieu || 'N/A'
                  }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Cổ áo</span
                  ><span class="fw-medium text-dark">{{ selectedProduct.tenCoAo || 'N/A' }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Tay áo</span
                  ><span class="fw-medium text-dark">{{ selectedProduct.tenTayAo || 'N/A' }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Giá nhập</span
                  ><span class="fw-bold text-danger">{{
                    formatCurrency(selectedProduct.giaNhap)
                  }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3">
                  <span class="text-muted small d-block">Giá bán</span
                  ><span class="fw-bold text-success">{{
                    formatCurrency(selectedProduct.giaBan)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="qrScanModal"
      tabindex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold" style="color: #5a4031">
              <i class="bi bi-qr-code-scan me-2"></i>Quét mã QR Sản Phẩm
            </h5>
            <button
              id="closeQrModalBtn"
              type="button"
              class="btn-close shadow-none"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="stopScanner"
            ></button>
          </div>
          <div class="modal-body p-4 text-center">
            <div
              id="reader"
              style="width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid #dee2e6"
            ></div>
            <p class="text-muted small mt-3 mb-0">
              Đưa mã QR (Mã SKU) của sản phẩm vào khung hình để tìm kiếm tự động.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { Html5QrcodeScanner } from 'html5-qrcode' // THƯ VIỆN QR

const products = ref([])
const selectedProduct = ref(null)

// Các biến Toast
const showToast = ref(false)
const toastType = ref('success')
const toastMessage = ref('')
const triggerToast = (msg, type = 'danger') => {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

// Các biến bộ lọc
const searchMaTen = ref('')
const searchDanhMuc = ref('')
const searchThuongHieu = ref('')
const searchChatLieu = ref('')
const searchKieuDang = ref('')
const searchCoAo = ref('')
const searchTayAo = ref('')
const searchMauSac = ref('')
const searchKichCo = ref('')
const searchStatus = ref('Tất cả')
const onlyInStock = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(10)

const listDanhMuc = ref([])
const listThuongHieu = ref([])
const listChatLieu = ref([])
const listKieuDang = ref([])
const listMauSac = ref([])
const listKichCo = ref([])
const listCoAo = ref([])
const listTayAo = ref([])

const formatCurrency = (val) => {
  if (val == null) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const fetchProducts = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/sanpham-chitiet/all-dto`)
    const data = await response.json()
    products.value = data
  } catch (error) {
    console.error('Lỗi khi tải biến thể sản phẩm:', error)
  }
}

const fetchAllDropdowns = async () => {
  try {
    const [resDM, resTH, resCL, resKD, resMS, resKC, resCA, resTA] = await Promise.all([
      axios.get('http://localhost:8080/api/danh-muc'),
      axios.get('http://localhost:8080/api/thuong-hieu'),
      axios.get('http://localhost:8080/api/chat-lieu'),
      axios.get('http://localhost:8080/api/kieu-dang'),
      axios.get('http://localhost:8080/api/mau-sac'),
      axios.get('http://localhost:8080/api/kich-co'),
      axios.get('http://localhost:8080/api/co-ao'),
      axios.get('http://localhost:8080/api/tay-ao'),
    ])
    listDanhMuc.value = resDM.data.filter((i) => i.trangThai === 1)
    listThuongHieu.value = resTH.data.filter((i) => i.trangThai === 1)
    listChatLieu.value = resCL.data.filter((i) => i.trangThai === 1)
    listKieuDang.value = resKD.data.filter((i) => i.trangThai === 1)
    listMauSac.value = resMS.data.filter((i) => i.trangThai === 1)
    listKichCo.value = resKC.data.filter((i) => i.trangThai === 1)
    listCoAo.value = resCA.data.filter((i) => i.trangThai === 1)
    listTayAo.value = resTA.data.filter((i) => i.trangThai === 1)
  } catch (err) {
    console.error('Lỗi khi tải bộ lọc gốc:', err)
  }
}

onMounted(() => {
  fetchProducts()
  fetchAllDropdowns()
})

const filteredProducts = computed(() => {
  let result = products.value
  if (searchMaTen.value) {
    const kw = searchMaTen.value.toLowerCase().trim()
    result = result.filter(
      (item) =>
        (item.maSku && item.maSku.toLowerCase().includes(kw)) ||
        (item.tenSanPham && item.tenSanPham.toLowerCase().includes(kw)),
    )
  }
  if (searchDanhMuc.value) result = result.filter((i) => i.tenDanhMuc === searchDanhMuc.value)
  if (searchThuongHieu.value)
    result = result.filter((i) => i.tenThuongHieu === searchThuongHieu.value)
  if (searchChatLieu.value) result = result.filter((i) => i.tenChatLieu === searchChatLieu.value)
  if (searchKieuDang.value) result = result.filter((i) => i.tenKieuDang === searchKieuDang.value)
  if (searchCoAo.value) result = result.filter((i) => i.tenCoAo === searchCoAo.value)
  if (searchTayAo.value) result = result.filter((i) => i.tenTayAo === searchTayAo.value)
  if (searchMauSac.value) result = result.filter((i) => i.tenMau === searchMauSac.value)
  if (searchKichCo.value) result = result.filter((i) => i.tenKichCo === searchKichCo.value)
  if (searchStatus.value !== 'Tất cả') {
    const isKinhDoanh = searchStatus.value === 'Đang bán' || searchStatus.value === 'Kinh doanh'
    result = result.filter((i) => i.soLuongTon > 0 === isKinhDoanh)
  }
  if (onlyInStock.value) result = result.filter((i) => i.soLuongTon > 0)
  return result
})

const totalPages = computed(
  () => Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1,
)
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

watch(
  [
    searchMaTen,
    searchDanhMuc,
    searchThuongHieu,
    searchChatLieu,
    searchKieuDang,
    searchCoAo,
    searchTayAo,
    searchMauSac,
    searchKichCo,
    searchStatus,
    onlyInStock,
    itemsPerPage,
  ],
  () => {
    currentPage.value = 1
  },
)

const resetFilter = () => {
  searchMaTen.value = ''
  searchDanhMuc.value = ''
  searchThuongHieu.value = ''
  searchChatLieu.value = ''
  searchKieuDang.value = ''
  searchCoAo.value = ''
  searchTayAo.value = ''
  searchMauSac.value = ''
  searchKichCo.value = ''
  searchStatus.value = 'Tất cả'
  onlyInStock.value = false
  currentPage.value = 1
}

const selectItem = (item) => {
  selectedProduct.value = item
}

// ======================= LOGIC QUÉT MÃ QR =======================
let html5QrcodeScanner = null

const startScanner = () => {
  // Đợi DOM render modal xong mới gắn camera vào div#reader
  setTimeout(() => {
    if (!html5QrcodeScanner) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      )
    }
    html5QrcodeScanner.render(onScanSuccess)
  }, 300)
}

const stopScanner = () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch((err) => console.error('Lỗi tắt camera:', err))
    html5QrcodeScanner = null
  }
}

const onScanSuccess = (decodedText) => {
  // 1. Làm sạch và cắt bỏ chữ "SKU: " thừa từ mã QR
  let cleanText = decodedText.trim()
  if (cleanText.toUpperCase().startsWith('SKU:')) {
    cleanText = cleanText.replace(/SKU:\s*/i, '').trim()
  }

  // 2. Reset TẤT CẢ các ô lọc khác để nhường chỗ cho mã QR
  searchDanhMuc.value = ''
  searchThuongHieu.value = ''
  searchChatLieu.value = ''
  searchKieuDang.value = ''
  searchCoAo.value = ''
  searchTayAo.value = ''
  searchMauSac.value = ''
  searchKichCo.value = ''
  searchStatus.value = 'Tất cả'
  onlyInStock.value = false

  // 3. Đẩy mã ĐÃ LÀM SẠCH vào ô tìm kiếm
  searchMaTen.value = cleanText

  // Thông báo và đóng Camera
  triggerToast(`Đã quét và lọc mã: ${cleanText}`, 'success')
  stopScanner()
  const closeBtn = document.getElementById('closeQrModalBtn')
  if (closeBtn) closeBtn.click()
}
// Hàm xử lý đường dẫn ảnh
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // Chú ý: Nếu backend của cậu lưu ảnh ở thư mục khác (ví dụ /uploads/) thì đổi chữ /images/ thành /uploads/ nhé
  return `http://localhost:8080/images/${path}`
}
</script>

<style scoped>
.toast {
  animation: slideInRight 0.4s ease-out;
}
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
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
.custom-select-filter {
  height: 38px !important;
  font-size: 13.5px !important;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}
.custom-select-filter:focus {
  border-color: #cbb3a1 !important;
  box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25) !important;
  color: #212529 !important;
}
.custom-select-filter option {
  color: #333333;
  font-size: 14px;
}
</style>
