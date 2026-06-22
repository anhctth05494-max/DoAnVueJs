<template>
  <div v-if="show" class="custom-modal-overlay">
    <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 850px; width: 100%">
     
      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom" style="background-color: #f8ece3;">
        <h6 class="mb-0 fw-bold" style="color: #5a4031"><i class="bi bi-ticket-perforated me-2"></i>CHỌN MÃ GIẢM GIÁ</h6>
        <i class="bi bi-x-lg cursor-pointer fs-5" style="color: #5a4031" @click="$emit('close')"></i>
      </div>
     
      <!-- SEARCH BAR -->
      <div class="p-3 bg-light border-bottom">
         <div class="input-group">
            <span class="input-group-text bg-white border-end-0 rounded-start-pill"><i class="bi bi-search text-muted"></i></span>
            <input type="text" class="form-control rounded-end-pill border-start-0 shadow-none ps-0" placeholder="Nhập mã hoặc tên phiếu giảm giá..." v-model="tuKhoaVoucher" @input="locVoucher">
         </div>
      </div>


      <!-- DANH SÁCH VOUCHER -->
      <div class="p-3 overflow-auto bg-light custom-scrollbar" style="max-height: 450px;">
       
        <div v-if="filteredVouchers.length === 0" class="text-center text-muted py-4">
           <i class="bi bi-box-seam fs-1 d-block mb-2 opacity-50"></i> Không tìm thấy mã giảm giá nào phù hợp!
        </div>
       
        <!-- ================= KHU VỰC GỢI Ý TỐT NHẤT ================= -->
        <div v-if="bestVoucher && !tuKhoaVoucher" class="mb-4">
           <h6 class="fw-bold mb-2" style="color: #d16b41; font-size: 14px;"><i class="bi bi-stars text-warning me-1"></i> GỢI Ý TỐT NHẤT CHO ĐƠN NÀY</h6>
           <div class="voucher-card d-flex bg-white shadow-sm rounded-3 overflow-hidden border position-relative" style="border-color: #f5cda6 !important; border-width: 2px !important;">
               <div class="ticket-sawtooth" style="background-image: radial-gradient(circle at 0 5px, transparent 5px, #fff5eb 6px);"></div>
               <div class="p-3 d-flex flex-column justify-content-center align-items-center border-end border-dashed" style="width: 120px; background-color: #fff5eb; border-color: #f5cda6 !important;">
                   <span class="badge mb-1" style="background-color: #d16b41;">Mã: {{ bestVoucher.maVoucher }}</span>
                   <span class="fw-bold text-danger fs-5" v-if="bestVoucher.loaiGiamGia === 1">{{ bestVoucher.giaTriGiam }}%</span>
                   <span class="fw-bold text-danger" v-else>{{ formatCurrency(bestVoucher.giaTriGiam) }}</span>
               </div>
               <div class="p-3 flex-grow-1 d-flex justify-content-between align-items-center" style="background: linear-gradient(to right, #fffaf5, #ffffff);">
                  <div>
                     <h6 class="fw-bold mb-1 text-dark">{{ bestVoucher.tenVoucher }}</h6>
                     <div class="small text-muted mb-1">Đơn tối thiểu: <span class="fw-medium text-dark">{{ formatCurrency(bestVoucher.donToiThieu) }}</span></div>
                     <div class="small text-muted" v-if="bestVoucher.loaiGiamGia === 1 && bestVoucher.giamToiDa">Giảm tối đa: <span class="fw-medium text-dark">{{ formatCurrency(bestVoucher.giamToiDa) }}</span></div>
                  </div>
                  <button class="btn btn-sm rounded-pill fw-bold px-3 shadow-sm btn-best-voucher" @click="$emit('select-voucher', bestVoucher)">Dùng ngay</button>
               </div>
           </div>
        </div>


        <!-- ================= DANH SÁCH MÃ GIẢM GIÁ THƯỜNG (CŨNG RẤT ĐẸP) ================= -->
        <h6 v-if="regularVouchers.length > 0 && !tuKhoaVoucher" class="fw-bold text-secondary mb-2" style="font-size: 13px;">TẤT CẢ MÃ GIẢM GIÁ KHÁC</h6>
       
        <div v-for="vc in regularVouchers" :key="vc.id"
             class="voucher-card regular-voucher d-flex mb-3 bg-white shadow-sm rounded-3 overflow-hidden border position-relative"
             :class="{ 'opacity-75': !kiemTraDieuKien(vc) }">
             
             <!-- Răng cưa trắng -->
             <div class="ticket-sawtooth" style="background-image: radial-gradient(circle at 0 5px, transparent 5px, #fdfaf7 6px);"></div>


             <!-- Phần % giảm giá bên trái -->
             <div class="p-3 d-flex flex-column justify-content-center align-items-center border-end border-dashed ticket-left">
                 <span class="badge mb-1" style="background-color: #8c6b5d;">{{ vc.maVoucher }}</span>
                 <span class="fw-bold fs-5" style="color: #5a4031;" v-if="vc.loaiGiamGia === 1">{{ vc.giaTriGiam }}%</span>
                 <span class="fw-bold" style="color: #5a4031;" v-else>{{ formatCurrency(vc.giaTriGiam) }}</span>
             </div>
             
             <!-- Phần Thông tin bên phải -->
             <div class="p-3 flex-grow-1 d-flex justify-content-between align-items-center bg-white">
                <div>
                   <h6 class="fw-bold mb-1 text-dark">{{ vc.tenVoucher }}</h6>
                   <div class="small text-muted mb-1">Đơn tối thiểu: <span class="fw-medium text-dark">{{ formatCurrency(vc.donToiThieu) }}</span></div>
                   <div class="small text-danger mt-1" style="font-size: 11px;"><i class="bi bi-clock"></i> HSD: {{ formatDateTime(vc.ngayKetThuc) }}</div>
                </div>
               
                <button class="btn btn-sm rounded-pill fw-bold px-3 btn-outline-brown shadow-none"
                        :class="kiemTraDieuKien(vc) ? '' : 'disabled opacity-50'"
                        @click="$emit('select-voucher', vc)">
                   {{ kiemTraDieuKien(vc) ? 'Áp dụng' : 'Chưa đủ ĐK' }}
                </button>
             </div>
        </div>


      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, computed, onMounted} from 'vue';
