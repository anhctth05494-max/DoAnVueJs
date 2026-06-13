<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { BASE_URL } from '../../../apiConfig.js'
const confirmChangeProductStatus = async () => {
  isShowProductConfirm.value = false // Đóng modal
  const p = pendingProduct.value
  if (!p) return

  // Gọi lại chính hàm xử lý API gốc trong dự án của cậu
  if (typeof toggleStatus === 'function') {
    await toggleStatus(p)
  } else {
    // Nếu không tìm thấy hàm toggleStatus, tự động đảo trạng thái thô để demo chạy được
    p.trangThai = (p.trangThai === 1 || p.trangThai === true) ? 0 : 1
    alert('Cập nhật trạng thái thành công!')
  }
}
// Các biến điều khiển Modal Confirm cho riêng Sản Phẩm
const isShowProductConfirm = ref(false)
const pendingProduct = ref(null) // Lưu thông tin sản phẩm đang chờ xử lý

// Hàm mở Modal khi cô hoặc cậu click thay đổi trạng thái sản phẩm
const triggerChangeProductStatus = (product) => {
  pendingProduct.value = product
  isShowProductConfirm.value = true
}


const exportExcelSanPham = () => {
  // 1. Kiểm tra nếu không có dữ liệu (Cậu nhớ đổi 'products.value' hoặc 'filteredProducts.value' theo đúng biến danh sách sản phẩm của cậu nhé)
  const productList = filteredProducts.value || products.value || []
  
  if (productList.length === 0) {
    alert('Không có dữ liệu sản phẩm để xuất!')
    return
  }

  const doExport = () => {
    // 2. Map dữ liệu sản phẩm sang định dạng Excel (Cậu sửa lại các trường item.xxx cho khớp với biến Backend trả về nhé)
    const dataToExport = productList.map((item, index) => {
      // Chuyển đổi giá bán về dạng số thô nếu nó đang là chuỗi, hoặc giữ nguyên nếu là số
      const rawPrice = typeof item.giaBan === 'string' 
        ? Number(item.giaBan.replace(/[^0-9]/g, '')) 
        : (item.giaBan ?? item.gia_ban ?? 0)

      return {
        STT: index + 1,
        'Mã Sản Phẩm': item.maSanPham ?? item.ma_san_pham ?? item.id,
        'Tên Sản Phẩm': item.tenSanPham ?? item.ten_san_pham ?? 'Chưa có tên',
        'Danh Mục': item.tenDanhMuc ?? item.danhMuc ?? '----',
        'Thương Hiệu': item.tenThuongHieu ?? item.thuongHieu ?? '----',
        'Giá Bán': rawPrice, // Để dạng số thô để Excel tính toán được
        'Số Lượng Tồn': item.soLuong ?? item.so_luong ?? 0,
        'Trạng Thái': item.trangThai === 1 || item.trangThai === 'Active' ? 'Kinh doanh' : 'Ngừng kinh doanh',
      }
    })

    // 3. Tạo worksheet và workbook
    const worksheet = window.XLSX.utils.json_to_sheet(dataToExport)
    const workbook = window.XLSX.utils.book_new()
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachSanPham')

    // 4. Thiết lập độ rộng chuẩn cho các cột (wch) giúp không bị che chữ
    worksheet['!cols'] = [
      { wch: 6 },   // STT
      { wch: 15 },  // Mã Sản Phẩm
      { wch: 30 },  // Tên Sản Phẩm (Tên thường dài nên cho rộng ra cậu nhé)
      { wch: 18 },  // Danh Mục
      { wch: 18 },  // Thương Hiệu
      { wch: 18 },  // Giá Bán
      { wch: 15 },  // Số Lượng Tồn
      { wch: 18 },  // Trạng Thái
    ]

    // 5. Định dạng giao diện (Style bảng tính)
    const range = window.XLSX.utils.decode_range(worksheet['!ref'])
    
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R }
        const cell_ref = window.XLSX.utils.encode_cell(cell_address)
        if (!worksheet[cell_ref]) continue

        if (!worksheet[cell_ref].s) worksheet[cell_ref].s = {}
        
        // Thêm đường viền mờ cho tất cả các ô
        worksheet[cell_ref].s.border = {
          top: { style: 'thin', color: { rgb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
          left: { style: 'thin', color: { rgb: 'E2E8F0' } },
          right: { style: 'thin', color: { rgb: 'E2E8F0' } }
        }

        // Căn giữa cột STT, Số Lượng, Trạng Thái
        if (C === 0 || C === 6 || C === 7) {
          worksheet[cell_ref].s.alignment = { horizontal: 'center', vertical: 'center' }
        }

        // Đổ style cho hàng Tiêu Đề (Header - Hàng 0)
        if (R === 0) {
          worksheet[cell_ref].s.fill = { fgColor: { rgb: 'DCCBC0' } } // Màu nền nâu kem đồng bộ
          worksheet[cell_ref].s.font = { name: 'Arial', bold: true, color: { rgb: '5A4031' }, sz: 11 }
          worksheet[cell_ref].s.alignment = { horizontal: 'center', vertical: 'center' }
        } 
        // Đổ style cho hàng dữ liệu
        else {
          worksheet[cell_ref].s.font = { name: 'Arial', sz: 10 }
          
          // Định dạng cột "Giá Bán" (Cột số 5)
          if (C === 5) {
            worksheet[cell_ref].z = '#,##0" ₫"' // Hiển thị phân tách hàng nghìn + " ₫"
            worksheet[cell_ref].s.font = { bold: true, color: { rgb: 'DC2626' } } // Chữ đỏ in đậm cực nét
            worksheet[cell_ref].s.alignment = { horizontal: 'right', vertical: 'center' }
          }
        }
      }
    }

    // 6. Ghi file và tải về máy
    const today = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')
    window.XLSX.writeFile(workbook, `Danh_Sach_SanPham_${today}.xlsx`)
  }

  // Tự động kiểm tra và nạp CDN SheetJS nếu chưa có
  if (window.XLSX) {
    doExport()
  } else {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
    script.onload = doExport
    document.head.appendChild(script)
  }
}

