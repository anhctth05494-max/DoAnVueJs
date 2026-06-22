<template>
  <div class="bg-white rounded-4 border d-flex flex-column h-100 position-relative text-dark shadow-sm overflow-hidden">


    <!-- OVERLAY KHI CHƯA CÓ HÓA ĐƠN -->
    <div v-if="!hoaDonActive" class="payment-overlay d-flex flex-column align-items-center justify-content-center text-muted">
      <div class="empty-state-icon mb-3"><i class="bi bi-receipt"></i></div>
      <h6 class="fw-bold text-dark">Chưa chọn hóa đơn</h6>
      <p class="small">Vui lòng chọn hoặc tạo mới hóa đơn để tiếp tục</p>
    </div>


    <!-- HEADER -->
    <div class="p-3 border-bottom d-flex align-items-center bg-light">
      <div class="icon-box-sm me-2"><i class="bi bi-wallet2 text-primary-brown"></i></div>
      <h6 class="fw-bold m-0" style="color: #3d211a; font-size: 16px;">Thông tin thanh toán</h6>
    </div>


    <!-- BODY -->
    <div class="flex-grow-1 overflow-auto custom-scrollbar p-3">


      <!-- ================= 1. MÃ GIẢM GIÁ ================= -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold text-muted" style="font-size: 12px; letter-spacing: 0.5px;">MÃ GIẢM GIÁ</span>
        <button class="btn btn-sm btn-outline-brown rounded-pill fw-medium" @click="showVoucherModal = true">
          <i class="bi bi-tags me-1"></i> Chọn mã
        </button>
      </div>


      <!-- Khối Voucher đang chọn -->
     <div v-if="voucherSelected" class="mb-2">
   <div class="voucher-ticket position-relative" :class="{'border-danger bg-danger-subtle opacity-75': loiVoucherHienTai}">
      <i class="bi bi-x-circle-fill btn-remove-voucher" @click="xoaVoucher"></i>
      <div class="d-flex align-items-center mb-2">
          <div class="voucher-badge" :class="loiVoucherHienTai ? 'bg-danger' : ''">VO</div>
          <span class="fw-bold text-truncate ms-2" :class="loiVoucherHienTai ? 'text-danger' : 'text-brown-dark'" style="font-size: 13.5px;">
             [{{ voucherSelected.maVoucher }}] {{ voucherSelected.tenVoucher }}
          </span>
      </div>
      <div class="row gx-2 gy-1 mt-2 pt-2 border-top border-dashed" style="font-size: 11.5px; color: #666;">
          <div class="col-6">Giảm: <span class="text-danger fw-bold fs-6">{{ voucherSelected.loaiGiamGia === 1 ? voucherSelected.giaTriGiam + '%' : formatCurrency(voucherSelected.giaTriGiam) }}</span></div>
          <div class="col-6">Đơn tối thiểu: <span class="fw-medium text-dark">{{ formatCurrency(voucherSelected.donToiThieu) }}</span></div>
      </div>
   </div>


   <div v-if="loiVoucherHienTai" class="mt-1 p-2 rounded bg-danger text-white d-flex justify-content-between align-items-center animation-shake">
       <div style="font-size: 11.5px; font-weight: 500;">
           <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ loiVoucherHienTai }}
       </div>
       <button class="btn btn-sm btn-light py-0 px-2 fw-bold text-danger" style="font-size: 11px;" @click="xoaVoucher">
           Xóa mã này
       </button>
   </div>
