<template>
  <div class="mx-auto my-2 page-container" style="max-width: 1200px; padding: 0 10px;">
    
    <div v-if="showToast" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin-top: 60px;">
      <div class="toast show shadow-lg border-0 rounded-3" :style="toastType === 'success' ? 'background-color: #f4fbf7; border-left: 5px solid #2e7d32 !important;' : 'background-color: #fff5f5; border-left: 5px solid #ef4444 !important;'" role="alert" style="min-width: 320px;">
        <div class="d-flex align-items-center">
          <div class="toast-body fw-medium px-3 py-2 d-flex align-items-center text-dark">
            <i :class="toastType === 'success' ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-triangle-fill text-danger'" class="me-3 fs-4"></i>
            <span>{{ toastMessage }}</span>
          </div>
          <button type="button" class="btn-close ms-auto me-3" @click="showToast = false"></button>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4 rounded-3 bg-white">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-3">
          <i class="bi bi-funnel text-dark me-2 fs-5"></i>
          <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm Chất liệu</h6>
        </div>
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label text-muted small mb-1">Từ khóa tìm kiếm</label>
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted" style="height: 38px;"><i class="bi bi-search"></i></span>
              <input v-model="filter.keyword" type="text" class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle" placeholder="Tìm theo mã hoặc tên chất liệu..." style="height: 38px; font-size: 13.5px;" />
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Trạng thái</label>
            <select v-model="filter.trangThai" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted" style="height: 38px; font-size: 13.5px;">
              <option value="">Tất cả trạng thái</option>
              <option value="1">Kinh doanh</option>
              <option value="0">Ngừng kinh doanh</option>
            </select>
          </div>
          <div class="col-md-5 d-flex gap-2 justify-content-end">
            <button @click="resetFilter" class="btn btn-outline-secondary rounded-pill px-3" style="height: 38px; font-size: 13.5px;"><i class="bi bi-arrow-clockwise"></i> Đặt lại</button>
            <button @click="openModal('ADD')" class="btn text-white rounded-pill px-3" style="background-color: #8c6b5d; height: 38px; font-size: 13.5px;">+ Thêm mới</button>
            <button @click="exportToExcel" class="btn text-white rounded-pill px-3" style="background-color: #a3b899; height: 38px; font-size: 13.5px; border: none;"><i class="bi bi-file-earmark-spreadsheet"></i> Xuất Excel</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-3 bg-white">
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle text-nowrap" style="font-size: 0.9rem">
            <thead>
              <tr>
                <th class="py-3 px-3 border-0 rounded-start fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 80px;">STT</th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 220px;">MÃ CHẤT LIỆU</th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">TÊN CHẤT LIỆU</th>
                <th class="py-3 px-3 border-0 fw-semibold text-center" style="background-color: #dccbc0; color: #5a4031; width: 180px;">TRẠNG THÁI</th>
                <th class="py-3 px-3 border-0 rounded-end text-center fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 150px;">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody class="border-top-0 text-secondary">
              <tr v-for="(item, index) in paginatedData" :key="item.id">
                <td class="py-3 px-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-3 px-3 text-dark fw-bold">{{ item.maChatLieu }}</td>
                <td class="py-3 px-3 text-dark">{{ item.tenChatLieu }}</td>
                <td class="py-3 px-3 text-center">
                  <span :class="['badge rounded-pill px-3 py-2 fw-medium', (item.trangThai === 1) ? 'bg-success text-white' : 'bg-danger text-white']">
                    {{ (item.trangThai === 1) ? 'Kinh doanh' : 'Ngừng KD' }}
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <div class="d-flex justify-content-center gap-3 align-items-center">
                    <i @click="openModal('VIEW', item)" class="bi bi-eye text-primary fs-5 cursor-pointer view-icon-hover" title="Xem & Sửa chi tiết"></i>
                    <i @click="confirmDelete(item)" class="bi bi-trash3 text-danger fs-5 cursor-pointer" title="Xóa"></i>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredData.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">Không tìm thấy chất liệu nào phù hợp.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredData.length > 0" class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small flex-wrap gap-3">
          <div>Hiển thị <span class="fw-bold text-dark">{{ paginatedData.length }}</span> / <span class="fw-bold text-dark">{{ filteredData.length }}</span> bản ghi</div>
          <div class="d-flex gap-1 align-items-center">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-sm btn-light border shadow-none px-2 rounded"><i class="bi bi-chevron-left"></i></button>
            <button v-for="page in totalPages" :key="page" @click="changePage(page)" class="btn btn-sm shadow-none px-3 rounded fw-medium" :class="currentPage === page ? 'btn-secondary text-white' : 'btn-light border text-muted'" :style="currentPage === page ? 'background-color: #8c6b5d; border-color: #8c6b5d;' : ''">{{ page }}</button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-sm btn-light border shadow-none px-2 rounded"><i class="bi bi-chevron-right"></i></button>
          </div>
          <div class="d-flex align-items-center gap-2">
            <select v-model="itemsPerPage" class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted pe-4" style="width: auto">
              <option :value="5">5 bản ghi / trang</option>
              <option :value="10">10 bản ghi / trang</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="custom-modal-overlay">
      <div class="custom-modal-content quick-edit-modal shadow-lg">
        <div class="custom-modal-header d-flex justify-content-between align-items-center">
          <h5 class="m-0 fw-bold fs-6 text-uppercase" style="color: #5a4031;">
            <i class="bi" :class="modalMode === 'ADD' ? 'bi-plus-lg' : 'bi-pencil-square'"></i> 
            {{ modalMode === 'ADD' ? 'Thêm Chất liệu mới' : 'Cập nhật Chất liệu' }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body p-4 bg-white">
          <div class="mb-3">
            <label class="form-label fw-bold">Mã chất liệu <span class="text-danger">*</span></label>
            <input type="text" class="form-control h-38" v-model="form.maChatLieu" placeholder="Nhập mã viết tắt..." :disabled="modalMode === 'VIEW'" readonly/>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Tên chất liệu <span class="text-danger">*</span></label>
            <input type="text" class="form-control h-38" v-model="form.tenChatLieu" placeholder="Nhập tên chất liệu chi tiết..." />
          </div>
          <div class="mb-2">
            <label class="form-label fw-bold d-block mb-2">Trạng thái hoạt động</label>
            <select v-model="form.trangThai" class="form-select h-38">
              <option :value="1">Kinh doanh</option>
              <option :value="0">Ngừng kinh doanh</option>
            </select>
          </div>
        </div>
        <div class="modal-footer bg-light px-4 py-3 d-flex justify-content-end gap-2 border-top-0">
          <button type="button" class="pill-btn" @click="closeModal">Hủy bỏ</button>
          <button type="button" class="btn btn-hoan-tat px-4 rounded-pill py-1 fs-6" @click="handleSaveClick">Xác nhận lưu</button>
        </div>
      </div>
    </div>

    <ConfirmModal 
      v-model="isShowConfirm" 
      title="Xác nhận thực hiện"
      message="Cậu có chắc chắn muốn thực hiện hành động này với"
      :itemName="pendingItem?.tenChatLieu" 
      @confirm="performAction" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ConfirmModal from '@/components/ConfirmModal.vue';
import { broadcastUpdate, listenUpdate } from '@/utils/BroadcastService';
const performAction = async () => {
  try {
    if (actionType.value === 'DELETE') {
      await axios.delete(`http://localhost:8080/api/chat-lieu/${pendingItem.value.id}`);
      triggerToast("Xóa chất liệu thành công!", "success");
    } else if (actionType.value === 'ADD') {
      await axios.post('http://localhost:8080/api/chat-lieu', form);
      triggerToast("Thêm mới chất liệu thành công!", "success");
      closeModal();
    } else if (actionType.value === 'EDIT') {
      await axios.put(`http://localhost:8080/api/chat-lieu/${form.id}`, form);
      triggerToast("Cập nhật chất liệu thành công!", "success");
      closeModal();
    }
    
    // --- ĐÂY LÀ PHẦN THÊM VÀO ---
    await fetchData(); 
    // Gửi tín hiệu để file "Thêm sản phẩm" và các tab khác cập nhật
    broadcastUpdate('CHAT_LIEU_UPDATE', form.id, form.tenChatLieu, form.trangThai);
    // ----------------------------

  } catch (err) { 
    triggerToast(err.response?.data || "Có lỗi xảy ra!", "danger"); 
  } finally { 
    isShowConfirm.value = false; 
  }
};
// ======================== Biến Toàn Cục ========================
const showToast = ref(false); 
const toastType = ref('success'); 
const toastMessage = ref('');
const listData = ref([]); 
const showModal = ref(false); 
const modalMode = ref('ADD');
const currentPage = ref(1); 
const itemsPerPage = ref(10);
const filter = reactive({ keyword: '', trangThai: '' });
const form = reactive({ id: null, maChatLieu: '', tenChatLieu: '', trangThai: 1 });

// ======================== Biến Modal Confirm ========================
const isShowConfirm = ref(false);
const pendingItem = ref(null);
const actionType = ref(''); // Lưu trạng thái: 'ADD', 'EDIT', hoặc 'DELETE'

// ======================== Hàm Hiển Thị Thông Báo ========================
const triggerToast = (message, type = 'danger') => { 
  toastMessage.value = message; 
  toastType.value = type; 
  showToast.value = true; 
  setTimeout(() => (showToast.value = false), 3000); 
};



const closeModal = () => showModal.value = false;

// ======================== Logic Xác Nhận Hành Động ========================
// Mở confirm khi muốn XÓA
const confirmDelete = (item) => { 
  pendingItem.value = item; 
  actionType.value = 'DELETE'; 
  isShowConfirm.value = true; 
};

// Mở confirm khi muốn THÊM hoặc SỬA (kiểm tra rỗng trước)
const handleSaveClick = () => {
  if (!form.maChatLieu.trim() || !form.tenChatLieu.trim()) {
    return triggerToast("Vui lòng nhập đầy đủ mã và tên chất liệu!", "danger");
  }
  actionType.value = modalMode.value === 'ADD' ? 'ADD' : 'EDIT'; 
  pendingItem.value = { tenChatLieu: form.tenChatLieu }; 
  isShowConfirm.value = true; 
};
const fetchData = async () => { 
  try { 
    const res = await axios.get('http://localhost:8080/api/chat-lieu'); 
    // Sắp xếp ID giảm dần (mới nhất lên đầu)
    listData.value = res.data.sort((a, b) => b.id - a.id); 
  } catch (err) { 
    triggerToast("Không thể tải danh sách!", "danger"); 
  }
};

// ======================== Logic Xuất Excel ========================
const exportToExcel = () => {
  // Lấy dữ liệu đã qua bộ lọc
  const data = filteredData.value.map((item, index) => ({
    "STT": index + 1,
    "Mã Chất Liệu": item.maChatLieu,
    "Tên Chất Liệu": item.tenChatLieu,
    "Trạng Thái": item.trangThai === 1 ? 'Kinh doanh' : 'Ngừng KD'
  }));
  
  if (data.length === 0) return triggerToast("Không có dữ liệu để xuất!", "warning");

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ChatLieu");
  XLSX.writeFile(wb, "DanhSachChatLieu.xlsx");
  triggerToast("Xuất file Excel thành công!", "success");
};

// ======================== Computed Filter & Phân Trang ========================
const filteredData = computed(() => {
  let r = listData.value;
  if (filter.keyword.trim()) {
    const kw = filter.keyword.toLowerCase().trim();
    r = r.filter(i => (i.maChatLieu && i.maChatLieu.toLowerCase().includes(kw)) || (i.tenChatLieu && i.tenChatLieu.toLowerCase().includes(kw)));
  }
  if (filter.trangThai !== '') r = r.filter(i => (i.trangThai === 1) === (filter.trangThai === '1'));
  return r;
});

const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value));
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value) || 1);
const changePage = (p) => { if (p >= 1 && p <= totalPages.value) currentPage.value = p; };
const resetFilter = () => { filter.keyword = ''; filter.trangThai = ''; currentPage.value = 1; };