const products = ref([])
const isMounted = ref(false)


// Các biến cho bộ lọc (GIỮ NGUYÊN)
const searchMaTen = ref('')
const searchChatLieu = ref('')
const searchThuongHieu = ref('')
const searchDanhMuc = ref('')
const searchStatus = ref('Tất cả')


// Các biến cho phân trang (GIỮ NGUYÊN)
const currentPage = ref(1)
const itemsPerPage = ref(10)


// ✅ THAY ĐỔI CỐT LÕI: Khai báo 3 mảng để hứng dữ liệu gốc từ API
const listChatLieu = ref([])
const listThuongHieu = ref([])
const listDanhMuc = ref([])


// Hàm tải dữ liệu từ API (GIỮ NGUYÊN)
const fetchProducts = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/sanpham`)
    if (!response.ok) throw new Error('Network response was not ok')
    const dataFromSQL = await response.json()
    products.value = dataFromSQL
  } catch (error) {
    console.error('Lỗi khi tải danh sách sản phẩm:', error)
  }
}


// ✅ SỬA ĐỔI: Thay vì computed nhặt từ sản phẩm, ta gọi trực tiếp API để luôn luôn hiện đủ thuộc tính mới thêm
const fetchDropdowns = async () => {
  try {
    // 1. Tải chất liệu
    const resCL = await fetch(`http://localhost:8080/api/chat-lieu`)
    if (resCL.ok) {
      const data = await resCL.json()
      listChatLieu.value = data.filter(item => item.trangThai === 1)
    }
    // 2. Tải thương hiệu
    const resTH = await fetch(`http://localhost:8080/api/thuong-hieu`)
    if (resTH.ok) {
      const data = await resTH.json()
      listThuongHieu.value = data.filter(item => item.trangThai === 1)
    }
    // 3. Tải danh mục
    const resDM = await fetch(`http://localhost:8080/api/danh-muc`)
    if (resDM.ok) {
      const data = await resDM.json()
      listDanhMuc.value = data.filter(item => item.trangThai === 1)
    }
  } catch (error) {
    console.error('Lỗi khi tải danh mục dropdown:', error)
  }
}