</div>
      <div v-else class="empty-voucher mb-2 cursor-pointer" @click="showVoucherModal = true">
         <i class="bi bi-ticket-perforated text-muted me-2"></i> Chưa áp dụng mã giảm giá nào
      </div>


      <!-- ================= TÍNH NĂNG ĐỈNH CAO: GỢI Ý MÃ TỐT NHẤT NGAY BÊN DƯỚI ================= -->
      <div v-if="bestVoucher && (!voucherSelected || tinhTienGiam(bestVoucher) > tinhTienGiam(voucherSelected))"
           class="hint-best-voucher mb-4 d-flex justify-content-between align-items-center">
         <div class="d-flex align-items-center">
            <i class="bi bi-stars text-warning fs-5 me-2"></i>
            <div>
               <div class="fw-bold text-dark" style="font-size: 12px;">Có mã <strong class="text-danger">{{ bestVoucher.maVoucher }}</strong> tốt hơn!</div>
               <div style="font-size: 11px;" class="text-muted">Tiết kiệm thêm <span class="fw-bold text-danger">{{ formatCurrency(tinhTienGiam(bestVoucher) - tinhTienGiam(voucherSelected)) }}</span></div>
            </div>
         </div>
         <button class="btn btn-sm btn-warning rounded-pill fw-bold py-1 px-3 shadow-sm" style="font-size: 11.5px;" @click="voucherSelected = bestVoucher">
            {{ voucherSelected ? 'Đổi mã' : 'Dùng ngay' }}
         </button>
      </div>
      <div v-else class="mb-4"></div> <!-- Spacer nếu không có gợi ý -->


      <!-- ================= 2. KHỐI TỔNG KẾT TIỀN ================= -->
      <div class="summary-box mb-4">
        <div class="d-flex justify-content-between mb-2" style="font-size: 14px;">
          <span class="text-muted">Tổng tiền hàng:</span><span class="fw-bold text-dark">{{ formatCurrency(tongTienHang) }}</span>
        </div>
        <!-- KHU VỰC PHÍ VẬN CHUYỂN CÓ LOGO GHN -->
         
<div v-if="isGiaoHang" class="d-flex justify-content-between align-items-center mb-3 py-2 border-bottom border-dashed">
    <div class="text-muted small d-flex align-items-center">
        Phí vận chuyển
        <!-- Logo GHN kéo thẳng từ CDN, không cần tải về máy -->
        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Blue-Orange.png"
             alt="GHN"
             class="ms-2"
             style="height: 15px; object-fit: contain;">
    </div>
   
    <!-- Tiền ship màu đậm cho nổi bật -->
   <span class="fw-bold text-dark" style="font-size: 14px;">
    + {{ formatCurrency(tienShip) }}
