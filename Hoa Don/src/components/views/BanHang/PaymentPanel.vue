<template>
  <div class="bg-white rounded-3 border d-flex flex-column h-100 position-relative text-dark" style="box-shadow: 0 2px 8px rgba(0,0,0,0.02);">

    <div v-if="!hoaDonActive" class="payment-overlay rounded-3 d-flex flex-column align-items-center justify-content-center text-muted">
      <i class="bi bi-credit-card fs-1 mb-2 opacity-50"></i>
      <p>Vui lòng chọn hoặc tạo hóa đơn</p>
    </div>

    <div class="p-3 border-bottom border-secondary-subtle">
      <h6 class="fw-bold m-0" style="color: #1c1c1c; font-size: 15px;">Thông tin thanh toán</h6>
    </div>

    <div class="flex-grow-1 overflow-auto custom-scrollbar p-3">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="fw-bold" style="color: #bc8f75; font-size: 12px;">MÃ GIẢM GIÁ</span>
        <button class="btn btn-sm rounded-pill fw-medium border shadow-none" 
                style="font-size: 11px; background-color: #fcfaf8; color: #1c1c1c;"
                @click="showVoucherModal = true">
          <i class="bi bi-plus text-dark"></i> Chọn mã giảm giá
        </button>
      </div>

      <div v-if="voucherSelected" class="p-3 mb-4 border rounded-2 position-relative" style="background-color: #fdfaf7; border-color: #eadcd3 !important;">
         <i class="bi bi-x-circle-fill text-danger position-absolute cursor-pointer bg-white rounded-circle" style="top: -8px; right: -8px; font-size: 18px;" @click="voucherSelected = null"></i>
         <div class="fw-bold mb-2 d-flex align-items-center text-truncate" style="color: #d16b41; font-size: 12.5px;">
             <span class="badge rounded-1 me-2" style="background-color: #d16b41; font-size: 9px; padding: 3px 5px;">VO</span>
             [{{ voucherSelected.maVoucher }}] {{ voucherSelected.tenVoucher }}
         </div>
         <div class="row gx-1 gy-2" style="font-size: 11px; color: #555;">
             <div class="col-6">Giảm: <span class="text-danger fw-bold">{{ voucherSelected.loaiGiamGia === 1 ? voucherSelected.giaTriGiam + '%' : formatCurrency(voucherSelected.giaTriGiam) }}</span></div>
             <div class="col-6">Đơn tối thiểu: <span class="text-dark">{{ formatCurrency(voucherSelected.donToiThieu) }}</span></div>
             <div class="col-12 mt-1 text-muted" style="font-size: 10.5px;">HSD: {{ formatDateTime(voucherSelected.ngayKetThuc) }}</div>
         </div>
      </div>
      
      <div v-else class="text-center text-muted mb-4 small fst-italic p-3 bg-light rounded border border-dashed">
         Chưa áp dụng mã giảm giá
      </div>

      <hr class="text-muted opacity-25 mb-3 border-secondary-subtle">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-dark" style="font-size: 13px;">Phương thức thanh toán</span>
        <div class="d-flex gap-2">
           <button class="btn btn-sm rounded-pill fw-medium border shadow-none"
                   :class="phuongThucTT === 1 ? 'btn-pt-active' : 'btn-pt-inactive'"
                   @click="phuongThucTT = 1" style="font-size: 11.5px;">Tiền mặt</button>
           <button class="btn btn-sm rounded-pill fw-medium border shadow-none"
                   :class="phuongThucTT === 2 ? 'btn-pt-active' : 'btn-pt-inactive'"
                   @click="phuongThucTT = 2" style="font-size: 11.5px;">VietQR</button>
        </div>
      </div>

      <div v-if="phuongThucTT === 1" class="mb-4">
        <div class="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light border border-secondary-subtle">
          <span class="text-dark fw-medium" style="font-size: 13px;">Khách thanh toán:</span>
          <div class="input-group" style="width: 140px;">
             <input type="text" class="form-control text-end shadow-none fw-bold text-primary border-secondary-subtle" 
                    style="font-size: 14px;" 
                    v-model="tienKhachDuaDisplay" 
                    placeholder="0">
             <span class="input-group-text bg-white border-secondary-subtle">đ</span>
          </div>
        </div>
      </div>

      <hr class="text-muted opacity-25 mb-3 border-secondary-subtle">

      <div class="d-flex justify-content-between mb-3" style="font-size: 13px;">
        <span class="text-dark">Tổng tiền hàng:</span>
        <span class="fw-bold text-dark">{{ formatCurrency(tongTienHang) }}</span>
      </div>
      
      <div class="d-flex justify-content-between mb-3" style="font-size: 13px;" v-if="isGiaoHang">
        <span class="text-dark align-middle">Phí giao hàng:
           <input type="number" v-model="tienShip" class="ms-2 border-0 bg-light text-end rounded shadow-none" style="width: 70px; outline: none; padding: 2px;" placeholder="0">
        </span>
        <span class="fw-bold text-dark">{{ formatCurrency(tienShip) }}</span>
      </div>

      <div class="d-flex justify-content-between mb-3" style="font-size: 13px;">
        <span class="text-dark">Giảm giá:</span>
        <span class="fw-bold text-danger">-{{ formatCurrency(tienGiamGiaThucTe) }}</span>
      </div>

      <div v-if="phuongThucTT === 1" class="d-flex justify-content-between mb-3 align-items-center p-2 rounded-2" :class="tienThua < 0 ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10'">
        <span class="fw-bold" style="font-size: 13px;" :class="tienThua < 0 ? 'text-danger' : 'text-success'">
           {{ tienThua < 0 ? 'Khách đưa thiếu:' : 'Tiền thừa trả khách:' }}
        </span>
        <span class="fw-bold" style="font-size: 15px;" :class="tienThua < 0 ? 'text-danger' : 'text-success'">
           {{ formatCurrency(Math.abs(tienThua)) }}
        </span>
      </div>

      <hr class="text-muted opacity-25 mb-3 border-secondary-subtle">

      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold text-dark" style="font-size: 14.5px;">TỔNG THANH TOÁN:</span>
        <span class="fw-bold text-danger" style="font-size: 20px;">{{ formatCurrency(khachCanTra) }}</span>
      </div>

    </div>

    <div class="p-3 border-top border-secondary-subtle bg-white" style="border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
       <button class="btn w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 btn-thanh-toan"
               :disabled="isKhongTheThanhToan"
               @click="xuLyThanhToan">
           <i class="bi" :class="phuongThucTT === 1 ? 'bi-cash-coin' : 'bi-qr-code'"></i> 
           {{ phuongThucTT === 1 ? 'THANH TOÁN' : 'TẠO MÃ QR' }}
       </button>
    </div>

    <VoucherSearch 
       :show="showVoucherModal" 
       :tongTienHang="tongTienHang" 
       @close="showVoucherModal = false"
       @select-voucher="apDungVoucher"
    />

    <VNPayModal 
       :show="showVNPayModal"
       :soTien="khachCanTra"
       :maHoaDon="hoaDonActive?.maHoaDon"
       @close="showVNPayModal = false"
       @xac-nhan="chotDonVNPAY"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import VoucherSearch from './VoucherSearch.vue';
