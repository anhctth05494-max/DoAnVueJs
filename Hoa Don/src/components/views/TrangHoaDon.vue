<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import HoaDonChiTiet from './HoaDonChiTiet.vue'
import { BASE_URL } from '../../apiConfig.js'

const statuses = [
  'Tất cả',
  'Chờ xác nhận',
  'Đã xác nhận',
  'Chờ giao hàng',
  'Đang giao',
  'Đã hoàn thành',
  'Đã hủy',
  'Yêu cầu hủy',
  'Đã hoàn tiền',
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
const itemsPerPage = 5

const fetchInvoices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/hoadon`)
    if (!response.ok) return
    const dataFromSQL = await response.json()

    const getStatusText = (status) => {
      const statusMap = {
        1: 'Chờ xác nhận',
        2: 'Đã xác nhận',
        3: 'Chờ giao hàng',
        4: 'Đang giao',
        5: 'Đã hoàn thành',
        6: 'Đã hủy',
        7: 'Yêu cầu hủy',
        8: 'Đã hoàn tiền',
      }
      return statusMap[status] || 'Không xác định'
    }

    invoices.value = dataFromSQL.map((item) => ({
      id: item.ma_hoa_don,
      staff: `NV00${item.id_nhan_vien}`,
      customer: item.ten_nguoi_nhan,
      phone: item.sdt_nguoi_nhan,
      total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
        item.tong_tien_thanh_toan,
      ),
      type: item.id_nhan_vien ? 'Trực tuyến' : 'Tại quầy',
      date: new Date(item.ngay_tao).toLocaleDateString('vi-VN'),
      rawDate: item.ngay_tao,
      status: getStatusText(item.trang_thai),
    }))
  } catch (error) {
    console.error('Lỗi:', error)
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

watch([activeStatus, searchMaHD, searchStartDate, searchEndDate, searchType], () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage) || 1)

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredInvoices.value.slice(start, start + itemsPerPage)
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

const printInvoice = async (maHD) => {
  try {
    const res = await fetch(`${BASE_URL}/hoadon/${maHD}`)
    const data = await res.json()
    const invoice = data.invoice
    const details = data.details

    const tongTienHang = details.reduce((sum, item) => sum + item.tong_tien, 0)
    const phiShip = invoice.phi_ship || 0
    const khachPhaiTra = invoice.tong_tien_thanh_toan
    const giamGia =
      tongTienHang + phiShip > khachPhaiTra ? tongTienHang + phiShip - khachPhaiTra : 0

    const fmt = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ'

    let printContents = `
      <html>
      <head>
        <title>Hóa Đơn ${maHD}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; font-size: 14px; margin: 0; padding: 20px; color: #000; }
          .receipt-container { width: 100%; max-width: 400px; margin: 0 auto; border: 1px dashed #ccc; padding: 20px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .fw-bold { font-weight: bold; }
          .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
          .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .item-name { flex: 2; padding-right: 10px; }
          .item-qty { flex: 1; text-align: center; }
          .item-price { flex: 1; text-align: right; }
          .summary-row { display: flex; justify-content: space-between; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="text-center">
            <h2 style="margin: 0;">ÁO DÀI GIAI ĐIỆU</h2>
            <p style="margin: 5px 0; font-size: 12px;">Số 10 Phố Hàng Bài, Hoàn Kiếm, Hà Nội</p>
            <p style="margin: 5px 0; font-size: 12px;">SĐT: 0988.888.888</p>
            <h3 style="margin: 15px 0;">HÓA ĐƠN THANH TOÁN</h3>
          </div>
          
          <div style="font-size: 13px;">
            <p><strong>Mã HĐ:</strong> ${maHD}</p>
            <p><strong>Ngày in:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            <p><strong>Khách hàng:</strong> ${invoice.ten_nguoi_nhan || 'Khách vãng lai'}</p>
          </div>

          <div class="divider"></div>
          
          <div class="item-row fw-bold">
            <div class="item-name">Sản phẩm</div>
            <div class="item-qty">SL</div>
            <div class="item-price">T.Tiền</div>
          </div>
          
          <div class="divider"></div>
    `

    details.forEach((sp) => {
      printContents += `
        <div style="margin-bottom: 8px;">
          <div style="font-weight: 600;">${sp.ten_san_pham}</div>
          <div class="item-row" style="font-size: 13px; color: #444;">
            <div class="item-name">${sp.ten_mau} - Size ${sp.ten_kich_co}</div>
            <div class="item-qty">x${sp.so_luong}</div>
            <div class="item-price">${fmt(sp.tong_tien)}</div>
          </div>
        </div>
      `
    })

    printContents += `
          <div class="divider"></div>
          
          <div class="summary-row">
            <span>Tổng tiền hàng:</span>
            <span>${fmt(tongTienHang)}</span>
          </div>
          <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span>${fmt(phiShip)}</span>
          </div>
          <div class="summary-row">
            <span>Giảm giá:</span>
            <span>- ${fmt(giamGia)}</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="summary-row fw-bold" style="font-size: 16px;">
            <span>KHÁCH CẦN TRẢ:</span>
            <span>${fmt(khachPhaiTra)}</span>
          </div>

          <div class="divider"></div>
          
          <div class="text-center" style="margin-top: 20px; font-size: 13px; font-style: italic;">
            <p>Cảm ơn quý khách và hẹn gặp lại!</p>
            <p>Powered by Java Spring Boot & VueJS</p>
          </div>
        </div>
      </body>
      </html>
    `

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    iframe.contentDocument?.write(printContents)
    iframe.contentDocument?.close()

    iframe.onload = function () {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    }
  } catch (error) {
    alert('Lỗi khi tạo hóa đơn in. Vui lòng thử lại!')
  }
}

const resetFilter = () => {
  searchMaHD.value = ''
  searchStartDate.value = ''
  searchEndDate.value = ''
  searchType.value = ''
  activeStatus.value = 'Tất cả'
}

onMounted(() => {
  isMounted.value = true
  fetchInvoices()
})
</script>

<template>
  <Teleport to="#header-title" v-if="isMounted">
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
                <option value="" selected disabled hidden></option>
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
                  <td class="py-3 px-3">{{ invoice.status }}</td>
                  <td class="py-3 px-3 text-center">
                    <i
                      class="bi bi-eye text-primary fs-5 me-3"
                      style="cursor: pointer"
                      title="Xem chi tiết"
                      @click="viewDetail(invoice.id)"
                    ></i>
                    <i
                      class="bi bi-printer text-success fs-5"
                      style="cursor: pointer"
                      title="In Hóa Đơn PDF"
                      @click="printInvoice(invoice.id)"
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

          <div class="d-flex justify-content-between align-items-center mt-4 text-muted small">
            <div>
              Hiển thị {{ paginatedInvoices.length }} sản phẩm trên trang {{ currentPage }}/{{
                totalPages
              }}
              >
            </div>
            <div class="d-flex gap-2 align-items-center">
              <i
                class="bi bi-chevron-left fs-6"
                @click="changePage(currentPage - 1)"
                :class="{ 'text-black-50': currentPage === 1 }"
                style="cursor: pointer"
              ></i>

              <span
                v-for="page in totalPages"
                :key="page"
                @click="changePage(page)"
                class="px-2 py-1 rounded fw-medium"
                :style="
                  currentPage === page
                    ? 'background-color: #8c6b5d; color: white; cursor: pointer'
                    : 'cursor: pointer; color: #6c757d'
                "
              >
                {{ page }}
              </span>

              <i
                class="bi bi-chevron-right fs-6"
                @click="changePage(currentPage + 1)"
                :class="{ 'text-black-50': currentPage === totalPages }"
                style="cursor: pointer"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <HoaDonChiTiet 
  :maHoaDon="selectedMaHD" 
  @back="handleBack" 
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
</style>