</span>
</div>
        <div class="d-flex justify-content-between mb-2" style="font-size: 14px;">
          <span class="text-muted">Giảm giá:</span><span class="fw-bold text-danger">-{{ formatCurrency(tienGiamGiaThucTe) }}</span>
        </div>
        <div class="border-top border-dashed my-3"></div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold text-dark" style="font-size: 15px;">KHÁCH CẦN TRẢ:</span>
          <span class="fw-bold text-danger" style="font-size: 22px;">{{ formatCurrency(khachCanTra) }}</span>
        </div>
      </div>


      <!-- ================= 3. HÌNH THỨC THANH TOÁN ================= -->
      <label class="fw-bold text-muted mb-2" style="font-size: 12px;">HÌNH THỨC THANH TOÁN</label>
      <div class="d-flex gap-2 mb-4">
         <button class="payment-method-btn flex-fill" :class="{ 'active': phuongThucTT === 1 }" @click="phuongThucTT = 1"><i class="bi bi-cash-stack"></i> Tiền mặt</button>
         <button class="payment-method-btn flex-fill" :class="{ 'active': phuongThucTT === 2 }" @click="phuongThucTT = 2"><i class="bi bi-qr-code-scan"></i> VietQR</button>
      </div>


      <!-- ================= 4. KHÁCH ĐƯA & TIỀN THỪA ================= -->
      <div v-if="phuongThucTT === 1" class="payment-action-box mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-medium text-dark" style="font-size: 14px;">Khách thanh toán:</span>
          <div class="input-money-wrapper">
              <input type="text" class="input-money" v-model="tienKhachDuaDisplay" placeholder="0"><span class="currency-unit">đ</span>
          </div>
        </div>
        <div v-if="tienThua < 0 && tienKhachDua > 0" class="alert-shortfall mb-3">
          <i class="bi bi-exclamation-triangle-fill me-1"></i> Khách đưa thiếu <strong>{{ formatCurrency(Math.abs(tienThua)) }}</strong>
        </div>
        <div class="d-flex justify-content-between align-items-center p-2 rounded-3" :class="tienThua < 0 ? 'bg-light' : 'bg-success-subtle'">
          <span class="fw-medium" style="font-size: 14px;" :class="tienThua < 0 ? 'text-muted' : 'text-success'">Tiền thừa:</span>
          <span class="fw-bold fs-5" :class="tienThua < 0 ? 'text-muted' : 'text-success'">{{ tienThua < 0 ? '0 đ' : formatCurrency(tienThua) }}</span>
        </div>
      </div>


      <!-- ================= 5. QR INLINE ================= -->
      <div v-if="phuongThucTT === 2" class="qr-inline-box mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold text-primary-brown" style="font-size: 13px;"><i class="bi bi-qr-code"></i> Quét mã thanh toán</span>
        </div>
        <div class="bg-white p-2 rounded-3 text-center border shadow-sm mb-2">
           <img :src="vietQrUrl" alt="VietQR" style="width: 100%; max-width: 180px;" @error="$event.target.style.display='none'">
        </div>
        <div class="text-center bg-light rounded-2 p-2 border">
           <div class="small text-muted mb-1">NDCK: <strong class="text-dark">THANHTOAN {{ hoaDonActive?.maHoaDon }}</strong></div>
           <div class="small text-muted">Số tiền: <strong class="text-danger fs-6">{{ formatCurrency(khachCanTra) }}</strong></div>
        </div>
      </div>
    </div>


    <!-- NÚT THANH TOÁN CHÍNH -->
    <div class="p-3 bg-white border-top shadow-sm" style="z-index: 5;">
       <button class="btn-checkout-premium w-100 d-flex align-items-center justify-content-center gap-2"
               :disabled="isKhongTheThanhToan"
               @click="xuLyThanhToan"> <i class="bi fs-5" :class="phuongThucTT === 1 ? 'bi-wallet2' : 'bi-check-circle'"></i>
           <span>{{ phuongThucTT === 1 ? 'HOÀN TẤT THANH TOÁN' : 'ĐÃ NHẬN ĐƯỢC TIỀN' }}</span>
       </button>
    </div>


    <VoucherSearch :show="showVoucherModal" :tongTienHang="tongTienHang" @close="showVoucherModal = false" @select-voucher="apDungVoucher" />
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import VoucherSearch from './VoucherSearch.vue';


const props = defineProps({
  hoaDonActive: Object,
  tongTienHang: Number,
  isGiaoHang: Boolean,
  hasProducts: Boolean,
  missingDeliveryInfo: Boolean,
  hasInvalidProducts: Boolean, // <-- BẮT BUỘC PHẢI CÓ DẤU PHẨY Ở ĐÂY NHÉ
 
  // Khai báo tiền ship thêm vào
  tienShip: {
    type: Number,
    default: 0
  }
});


// CẬP NHẬT LẠI CHỐT CHẶN THANH TOÁN
const isKhongTheThanhToan = computed(() => {
   if (!props.hoaDonActive || !props.hasProducts) return true;
   if (props.isGiaoHang && props.missingDeliveryInfo) return true;
   if (phuongThucTT.value === 1 && tienThua.value < 0) return true;
   if (props.hasInvalidProducts) return true;
   
   // CHẶN: Nếu voucher đang chọn bị lỗi thì cấm thanh toán luôn
   if (loiVoucherHienTai.value) return true;


   return false;
});


const emit = defineEmits(['thanh-toan']);


