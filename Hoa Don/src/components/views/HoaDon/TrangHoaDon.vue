<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import HoaDonChiTiet from './HoaDonChiTiet.vue'
import { BASE_URL } from '@/apiConfig'

const statuses = [
  'Tất cả',
  'Chờ xác nhận',
  'Đã xác nhận',
  'Chờ giao hàng',
  'Đang giao hàng',
  'Đã giao hàng',
  'Đã hoàn thành',
  'Đã hủy',
]
const activeStatus = ref('Tất cả')
const invoices = ref([])
const isShowDetail = ref(false)
const isMounted = ref(false)

const selectedMaHD = ref('')
const searchMaHD = ref('')
const searchStartDate = ref('')
const searchEndDate = ref('')
const searchType = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(5)

const fetchInvoices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/hoadon`)
    if (!response.ok) return
    const dataFromSQL = await response.json()

    const getStatusText = (status) => {
      if (status === true || status === 'true') return 'Chờ xác nhận'
      if (status === false || status === 'false') return 'Không xác định'

      const statusMap = {
        1: 'Chờ xác nhận',
        2: 'Đã xác nhận',
        3: 'Chờ giao hàng',
        4: 'Đang giao hàng',
        5: 'Đã hoàn thành',
        6: 'Đã giao hàng',
        7: 'Đã hủy',
      }
      return statusMap[Number(status)] || 'Không xác định'
    }

    invoices.value = dataFromSQL.map((item) => ({
      id: item.ma_hoa_don ?? item.maHoaDon ?? item.MA_HOA_DON,
      staff: `NV00${item.id_nhan_vien ?? item.idNhanVien ?? item.ID_NHAN_VIEN ?? '1'}`,
      customer: item.ten_nguoi_nhan ?? item.tenNguoiNhan ?? item.TEN_NGUOI_NHAN ?? 'Khách vãng lai',
      phone: item.sdt_nguoi_nhan ?? item.sdtNguoiNhan ?? item.SDT_NGUOI_NHAN ?? '----',
      total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
        item.tong_tien_thanh_toan ?? item.tongTienThanhToan ?? item.TONG_TIEN_THANH_TOAN ?? 0,
      ),
      type:
        item.id_khach_hang || item.idKhachHang || item.ID_KHACH_HANG ? 'Trực tuyến' : 'Tại quầy',
      date: new Date(
        item.ngay_tao ?? item.ngayTao ?? item.NGAY_TAO ?? Date.now(),
      ).toLocaleDateString('vi-VN'),
      rawDate: item.ngay_tao ?? item.ngayTao ?? item.NGAY_TAO ?? Date.now(),
      status: getStatusText(item.trang_thai ?? item.trangThai ?? item.TRANG_THAI ?? 1),
    }))
  } catch (error) {
    console.error(error)
    invoices.value = []
  }
}

const filteredInvoices = computed(() => {
  let result = invoices.value
  if (activeStatus.value !== 'Tất cả') {
    result = result.filter((item) => item.status === activeStatus.value)
  }
  if (searchMaHD.value) {
    result = result.filter((item) => item.id.toLowerCase().includes(searchMaHD.value.toLowerCase()))
  }
  if (searchType.value) {
    const typeText = searchType.value === 'online' ? 'Trực tuyến' : 'Tại quầy'
    result = result.filter((item) => item.type === typeText)
  }
  if (searchStartDate.value) {
    const start = new Date(searchStartDate.value).setHours(0, 0, 0, 0)
    result = result.filter((item) => new Date(item.rawDate).setHours(0, 0, 0, 0) >= start)
  }
  if (searchEndDate.value) {
    const end = new Date(searchEndDate.value).setHours(23, 59, 59, 999)
    result = result.filter((item) => new Date(item.rawDate).getTime() <= end)
  }
  return result
})

watch([activeStatus, searchMaHD, searchStartDate, searchEndDate, searchType, itemsPerPage], () => {
  currentPage.value = 1
})

const totalPages = computed(
  () => Math.ceil(filteredInvoices.value.length / itemsPerPage.value) || 1,
)

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredInvoices.value.slice(start, start + itemsPerPage.value)
})

// ĐÃ FIX LỖI IN THỪA SỐ TRANG
const visiblePages = computed(() => {
  const currentChunk = Math.ceil(currentPage.value / 3)
  const startPage = (currentChunk - 1) * 3 + 1
  const pages = []
  for (let i = 0; i < 3; i++) {
    if (startPage + i <= totalPages.value) {
      pages.push(startPage + i)
    }
  }
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const viewDetail = (maHD) => {
  selectedMaHD.value = maHD
  isShowDetail.value = true
}

const resetFilter = () => {
  searchMaHD.value = ''
  searchStartDate.value = ''
  searchEndDate.value = ''
  searchType.value = ''
  activeStatus.value = 'Tất cả'
}

const exportExcel = () => {
  if (filteredInvoices.value.length === 0) {
    alert('Không có dữ liệu để xuất!')
    return
  }

  const doExport = () => {
    const dataToExport = filteredInvoices.value.map((item, index) => ({
      STT: index + 1,
      'Mã Hóa Đơn': item.id,
      'Nhân Viên': item.staff,
      'Khách Hàng': item.customer,
      'Số Điện Thoại': item.phone,
      'Tổng Tiền Thanh Toán': item.total,
      'Loại Đơn Hàng': item.type,
      'Ngày Tạo': item.date,
      'Trạng Thái': item.status,
    }))

    const worksheet = window.XLSX.utils.json_to_sheet(dataToExport)
    const workbook = window.XLSX.utils.book_new()
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachHoaDon')

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
    ]

    const today = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')
    window.XLSX.writeFile(workbook, `Danh_Sach_Hoa_Don_${today}.xlsx`)
  }

  if (window.XLSX) {
    doExport()
  } else {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
    script.onload = doExport
    document.head.appendChild(script)
  }
}

onMounted(() => {
  isMounted.value = true
  fetchInvoices()
})
</script>

<template>
  <Teleport to="body" v-if="isMounted">
    <div v-if="!isShowDetail">
      <h4 class="mb-1 fw-bold text-dark fs-5">Quản Lý Hoá Đơn</h4>
      <div class="text-muted small">Trang chủ | Quản lý hóa đơn</div>
    </div>
    <div v-else>
      <h4 class="mb-1 fw-bold text-dark fs-5">Chi Tiết Hóa Đơn</h4>
      <div class="text-muted small">Trang chủ | Hóa đơn | Chi tiết hóa đơn</div>
    </div>
  </Teleport>

  <div class="container-fluid p-0">
    <div v-if="!isShowDetail">
      <div class="card border-0 shadow-sm mb-4 rounded-3">
        <div class="card-body p-4">
          <h6 class="card-title fw-medium mb-3 text-dark">Bộ lọc</h6>
          <div class="row g-4 align-items-end">
            <div class="col-md-3">
              <label class="form-label text-muted small mb-2">Mã hóa đơn</label>
              <input
                v-model="searchMaHD"
                type="text"
                class="form-control rounded-pill shadow-none border-secondary-subtle"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label text-muted small mb-2">Ngày bắt đầu</label>
              <input
                v-model="searchStartDate"
                type="date"
                class="form-control rounded-pill shadow-none border-secondary-subtle text-muted"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label text-muted small mb-2">Ngày kết thúc</label>
              <input
                v-model="searchEndDate"
                type="date"
                class="form-control rounded-pill shadow-none border-secondary-subtle text-muted"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label text-muted small mb-2">Loại đơn</label>
              <select
                v-model="searchType"
                class="form-select rounded-pill shadow-none border-secondary-subtle text-muted"
              >
                <option value="">Tất cả</option>
                <option value="online">Trực tuyến</option>
                <option value="offline">Tại quầy</option>
              </select>
            </div>
            <div class="col-md-2">
              <button
                @click="resetFilter"
                class="btn rounded-pill px-4 shadow-none border"
                style="background-color: #ebdcd0; color: #5a4031; border-color: #cbb3a1 !important"
              >
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="card-title fw-medium mb-0 text-dark">Danh sách hóa đơn</h6>
            <button
              @click="exportExcel"
              class="btn btn-sm px-3 rounded-pill fw-medium shadow-none d-flex align-items-center gap-2 border"
              style="background-color: #ebdcd0; color: #5a4031; border-color: #cbb3a1 !important"
            >
              <i class="bi bi-box-arrow-up"></i> Xuất Excel
            </button>
          </div>

          <div class="d-flex flex-wrap gap-2 mb-4">
            <button
              v-for="status in statuses"
              :key="status"
              @click="activeStatus = status"
              :class="[
                'btn btn-sm rounded-pill px-3 shadow-none',
                activeStatus === status ? 'border-0 fw-medium' : 'border',
              ]"
              :style="
                activeStatus === status
                  ? 'background-color: #EBDCD0; color: #5A4031;'
                  : 'border-color: #DEE2E6; color: #6C757D; background-color: #FFF;'
              "
            >
              {{ status }}
            </button>
          </div>

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
                    Mã HD
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    Tên NV
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    Tên KH
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    SĐT KH
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    Tổng tiền TT
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    Loại đơn
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    Ngày tạo
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    Trạng thái
                  </th>
                  <th
                    class="py-3 px-3 border-0 rounded-end text-center fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody class="border-top-0 text-secondary">
                <tr v-for="(invoice, index) in paginatedInvoices" :key="invoice.id">
                  <td class="py-3 px-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td class="py-3 px-3 text-dark fw-medium">{{ invoice.id }}</td>
                  <td class="py-3 px-3">{{ invoice.staff }}</td>
                  <td class="py-3 px-3">{{ invoice.customer }}</td>
                  <td class="py-3 px-3">{{ invoice.phone }}</td>
                  <td class="py-3 px-3 text-danger fw-bold">{{ invoice.total }}</td>
                  <td class="py-3 px-3">{{ invoice.type }}</td>
                  <td class="py-3 px-3">{{ invoice.date }}</td>
                  
                  <td class="py-3 px-3">
                    <span class="badge-trang-thai">{{ invoice.status }}</span>
                  </td>
                  
                  <td class="py-3 px-3 text-center">
                    <i
                      class="bi bi-eye text-primary fs-5"
                      style="cursor: pointer"
                      title="Xem chi tiết"
                      @click="viewDetail(invoice.id)"
                    ></i>
                  </td>
                </tr>
                <tr v-if="paginatedInvoices.length === 0">
                  <td colspan="10" class="text-center py-4 text-danger">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small"
          >
            <div>
              Hiển thị {{ paginatedInvoices.length }} / {{ filteredInvoices.length }} bản ghi
            </div>

            <div class="d-flex gap-3 align-items-center">
              <i class="bi bi-chevron-left fs-6 fw-bold"
                 @click="changePage(currentPage - 1)"
                 :style="currentPage > 1 ? 'cursor: pointer; color: #5a4031;' : 'cursor: not-allowed; color: #dee2e6;'"></i>

              <div class="d-flex gap-1">
                <span v-for="page in visiblePages" :key="page"
                      @click="page <= totalPages ? changePage(page) : null"
                      class="px-3 py-1 rounded-2 fw-medium btn-page"
                      :class="{ 'active': currentPage === page, 'disabled-page': page > totalPages }">
                  {{ page }}
                </span>
              </div>

              <i class="bi bi-chevron-right fs-6 fw-bold"
                 @click="changePage(currentPage + 1)"
                 :style="currentPage < totalPages ? 'cursor: pointer; color: #5a4031;' : 'cursor: not-allowed; color: #dee2e6;'"></i>
            </div>

            <div>
              <select
                v-model.number="itemsPerPage"
                class="form-select form-select-sm shadow-none text-muted border-secondary-subtle rounded-2"
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
    </div>

    <div v-else>
      <HoaDonChiTiet
        :maHoaDon="selectedMaHD"
        @back="isShowDetail = false; fetchInvoices()"
      />
    </div>
  </div>
</template>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #fafafa;
}
.form-control:focus,
.form-select:focus {
  border-color: #cbb3a1;
  box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25);
}

/* THÊM CSS MỚI ĐÃ LÀM TỪ QUA VÀO ĐÂY */
.badge-trang-thai {
  background-color: #0d6efd;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}

.btn-page {
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
}

.btn-page.active {
  background-color: #8a6d59 !important;
  color: #ffffff !important;
}

.btn-page.disabled-page {
  color: #dee2e6 !important;
  cursor: default;
}

.btn-page:hover:not(.active):not(.disabled-page) {
  background-color: #f3f4f6;
}
</style>