<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { BASE_URL } from '@/apiConfig'

const props = defineProps({
  maHoaDon: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['back'])

const invoice = ref({})
const details = ref([])
const isLoading = ref(true)

const allColors = ref([])
const allSizes = ref([])

const searchProduct = ref('')
const searchColor = ref('')
const searchSize = ref('')

const maxAvailablePrice = ref(0)
const maxPrice = ref(0)

const currentPage = ref(1)
const itemsPerPage = ref(5)

const showHistoryModal = ref(false)
const showEditInfoModal = ref(false)
const showConfirmSaveModal = ref(false)

// ĐÃ THÊM: Biến quản lý Popup xác nhận In để đối phó logic 2 thông báo
const showConfirmPrintModal = ref(false) 

const isSavingInfo = ref(false)

const editInfoForm = ref({
  ten: '',
  sdt: '',
  email: '',
  diaChi: ''
})

const toastMessage = ref('')
const toastType = ref('success') 
const showToast = ref(false)

const displayToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const fixFont = (text) => {
  if (!text || text === '--') return text || ''
  let str = String(text).trim()
  if (/D\?|D\uFFFD|^\?$|^\?\?$|^D$|^Đ$|^Do$/i.test(str)) return 'Đỏ'
  if (/Tr\?ng|Tr\uFFFDng|^Trng$|^Tr ng$/i.test(str)) return 'Trắng'
  if (/H\?ng|H\uFFFDng|^Hng$/i.test(str)) return 'Hồng'
  if (/V\?ng|V\uFFFDng|^Vng$/i.test(str)) return 'Vàng'
  if (/^Xanh$/i.test(str)) return 'Xanh'
  return str
}

const getShippingLogo = (dvvc) => {
  const isGHTK = dvvc && String(dvvc).toUpperCase() === 'GHTK'
  return isGHTK ? ['/', 'logo_ghtk', '.png'].join('') : ['/', 'logo_ghn', '.png'].join('')
}

const fetchDetail = async () => {
  try {
    const response = await fetch(`${BASE_URL}/hoadon/${props.maHoaDon}`)
    if (!response.ok) throw new Error('Error')
    const data = await response.json()
    invoice.value = data.invoice
    details.value = data.details
    const highestPrice = Math.max(...data.details.map(item => Number(item.don_gia || item.donGia || item.DON_GIA) || 0), 0)
    maxAvailablePrice.value = highestPrice > 0 ? highestPrice : 10000000
    maxPrice.value = maxAvailablePrice.value
  } catch (error) {
    console.error(error)
  }
}

const fetchAllAttributes = async () => {
  try {
    const [resColor, resSize] = await Promise.all([
      fetch(`${BASE_URL}/hoadon/mausac`).catch(() => null),
      fetch(`${BASE_URL}/hoadon/kichco`).catch(() => null)
    ])
    if (resColor && resColor.ok) {
      const dataColor = await resColor.json()
      allColors.value = dataColor.map(item => fixFont(Object.values(item)[0])).filter(Boolean)
    } else {
      allColors.value = ['Trắng', 'Đỏ', 'Xanh', 'Vàng', 'Hồng']
    }
    if (resSize && resSize.ok) {
      const dataSize = await resSize.json()
      allSizes.value = dataSize.map(item => fixFont(Object.values(item)[0])).filter(Boolean)
    } else {
      allSizes.value = ['S', 'M', 'L', 'XL', 'XXL']
    }
  } catch (error) {
    console.error(error)
    allColors.value = ['Trắng', 'Đỏ', 'Xanh', 'Vàng', 'Hồng']
    allSizes.value = ['S', 'M', 'L', 'XL', 'XXL']
  }
}

const initializeData = async () => {
  isLoading.value = true
  await Promise.all([fetchDetail(), fetchAllAttributes()])
  isLoading.value = false
}

onMounted(() => {
  initializeData()
})

const isOnline = computed(() => {
  return invoice.value.id_khach_hang !== null
})

const activeTimelineSteps = computed(() => {
  if (isOnline.value) {
    return [
      { step: 1, label: 'Chờ xác nhận', icon: 'bi-hourglass-split' },
      { step: 2, label: 'Đã xác nhận', icon: 'bi-check2-circle' },
      { step: 3, label: 'Chờ giao hàng', icon: 'bi-box-seam' },
      { step: 4, label: 'Đang giao hàng', icon: 'bi-truck' },
      { step: 5, label: 'Hoàn thành', icon: 'bi-flag' }
    ]
  } else {
    return [
      { step: 1, label: 'Chờ xác nhận', icon: 'bi-hourglass-split' },
      { step: 5, label: 'Hoàn thành', icon: 'bi-flag' }
    ]
  }
})

const currentStatus = computed(() => Number(invoice.value.trang_thai) || 1)

const tongTienHang = computed(() => {
  return details.value.reduce((sum, item) => sum + (Number(item.tong_tien || item.tongTien || item.TONG_TIEN) || 0), 0)
})
const phiVanChuyen = computed(() => Number(invoice.value.phi_ship) || 0)
const tongThanhToan = computed(() => Number(invoice.value.tong_tien_thanh_toan) || 0)
const tienGiamGia = computed(() => {
  const giam = (tongTienHang.value + phiVanChuyen.value) - tongThanhToan.value
  return giam > 0 ? giam : 0
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN').format(val || 0)
}
const formatCurrencyVND = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
}
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ${d.toLocaleDateString('vi-VN')}`
}

const orderHistory = computed(() => {
  const history = []
  const createDate = new Date(invoice.value.ngay_tao || Date.now())
  const adminName = 'Quản trị viên'
  const customerName = invoice.value.ten_nguoi_nhan || 'Khách vãng lai'

  if (isOnline.value) {
    history.push({ title: 'Khách hàng đặt đơn', time: formatDate(createDate), user: customerName, status: 'Chờ xác nhận', statusColor: '#f39c12', note: 'Khách hàng tạo đơn hàng trực tuyến trên hệ thống.' })
    if (currentStatus.value >= 2 && currentStatus.value !== 7) {
      history.push({ title: 'Xác nhận đơn hàng', time: formatDate(new Date(createDate.getTime() + 15 * 60000)), user: adminName, status: 'Đã xác nhận', statusColor: '#3498db', note: 'Nhân viên đã gọi điện xác nhận đơn hàng thành công.' })
    }
    if (currentStatus.value >= 3 && currentStatus.value !== 7) {
      history.push({ title: 'Giao cho ĐVVC', time: formatDate(new Date(createDate.getTime() + 60 * 60000)), user: adminName, status: 'Chờ giao hàng', statusColor: '#9b59b6', note: 'Đơn hàng đã được đóng gói và bàn giao cho bưu tá.' })
    }
    if (currentStatus.value >= 4 && currentStatus.value !== 7) {
      history.push({ title: 'Đang vận chuyển', time: formatDate(new Date(createDate.getTime() + 120 * 60000)), user: 'Hệ thống', status: 'Đang giao hàng', statusColor: '#e67e22', note: 'Bưu tá đang trên đường giao hàng đến khách.' })
    }
    if (currentStatus.value === 5) {
      history.push({ title: 'Thanh toán & Hoàn thành', time: formatDate(new Date(invoice.value.ngay_thanh_toan || createDate.getTime() + 240 * 60000)), user: adminName, status: 'Hoàn thành', statusColor: '#2e7d32', note: 'Đơn hàng đã giao thành công và thu tiền đầy đủ.' })
    }
    if (currentStatus.value === 7) {
      history.push({ title: 'Hủy đơn hàng', time: formatDate(new Date(createDate.getTime() + 30 * 60000)), user: adminName, status: 'Đã hủy', statusColor: '#e74c3c', note: invoice.value.ly_do_huy || 'Đơn hàng bị hủy theo yêu cầu.' })
    }
  } else {
    history.push({ title: 'Tạo đơn hàng tại quầy', time: formatDate(createDate), user: adminName, status: 'Chờ xác nhận', statusColor: '#f39c12', note: 'Nhân viên tạo đơn hàng mới trên phần mềm.' })
    if (currentStatus.value === 5) {
      history.push({ title: 'Thanh toán đơn hàng', time: formatDate(new Date(invoice.value.ngay_thanh_toan || createDate.getTime() + 5 * 60000)), user: adminName, status: 'Hoàn thành', statusColor: '#2e7d32', note: 'Đơn hàng được thanh toán tại quầy thành công.' })
    }
  }
  return history.reverse()
})

const filteredDetails = computed(() => {
  return details.value.filter(item => {
    const keyword = searchProduct.value.toLowerCase()
    const matchKeyword = !keyword || (item.ma_sp?.toLowerCase().includes(keyword) || item.ten_san_pham?.toLowerCase().includes(keyword))
    const itemColor = fixFont(item.ten_mau || item.tenMau || item.TEN_MAU || '')
    const matchColor = !searchColor.value || (itemColor === searchColor.value)
    const itemSize = fixFont(item.ten_kich_co || item.tenKichCo || item.TEN_KICH_CO || '')
    const matchSize = !searchSize.value || (itemSize === searchSize.value)
    const price = Number(item.don_gia || item.donGia || item.DON_GIA) || 0
    const matchPrice = price <= (Number(maxPrice.value) || 0)
    return matchKeyword && matchColor && matchSize && matchPrice
  })
})

watch([searchProduct, searchColor, searchSize, maxPrice, itemsPerPage], () => { currentPage.value = 1 })
const totalPages = computed(() => Math.ceil(filteredDetails.value.length / itemsPerPage.value) || 1)
const visiblePages = computed(() => {
  const currentChunk = Math.ceil(currentPage.value / 3)
  const startPage = (currentChunk - 1) * 3 + 1
  const pages = []
  for (let i = 0; i < 3; i++) { if (startPage + i <= totalPages.value) pages.push(startPage + i) }
  return pages
})
const paginatedDetails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredDetails.value.slice(start, start + itemsPerPage.value)
})
const changePage = (page) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

const resetFilters = () => {
  searchProduct.value = ''
  searchColor.value = ''
  searchSize.value = ''
  maxPrice.value = maxAvailablePrice.value
}

const openEditInfoModal = () => {
  editInfoForm.value = {
    ten: invoice.value.ten_nguoi_nhan || invoice.value.tenNguoiNhan || '',
    sdt: invoice.value.sdt_nguoi_nhan || invoice.value.sdtNguoiNhan || '',
    email: invoice.value.email || '',
    diaChi: invoice.value.dia_chi_giao_hang || invoice.value.diaChiGiaoHang || ''
  }
  showEditInfoModal.value = true
}

const closeEditInfoModal = () => {
  showEditInfoModal.value = false
}

const triggerSaveConfirm = () => {
  if (!editInfoForm.value.ten || !editInfoForm.value.sdt) {
    displayToast('Vui lòng nhập đầy đủ Tên và Số điện thoại!', 'danger')
    return
  }
  showConfirmSaveModal.value = true
}

const executeSaveInfo = async () => {
  showConfirmSaveModal.value = false
  isSavingInfo.value = true
  try {
    invoice.value.ten_nguoi_nhan = editInfoForm.value.ten
    invoice.value.sdt_nguoi_nhan = editInfoForm.value.sdt
    invoice.value.email = editInfoForm.value.email
    if (isOnline.value) { invoice.value.dia_chi_giao_hang = editInfoForm.value.diaChi }
    showEditInfoModal.value = false
    displayToast('Cập nhật thông tin khách hàng thành công!', 'success')
  } catch (error) {
    console.error(error)
    displayToast('Đã xảy ra lỗi khi lưu thông tin!', 'danger')
  } finally {
    isSavingInfo.value = false
  }
}

// Bổ sung hàm gọi popup In hóa đơn
const triggerPrintConfirm = () => {
  showConfirmPrintModal.value = true
}

const cancelPrint = () => {
  showConfirmPrintModal.value = false
  displayToast('Hủy in hóa đơn thành công!', 'danger')
}

const executePrint = () => {
  showConfirmPrintModal.value = false
  displayToast('In hóa đơn thành công!', 'success')
  
  const qrText = `HÓA ĐƠN: ${props.maHoaDon}\nKhách hàng: ${invoice.value.ten_nguoi_nhan || 'Khách vãng lai'}\nSĐT: ${invoice.value.sdt_nguoi_nhan || '---'}\nTổng TT: ${formatCurrencyVND(tongThanhToan.value)}\nNgày: ${new Date().toLocaleString('vi-VN')}`;
  const qrDataUrl = encodeURIComponent(qrText);
  
  const currentOrigin = window.location.origin;
  const shippingLogoUrl = invoice.value.ten_dvvc ? getShippingLogo(invoice.value.ten_dvvc) : '';
  const absoluteLogoUrl = shippingLogoUrl ? `${currentOrigin}${shippingLogoUrl}` : '';
  const shippingLogoHtml = absoluteLogoUrl ? `<img src="${absoluteLogoUrl}" height="14" style="vertical-align: middle; margin-left: 5px;" />` : '';

  let printContents = `
    <!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Hóa Đơn ${props.maHoaDon}</title>
      <style>
        * { box-sizing: border-box; } @page { size: A4; margin: 0; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #000; margin: 0; padding: 20mm; line-height: 1.5; }
        .invoice-box { width: 100%; max-width: 800px; margin: 0 auto; background: #fff; }
        .text-center { text-align: center; } .text-right { text-align: right; } .text-left { text-align: left; } .fw-bold { font-weight: bold; }
        .invoice-title { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 30px 0; text-align: center; }
        .header-wrap { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .store-info h2 { margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .store-info p, .bill-meta p, .customer-info p { margin: 3px 0; font-size: 13px; color: #333; }
        .customer-info { margin-bottom: 25px; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 15px 0; display: flex; justify-content: space-between;}
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
        th { border-bottom: 2px solid #000; padding: 10px 5px; font-size: 14px; text-transform: uppercase; }
        td { padding: 12px 5px; border-bottom: 1px dashed #ccc; vertical-align: top; font-size: 14px; word-wrap: break-word;}
        .summary-table { width: 100%; border-collapse: collapse; } .summary-table td { border: none; padding: 6px 0; font-size: 14px;}
        .summary-table .total-row td { border-top: 2px solid #000; font-size: 16px; padding-top: 12px; font-weight: bold; }
      </style></head><body>
      <div class="invoice-box"><div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
        <div class="header-wrap"><div class="store-info"><h2>CỬA HÀNG ÁO DÀI GIAI ĐÀI</h2><p><strong>Địa chỉ:</strong> Số 10 Phố Hàng Bài, Hoàn Kiếm, Hà Nội</p><p><strong>Hotline:</strong> 0988.888.888</p></div>
          <div class="bill-meta text-right"><p><strong>Mã HĐ:</strong> ${props.maHoaDon}</p><p><strong>Ngày in:</strong> ${new Date().toLocaleString('vi-VN')}</p><p><strong>Thu ngân:</strong> Quản trị viên</p></div></div>
        <div class="customer-info"><div><p><strong>Khách hàng:</strong> ${invoice.value.ten_nguoi_nhan || 'Khách vãng lai'}</p><p><strong>Điện thoại:</strong> ${invoice.value.sdt_nguoi_nhan || '----'}</p>
            ${invoice.value.dia_chi_giao_hang ? `<p><strong>Địa chỉ giao:</strong> ${invoice.value.dia_chi_giao_hang}</p>` : ''}</div>
          <div class="text-right"><p><strong>Loại đơn:</strong> ${isOnline.value ? 'Trực tuyến' : 'Tại quầy'}</p><p><strong>Hình thức TT:</strong> ${invoice.value.ten_pttt || 'Tiền mặt'}</p></div></div>
        <table><thead><tr><th class="text-left" style="width: 45%;">Tên hàng hóa, dịch vụ</th><th class="text-center" style="width: 15%;">Số lượng</th><th class="text-right" style="width: 20%;">Đơn giá</th><th class="text-right" style="width: 20%;">Thành tiền</th></tr></thead>
          <tbody>`
  details.value.forEach((sp) => {
    printContents += `<tr><td class="text-left"><div class="fw-bold">${sp.ten_san_pham || sp.tenSanPham || sp.TEN_SAN_PHAM}</div><div style="font-size: 12px; color: #555; margin-top: 4px;">Phân loại: ${fixFont(sp.ten_mau || sp.tenMau || sp.TEN_MAU)} - ${fixFont(sp.ten_kich_co || sp.tenKichCo || sp.TEN_KICH_CO) || '--'}</div></td>
      <td class="text-center">${sp.so_luong || sp.soLuong || sp.SO_LUONG}</td><td class="text-right">${formatCurrencyVND(sp.don_gia || sp.donGia || sp.DON_GIA)}</td><td class="text-right fw-bold">${formatCurrencyVND(sp.tong_tien || sp.tongTien || sp.TONG_TIEN)}</td></tr>`
  })
  printContents += `</tbody></table>
        <table style="width: 100%; margin-top: 20px; border: none;"><tr>
            <td style="width: 40%; vertical-align: bottom; text-align: center; border: none; padding-right: 20px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${qrDataUrl}" alt="QR Hóa Đơn" style="width: 110px; height: 110px; margin-bottom: 8px;" />
              <div style="font-size: 12px; color: #555; font-style: italic;">Quét để kiểm tra hóa đơn</div></td>
            <td style="width: 60%; vertical-align: top; border: none;"><table class="summary-table">
                <tr><td class="text-right">Tổng tiền hàng:</td><td class="text-right fw-bold">${formatCurrencyVND(tongTienHang.value)}</td></tr>
                ${(tienGiamGia.value > 0 && invoice.value.ma_voucher) ? `<tr><td class="text-right">Giảm giá (Mã ${invoice.value.ma_voucher}):</td><td class="text-right">- ${formatCurrencyVND(tienGiamGia.value)}</td></tr>` : ''}
                ${phiVanChuyen.value > 0 ? `<tr><td class="text-right">Phí vận chuyển ${shippingLogoHtml}:</td><td class="text-right">+ ${formatCurrencyVND(phiVanChuyen.value)}</td></tr>` : ''}
                <tr class="total-row"><td class="text-right">TỔNG KHÁCH CẦN TRẢ:</td><td class="text-right">${formatCurrencyVND(tongThanhToan.value)}</td></tr>
              </table></td></tr></table></div></body></html>`

  const iframe = document.createElement('iframe')
  iframe.style.visibility = 'hidden'
  iframe.style.position = 'absolute'
  iframe.style.width = '0px'
  iframe.style.height = '0px'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)
  iframe.contentDocument?.write(printContents)
  iframe.contentDocument?.close()

  setTimeout(() => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    iframe.contentWindow.onafterprint = () => {
      setTimeout(() => { document.body.removeChild(iframe) }, 500)
    }
  }, 1000)
}
</script>

<template>
  <div class="container-fluid p-0" v-if="!isLoading">
    
    <div v-if="showToast" class="custom-toast-container">
      <div class="custom-toast animate__animated animate__slideInRight animate__faster shadow-sm border" :class="toastType">
        <div class="toast-icon">
          <i v-if="toastType === 'success'" class="bi bi-check-circle-fill text-success"></i>
          <i v-else-if="toastType === 'danger'" class="bi bi-x-circle-fill text-danger"></i>
          <i v-else class="bi bi-info-circle-fill text-secondary"></i>
        </div>
        <div class="toast-text">{{ toastMessage }}</div>
      </div>
    </div>
    
    <div class="d-flex align-items-center mb-4 text-primary-brown cursor-pointer" @click="$emit('back')">
      <i class="bi bi-chevron-left fs-5 me-2"></i>
      <h5 class="mb-0 fw-bold">Chi tiết hóa đơn: <span class="text-brown">{{ maHoaDon }}</span></h5>
    </div>

    <div class="row g-4">
      <div class="col-xl-8 col-lg-7">
        <div class="card border-0 shadow-sm rounded-3 mb-4">
          <div class="card-body p-4">
            <h6 class="fw-bold mb-4 text-dark"><i class="bi bi-clipboard-data me-2"></i>Trạng thái đơn hàng</h6>
            <div class="timeline-container position-relative py-3">
              <div class="timeline-line bg-secondary bg-opacity-25"></div>
              <div class="d-flex justify-content-between">
                <div v-for="(step, index) in activeTimelineSteps" :key="step.step" class="timeline-item text-center z-1">
                  <div class="timeline-icon d-flex align-items-center justify-content-center mx-auto mb-2 border" :class="currentStatus >= step.step ? 'bg-status text-white border-status' : 'bg-white text-muted'">
                    <i class="bi" :class="step.icon"></i>
                  </div>
                  <div class="fw-bold small" :class="currentStatus >= step.step ? 'text-status' : 'text-muted'">{{ step.label }}</div>
                  <div class="timeline-date small text-muted" v-if="currentStatus >= step.step && step.step === 1">{{ formatDate(invoice.ngay_tao) }}</div>
                </div>
              </div>
            </div>
            <div class="text-end mt-4">
              <button @click="showHistoryModal = true" class="btn btn-custom-brown rounded-pill px-4 shadow-none fw-medium"><i class="bi bi-clock-history me-2"></i>Lịch sử thao tác</button>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-3">
          <div class="col-md-6">
            <div class="card border-0 shadow-sm rounded-3 h-100">
              <div class="card-body p-4">
                <h6 class="fw-bold mb-4 text-dark"><i class="bi bi-person me-2"></i>Thông tin khách hàng</h6>
                <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span class="text-muted small">Tên khách hàng</span><span class="fw-bold text-dark">{{ invoice.ten_nguoi_nhan || 'Khách vãng lai' }}</span>
                </div>
                <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span class="text-muted small">Số điện thoại</span><span class="fw-bold text-dark">{{ invoice.sdt_nguoi_nhan || '----' }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted small">Email</span><span class="fw-bold text-dark">{{ invoice.email || '----' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="card border-0 shadow-sm rounded-3 h-100">
              <div class="card-body p-4">
                <h6 class="fw-bold mb-4 text-dark"><i class="bi bi-geo-alt me-2"></i>Thông tin giao hàng</h6>
                <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span class="text-muted small">Địa chỉ</span><span class="fw-bold text-dark text-end" style="max-width: 60%">{{ invoice.dia_chi_giao_hang || 'Mua tại quầy' }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted small">Loại đơn</span><span class="fw-bold text-dark">{{ isOnline ? 'Trực tuyến' : 'Tại quầy' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mb-4" v-if="currentStatus !== 5 && currentStatus !== 7">
          <button @click="openEditInfoModal" class="btn btn-custom-brown btn-sm rounded-pill shadow-none px-4 fw-medium"><i class="bi bi-pencil-square me-2"></i>Sửa thông tin</button>
        </div>
      </div>

      <div class="col-xl-4 col-lg-5 d-flex flex-column gap-4">
        <div class="card border-0 shadow-sm rounded-3">
          <div class="card-body p-4">
            <h6 class="fw-bold mb-4 text-dark"><i class="bi bi-wallet2 me-2"></i>Tổng kết thanh toán</h6>
            <div class="d-flex justify-content-between mb-3"><span class="text-muted small">Tổng tiền hàng</span><span class="fw-bold text-dark">{{ formatCurrencyVND(tongTienHang) }}</span></div>
            <div v-if="tienGiamGia > 0 && invoice.ma_voucher" class="d-flex justify-content-between mb-3 align-items-center">
              <span class="text-muted small">Giảm giá <span class="fw-medium text-brown ms-1">(Mã: {{ invoice.ma_voucher }})</span></span>
              <span class="fw-bold text-brown">- {{ formatCurrencyVND(tienGiamGia) }}</span>
            </div>
            
            <div v-if="isOnline" class="d-flex justify-content-between mb-3 pb-3 border-bottom align-items-center">
              <span class="text-muted small d-flex align-items-center gap-2">Phí vận chuyển<img :src="getShippingLogo(invoice.ten_dvvc)" alt="Logo" height="15" style="margin-top: -2px; object-fit: contain;" /></span>
              <span class="fw-bold text-dark">+ {{ formatCurrencyVND(phiVanChuyen) }}</span>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mt-2"><span class="fw-bold text-brown fs-6">TỔNG TIỀN</span><span class="fw-bold fs-5 text-brown">{{ formatCurrencyVND(tongThanhToan) }}</span></div>
          </div>
        </div>
        <div class="card border-0 shadow-sm rounded-3 flex-grow-1">
          <div class="card-body p-4 d-flex flex-column">
            <h6 class="fw-bold mb-4 text-dark"><i class="bi bi-clock-history me-2"></i>Lịch sử thanh toán</h6>
            <div class="d-flex justify-content-between mb-3 flex-grow-1">
              <div><span class="fw-bold text-dark d-block mb-1">{{ invoice.ten_pttt || 'Tiền mặt' }}</span><span class="text-muted small">Thanh toán {{ isOnline ? 'khi nhận hàng' : 'tại quầy' }}</span></div>
              <div class="text-end"><span class="fw-bold" :class="invoice.ngay_tt_thuc_te ? 'text-brown' : 'text-danger'">{{ invoice.ngay_tt_thuc_te ? 'Đã thanh toán' : 'Chưa thanh toán' }}</span><span class="fw-bold text-dark d-block mt-2">{{ formatCurrencyVND(tongThanhToan) }}</span></div>
            </div>
            
            <button @click="triggerPrintConfirm" class="btn btn-custom-brown w-100 py-2 rounded-pill shadow-none fw-bold mt-3">
              <i class="bi bi-printer me-2"></i> In Hóa Đơn
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-3 mt-2 mb-5">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-4"><h6 class="fw-bold mb-0 text-dark"><i class="bi bi-box me-2"></i>Danh sách sản phẩm</h6></div>
        <div class="row g-4 mb-4">
          <div class="col-md-3"><label class="form-label small fw-medium text-dark mb-2">Tên hoặc mã sản phẩm</label><input v-model="searchProduct" type="text" class="form-control rounded-3 shadow-none border-secondary-subtle" placeholder="Nhập tên hoặc mã..." /></div>
          <div class="col-md-2"><label class="form-label small fw-medium text-dark mb-2">Màu sắc</label><select v-model="searchColor" class="form-select rounded-3 shadow-none border-secondary-subtle"><option value="">Tất cả màu</option><option v-for="color in allColors" :key="color" :value="color">{{ color }}</option></select></div>
          <div class="col-md-2"><label class="form-label small fw-medium text-dark mb-2">Kích cỡ</label><select v-model="searchSize" class="form-select rounded-3 shadow-none border-secondary-subtle"><option value="">Tất cả size</option><option v-for="size in allSizes" :key="size" :value="size">{{ size }}</option></select></div>
          <div class="col-md-4"><div class="d-flex justify-content-between mb-2"><label class="form-label small fw-medium text-dark mb-0">Khoảng giá</label><span class="small text-muted fw-medium">0 - {{ formatCurrencyVND(maxPrice) }}</span></div><input type="range" class="form-range custom-range mt-1" min="0" :max="maxAvailablePrice" step="10000" v-model.number="maxPrice"></div>
          <div class="col-md-1 d-flex align-items-end"><button @click="resetFilters" class="btn btn-custom-brown w-100 rounded-3 shadow-none px-0" style="height: 38px;" title="Làm mới bộ lọc"><i class="bi bi-arrow-clockwise"></i></button></div>
        </div>
        <div class="table-responsive border-top pt-3">
          <table class="table table-borderless align-middle text-nowrap" style="font-size: 0.9rem">
            <thead>
              <tr class="border-bottom">
                <th class="text-muted fw-semibold py-3">STT</th><th class="text-muted fw-semibold py-3">Mã sản phẩm</th><th class="text-muted fw-semibold py-3">Tên sản phẩm</th>
                <th class="text-muted fw-semibold py-3 text-center">Kích cỡ</th><th class="text-muted fw-semibold py-3 text-center">Màu sắc</th><th class="text-muted fw-semibold py-3 text-center">Số lượng</th>
                <th class="text-muted fw-semibold py-3 text-end">Đơn giá</th><th class="text-muted fw-semibold py-3 text-end">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sp, index) in paginatedDetails" :key="sp.ma_sp" class="border-bottom">
                <td class="py-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-3">{{ sp.ma_sp || sp.ma_san_pham || sp.maSanPham || sp.ma_sku || sp.maSku || sp.MA_SKU }}</td>
                <td class="py-3 fw-bold text-dark">{{ sp.ten_san_pham || sp.tenSanPham || sp.TEN_SAN_PHAM }}</td>
                <td class="py-3 text-center">{{ fixFont(sp.ten_kich_co || sp.tenKichCo || sp.TEN_KICH_CO) || '--' }}</td>
                <td class="py-3 text-center">{{ fixFont(sp.ten_mau || sp.tenMau || sp.TEN_MAU) || '--' }}</td>
                <td class="py-3 text-center">{{ sp.so_luong || sp.soLuong || sp.SO_LUONG }}</td>
                <td class="py-3 text-end">{{ formatCurrencyVND(sp.don_gia || sp.donGia || sp.DON_GIA) }}</td>
                <td class="py-3 text-end text-brown fw-bold">{{ formatCurrencyVND(sp.tong_tien || sp.tongTien || sp.TONG_TIEN) }}</td>
              </tr>
              <tr v-if="paginatedDetails.length === 0"><td colspan="8" class="text-center py-4 text-danger">Không tìm thấy sản phẩm phù hợp.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small">
          <div>Hiển thị {{ paginatedDetails.length }} / {{ filteredDetails.length }} bản ghi</div>
          <div class="d-flex gap-3 align-items-center">
            <i class="bi bi-chevron-left fs-6 fw-bold" @click="changePage(currentPage - 1)" :style="currentPage > 1 ? 'cursor: pointer; color: #5a4031;' : 'cursor: not-allowed; color: #dee2e6;'"></i>
            <div class="d-flex gap-1"><span v-for="page in visiblePages" :key="page" @click="page <= totalPages ? changePage(page) : null" class="px-3 py-1 rounded-2 fw-medium btn-page" :class="{ 'active': currentPage === page, 'disabled-page': page > totalPages }">{{ page }}</span></div>
            <i class="bi bi-chevron-right fs-6 fw-bold" @click="changePage(currentPage + 1)" :style="currentPage < totalPages ? 'cursor: pointer; color: #5a4031;' : 'cursor: not-allowed; color: #dee2e6;'"></i>
          </div>
          <div>
            <select v-model.number="itemsPerPage" class="form-select form-select-sm shadow-none text-muted border-secondary-subtle rounded-2" style="width: auto;">
              <option :value="5">5 bản ghi / trang</option><option :value="10">10 bản ghi / trang</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showHistoryModal" class="custom-modal-overlay" @click.self="showHistoryModal = false">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden">
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 class="mb-0 fw-bold text-dark">Lịch sử trạng thái đơn hàng</h5>
          <i class="bi bi-x-lg cursor-pointer text-muted fs-5" @click="showHistoryModal = false"></i>
        </div>
        <div class="p-3 border-bottom d-flex justify-content-between text-muted small bg-light">
          <span><strong>Mã đơn:</strong> <span class="text-primary-brown">{{ maHoaDon }}</span></span><span><strong>Ngày tạo:</strong> {{ formatDate(invoice.ngay_tao) }}</span>
        </div>
        <div class="p-4 bg-white" style="max-height: 450px; overflow-y: auto;">
          <div class="history-timeline ms-2">
            <div v-for="(item, idx) in orderHistory" :key="idx" class="history-item mb-4 position-relative">
              <div class="timeline-dot bg-white border border-2" :style="{ borderColor: item.statusColor + ' !important' }"></div>
              <div class="history-card border rounded-3 p-3 ms-4 bg-light bg-opacity-25 shadow-sm">
                <div class="d-flex justify-content-between align-items-start mb-2"><h6 class="fw-bold mb-0 text-dark">{{ item.title }}</h6><span class="badge rounded-pill" :style="{ backgroundColor: item.statusColor + '20', color: item.statusColor }">{{ item.status }}</span></div>
                <div class="text-muted small mb-3"><i class="bi bi-clock me-1"></i>{{ item.time }}</div>
                <div class="d-flex align-items-center mb-2 small text-secondary"><i class="bi bi-person-circle me-2"></i> <strong>Người thao tác:</strong> <span class="ms-1">{{ item.user }}</span></div>
                <div class="p-2 rounded-2 small mt-2 d-flex gap-2" style="background-color: #fdf8e4; color: #a67c52; border-left: 3px solid #dccbc0;"><i class="bi bi-chat-left-text mt-1"></i><span>{{ item.note }}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-3 border-top text-end bg-light"><button class="btn btn-outline-secondary px-4 rounded-3 shadow-none" @click="showHistoryModal = false">Đóng</button></div>
      </div>
    </div>

    <div v-if="showEditInfoModal" class="custom-modal-overlay" @click.self="closeEditInfoModal">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden">
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
          <h5 class="mb-0 fw-bold text-dark">Sửa thông tin nhận hàng</h5><i class="bi bi-x-lg cursor-pointer text-muted fs-5" @click="closeEditInfoModal"></i>
        </div>
        <div class="p-4 bg-white">
          <div class="mb-3"><label class="form-label small fw-medium text-dark">Tên khách hàng</label><input v-model="editInfoForm.ten" type="text" class="form-control rounded-3 shadow-none border-secondary-subtle" placeholder="Nhập tên khách hàng" /></div>
          <div class="mb-3"><label class="form-label small fw-medium text-dark">Số điện thoại</label><input v-model="editInfoForm.sdt" type="text" class="form-control rounded-3 shadow-none border-secondary-subtle" placeholder="Nhập số điện thoại" /></div>
          <div class="mb-3"><label class="form-label small fw-medium text-dark">Email (Tùy chọn)</label><input v-model="editInfoForm.email" type="email" class="form-control rounded-3 shadow-none border-secondary-subtle" placeholder="Nhập email" /></div>
          <div class="mb-3" v-if="isOnline"><label class="form-label small fw-medium text-dark">Địa chỉ giao hàng</label><textarea v-model="editInfoForm.diaChi" class="form-control rounded-3 shadow-none border-secondary-subtle" rows="3" placeholder="Nhập địa chỉ chi tiết"></textarea></div>
        </div>
        <div class="p-3 border-top d-flex justify-content-end gap-2 bg-light">
          <button class="btn btn-outline-secondary px-4 rounded-pill shadow-none" @click="closeEditInfoModal">Hủy</button>
          <button class="btn btn-custom-brown px-4 rounded-pill shadow-none" @click="triggerSaveConfirm" :disabled="isSavingInfo"><span v-if="isSavingInfo" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Lưu thay đổi</button>
        </div>
      </div>
    </div>

    <div v-if="showConfirmSaveModal" class="custom-modal-overlay" style="z-index: 1060;" @click.self="showConfirmSaveModal = false">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white p-4 text-center" style="max-width: 400px;">
        <div class="mx-auto mb-3" style="width: 64px; height: 64px;">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7.2L12 12.4L22 7.2L12 2Z" fill="#9e7b68"/><path d="M2 7.2V17.2L12 22.4V12.4L2 7.2Z" fill="#765341"/><path d="M22 7.2V17.2L12 22.4V12.4L22 7.2Z" fill="#8c6551"/><line x1="12" y1="2" x2="12" y2="12.4" stroke="white" stroke-width="1.5" stroke-linecap="round"/><line x1="7" y1="4.6" x2="12" y2="7.2" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <h5 class="fw-bold mb-3" style="color: #5a4031; font-size: 1.1rem;">Xác Nhận Thay Đổi</h5>
        <p class="text-muted mb-4" style="font-size: 0.9rem; line-height: 1.5;">Bạn có chắc chắn muốn lưu thay đổi thông tin khách hàng cho hóa đơn:<br><strong class="text-dark">[{{ maHoaDon }}]</strong> không?</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn rounded-pill fw-medium shadow-none" style="background-color: #e4e8ec; color: #6c757d; border: none; min-width: 110px; font-size: 0.9rem;" @click="showConfirmSaveModal = false">Hủy bỏ</button>
          <button class="btn rounded-pill fw-medium shadow-none" style="background-color: #e8d8ce; color: #5a4031; border: none; min-width: 110px; font-size: 0.9rem;" @click="executeSaveInfo">Xác nhận</button>
        </div>
      </div>
    </div>

    <div v-if="showConfirmPrintModal" class="custom-modal-overlay" style="z-index: 1060;" @click.self="showConfirmPrintModal = false">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white p-4 text-center" style="max-width: 400px;">
        <div class="mx-auto mb-3">
          <i class="bi bi-printer" style="font-size: 3.5rem; color: #8c6551;"></i>
        </div>
        <h5 class="fw-bold mb-3" style="color: #5a4031; font-size: 1.1rem;">Xác Nhận In Hóa Đơn</h5>
        <p class="text-muted mb-4" style="font-size: 0.9rem; line-height: 1.5;">Hệ thống sẽ kết xuất hóa đơn <strong class="text-dark">[{{ maHoaDon }}]</strong> ra bản in.<br>Bạn có muốn tiếp tục?</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn rounded-pill fw-medium shadow-none" style="background-color: #e4e8ec; color: #6c757d; border: none; min-width: 110px; font-size: 0.9rem;" @click="cancelPrint">Hủy bỏ</button>
          <button class="btn rounded-pill fw-medium shadow-none" style="background-color: #e8d8ce; color: #5a4031; border: none; min-width: 110px; font-size: 0.9rem;" @click="executePrint">In Hóa Đơn</button>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="d-flex justify-content-center align-items-center" style="height: 50vh;">
    <div class="spinner-border text-brown" role="status"></div>
  </div>
</template>

<style scoped>
.text-primary-brown { color: #5a4031; } .text-brown { color: #a67c52 !important; } .cursor-pointer { cursor: pointer; }
.btn-custom-brown { background-color: #ebdcd0 !important; color: #5a4031 !important; border: 1px solid #cbb3a1 !important; transition: all 0.2s ease-in-out; }
.btn-custom-brown:hover { background-color: #e2cec0 !important; color: #4a3528 !important; border-color: #bfac9b !important; }
.btn-custom-brown:disabled { background-color: #f5ede8 !important; color: #a1938b !important; border-color: #dfd6d0 !important; cursor: not-allowed; }

.bg-status { background-color: #2e7d32 !important; } .text-status { color: #2e7d32 !important; } .border-status { border-color: #2e7d32 !important; }
.timeline-container { padding: 0 40px; } .timeline-line { position: absolute; top: 35px; left: 10%; right: 10%; height: 2px; z-index: 0; }
.timeline-item { position: relative; width: 120px; } .timeline-icon { width: 45px; height: 45px; border-radius: 50%; font-size: 1.2rem; background-color: white; }
.timeline-date { font-size: 0.7rem; margin-top: 4px; } .custom-range::-webkit-slider-thumb { background: #a67c52; }
.custom-range::-moz-range-thumb { background: #a67c52; } .custom-range::-ms-thumb { background: #a67c52; }

.custom-toast-container {
  position: fixed; top: 75px; right: 20px; z-index: 9999;
}
.custom-toast {
  display: flex; align-items: center; background-color: #ffffff;
  border-radius: 8px; padding: 12px 20px; min-width: 250px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.custom-toast.success { border-left: 5px solid #198754 !important; }
.custom-toast.info { border-left: 5px solid #6c757d !important; }
.custom-toast.danger { border-left: 5px solid #dc3545 !important; }

.toast-icon i { font-size: 1.25rem; margin-right: 12px; }
.toast-text { color: #333; font-weight: 500; font-size: 0.95rem; }

.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 1050; display: flex; align-items: center; justify-content: center; }
.custom-modal-content { width: 100%; max-width: 550px; animation: modalFadeIn 0.25s ease-out; }
@keyframes modalFadeIn { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.history-timeline { position: relative; padding-left: 10px; }
.history-timeline::before { content: ''; position: absolute; top: 0; bottom: 0; left: 16px; width: 2px; background-color: #e9ecef; }
.history-item .timeline-dot { position: absolute; left: 1px; top: 15px; width: 12px; height: 12px; border-radius: 50%; z-index: 2; }
.history-card { transition: all 0.2s; } .history-card:hover { transform: translateX(3px); border-color: #dccbc0 !important; }
.btn-page { cursor: pointer; color: #6c757d; transition: all 0.2s ease; } .btn-page.active { background-color: #8a6d59 !important; color: #ffffff !important; }
.btn-page.disabled-page { color: #dee2e6 !important; cursor: default; } .btn-page:hover:not(.active):not(.disabled-page) { background-color: #f3f4f6; }
</style>