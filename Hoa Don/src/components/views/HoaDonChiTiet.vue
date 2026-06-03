<script setup>
import { ref, onMounted, computed } from 'vue'
import { BASE_URL } from '../../apiConfig'

const props = defineProps({
  maHoaDon: String,
})

const emit = defineEmits(['back'])

const invoice = ref({})
const details = ref([])

const availableProducts = ref([])

const showModal = ref(false)
const isEdit = ref(false)

const formItem = ref({
  old_ma_sp: '',
  ma_sp: '',
  ten_san_pham: '',
  ten_mau: '',
  ten_kich_co: '',
  so_luong: 1,
  don_gia: 0,
  tong_tien: 0,
})

const uniqueProductNames = computed(() => {
  const names = availableProducts.value.map((item) => item.ten_san_pham)
  return [...new Set(names)]
})

const allColors = computed(() => {
  const colors = availableProducts.value.map((item) => item.ten_mau || 'Không có')
  return [...new Set(colors)].sort()
})

const allSizes = computed(() => {
  const sizes = availableProducts.value.map((item) => item.ten_kich_co || 'Không có')
  return [...new Set(sizes)].sort()
})

const onProductNameChange = () => {
  const firstMatch = availableProducts.value.find(
    (item) => item.ten_san_pham === formItem.value.ten_san_pham,
  )
  if (firstMatch) {
    formItem.value.ma_sp = firstMatch.ma_sp
    formItem.value.ten_mau = firstMatch.ten_mau || 'Không có'
    formItem.value.ten_kich_co = firstMatch.ten_kich_co || 'Không có'
    formItem.value.don_gia = firstMatch.don_gia || 0
  }
}

const onColorOrSizeChange = () => {
  if (formItem.value.ten_san_pham && formItem.value.ten_mau && formItem.value.ten_kich_co) {
    const match = availableProducts.value.find(
      (item) =>
        item.ten_san_pham === formItem.value.ten_san_pham &&
        (item.ten_mau || 'Không có') === formItem.value.ten_mau &&
        (item.ten_kich_co || 'Không có') === formItem.value.ten_kich_co,
    )

    if (match) {
      formItem.value.ma_sp = match.ma_sp
      formItem.value.don_gia = match.don_gia || 0
    } else {
      formItem.value.ma_sp = 'Không tồn tại'
      formItem.value.don_gia = 0
    }
  }
}

const tongTienHang = computed(() => {
  return details.value.reduce((sum, item) => sum + item.tong_tien, 0)
})

const tienGiamGia = computed(() => {
  if (!invoice.value.tong_tien_thanh_toan) return 0
  const expectedTotal = tongTienHang.value + (invoice.value.phi_ship || 0)
  const actualTotal = invoice.value.tong_tien_thanh_toan
  return expectedTotal > actualTotal ? expectedTotal - actualTotal : 0
})