import axios from 'axios';


const props = defineProps({ show: Boolean, tongTienHang: { type: Number, default: 0 } });
const emit = defineEmits(['close', 'select-voucher']);


const tuKhoaVoucher = ref('');
const dsVoucher = ref([]);
const filteredVouchers = ref([]);


const formatCurrency = (val) => val ? new Intl.NumberFormat('vi-VN').format(val) + ' đ' : '0 đ';
const formatDateTime = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray)) return '---';
  const d = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3] || 0, dateArray[4] || 0);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};


const kiemTraDieuKien = (vc) => props.tongTienHang >= vc.donToiThieu;


// LỌC VOUCHER TỐT NHẤT
const bestVoucher = computed(() => {
   if (!props.tongTienHang || filteredVouchers.value.length === 0) return null;
   let best = null, maxDiscount = 0;
   filteredVouchers.value.forEach(vc => {
       if (kiemTraDieuKien(vc)) {
           let giam = vc.loaiGiamGia === 1 ? (props.tongTienHang * vc.giaTriGiam) / 100 : vc.giaTriGiam;
           if (vc.loaiGiamGia === 1 && vc.giamToiDa && giam > vc.giamToiDa) giam = vc.giamToiDa;
           if (giam > maxDiscount) { maxDiscount = giam; best = vc; }
       }
   });
   return best;
});


// Loại bỏ Best Voucher ra khỏi danh sách thường
const regularVouchers = computed(() => {
   if (!bestVoucher.value) return filteredVouchers.value;
   return filteredVouchers.value.filter(vc => vc.id !== bestVoucher.value.id);
});


const fetchVouchers = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/phieu-giam-gia?trangThai=1');
    let data = res.data.content || [];


    // ================================================================
    // BỘ LỌC THẦN THÁNH: Loại bỏ Voucher hết lượt & hết hạn ngay từ đầu
    // ================================================================
    const now = new Date().getTime();
    data = data.filter(vc => {
         // 1. Loại bỏ nếu số lượng về 0
         if (vc.soLuong <= 0) return false;


         // 2. Loại bỏ nếu hết hạn (Backend đang trả về mảng [YYYY, MM, DD])
         if (vc.ngayKetThuc && Array.isArray(vc.ngayKetThuc)) {
             // Cộng thêm 23h59m59s để voucher vẫn dùng được đến hết ngày hôm đó
             const endDate = new Date(vc.ngayKetThuc[0], vc.ngayKetThuc[1] - 1, vc.ngayKetThuc[2], 23, 59, 59).getTime();
             if (endDate < now) return false;
         }
         return true; // Giữ lại các voucher ngon lành
    });


    data.sort((a, b) => b.id - a.id); // Sắp xếp giảm dần để Voucher mới thêm lên đầu
    dsVoucher.value = data;
    filteredVouchers.value = data;
  } catch (error) {
    console.error(error);
  }
};


const locVoucher = () => {
   if (!tuKhoaVoucher.value) { filteredVouchers.value = dsVoucher.value; return; }
   const kw = tuKhoaVoucher.value.toLowerCase();
   filteredVouchers.value = dsVoucher.value.filter(vc =>
      (vc.tenVoucher && vc.tenVoucher.toLowerCase().includes(kw)) ||
      (vc.maVoucher && vc.maVoucher.toLowerCase().includes(kw))
   );
};


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


// Cứ mở Modal lên là gọi lại API để đảm bảo luôn lấy được Voucher vừa tạo bên Admin
watch(() => props.show, (newVal) => {
   if (newVal) { tuKhoaVoucher.value = ''; fetchVouchers(); }
});
</script>


<style scoped>
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 2050; display: flex; align-items: center; justify-content: center; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.cursor-pointer { cursor: pointer; }


/* Răng cưa chia vé */
.ticket-sawtooth { position: absolute; left: 114px; top: -5px; bottom: -5px; width: 12px; background-size: 12px 12px; background-repeat: repeat-y; }
.border-dashed { border-right-style: dashed !important; border-width: 2px !important; border-color: #e9ecef !important; }


/* Tùy chỉnh danh sách Voucher thường cho ĐẸP & SANG */
.regular-voucher { border-color: #e9ecef !important; transition: all 0.2s; }
.regular-voucher:hover { border-color: #cbb3a1 !important; box-shadow: 0 4px 12px rgba(90, 64, 49, 0.1) !important; transform: translateY(-1px); }
.ticket-left { width: 120px; background-color: #fcfaf8; }


.btn-outline-brown { border: 1px solid #ebdcd0; color: #5a4031; background: #fff; transition: 0.2s; }
.btn-outline-brown:hover:not(.disabled) { background: #5a4031; color: white; border-color: #5a4031; }


.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }


/* Nút Best Voucher */
.btn-best-voucher { background: linear-gradient(135deg, #d16b41 0%, #b85026 100%); color: white; border: none; transition: 0.2s; }
.btn-best-voucher:hover { transform: scale(1.05); box-shadow: 0 4px 10px rgba(209, 107, 65, 0.3); }
</style>