const phuongThucTT = ref(1);
const tienKhachDua = ref(0);
const showVoucherModal = ref(false);
const voucherSelected = ref(null);


// Mảng lưu trữ mã giảm giá để tính toán "Gợi ý tốt nhất"
const dsVoucherOnline = ref([]);


// KHO LƯU TRỮ VOUCHER THEO TỪNG HÓA ĐƠN (GIẢI QUYẾT LỖI MẤT VOUCHER)
const voucherCache = ref({});


// Thay thế đoạn watch hiện tại bằng đoạn này
watch(() => props.hoaDonActive, (newVal, oldVal) => {
   // Lưu voucher của hóa đơn cũ vào Cache trước khi chuyển
   if (oldVal && oldVal.maHoaDon) {
       voucherCache.value[oldVal.maHoaDon] = voucherSelected.value;
   }
   
   // Gọi lại voucher của hóa đơn mới từ Cache (nếu có)
   if (newVal && newVal.maHoaDon) {
       voucherSelected.value = voucherCache.value[newVal.maHoaDon] || null;
   } else {
       voucherSelected.value = null;
   }


   // Các trường nhập liệu reset
   tienKhachDua.value = 0;
   // tienShip.value = 0; 👈 Xóa hoặc comment lại dòng này!
   phuongThucTT.value = 1;
});


const fetchVouchers = async () => {
    try {
        const res = await axios.get('http://localhost:8080/api/phieu-giam-gia?trangThai=1');
        dsVoucherOnline.value = res.data.content || [];
    } catch (error) {}
};


onMounted(() => {
    fetchVouchers(); // Lấy data ngầm để tính toán voucher tốt nhất
    setInterval(fetchVouchers, 3000);
});


// Hàm tính số tiền giảm thực tế của 1 voucher
const tinhTienGiam = (vc) => {
   if (!vc) return 0;
   let giam = 0;
   if (vc.loaiGiamGia === 1) {
      giam = (props.tongTienHang * vc.giaTriGiam) / 100;
      if (vc.giamToiDa && giam > vc.giamToiDa) giam = vc.giamToiDa;
   } else {
      giam = vc.giaTriGiam;
   }
   return giam > props.tongTienHang ? props.tongTienHang : giam;
};






// Thuật toán tìm Voucher tốt nhất cho hóa đơn hiện tại (Đã fix lỗi hiển thị voucher hết lượt)
const bestVoucher = computed(() => {
   if (!props.tongTienHang || dsVoucherOnline.value.length === 0) return null;
   
   let best = null;
   let maxGiam = 0;
   const now = new Date(); // Lấy thời gian hiện tại để so sánh hạn sử dụng


   dsVoucherOnline.value.forEach(vc => {
       // CHỐT CHẶN: Chỉ xét những voucher thỏa mãn TẤT CẢ 4 điều kiện sau:
       // 1. Trạng thái hoạt động (1)
       // 2. Số lượng lớn hơn 0
       // 3. Còn hạn sử dụng
       // 4. Tổng tiền hàng đạt mức tối thiểu
       const conHan = new Date(vc.ngayKetThuc) >= now;
       const hopLe = vc.trangThai === 1 && vc.soLuong > 0 && conHan && props.tongTienHang >= vc.donToiThieu;


       if (hopLe) {
           let giam = tinhTienGiam(vc);
           if (giam > maxGiam) {
               maxGiam = giam;
               best = vc;
           }
       }
   });
   
   return best;
});
const vcChannel = new BroadcastChannel('kenh_dong_bo_voucher');


onMounted(() => {
    fetchVouchers(); // Vẫn gọi bình thường khi mới mở trang


    // Lắng nghe tiếng hét từ tab Quản lý
    vcChannel.onmessage = (event) => {
        if (event.data === 'CAP_NHAT_DI_ANH_EM') {
            // Có tab khác vừa đổi trạng thái voucher!
            // Lập tức gọi lại API ngầm bên dưới, giao diện tự động chớp 1 cái là mất voucher cũ.
            fetchVouchers();
        }
    };
});
const xoaVoucher = () => { voucherSelected.value = null; };