const formatCurrency = (val) => {
  if (!val && val !== 0) return '0 VND'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const formatDate = (val) => {
  if (!val) return '----'
  return new Date(val).toLocaleString('vi-VN')
}

const fetchAvailableProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/hoadon/danhsach-sanpham`)
    if (res.ok) {
      availableProducts.value = await res.json()
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm')
  }
}

const fetchInvoiceDetail = async () => {
  try {
    const res = await fetch(`${BASE_URL}/hoadon/${props.maHoaDon}`)
    if (!res.ok) {
      alert('Lỗi: Không thể kết nối tới API. Vui lòng kiểm tra lại Backend.')
      return
    }
    const data = await res.json()
    invoice.value = data.invoice
    details.value = data.details
  } catch (err) {
    console.error(err)
  }
}

const updateStatus = async (newStatus) => {
  let message = ''
  let lyDo = ''

  if (newStatus === 2) message = 'Xác nhận đơn hàng này?'
  if (newStatus === 3) message = 'Bàn giao cho đơn vị vận chuyển?'
  if (newStatus === 4) message = 'Bắt đầu giao hàng?'
  if (newStatus === 5) message = 'Xác nhận đơn hàng đã giao thành công?'

  if (newStatus === 6) {
    if (invoice.value.trang_thai === 4) {
      message = 'Khách từ chối nhận (Bom hàng). Bạn có chắc chắn muốn HỦY đơn?'
    } else if (invoice.value.trang_thai === 7) {
      message = 'Chấp nhận yêu cầu hủy đơn của khách hàng?'
    } else {
      message = 'BẠN CÓ CHẮC CHẮN MUỐN HỦY ĐƠN HÀNG NÀY?'
    }
  }

  if (newStatus === 8) {
    message = 'Xác nhận đã HOÀN TIỀN thành công cho khách hàng?'
  }

  if (confirm(message)) {
    if (newStatus === 6) {
      lyDo =
        prompt('Nhập lý do hủy đơn (bắt buộc):', invoice.value.ly_do_huy || 'Người quản lý hủy') ||
        'Người quản lý hủy'
    }

    try {
      // ĐÃ FIX: ÉP CHUẨN TIẾNG VIỆT UTF-8 Ở ĐÂY
      const res = await fetch(`${BASE_URL}/hoadon/${props.maHoaDon}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
        },
        body: JSON.stringify({ trang_thai: newStatus, ly_do_huy: lyDo }),
      })

      if (res.ok) {
        invoice.value.trang_thai = newStatus
        if (newStatus === 6) invoice.value.ly_do_huy = lyDo
        alert('Cập nhật trạng thái thành công!')
      } else {
        alert('Lỗi khi cập nhật SQL!')
      }
    } catch (error) {
      alert('Mất kết nối Server!')
    }
  }
}

const openAddModal = () => {
  isEdit.value = false
  formItem.value = {
    old_ma_sp: '',
    ma_sp: '',
    ten_san_pham: '',
    ten_mau: '',
    ten_kich_co: '',
    so_luong: 1,
    don_gia: 0,
    tong_tien: 0,
  }
  showModal.value = true
}

const openEditModal = (item) => {
  isEdit.value = true
  formItem.value = {
    old_ma_sp: item.ma_sp,
    ma_sp: item.ma_sp,
    ten_san_pham: item.ten_san_pham,
    ten_mau: item.ten_mau || 'Không có',
    ten_kich_co: item.ten_kich_co || 'Không có',
    so_luong: item.so_luong,
    don_gia: item.don_gia,
    tong_tien: item.tong_tien,
  }
  showModal.value = true
}