watch([() => filter.keyword, () => filter.trangThai, itemsPerPage], () => currentPage.value = 1);

onMounted(() => {
  fetchData();
  
  // Lắng nghe tín hiệu từ các tab khác
  listenUpdate((data) => {
    if (data.type === 'CHAT_LIEU_UPDATE') {
      fetchData(); 
    }
  });
});
const openModal = (mode, item = null) => {
  modalMode.value = mode;
  if (mode === 'VIEW' && item) {
    Object.assign(form, { id: item.id, maChatLieu: item.maChatLieu, tenChatLieu: item.tenChatLieu, trangThai: item.trangThai });
  } else {
    // Logic tự sinh mã Chất liệu
    const maxId = listData.value.length > 0 
      ? Math.max(...listData.value.map(i => parseInt(i.maChatLieu.replace(/\D/g, ''), 10) || 0)) 
      : 0;
    Object.assign(form, { id: null, maChatLieu: `CL${maxId + 1}`, tenChatLieu: '', trangThai: 1 });
  }
  showModal.value = true;
};
</script>

<style scoped>
/* Icon & Input */
.cursor-pointer { cursor: pointer; } 
.h-38 { height: 38px !important; font-size: 13.5px !important; }
.view-icon-hover { transition: transform 0.15s; } 
.view-icon-hover:hover { transform: scale(1.2); color: #0d6efd !important; }
.form-control:focus, .form-select:focus { border-color: #cbb3a1 !important; box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25) !important; }

/* Table */
.table-hover tbody tr:hover { background-color: #fcfaf8; }

/* Modal Edit */
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.quick-edit-modal { width: 450px; }
.custom-modal-header { background-color: #f8ece3; color: #5a4031; padding: 16px 20px; border-bottom: 1px solid #e0e0e0; border-top: 4px solid #5a4031; }

/* Nút Bấm Trong Modal */
.pill-btn { border: 1px solid #ccc; border-radius: 20px; padding: 4px 16px; font-size: 13px; background: white; color: #333; font-weight: 600; }
.btn-hoan-tat { background-color: #dccbc0; color: #5a4031; font-weight: 600; border: none; border-radius: 20px !important; }
.btn-hoan-tat:hover { background-color: #cbb8ac; }

/* Toast */
.toast { animation: slideInRight 0.4s ease-out; }
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>