// Xử lý logic lọc dữ liệu (Cập nhật thông minh để hiểu cả Object hoặc Chữ thường)
const filteredProducts = computed(() => {
  let result = products.value


  if (searchMaTen.value) {
    const keyword = searchMaTen.value.toLowerCase()
    result = result.filter(
      (item) =>
        (item.maSanPham && item.maSanPham.toLowerCase().includes(keyword)) ||
        (item.tenSanPham && item.tenSanPham.toLowerCase().includes(keyword)),
    )
  }


  // Khớp chính xác tên theo chuỗi text hiển thị ở option
  if (searchChatLieu.value) {
    result = result.filter((item) => {
      const name = item.chatLieu?.tenChatLieu || item.chatLieu;
      return name === searchChatLieu.value;
    })
  }
  if (searchThuongHieu.value) {
    result = result.filter((item) => {
      const name = item.thuongHieu?.tenThuongHieu || item.thuongHieu?.ten || item.thuongHieu;
      return name === searchThuongHieu.value;
    })
  }
  if (searchDanhMuc.value) {
    result = result.filter((item) => {
      const name = item.danhMuc?.tenDanhMuc || item.danhMuc?.ten || item.danhMuc;
      return name === searchDanhMuc.value;
    })
  }


  if (searchStatus.value !== 'Tất cả') {
    const isKinhDoanh = searchStatus.value === 'Đang bán' || searchStatus.value === 'Kinh doanh'
    result = result.filter((item) => {
      const active = item.trangThai === 1 || item.trangThai === true
      return active === isKinhDoanh
    })
  }


  return result
})


// Các hàm watch, tính toán phân trang, resetFilter (GIỮ NGUYÊN)
watch(
  [searchMaTen, searchChatLieu, searchThuongHieu, searchDanhMuc, searchStatus, itemsPerPage],
  () => {
    currentPage.value = 1
  },
)


const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1)
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})


const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}


const resetFilter = () => {
  searchMaTen.value = ''
  searchChatLieu.value = ''
  searchThuongHieu.value = ''
  searchDanhMuc.value = ''
  searchStatus.value = 'Tất cả'
  currentPage.value = 1
}


// ✅ SỬA ĐỔI: Gọi thêm hàm fetchDropdowns() khi mounted trang
onMounted(() => {
  isMounted.value = true
  fetchProducts()
  fetchDropdowns() // <--- Load dữ liệu gốc cho 3 ô select
})


// Toàn bộ logic Toast và Gạt nút trạng thái (GIỮ NGUYÊN TỪ FILE GỐC)
const toastMessage = ref('')
const toastType = ref('success')
const showToast = ref(false)


const displayToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 5000)
}