const deleteItem = async (item) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${item.ten_san_pham}" khỏi hóa đơn này?`)) {
    try {
      const res = await fetch(`${BASE_URL}/hoadon/${props.maHoaDon}/sanpham/${item.ma_sp}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        alert('Xóa sản phẩm thành công')
        fetchInvoiceDetail()
      } else {
        alert('Lỗi khi thực hiện xóa sản phẩm')
      }
    } catch (error) {
      alert('Mất kết nối Server')
    }
  }
}

const saveItem = async () => {
  if (!formItem.value.ma_sp || formItem.value.ma_sp === 'Không tồn tại') {
    alert('Sản phẩm với Màu và Size này không tồn tại trong kho!')
    return
  }
  if (formItem.value.so_luong <= 0) {
    alert('Số lượng sản phẩm phải lớn hơn 0!')
    return
  }
  if (formItem.value.don_gia < 0) {
    alert('Đơn giá sản phẩm không được là số âm!')
    return
  }

  try {
    if (
      isEdit.value &&
      formItem.value.old_ma_sp &&
      formItem.value.old_ma_sp !== formItem.value.ma_sp
    ) {
      await fetch(`${BASE_URL}/hoadon/${props.maHoaDon}/sanpham/${formItem.value.old_ma_sp}`, {
        method: 'DELETE',
      })
    }

    // ĐÃ FIX: ÉP CHUẨN TIẾNG VIỆT UTF-8 Ở ĐÂY
    const res = await fetch(`${BASE_URL}/hoadon/${props.maHoaDon}/sanpham`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ma_sp: formItem.value.ma_sp,
        so_luong: formItem.value.so_luong,
        don_gia: formItem.value.don_gia,
      }),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      if (isEdit.value) {
        alert('Cập nhật sản phẩm thành công!')
      } else {
        alert('Thêm sản phẩm thành công!')
      }
      showModal.value = false
      fetchInvoiceDetail()
    } else {
      alert(result.message)
    }
  } catch (error) {
    alert('Mất kết nối Server')
  }
}

onMounted(() => {
  fetchInvoiceDetail()
  fetchAvailableProducts()
})
</script>

<template>
  <div class="container-fluid p-0 font-sans position-relative">
    <div class="d-flex align-items-center gap-3 mb-4">
      <button
        @click="emit('back')"
        class="btn btn-link text-dark p-0 text-decoration-none shadow-none"
      >
        <i class="bi bi-chevron-left fs-5"></i>
      </button>
      <h5 class="mb-0 fw-medium text-dark">
        Chi tiết hóa đơn: <span class="text-primary">{{ maHoaDon }}</span>
      </h5>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-3 h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-5">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-box-seam text-secondary"></i>
                <span class="fw-medium text-dark">Trạng thái hóa đơn</span>
              </div>

              <div class="d-flex gap-2">
                <button
                  v-if="invoice.trang_thai === 1"
                  @click="updateStatus(2)"
                  class="btn btn-sm btn-primary rounded-pill px-3 fw-medium shadow-sm"
                >
                  <i class="bi bi-check2"></i> Xác nhận đơn
                </button>
                <button
                  v-if="invoice.trang_thai === 2"
                  @click="updateStatus(3)"
                  class="btn btn-sm btn-info text-white rounded-pill px-3 fw-medium shadow-sm"
                >
                  <i class="bi bi-box-arrow-right"></i> Giao cho vận chuyển
                </button>
                <button
                  v-if="invoice.trang_thai === 3"
                  @click="updateStatus(4)"
                  class="btn btn-sm btn-warning text-dark rounded-pill px-3 fw-medium shadow-sm"
                >
                  <i class="bi bi-truck"></i> Bắt đầu giao
                </button>
                <button
                  v-if="invoice.trang_thai === 4"
                  @click="updateStatus(5)"
                  class="btn btn-sm btn-success rounded-pill px-3 fw-medium shadow-sm"
                >
                  <i class="bi bi-check-circle"></i> Đã giao thành công
                </button>

                <button
                  v-if="invoice.trang_thai >= 1 && invoice.trang_thai <= 4"
                  @click="updateStatus(6)"
                  class="btn btn-sm btn-outline-danger rounded-pill px-3 fw-medium"
                >
                  <i class="bi bi-x-circle"></i>
                  {{ invoice.trang_thai === 4 ? 'Khách bom hàng' : 'Hủy đơn' }}
                </button>

                <button
                  v-if="invoice.trang_thai === 7"
                  @click="updateStatus(6)"
                  class="btn btn-sm btn-danger rounded-pill px-3 fw-medium shadow-sm"
                >
                  <i class="bi bi-check-circle"></i> Chấp nhận hủy
                </button>
                <button
                  v-if="invoice.trang_thai === 7 && invoice.ngay_thanh_toan"
                  @click="updateStatus(8)"
                  class="btn btn-sm btn-warning text-dark rounded-pill px-3 fw-medium shadow-sm"
                >
                  <i class="bi bi-cash-coin"></i> Đã hoàn tiền
                </button>
              </div>
            </div>

            <div
              v-if="invoice.trang_thai === 6"
              class="text-center py-4 rounded"
              style="background-color: #fff5f5"
            >
              <i class="bi bi-x-circle-fill text-danger mb-2" style="font-size: 2.5rem"></i>
              <h5 class="text-danger fw-bold mt-2">Đơn hàng đã bị hủy</h5>
              <p class="text-muted mb-0">
                Lý do: {{ invoice.ly_do_huy || 'Không có lý do cụ thể' }}
              </p>
            </div>

            <div
              v-else-if="invoice.trang_thai === 7"
              class="text-center py-4 rounded"
              style="background-color: #fffdf5"
            >
              <i
                class="bi bi-exclamation-triangle-fill text-warning mb-2"
                style="font-size: 2.5rem"
              ></i>
              <h5 class="text-warning fw-bold mt-2">Khách hàng yêu cầu hủy đơn</h5>
              <p class="text-muted mb-0">
                Lý do khách báo: {{ invoice.ly_do_huy || 'Không có lý do cụ thể' }}
              </p>
              <p class="text-muted small mt-1">
                Vui lòng kiểm tra và bấm xác nhận hủy (hoặc hoàn tiền nếu khách đã thanh toán).
              </p>
            </div>

            <div
              v-else-if="invoice.trang_thai === 8"
              class="text-center py-4 rounded"
              style="background-color: #f0fdf4"
            >
              <i class="bi bi-shield-check text-success mb-2" style="font-size: 2.5rem"></i>
              <h5 class="text-success fw-bold mt-2">Đơn hàng đã được Hủy & Hoàn tiền</h5>
              <p class="text-muted mb-0">Tiền đã được hoàn lại thành công cho khách hàng.</p>
              <p class="text-muted small">
                Lý do: {{ invoice.ly_do_huy || 'Không có lý do cụ thể' }}
              </p>
            </div>

            <div
              v-else
              class="d-flex justify-content-between text-center position-relative px-3 pb-2"
            >
              <div
                class="position-absolute top-50 start-0 end-0 translate-middle-y mx-5"
                style="height: 2px; background-color: #dee2e6; z-index: 1"
              ></div>

              <div class="position-relative" style="z-index: 2; width: 100px">
                <div
                  :class="[
                    'bg-white border rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3',
                    invoice.trang_thai >= 1
                      ? 'border-success text-success'
                      : 'border-secondary text-secondary',
                  ]"
                  style="width: 45px; height: 45px; border-width: 2px !important"
                >
                  <i class="bi bi-clock-history fs-5"></i>
                </div>
                <small :class="invoice.trang_thai >= 1 ? 'text-success fw-medium' : 'text-muted'"
                  >Chờ xác nhận</small
                >
              </div>

              <div class="position-relative" style="z-index: 2; width: 100px">
                <div
                  :class="[
                    'bg-white border rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3',
                    invoice.trang_thai >= 2
                      ? 'border-success text-success'
                      : 'border-secondary text-secondary',
                  ]"
                  style="width: 45px; height: 45px; border-width: 2px !important"
                >
                  <i class="bi bi-sliders fs-5"></i>
                </div>
                <small :class="invoice.trang_thai >= 2 ? 'text-success fw-medium' : 'text-muted'"
                  >Đã xác nhận</small
                >
              </div>

              <div class="position-relative" style="z-index: 2; width: 100px">
                <div
                  :class="[
                    'bg-white border rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3',
                    invoice.trang_thai >= 3
                      ? 'border-success text-success'
                      : 'border-secondary text-secondary',
                  ]"
                  style="width: 45px; height: 45px; border-width: 2px !important"
                >
                  <i class="bi bi-truck fs-5"></i>
                </div>
                <small :class="invoice.trang_thai >= 3 ? 'text-success fw-medium' : 'text-muted'"
                  >Chờ giao hàng</small
                >
              </div>

              <div class="position-relative" style="z-index: 2; width: 100px">
                <div
                  :class="[
                    'bg-white border rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3',
                    invoice.trang_thai >= 4
                      ? 'border-success text-success'
                      : 'border-secondary text-secondary',
                  ]"
                  style="width: 45px; height: 45px; border-width: 2px !important"
                >
                  <i class="bi bi-box-seam fs-5"></i>
                </div>
                <small :class="invoice.trang_thai >= 4 ? 'text-success fw-medium' : 'text-muted'"
                  >Đang giao</small
                >
              </div>

              <div class="position-relative" style="z-index: 2; width: 100px">
                <div
                  :class="[
                    'bg-white border rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3',
                    invoice.trang_thai >= 5
                      ? 'border-success text-success'
                      : 'border-secondary text-secondary',
                  ]"
                  style="width: 45px; height: 45px; border-width: 2px !important"
                >
                  <i class="bi bi-check-lg fs-5"></i>
                </div>
                <small :class="invoice.trang_thai >= 5 ? 'text-success fw-medium' : 'text-muted'"
                  >Đã hoàn thành</small
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-3 h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center gap-2 mb-4">
              <i class="bi bi-receipt text-secondary"></i>
              <span class="fw-medium text-dark">Tổng kết thanh toán</span>
            </div>
            <div class="d-flex justify-content-between mb-3 text-dark small">
              <span>Tổng tiền hàng</span>
              <span class="fw-medium">{{ formatCurrency(tongTienHang) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3 text-dark small">
              <span>Tiền giảm giá</span>
              <span class="fw-medium text-success">- {{ formatCurrency(tienGiamGia) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-4 pb-4 border-bottom text-dark small">
              <span>Phí vận chuyển</span>
              <span class="fw-medium">{{ formatCurrency(invoice.phi_ship) }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-danger fw-bold small">Tổng tiền</span>
              <span class="text-danger fw-bold fs-6">{{
                formatCurrency(invoice.tong_tien_thanh_toan)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-3 h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center gap-2 mb-4">
              <i class="bi bi-person text-secondary"></i>
              <span class="fw-medium text-dark">Thông tin khách hàng</span>
            </div>
            <div class="d-flex mb-3 text-dark small">
              <span class="text-muted" style="width: 110px">Tên KH:</span>
              <span class="fw-medium">{{ invoice.ten_nguoi_nhan || '----' }}</span>
            </div>
            <div class="d-flex mb-3 text-dark small">
              <span class="text-muted" style="width: 110px">Số điện thoại:</span>
              <span class="fw-medium">{{ invoice.sdt_nguoi_nhan || '----' }}</span>
            </div>
            <div class="d-flex text-dark small">
              <span class="text-muted" style="width: 110px">Email:</span>
              <span class="fw-medium">{{ invoice.email || '----' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-3 h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center gap-2 mb-4">
              <i class="bi bi-geo-alt text-secondary"></i>
              <span class="fw-medium text-dark">Thông tin giao hàng</span>
            </div>
            <div class="d-flex mb-3 text-dark small">
              <span class="text-muted" style="width: 80px">Địa chỉ:</span>
              <span class="fw-medium flex-grow-1">{{ invoice.dia_chi_giao_hang || '----' }}</span>
            </div>
            <div class="d-flex text-dark small">
              <span class="text-muted" style="width: 80px">Ghi chú:</span>
              <span class="fw-medium">{{ invoice.ghi_chu || 'Không có ghi chú' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-3 h-100 d-flex flex-column">
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-4">
              <i class="bi bi-credit-card text-secondary"></i>
              <span class="fw-medium text-dark">Lịch sử thanh toán</span>
            </div>
            <div class="text-dark small mb-2">
              Thanh toán:
              <span v-if="invoice.ngay_thanh_toan" class="fw-medium text-success"
                >+{{ formatCurrency(invoice.tong_tien_thanh_toan) }}</span
              >
              <span v-else class="fw-medium text-warning">Chưa thanh toán</span>
            </div>
            <div class="text-dark small mb-4">
              Cổng TT:
              <span class="fw-medium">{{
                invoice.ten_pttt || 'Thanh toán khi nhận hàng (COD)'
              }}</span>
            </div>
            <div class="mt-auto text-end text-muted" style="font-size: 0.8rem">
              <i class="bi bi-clock"></i>
              {{ invoice.ngay_thanh_toan ? formatDate(invoice.ngay_thanh_toan) : '----' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-end mb-3 mt-5 px-1">
      <span class="text-dark fw-medium">Danh sách sản phẩm ({{ details.length }})</span>
      <div class="d-flex gap-2">
        <button
          v-if="invoice.trang_thai === 1"
          @click="openAddModal"
          class="btn btn-sm px-4 rounded-pill fw-medium shadow-none custom-btn-outline"
        >
          + Thêm sản phẩm
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-3 mb-4">
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table align-middle text-nowrap mb-0" style="font-size: 0.9rem">
            <thead>
              <tr>
                <th
                  class="py-3 px-3 border-0 rounded-start fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  STT
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  Mã SP
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  Tên Sản Phẩm
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  Màu sắc
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  Kích cỡ
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold text-center"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  SL
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  Đơn giá
                </th>
                <th
                  class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  Thành tiền
                </th>
                <th
                  v-if="invoice.trang_thai === 1"
                  class="py-3 px-3 border-0 rounded-end text-center fw-semibold"
                  style="background-color: #f8f9fa; color: #5a4031"
                >
                  Thao tác
                </th>
                <th v-else class="border-0 rounded-end" style="background-color: #f8f9fa"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sp, idx) in details" :key="idx" class="border-bottom">
                <td class="py-3 px-3">{{ idx + 1 }}</td>
                <td class="py-3 px-3 fw-medium text-dark">{{ sp.ma_sp }}</td>
                <td class="py-3 px-3">{{ sp.ten_san_pham }}</td>
                <td class="py-3 px-3">{{ sp.ten_mau || '----' }}</td>
                <td class="py-3 px-3">{{ sp.ten_kich_co || '----' }}</td>
                <td class="py-3 px-3 text-center fw-medium">{{ sp.so_luong }}</td>
                <td class="py-3 px-3">{{ formatCurrency(sp.don_gia) }}</td>
                <td class="py-3 px-3 text-danger fw-bold">{{ formatCurrency(sp.tong_tien) }}</td>
                <td v-if="invoice.trang_thai === 1" class="py-3 px-3 text-center">
                  <i
                    class="bi bi-pencil-square text-primary fs-5 me-3"
                    style="cursor: pointer"
                    title="Sửa"
                    @click="openEditModal(sp)"
                  ></i>
                  <i
                    class="bi bi-trash text-danger fs-5"
                    style="cursor: pointer"
                    title="Xóa"
                    @click="deleteItem(sp)"
                  ></i>
                </td>
                <td v-else></td>
              </tr>
              <tr v-if="details.length === 0">
                <td colspan="10" class="text-center py-5 text-muted border-0">
                  Không có dữ liệu sản phẩm.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="bg-white p-4 modal-box shadow-lg position-relative">
        <div class="d-flex align-items-center mb-3 mt-1" style="color: #6d4c41">
          <i class="bi bi-box-seam-fill fs-4 me-2"></i>
          <h6 class="fw-bold mb-0 text-uppercase" style="letter-spacing: 0.5px; font-size: 1.05rem">
            THÔNG TIN SẢN PHẨM
          </h6>
        </div>
        <hr class="mb-4" style="border-top: 1px solid #212529; opacity: 0.3" />

        <div class="row">
          <div class="col-md-8">
            <div class="row g-3">
              <div class="col-md-7">
                <label class="fw-bold text-dark mb-1" style="font-size: 0.9rem">Tên sản phẩm</label>
                <select
                  v-model="formItem.ten_san_pham"
                  @change="onProductNameChange"
                  class="form-select figma-input shadow-none"
                >
                  <option value="" disabled selected>-- Chọn sản phẩm --</option>
                  <option v-for="name in uniqueProductNames" :key="name" :value="name">
                    {{ name }}
                  </option>
                </select>
              </div>

              <div class="col-md-5">
                <label class="fw-bold text-dark mb-1" style="font-size: 0.9rem">Mã sản phẩm</label>
                <input
                  v-model="formItem.ma_sp"
                  type="text"
                  class="form-control figma-input shadow-none"
                  :class="{
                    'bg-light': formItem.ma_sp !== 'Không tồn tại',
                    'text-danger fw-bold border-danger': formItem.ma_sp === 'Không tồn tại',
                  }"
                  disabled
                  placeholder="Tự động điền..."
                />
              </div>

              <div class="col-md-7">
                <label class="fw-bold text-dark mb-1" style="font-size: 0.9rem">Đơn giá</label>
                <input
                  v-model="formItem.don_gia"
                  type="number"
                  class="form-control figma-input shadow-none bg-light"
                  disabled
                  placeholder="0"
                />
              </div>

              <div class="col-md-5">
                <label class="fw-bold text-dark mb-1" style="font-size: 0.9rem">Số lượng</label>
                <input
                  v-model="formItem.so_luong"
                  type="number"
                  min="1"
                  class="form-control figma-input shadow-none"
                  placeholder="1"
                />
              </div>

              <div class="col-md-6">
                <label class="fw-bold text-dark mb-1" style="font-size: 0.9rem">Màu sắc</label>
                <select
                  v-model="formItem.ten_mau"
                  @change="onColorOrSizeChange"
                  class="form-select figma-input shadow-none"
                >
                  <option value="" disabled selected>-- Chọn màu --</option>
                  <option v-for="color in allColors" :key="color" :value="color">
                    {{ color }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="fw-bold text-dark mb-1" style="font-size: 0.9rem">Kích cỡ</label>
                <select
                  v-model="formItem.ten_kich_co"
                  @change="onColorOrSizeChange"
                  class="form-select figma-input shadow-none"
                >
                  <option value="" disabled selected>-- Chọn size --</option>
                  <option v-for="size in allSizes" :key="size" :value="size">{{ size }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="col-md-4 d-flex flex-column align-items-center justify-content-start pt-1">
            <label class="fw-bold text-dark mb-2 w-100 text-center" style="font-size: 0.9rem"
              >Ảnh sản phẩm</label
            >
            <div class="image-upload-box d-flex align-items-center justify-content-center">
              <i class="bi bi-plus text-secondary" style="font-size: 3rem"></i>
            </div>
            <div class="mt-2 text-center" style="cursor: pointer">
              <span
                class="badge rounded-pill text-dark d-flex align-items-center justify-content-center"
                style="background-color: #a8a09b; padding: 4px 20px"
              >
                <i class="bi bi-camera fs-6"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center gap-3 mt-5 mb-2">
          <button class="btn figma-btn-submit shadow-sm" @click="saveItem">
            + {{ isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm' }}
          </button>
          <button class="btn figma-btn-cancel shadow-sm" @click="showModal = false">+ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-sans {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.table > :not(caption) > * > * {
  border-bottom-color: #f1f1f1;
}

.custom-btn-solid {
  background-color: #dccbc0;
  color: #5a4031;
}
.custom-btn-solid:hover {
  background-color: #cbb3a1;
}
.custom-btn-outline {
  background-color: #fff;
  border-color: #dccbc0 !important;
  color: #5a4031;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1050;
}

.modal-box {
  width: 780px;
  border-radius: 12px;
}

.figma-input {
  border-radius: 20px;
  border: 1px solid #333;
  padding: 0.35rem 1rem;
  font-size: 0.9rem;
  color: #212529;
}
.figma-input:focus {
  border-color: #8c6b5d;
  box-shadow: 0 0 0 0.2rem rgba(140, 107, 93, 0.25);
}

.image-upload-box {
  width: 140px;
  height: 160px;
  border: 1px dashed #666;
  border-radius: 10px;
  background-color: #fefefe;
  cursor: pointer;
  transition: background-color 0.2s;
}
.image-upload-box:hover {
  background-color: #f1f1f1;
}

.figma-btn-submit {
  background-color: #d4c5b9;
  color: #5a4031;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 20px;
  padding: 0.4rem 1.5rem;
  border: none;
}
.figma-btn-submit:hover {
  background-color: #c4b3a4;
}

.figma-btn-cancel {
  background-color: #b3b3b3;
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 20px;
  padding: 0.4rem 1.8rem;
  border: none;
}
.figma-btn-cancel:hover {
  background-color: #9e9e9e;
}
</style>
