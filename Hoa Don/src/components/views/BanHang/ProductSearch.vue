<template>
  <div v-if="show" class="custom-modal-overlay">
    <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 900px; width: 100%">
     
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom" style="background-color: #f8ece3;">
        <h6 class="mb-0 fw-bold" style="color: #5a4031"><i class="bi bi-box-seam me-2"></i>CHỌN SẢN PHẨM BÁN</h6>
        <i class="bi bi-x-lg cursor-pointer fs-5" style="color: #5a4031" @click="$emit('close')"></i>
      </div>
     
      <div class="p-3 bg-light border-bottom">
         <div class="input-group">
            <span class="input-group-text bg-white border-end-0 rounded-start-pill"><i class="bi bi-search text-muted"></i></span>
            <input type="text" class="form-control rounded-end-pill border-start-0 shadow-none ps-0"
                   placeholder="Tìm theo tên sản phẩm, mã SKU, màu sắc, kích cỡ..." v-model="tuKhoaTimSP">
         </div>
      </div>


      <div class="p-0 overflow-y-auto overflow-x-hidden custom-scrollbar" style="max-height: 480px;">
       
        <div v-if="dsSanPhamLoc.length === 0" class="text-center text-muted py-5">
           <i class="bi bi-search fs-1 d-block mb-2 opacity-25"></i>
           Không tìm thấy sản phẩm nào phù hợp hoặc sản phẩm đã hết hàng.
        </div>


        <table v-else class="table table-hover align-middle mb-0 custom-modal-table">
          <thead class="table-light sticky-top" style="z-index: 1;">
            <tr>
              <th class="ps-3 text-center" style="width: 60px;">STT</th>
              <th class="text-center" style="width: 70px;">Ảnh</th>
              <th>Sản phẩm</th>
              <th>Phân loại</th>
              <th class="text-center">Tồn kho</th>
              <th class="text-end">Đơn giá</th>
              <th class="text-center pe-3" style="width: 100px;">Giảm giá</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(spct, index) in dsSanPhamLoc" :key="spct.id"
                class="cursor-pointer row-hover-effect"
                @click="$emit('add-to-cart', spct)">
               
              <td class="ps-3 text-center fw-medium text-secondary">{{ index + 1 }}</td>
             
              <td class="text-center">
                 <img :src="getImage(spct.hinhAnh)" @error="$event.target.src=anhLoi" class="rounded border shadow-sm" width="45" height="45" style="object-fit: cover; background: #f8f9fa;">
              </td>
             
              <td>
                <div class="fw-bold text-dark" style="font-size: 13.5px; line-height: 1.2;">{{ spct.tenSanPham }}</div>
                <small class="text-muted" style="font-size: 11px;">Mã: {{ spct.maSku }}</small>
              </td>
             
              <td style="font-size: 12.5px">
                <span class="badge bg-light text-dark border me-1">{{ spct.tenMau || '---' }}</span>
                <span class="badge bg-light text-dark border">{{ spct.tenKichCo || '---' }}</span>
              </td>
             
              <td class="text-center">
                <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                  {{ spct.soLuongTon }}
                </span>
              </td>
             
              <td class="text-end">
                <div v-if="spct.phanTramGiam > 0">
                    <div class="text-decoration-line-through text-muted" style="font-size: 11.5px;">{{ formatCurrency(spct.giaBan) }}</div>
                    <div class="fw-bold text-danger">{{ formatCurrency(spct.giaSauGiam) }}</div>
                </div>
                <div v-else class="fw-bold text-dark">{{ formatCurrency(spct.giaBan) }}</div>
              </td>
             
              <td class="text-center pe-3">
                 <div v-if="spct.phanTramGiam > 0" class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1" style="font-size: 11px;">
                    <i class="bi bi-tag-fill me-1"></i>{{ spct.phanTramGiam }}%
                 </div>
                 <span v-else class="text-muted">---</span>
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
  return `http://localhost:8080/api/sanpham-chitiet/images/${link}`; // Đồng bộ đúng API của bạn
};


const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
};


// Hàm lọc Sản phẩm (Dùng camelCase)
const dsSanPhamLoc = computed(() => {
   // Lọc sản phẩm đang kinh doanh và còn hàng
   let sanPhamHienThi = props.dsSanPhamChiTiet.filter(sp => sp.soLuongTon > 0 && sp.trangThai === 1);


   // Lọc theo từ khóa
   if (tuKhoaTimSP.value) {
      const kw = tuKhoaTimSP.value.toLowerCase();
      sanPhamHienThi = sanPhamHienThi.filter(sp => {
         const ten = (sp.tenSanPham || '').toLowerCase();
         const sku = (sp.maSku || '').toLowerCase();
         const mau = (sp.tenMau || '').toLowerCase();
         const size = (sp.tenKichCo || '').toLowerCase();
         
         return ten.includes(kw) || sku.includes(kw) || mau.includes(kw) || size.includes(kw);
      });
   }


   return sanPhamHienThi;
});
</script>


<style scoped>
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 2050; display: flex; align-items: center; justify-content: center; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.custom-modal-table th { font-size: 13px; color: #6c757d; font-weight: 600; padding-top: 12px; padding-bottom: 12px; border-bottom: 2px solid #e9ecef; }
.custom-modal-table td { padding-top: 12px; padding-bottom: 12px; vertical-align: middle; border-bottom: 1px solid #f8f9fa; }


/* Hiệu ứng chọn dòng không bị giật lag */
.row-hover-effect { transition: background-color 0.2s ease; }
.row-hover-effect:hover { background-color: #fcfaf8 !important; box-shadow: inset 3px 0 0 #5a4031; }


/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbb3a1; }
</style>