const apDungVoucher = (vc) => {
   voucherSelected.value = vc;
   showVoucherModal.value = false;
};


// ================= CÁC HÀM FORMAT VÀ TÍNH TOÁN TIỀN =================
const parseCurrencyMask = (val) => {
  if (!val) return 0;
  const cleanVal = val.toString().replace(/\./g, '').replace(/[^0-9]/g, '');
  return cleanVal ? parseInt(cleanVal, 10) : 0;
};


const tienKhachDuaDisplay = computed({
  get: () => tienKhachDua.value === 0 ? '' : tienKhachDua.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
  set: (val) => tienKhachDua.value = parseCurrencyMask(val)
});


const tienGiamGiaThucTe = computed(() => tinhTienGiam(voucherSelected.value));


const khachCanTra = computed(() => {
   // Đã đổi tienShip.value thành props.tienShip
   let ship = props.isGiaoHang ? Number(props.tienShip || 0) : 0;
   let finalPrice = props.tongTienHang + ship - tienGiamGiaThucTe.value;
   return finalPrice > 0 ? finalPrice : 0;
});


const tienThua = computed(() => Number(tienKhachDua.value || 0) - khachCanTra.value);


const xuLyThanhToan = () => {
    // 1. Chặn nếu có sản phẩm lỗi
    if (props.hasInvalidProducts) {
        alert("CẢNH BÁO: Có sản phẩm ngừng kinh doanh. Vui lòng xóa trước khi thanh toán!");
        return;
    }


    // 2. Chặn nếu Voucher bị lỗi (Hết hạn, hết lượt do tab khác vừa dùng)
    if (loiVoucherHienTai.value) {
        showToast(loiVoucherHienTai.value, "error");
        return;
    }


    // ================================================================
    // ĐÂY LÀ ĐOẠN MA THUẬT (0 ĐỘ TRỄ): TRỪ SỐ LƯỢNG NGAY TRÊN GIAO DIỆN
    // ================================================================
    if (voucherSelected.value) {
        // Tìm đúng cái voucher đó trong danh sách đang lưu ở màn hình
        const vcTrongKho = dsVoucherOnline.value.find(v => v.maVoucher === voucherSelected.value.maVoucher);
        if (vcTrongKho) {
            // Ép trừ số lượng đi 1 ngay lập tức, không thèm chờ Java!
            vcTrongKho.soLuong -= 1;
        }
       
        // (Tùy chọn): Xóa luôn khỏi bộ nhớ đệm của Hóa Đơn hiện tại để nó không dính dấp nữa
        delete voucherCache.value[props.hoaDonActive.maHoaDon];
    }


    // 3. Tiến hành thanh toán bình thường
    emitThanhToan();
};


const formatCurrency = (val) => val ? new Intl.NumberFormat('vi-VN').format(val) + ' đ' : '0 đ';


// VIETQR Config
const vietQrUrl = computed(() => {
   const amount = khachCanTra.value > 0 ? khachCanTra.value : 0;
   const noiDung = props.hoaDonActive ? `THANHTOAN ${props.hoaDonActive.maHoaDon}` : 'THANHTOAN';
   return `https://img.vietqr.io/image/MB-00903082610-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(noiDung)}&accountName=TRINH XUAN BACH`;
});


const emitThanhToan = () => {
   emit('thanh-toan', {
      khachCanTra: khachCanTra.value,
      tienShip: props.tienShip, // Đã đổi thành props.tienShip
      tienGiamGia: tienGiamGiaThucTe.value,
      phuongThucTT: phuongThucTT.value,
      idVoucher: voucherSelected.value ? voucherSelected.value.id : null
   });
};


