<template>
  <div class="table-responsive" style="min-height: 200px;">
   
    <table v-if="cartItems.length > 0" class="table align-middle custom-cart-table">
      <thead class="text-nowrap">
        <tr>
          <th style="width: 5%">STT</th>
          <th style="width: 7%">Ảnh</th>
          <th style="width: 18%">Sản phẩm</th> <th style="width: 15%">Phân loại</th>
          <th style="width: 13%" class="text-end pe-4">Đơn giá</th>
          <th style="width: 8%" class="text-center">Tồn kho</th>
          <th style="width: 14%" class="text-center">Số lượng</th>
          <th style="width: 15%" class="text-end">Thành tiền</th>
          <th style="width: 5%" class="text-center"></th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="(item, index) in cartItems" :key="item.id"
      :class="{ 'product-disabled': item.trangThai === 0 }">
     
    <td class="text-muted fw-medium">{{ index + 1 }}</td>
   
    <td>
      <img :src="item.hinhAnh" class="product-img rounded border" @error="$event.target.src=anhLoi" />
    </td>
   
   <td>
  <div class="fw-bold" style="font-size: 13.5px">{{ item.tenSanPham }}</div>
  <div class="text-muted" style="font-size: 11px">{{ item.maSku }}</div>
 
  <div v-if="item.trangThai === 0" class="text-danger mt-1 fw-bold error-blink" style="font-size: 10.5px;">
       <i class="bi bi-exclamation-triangle-fill"></i> Đã ngừng kinh doanh
  </div>
 
  <div v-else-if="item.soLuongTon <= 0" class="text-danger mt-1 fw-bold error-blink" style="font-size: 10.5px;">
       <i class="bi bi-exclamation-triangle-fill"></i> Sản phẩm đã hết hàng
  </div>
 
</td>
   
    <td style="font-size: 12px">
      <div>{{ item.mauSac }}</div>
      <div class="fw-bold">{{ item.kichCo }}</div>
    </td>
   
 <td class="text-end pe-4 align-middle" style="width: 150px;">
    <div class="fw-medium text-danger" style="font-size: 14px; line-height: 1.2;">
        {{ formatCurrency(item.giaBan) }}
    </div>


    <div v-if="item.giaCu"
         class="d-inline-flex align-items-center mt-1 px-2 rounded-pill border"
         style="background-color: #fff3cd; border-color: #ffeeba !important; height: 18px; cursor: help;">
       
        <i class="bi bi-arrow-down-up text-warning me-1" style="font-size: 9px;"></i>
       
        <span style="font-size: 10.5px; color: #856404; font-weight: 700; white-space: nowrap;">
            {{ formatCurrency(item.giaCu) }} → {{ formatCurrency(item.giaBan) }}
        </span>
    </div>
</td>
   
    <td class="text-center fw-bold text-secondary">{{ item.soLuongTon }}</td>
   
   <td class="align-middle">
  <div class="d-flex justify-content-center align-items-center">
    <div class="qty-control d-flex border rounded-pill overflow-hidden" :class="{ 'opacity-50': item.trangThai === 0 }">
     
      <button class="btn btn-sm shadow-none px-2 text-muted bg-light"
              @click="$emit('update-qty', { item, qty: item.soLuong - 1 })"
              :disabled="item.soLuong <= 1 || item.trangThai === 0">
        <i class="bi bi-dash"></i>
      </button>
     
      <input type="text" class="form-control form-control-sm text-center border-0 shadow-none bg-white p-0"
             :value="item.soLuong" style="width: 30px" readonly>
     
      <button class="btn btn-sm shadow-none px-2 text-muted bg-light"
              @click="$emit('update-qty', { item, qty: Number(item.soLuong) + 1 })"
              :disabled="Number(item.soLuongTon) <= 0 || item.trangThai === 0">
        <i class="bi bi-plus"></i>
      </button>


    </div>
  </div>
</td>
   
    <td class="text-end fw-bold text-danger" style="font-size: 14px">{{ formatCurrency(item.giaBan * item.soLuong) }}</td>
   
    <td class="text-center">
      <i class="bi bi-trash3-fill text-danger cursor-pointer fs-5" @click="$emit('delete-item', item)"></i>
    </td>
  </tr>
</tbody>


    </table>




    <div v-else class="text-center py-5 mt-4 text-muted w-100 d-flex flex-column align-items-center justify-content-center">
       <div class="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px">
           <i class="bi bi-cart-x fs-1 opacity-50"></i>
       </div>
       <h6 class="fw-bold mb-1">Chưa có sản phẩm</h6>
       <p class="small mb-0 opacity-75">Vui lòng chọn khách hàng và thêm sản phẩm vào giỏ</p>
    </div>
  </div>
</template>




<script setup>
import { defineProps, defineEmits } from 'vue';




const props = defineProps({
  cartItems: { type: Array, default: () => [] }
});




const emit = defineEmits(['update-qty', 'delete-item']);




const anhLoi = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';




const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
};
</script>




<style scoped>
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.error-blink {
  animation: blink 2s linear infinite;
}
.custom-cart-table th { font-size: 13px; color: #495057; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #eef0f2; }
.custom-cart-table td { padding-top: 15px; padding-bottom: 15px; border-bottom: 1px solid #f8f9fa; }
.product-img { width: 40px; height: 40px; object-fit: cover; }
.qty-control { width: fit-content; border-color: #dee2e6 !important; }
.qty-control button { font-size: 12px; padding: 2px 8px; }
.cursor-pointer { cursor: pointer; transition: opacity 0.2s; }
.cursor-pointer:hover { opacity: 0.7; }
/* Dòng làm mờ cả hàng */
.product-disabled {
  background-color: #f8f9fa !important;
  opacity: 0.8;
}


/* Đảm bảo chữ cảnh báo luôn đỏ rực, không bị ảnh hưởng bởi độ mờ của dòng */
.text-danger-custom {
  color: #dc3545 !important; /* Màu đỏ của Bootstrap */
  opacity: 1 !important;     /* Ép độ trong suốt về 100% */
  font-weight: 800 !important;
  display: block;
}
</style>