import VNPayModal from './VNPayModal.vue';

const props = defineProps({
  hoaDonActive: Object,
  tongTienHang: { type: Number, default: 0 },
  isGiaoHang: Boolean,
  hasProducts: Boolean,
  missingDeliveryInfo: Boolean
});

const emit = defineEmits(['thanh-toan']);

const phuongThucTT = ref(1); 
const tienShip = ref(0);
const tienKhachDua = ref(0); 

// CHỈ DỌN DẸP KHI ĐỔI SANG HÓA ĐƠN KHÁC
watch(() => props.hoaDonActive, () => {
   tienKhachDua.value = 0;
   tienShip.value = 0;
   voucherSelected.value = null;
   phuongThucTT.value = 1;
});

const parseCurrencyMask = (val) => {
  if (!val) return 0;
  const cleanVal = val.toString().replace(/\./g, '').replace(/[^0-9]/g, '');
  return cleanVal ? parseInt(cleanVal, 10) : 0;
};

const tienKhachDuaDisplay = computed({
  get: () => {
     if (tienKhachDua.value === 0) return '';
     return tienKhachDua.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },
  set: (val) => {
     tienKhachDua.value = parseCurrencyMask(val);
  }
});

const showVoucherModal = ref(false);
const voucherSelected = ref(null);

const apDungVoucher = (vc) => {
   voucherSelected.value = vc;
   showVoucherModal.value = false;
};

const tienGiamGiaThucTe = computed(() => {
   if (!voucherSelected.value || !props.hasProducts) return 0;
   let giam = 0;
   const vc = voucherSelected.value;
   if (vc.loaiGiamGia === 1) { 
      giam = (props.tongTienHang * vc.giaTriGiam) / 100;
      if (vc.giamToiDa && giam > vc.giamToiDa) giam = vc.giamToiDa;
   } else { 
      giam = vc.giaTriGiam;
   }
   return giam > props.tongTienHang ? props.tongTienHang : giam;
});

const khachCanTra = computed(() => {
   let ship = props.isGiaoHang ? Number(tienShip.value || 0) : 0;
   let finalPrice = props.tongTienHang + ship - tienGiamGiaThucTe.value;
   return finalPrice > 0 ? finalPrice : 0;
});

const tienThua = computed(() => Number(tienKhachDua.value || 0) - khachCanTra.value);

const isKhongTheThanhToan = computed(() => {
   if (!props.hoaDonActive || !props.hasProducts) return true;
   if (props.isGiaoHang && props.missingDeliveryInfo) return true;
   if (phuongThucTT.value === 1 && tienThua.value < 0) return true;
   return false;
});

const formatCurrency = (val) => val ? new Intl.NumberFormat('vi-VN').format(val) + ' đ' : '0 đ';
const formatDateTime = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray)) return '---';
  const d = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

const showVNPayModal = ref(false);

const xuLyThanhToan = () => {
   if (phuongThucTT.value === 2) {
      showVNPayModal.value = true;
   } else {
      emitThanhToan();
   }
};

const chotDonVNPAY = () => {
   showVNPayModal.value = false;
   emitThanhToan();
};

const emitThanhToan = () => {
   emit('thanh-toan', {
      khachCanTra: khachCanTra.value,
      tienShip: tienShip.value,
      tienGiamGia: tienGiamGiaThucTe.value,
      phuongThucTT: phuongThucTT.value,
      idVoucher: voucherSelected.value ? voucherSelected.value.id : null
   });
};
</script>

<style scoped>
.payment-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(1.5px); z-index: 10; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d0d0d0; }
.btn-pt-inactive { background-color: white; color: #1c1c1c; border-color: #dee2e6; }
.btn-pt-active { background-color: #fbf6f2 !important; color: #1c1c1c !important; border-color: #e5d4c8 !important; }
.btn-thanh-toan { background-color: #dccac0; color: #1c1c1c; transition: all 0.2s ease-in-out; }
.btn-thanh-toan:hover:not(:disabled) { background-color: #cbb6a9; transform: translateY(-1px); }
.btn-thanh-toan:disabled { background-color: #e9e0da; color: #8c8c8c; cursor: not-allowed; }
.border-dashed { border-style: dashed !important; border-width: 2px !important; }
.cursor-pointer { cursor: pointer; }
</style>