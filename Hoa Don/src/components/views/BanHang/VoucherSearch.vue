<template>
  <div v-if="show" class="custom-modal-overlay">
    <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 850px; width: 100%">
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom" style="background-color: #f8ece3;">
        <h6 class="mb-0 fw-bold" style="color: #5a4031"><i class="bi bi-ticket-perforated me-2"></i>CHỌN PHIẾU GIẢM GIÁ</h6>
        <i class="bi bi-x-lg cursor-pointer fs-5" style="color: #5a4031" @click="$emit('close')"></i>
      </div>
      
      <div class="p-3 bg-light border-bottom">
         <input type="text" class="form-control rounded-pill shadow-none" placeholder="Nhập mã hoặc tên phiếu giảm giá..." v-model="tuKhoaVoucher" @input="locVoucher">
      </div>

      <div class="p-3 overflow-auto bg-light" style="max-height: 400px;">
        <div v-if="filteredVouchers.length === 0" class="text-center text-muted py-4">
           Không tìm thấy mã giảm giá nào phù hợp!
        </div>
        
        <div v-for="vc in filteredVouchers" :key="vc.id" 
             class="voucher-card d-flex mb-3 bg-white shadow-sm rounded-3 overflow-hidden border border-warning-subtle position-relative">
             
             <div class="ticket-sawtooth"></div>

             <div class="p-3 d-flex flex-column justify-content-center align-items-center bg-warning bg-opacity-10 border-end border-warning-subtle border-dashed" style="width: 120px;">
                 <span class="badge bg-warning text-dark mb-1">Mã: {{ vc.maVoucher }}</span>
                 <span class="fw-bold text-danger fs-5" v-if="vc.loaiGiamGia === 1">{{ vc.giaTriGiam }}%</span>
                 <span class="fw-bold text-danger" v-else>{{ formatCurrency(vc.giaTriGiam) }}</span>
             </div>
             
             <div class="p-3 flex-grow-1 d-flex justify-content-between align-items-center">
                <div>
                   <h6 class="fw-bold mb-1 text-dark">{{ vc.tenVoucher }}</h6>
                   <div class="small text-muted mb-1">Đơn tối thiểu: <span class="fw-medium text-dark">{{ formatCurrency(vc.donToiThieu) }}</span></div>
                   <div class="small text-muted" v-if="vc.loaiGiamGia === 1 && vc.giamToiDa">Giảm tối đa: <span class="fw-medium text-dark">{{ formatCurrency(vc.giamToiDa) }}</span></div>
                   <div class="small text-danger mt-1" style="font-size: 11px;">HSD: {{ formatDateTime(vc.ngayKetThuc) }}</div>
                </div>
                
                <button class="btn btn-sm rounded-pill fw-bold px-3 shadow-none" 
                        :class="kiemTraDieuKien(vc) ? 'btn-outline-danger' : 'btn-outline-secondary disabled'"
                        @click="$emit('select-voucher', vc)">
                   Dùng ngay
                </button>
             </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  show: Boolean,
  tongTienHang: Number
});

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

// Hàm check xem đơn hàng có đủ tiền để xài mã này không
const kiemTraDieuKien = (vc) => {
   return props.tongTienHang >= vc.donToiThieu;
};

const fetchVouchers = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/phieu-giam-gia?trangThai=1');
    dsVoucher.value = res.data.content || [];
    filteredVouchers.value = dsVoucher.value;
  } catch (error) { console.error("Lỗi lấy danh sách Voucher:", error); }
};

const locVoucher = () => {
   if (!tuKhoaVoucher.value) {
      filteredVouchers.value = dsVoucher.value;
      return;
   }
   const kw = tuKhoaVoucher.value.toLowerCase();
   filteredVouchers.value = dsVoucher.value.filter(vc => 
      vc.tenVoucher.toLowerCase().includes(kw) || 
      vc.maVoucher.toLowerCase().includes(kw)
   );
};

// Load API mỗi khi bật Modal
watch(() => props.show, (newVal) => {
   if (newVal) fetchVouchers();
});
</script>

<style scoped>
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 2050; display: flex; align-items: center; justify-content: center; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.cursor-pointer { cursor: pointer; }
.border-dashed { border-right-style: dashed !important; border-width: 2px !important; }

/* Rãnh răng cưa kiểu vé Ticket */
.ticket-sawtooth {
  position: absolute; left: 114px; top: -5px; bottom: -5px; width: 12px;
  background-image: radial-gradient(circle at 0 5px, transparent 5px, white 6px);
  background-size: 12px 12px; background-repeat: repeat-y;
}
</style>