// Thêm biến kiểm tra lỗi Voucher
const loiVoucherHienTai = computed(() => {
   if (!voucherSelected.value) return null;


   // Tìm thông tin mới nhất của voucher này trên hệ thống
   const vcMoiNhat = dsVoucherOnline.value.find(v => v.maVoucher === voucherSelected.value.maVoucher);


   // 1. Bị xóa hoặc ngưng hoạt động
   if (!vcMoiNhat || vcMoiNhat.trangThai === 0) {
       return "Voucher này không khả dụng hoặc đã bị xóa!";
   }
   // 2. Hết số lượng (HDC 1 vừa dùng mất)
   if (vcMoiNhat.soLuong <= 0) {
       return "Voucher đã hết lượt sử dụng!";
   }
   // 3. Hết hạn sử dụng
   if (new Date(vcMoiNhat.ngayKetThuc) < new Date()) {
       return "Voucher đã hết hạn sử dụng!";
   }
   // 4. Bổ sung thêm: Nếu khách xóa bớt đồ làm tổng tiền rớt xuống dưới mức tối thiểu
   if (props.tongTienHang < vcMoiNhat.donToiThieu) {
       return `Chưa đạt đơn tối thiểu ${formatCurrency(vcMoiNhat.donToiThieu)}!`;
   }


   return null; // OK, voucher ngon lành
});




</script>


<style scoped>
/* Màu sắc chủ đạo */
:root {
  --primary-brown: #5a4031;
  --light-brown: #ebdcd0;
  --hover-brown: #cbb3a1;
  --danger-color: #d16b41;
}


