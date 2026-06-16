<template>
  <div v-if="show" class="custom-modal-overlay">
    <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 900px; width: 100%">
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom" style="background-color: #f8ece3;">
        <h6 class="mb-0 fw-bold" style="color: #5a4031">DANH SÁCH BIẾN THỂ SẢN PHẨM</h6>
        <i class="bi bi-x-lg cursor-pointer fs-5" style="color: #5a4031" @click="$emit('close')"></i>
      </div>
      <div class="p-3 bg-light border-bottom">
         <input type="text" class="form-control rounded-pill shadow-none" placeholder="Tìm theo tên sản phẩm, mã SKU, màu sắc, kích cỡ..." v-model="tuKhoaTimSP">
      </div>
      <div class="p-0 overflow-auto" style="max-height: 450px;">
        <table class="table table-hover align-middle mb-0 custom-modal-table">
          <thead class="table-light sticky-top text-nowrap">
            <tr>
              <th class="ps-3">Mã SKU</th>
              <th>Sản phẩm</th>
              <th>Phân loại</th>
              <th class="text-center">Tồn kho</th>
              <th class="text-end">Đơn giá</th>
              <th class="text-center pe-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="spct in dsSanPhamLoc" :key="spct.id">
              <td class="ps-3 fw-medium text-secondary">{{ spct.ma_sp }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <img :src="getImage(spct.hinh_anh)" @error="$event.target.src=anhLoi" class="rounded border" width="40" height="40" style="object-fit: cover;">
                  <span class="fw-bold" style="font-size: 13.5px">{{ spct.ten_san_pham }}</span>
                </div>
              </td>
              <td style="font-size: 13px">
                <span class="badge bg-light text-dark border me-1">{{ spct.ten_mau }}</span>
                <span class="badge bg-light text-dark border">{{ spct.ten_kich_co }}</span>
              </td>
              <td class="text-center">
                <span class="badge" :class="spct.so_luong_ton > 0 ? 'bg-success' : 'bg-danger'">{{ spct.so_luong_ton }}</span>
              </td>
              <td class="text-end fw-bold text-danger">{{ formatCurrency(spct.don_gia) }}</td>
              <td class="text-center pe-3">
                <button class="btn btn-sm btn-outline-dark rounded-pill px-3" @click="$emit('add-to-cart', spct)" :disabled="spct.so_luong_ton <= 0">Chọn</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  dsSanPhamChiTiet: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'add-to-cart']);

const tuKhoaTimSP = ref('');
const anhLoi = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

const getImage = (link) => {
  if (!link) return anhLoi;
  if (link.startsWith('http') || link.startsWith('data:')) return link;
  return `http://localhost:8080/images/${link}`; 
};

const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
};

const dsSanPhamLoc = computed(() => {
   if (!tuKhoaTimSP.value) return props.dsSanPhamChiTiet;
   const kw = tuKhoaTimSP.value.toLowerCase();
   return props.dsSanPhamChiTiet.filter(sp => {
      const ten = (sp.ten_san_pham || '').toLowerCase();
      const sku = (sp.ma_sp || '').toLowerCase();
      return ten.includes(kw) || sku.includes(kw);
   });
});
</script>

<style scoped>
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 2050; display: flex; align-items: center; justify-content: center; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.custom-modal-table th { font-size: 13px; color: #495057; font-weight: 600; padding-top: 12px; padding-bottom: 12px; }
.custom-modal-table td { padding-top: 10px; padding-bottom: 10px; vertical-align: middle; }
.cursor-pointer { cursor: pointer; }
</style>