<template>
  <div v-if="show" class="custom-modal-overlay">
    <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden text-center" style="max-width: 450px; width: 100%">
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom" style="background-color: #0c3e7f;">
        <h6 class="mb-0 fw-bold text-white"><i class="bi bi-qr-code-scan me-2"></i>CHUYỂN KHOẢN NGÂN HÀNG</h6>
        <i class="bi bi-x-lg cursor-pointer fs-5 text-white" @click="$emit('close')"></i>
      </div>
     
      <div class="p-4 bg-light d-flex flex-column align-items-center">
         <img src="https://vietqr.net/portal/v2/Resources/images/napas247.png" alt="VietQR" height="35" class="mb-3">
         
         <div class="bg-white p-2 rounded-3 shadow-sm border mb-3">
             <img :src="vietQrUrl" alt="Mã QR Chuyển khoản" width="220" height="220" class="img-fluid" @error="$event.target.style.display='none'">
         </div>




         <h5 class="fw-bold text-danger mb-1">{{ formatCurrency(soTien) }}</h5>
         <p class="text-muted small mb-4">Nội dung CK: <strong class="text-dark">THANHTOAN {{ maHoaDon }}</strong></p>




         <div class="w-100 d-flex gap-2">
            <button class="btn btn-outline-secondary w-50 rounded-pill shadow-none" @click="$emit('close')">Hủy bỏ</button>
            <button class="btn btn-primary w-50 rounded-pill shadow-none fw-bold" style="background-color: #0c3e7f; border: none;" @click="$emit('xac-nhan')">
               Đã nhận được tiền
            </button>
         </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { computed } from 'vue';




const props = defineProps({
  show: Boolean,
  soTien: Number,
  maHoaDon: String
});




const emit = defineEmits(['close', 'xac-nhan']);




const formatCurrency = (val) => val ? new Intl.NumberFormat('vi-VN').format(val) + ' đ' : '0 đ';




// ========================================================
// BÁC SỬA 3 DÒNG NÀY THÀNH THÔNG TIN NGÂN HÀNG CỦA BÁC NHÉ:
// ========================================================
const bankID = "MB";             // Tên viết tắt ngân hàng (VD: VCB, TCB, MB, BIDV, VPB, ACB...)
const accountNo = "00903082610";  // ĐIỀN SỐ TÀI KHOẢN THẬT CỦA BÁC VÀO ĐÂY
const accountName = "TRINH XUAN BACH"; // ĐIỀN TÊN CHỦ TÀI KHOẢN (Viết hoa không dấu)
// ========================================================




const vietQrUrl = computed(() => {
   const amount = props.soTien > 0 ? props.soTien : 0;
   const noiDung = `THANHTOAN ${props.maHoaDon}`;
   return `https://img.vietqr.io/image/${bankID}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(noiDung)}&accountName=${encodeURIComponent(accountName)}`;
});
</script>




<style scoped>
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 2050; display: flex; align-items: center; justify-content: center; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.cursor-pointer { cursor: pointer; }
</style>