const toggleStatus = async (product) => {
  const isCurrentlyActive = product.trangThai === 1 || product.trangThai === true;
  product.trangThai = isCurrentlyActive ? 0 : 1;


  try {
    const response = await fetch(`http://localhost:8080/api/sanpham/${product.id}/toggle-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
   
    if (!response.ok) throw new Error("Lỗi API Backend");
    displayToast(`Đã ${product.trangThai === 1 ? 'mở' : 'ngừng'} bán sản phẩm ${product.maSanPham}`, 'success');


  } catch (error) {
    console.error("Lỗi:", error);
    displayToast("Cập nhật trạng thái thất bại!", 'danger');
    product.trangThai = isCurrentlyActive ? 1 : 0;
  }
};
</script>


<template>
  <div class="container-fluid p-0">
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
              <span
                class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted"
              >
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="searchMaTen"
                type="text"
                class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle"
                placeholder="Tìm theo mã / tên sản phẩm..."
              />
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Chất liệu</label>
       
            <select v-model="searchChatLieu" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted">
  <option value="">Tất cả chất liệu</option>
  <option v-for="item in listChatLieu" :key="item.id" :value="item.tenChatLieu">
    {{ item.tenChatLieu }}
  </option>
</select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Thương hiệu</label>
            <select v-model="searchThuongHieu" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted">
  <option value="">Tất cả thương hiệu</option>
  <option v-for="item in listThuongHieu" :key="item.id" :value="item.tenThuongHieu || item.ten">
    {{ item.tenThuongHieu || item.ten }}
  </option>
</select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Danh mục</label>
            <select v-model="searchDanhMuc" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted">
  <option value="">Tất cả danh mục</option>
  <option v-for="item in listDanhMuc" :key="item.id" :value="item.tenDanhMuc || item.ten">
    {{ item.tenDanhMuc || item.ten }}
  </option>
</select>
          </div>
        </div>


        <div class="d-flex flex-wrap justify-content-between align-items-end">
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
                <label class="form-check-label small text-dark" for="statusNgung"
                  >Ngừng kinh doanh</label
                >
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


          <div class="d-flex gap-2 mt-3 mt-md-0">
            <button
  @click="exportExcelSanPham"
  class="btn btn-sm px-3 rounded-pill fw-medium shadow-none d-flex align-items-center gap-2 border"
  style="background-color: #ebdcd0; color: #5a4031; border-color: #cbb3a1 !important"
>
  <i class="bi bi-box-arrow-up"></i> Xuất Excel
</button>
            <RouterLink 
  to="/san-pham/them" 
  class="btn rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
  style="background-color: #dccbc0; color: #5a4031"
>
  <i class="bi bi-plus-lg"></i> Thêm sản phẩm chi tiết
</RouterLink>
<RouterLink
    to="/san-pham/danh-sach-chi-tiet"
     class="btn rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
  style="background-color: #dccbc0; color: #5a4031"
  >
    <i class="bi bi-plus-lg"></i> Danh sách chi tiết sản phẩm
  </RouterLink>
            <button
              @click="resetFilter"
              class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
            >
              <i class="bi bi-arrow-clockwise"></i> Đặt lại bộ lọc
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
                  MÃ SẢN PHẨM
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
                  CHẤT LIỆU
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  THƯƠNG HIỆU
                </th>
                <th
                  class="py-3 px-3 border-0 text-center fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  SL TỒN
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031"
                >
                  DANH MỤC
                </th>
                <th
                  class="py-3 px-3 border-0 text-center fw-semibold"
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
              <tr v-for="(product, index) in paginatedProducts" :key="product.id">
                <td class="py-3 px-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-3 px-3 text-dark fw-medium">{{ product.maSanPham }}</td>
                <td class="py-3 px-3 text-dark">{{ product.tenSanPham }}</td>
                <td class="py-3 px-3">{{ product.chatLieu || 'Chưa cập nhật' }}</td>
                <td class="py-3 px-3">{{ product.thuongHieu }}</td>
                <td class="py-3 px-3 text-center fw-bold text-dark">{{ product.tongTonKho }}</td>
                <td class="py-3 px-3">{{ product.danhMuc }}</td>


                <td class="py-3 px-3 text-center">
                  <span
                    :class="[
                      'badge rounded-pill px-3 py-2 fw-medium',
                      product.trangThai === 1 || product.trangThai === true
                        ? 'bg-primary text-white'
                        : 'bg-danger text-white',
                    ]"
                    style="opacity: 0.85"
                  >
                    {{
                      product.trangThai === 1 || product.trangThai === true
                        ? 'Kinh doanh'
                        : 'Ngừng KD'
                    }}
                  </span>
                </td>


               


<td class="py-3 px-3 text-center">
  <div class="d-flex justify-content-center gap-3 align-items-center">
    <div class="form-check form-switch mb-0">
     <input
  class="form-check-input"
  type="checkbox"
  role="switch"
  :checked="product.trangThai === 1 || product.trangThai === true"
  @click.prevent="triggerChangeProductStatus(product)"
  style="cursor: pointer"
/>
    </div>
    <router-link :to="{ name: 'ChiTietSanPham', params: { id: product?.id } }">
      <i class="bi bi-eye fs-5" style="cursor:pointer"></i>
    </router-link>
  </div>
</td>


              </tr>


              <tr v-if="paginatedProducts.length === 0">
                <td colspan="9" class="text-center py-5 text-danger fw-medium">
                  <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
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
  </div>

<Teleport to="body" v-if="isShowProductConfirm">
    <div class="confirm-overlay">
      <div class="confirm-modal-card">
        <div class="confirm-icon-area">
          <i class="bi bi-box-seam-fill"></i>
        </div>
        <h5 class="confirm-title">Xác Nhận Thay Đổi</h5>
        <p class="confirm-message">
          Cậu có chắc chắn muốn thay đổi trạng thái hoạt động của sản phẩm:<br>
          <strong class="text-dark">[{{ pendingProduct?.maSanPham || pendingProduct?.id }}] - {{ pendingProduct?.tenSanPham }}</strong> không?
        </p>
        <div class="confirm-actions">
          <button @click="isShowProductConfirm = false" class="btn-cancel-custom">
            Hủy bỏ
          </button>
          <button @click="confirmChangeProductStatus" class="btn-confirm-custom">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </Teleport>

</template>


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
.badge {
  font-weight: 500;
}
/* Hiệu ứng trượt vào */
.toast {
  animation: slideInRight 0.4s ease-out;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
/* CSS Hộp thoại Confirm Sản phẩm Custom */
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

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>