.text-primary-brown { color: #5a4031; }
.text-brown-dark { color: #3d211a; }
.border-dashed { border-style: dashed !important; border-width: 1.5px !important; border-color: #dee2e6 !important; }


/* Nền mờ khi chưa có hóa đơn */
.payment-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(2px); z-index: 20; border-radius: inherit; }
.empty-state-icon { width: 60px; height: 60px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #adb5bd; }


/* Icon Header */
.icon-box-sm { width: 32px; height: 32px; background: #ebdcd0; border-radius: 8px; display: flex; align-items: center; justify-content: center; }


/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ced4da; }


/* Button Nâu Outline */
.btn-outline-brown { border: 1px solid #ebdcd0; color: #5a4031; background: #fff; transition: 0.2s; }
.btn-outline-brown:hover { background: #fdfaf7; border-color: #cbb3a1; }


/* VOUCHER TICKET STYLE */
.voucher-ticket { background: #fffaf7; border: 1px solid #f2e2d9; border-radius: 10px; padding: 15px; box-shadow: 0 2px 4px rgba(209, 107, 65, 0.05); border-left: 4px solid #d16b41; }
.voucher-badge { background: #d16b41; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
.btn-remove-voucher { font-size: 20px; color: #ff6b6b; cursor: pointer; position: absolute; top: -10px; right: -10px; background: white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: 0.2s; }
.btn-remove-voucher:hover { transform: scale(1.1); }
.empty-voucher { border: 1px dashed #ced4da; background: #f8f9fa; border-radius: 10px; padding: 12px; text-align: center; color: #6c757d; font-size: 13px; transition: 0.2s; }
.empty-voucher:hover { background: #fff; border-color: #cbb3a1; color: #5a4031; }


/* SUMMARY BOX (Tổng kết tiền) */
.summary-box { background: #fdfcfb; border: 1px solid #f0ece9; border-radius: 12px; padding: 16px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01); }
.ship-input { width: 80px; border: 1px solid #dee2e6; border-radius: 6px; padding: 2px 6px; text-align: right; outline: none; transition: 0.2s; background: white; }
.ship-input:focus { border-color: #cbb3a1; }




/* Ô NHẬP TIỀN KHÁCH ĐƯA */
.payment-action-box { border: 1px solid #f0ece9; padding: 15px; border-radius: 12px; }
.input-money-wrapper { display: flex; align-items: center; border: 2px solid #ebdcd0; border-radius: 8px; overflow: hidden; background: white; transition: 0.2s; }
.input-money-wrapper:focus-within { border-color: #cbb3a1; box-shadow: 0 0 0 3px rgba(235, 220, 208, 0.3); }
.input-money { border: none; outline: none; text-align: right; font-weight: 700; font-size: 18px; color: #5a4031; padding: 8px 12px; width: 100%; background: transparent; }
.currency-unit { background: #fdfaf7; color: #8c6b5d; font-weight: bold; padding: 8px 12px; border-left: 1px solid #ebdcd0; }


/* Cảnh báo thiếu tiền */
.alert-shortfall { background: #fff5f5; color: #dc3545; border: 1px solid #ffcaca; padding: 8px 12px; border-radius: 8px; font-size: 12.5px; }


/* KHỐI QR INLINE MỚI */
.qr-inline-box { background: #fdfcfb; border: 1px solid #f0ece9; border-radius: 12px; padding: 15px; animation: slideDown 0.3s ease-out; }
.timer-badge { background-color: #fff5f5; color: #dc3545; font-weight: bold; padding: 4px 8px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; gap: 4px; border: 1px solid #ffcaca; }


@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* ========================================================
   NÚT THANH TOÁN CHÍNH (FLAT DESIGN SANG TRỌNG)
======================================================== */
.btn-checkout-premium {
  background: #968375; /* Màu nâu đậm chủ đạo của trang */
  color: rgb(255, 255, 255);
  border: none;
  padding: 16px;
  font-size: 16px;
  border-radius: 10px;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 12px rgba(90, 64, 49, 0.15);
}


/* Hover: Chuyển màu nâu trầm hơn một chút, nổi lên nhẹ */
.btn-checkout-premium:hover:not(:disabled) {
  background: #463125;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(90, 64, 49, 0.25);
}


/* Click: Nút phản hồi lún xuống tinh tế */
.btn-checkout-premium:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 2px 6px rgba(90, 64, 49, 0.15);
}


/* Trạng thái Disable (Khi chưa có SP hoặc tiền khách đưa thiếu) */
.btn-checkout-premium:disabled {
  background: #e9ecef;
  color: #adb5bd;
  box-shadow: none;
  cursor: not-allowed;
}
/* ========================================================
   NÚT CHỌN PHƯƠNG THỨC THANH TOÁN (VIETQR / TIỀN MẶT)
======================================================== */
.payment-method-btn {
  background: #ffffff;
  border: 2px solid #e9ecef;
  padding: 12px 10px;
  border-radius: 12px;
  font-weight: 600;
  color: #868e96;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  position: relative;
  overflow: hidden;
}


/* Hiệu ứng khi di chuột qua */
.payment-method-btn:hover {
  border-color: #cbb3a1;
  color: #5a4031;
  background: #fcfaf8;
  transform: translateY(-2px);
}


/* Trạng thái đang được chọn (Active) - Sáng rực rỡ */
.payment-method-btn.active {
  background: linear-gradient(135deg, #ffffff 0%, #fffaf7 100%);
  border-color: #968375;
  color: #968375;
  box-shadow: 0 6px 15px rgba(209, 107, 65, 0.15);
  transform: translateY(-2px);
}


/* Thêm icon check nhỏ ở góc khi Active cho xịn xò */
.payment-method-btn.active::after {
  content: '\F26A'; /* Mã icon check-circle-fill của Bootstrap */
  font-family: 'bootstrap-icons';
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 14px;
  color: #968375;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}


@keyframes shake { 0%, 100% {transform: translateX(0);} 25% {transform: translateX(-2px);} 75% {transform: translateX(2px);} } .animation-shake { animation: shake 0.4s ease-in-out; }
</style>



