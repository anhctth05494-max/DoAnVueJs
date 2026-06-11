<template>
  <div class="mx-auto my-2 page-container" style="max-width: 1200px; padding: 0 10px;">
    
    <div v-if="showToast" class="position-fixed top-0 end-0 p-3" style="z-index: 2055; margin-top: 60px">
      <div class="toast show align-items-center text-white border-0 shadow-lg" :class="toastType === 'success' ? 'bg-success' : 'bg-danger'" role="alert">
        <div class="d-flex">
          <div class="toast-body fw-medium px-3 py-2">
            <i :class="toastType === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'" class="me-2 fs-5 align-middle"></i>
            {{ toastMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-3 m-auto" @click="showToast = false"></button>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4 rounded-3 bg-white">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-3">
          <i class="bi bi-funnel text-dark me-2 fs-5"></i>
          <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm Thương hiệu</h6>
        </div>

        <div class="row g-3 align-items-end">
          <div class="col-md-5">
            <label class="form-label text-muted small mb-1">Từ khóa tìm kiếm</label>
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted" style="height: 38px;">
                <i class="bi bi-search"></i>
              </span>
              <input v-model="filter.keyword" type="text" class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle" placeholder="Tìm theo mã hoặc tên thương hiệu..." style="height: 38px; font-size: 13.5px;" />
            </div>
          </div>

          <div class="col-md-4">
            <label class="form-label text-muted small mb-1">Trạng thái</label>
            <select v-model="filter.trangThai" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted" style="height: 38px; font-size: 13.5px;">
              <option value="">Tất cả trạng thái</option>
              <option value="1">Kinh doanh</option>
              <option value="0">Ngừng kinh doanh</option>
            </select>
          </div>

          <div class="col-md-3 d-flex gap-2 justify-content-end">
            <button @click="resetFilter" class="btn btn-outline-secondary rounded-pill px-3" style="height: 38px; font-size: 13.5px;"><i class="bi bi-arrow-clockwise"></i> Đặt lại</button>
            <button @click="openModal('ADD')" class="btn text-white rounded-pill px-3" style="background-color: #8c6b5d; height: 38px; font-size: 13.5px;">+ Thêm mới</button>
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
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 220px;">MÃ THƯƠNG HIỆU</th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">TÊN THƯƠNG HIỆU</th>
                <th class="py-3 px-3 border-0 fw-semibold text-center" style="background-color: #dccbc0; color: #5a4031; width: 180px;">TRẠNG THÁI</th>
                <th class="py-3 px-3 border-0 rounded-end text-center fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 150px;">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody class="border-top-0 text-secondary">
              <tr v-for="(item, index) in paginatedData" :key="item.id">
                <td class="py-3 px-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-3 px-3 text-dark fw-bold">{{ item.maThuongHieu }}</td>
                <td class="py-3 px-3 text-dark">{{ item.tenThuongHieu }}</td>
                <td class="py-3 px-3 text-center">
                  <span :class="['badge rounded-pill px-3 py-2 fw-medium', item.trangThai === 1 ? 'bg-success text-white' : 'bg-danger text-white']">
                    {{ item.trangThai === 1 ? 'Kinh doanh' : 'Ngừng KD' }}
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <div class="d-flex justify-content-center gap-3 align-items-center">
                    <i @click="openModal('VIEW', item)" class="bi bi-eye text-primary fs-5 cursor-pointer view-icon-hover" title="Xem & Sửa chi tiết"></i>
                   <i @click="deleteItem(item)" class="bi bi-trash3 text-danger fs-5 cursor-pointer"></i>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredData.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">Không tìm thấy thương hiệu nào phù hợp.</td>
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
            {{ modalMode === 'ADD' ? 'Thêm Thương hiệu mới' : 'Cập nhật Thương hiệu' }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body p-4 bg-white">
          <div class="mb-3">
            <label class="form-label fw-bold">Mã thương hiệu <span class="text-danger">*</span></label>
            <input type="text" class="form-control h-38" v-model="form.maThuongHieu" placeholder="Nhập mã thương hiệu..." :disabled="modalMode === 'VIEW'" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Tên thương hiệu <span class="text-danger">*</span></label>
            <input type="text" class="form-control h-38" v-model="form.tenThuongHieu" placeholder="Nhập tên thương hiệu chi tiết..." />
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
          <button type="button" class="btn btn-hoan-tat px-4 rounded-pill py-1 fs-6" @click="saveData">Xác nhận lưu</button>
        </div>
      </div>
    </div>
  </div>
  <ConfirmModal 
  v-model="isShowConfirm" 
  title="Xác nhận"
  message="Cậu có chắc chắn muốn thực hiện hành động với:"
  :itemName="pendingItem?.tenThuongHieu"
  @confirm="performDelete" 
/>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import ConfirmModal from '@/components/ConfirmModal.vue';
// Biến dùng chung cho Modal Confirm
// Biến điều khiển
const isShowConfirm = ref(false);
const pendingItem = ref(null);
const actionType = ref(''); // Để phân biệt Thêm/Sửa/Xóa

// Hàm xóa (chỉ mở modal)
const deleteItem = (item) => {
  pendingItem.value = item;
  actionType.value = 'DELETE';
  isShowConfirm.value = true;
};

// Hàm lưu (cũng mở modal thay vì dùng confirm() thô)
const saveData = () => {
  if (!form.maThuongHieu.trim() || !form.tenThuongHieu.trim()) {
    return triggerToast("Vui lòng nhập đầy đủ Mã và Tên thương hiệu!", "danger");
  }
  actionType.value = modalMode.value === 'ADD' ? 'ADD' : 'EDIT';
  pendingItem.value = { tenThuongHieu: form.tenThuongHieu }; // Để hiện tên trong modal
  isShowConfirm.value = true;
};

// Hàm xử lý chung khi nhấn xác nhận trong Modal
const performDelete = async () => {
  try {
    if (actionType.value === 'DELETE') {
      await axios.delete(`http://localhost:8080/api/thuong-hieu/${pendingItem.value.id}`);
      triggerToast("Xóa thương hiệu thành công!", "success");
      fetchData();
    } else if (actionType.value === 'ADD') {
      await axios.post('http://localhost:8080/api/thuong-hieu', form);
      triggerToast("Thêm mới thành công!", "success");
      closeModal();
      fetchData();
    } else if (actionType.value === 'EDIT') {
      await axios.put(`http://localhost:8080/api/thuong-hieu/${form.id}`, form);
      triggerToast("Cập nhật thành công!", "success");
      closeModal();
      fetchData();
    }
  } catch (err) {
    triggerToast("Có lỗi xảy ra, vui lòng thử lại!", "danger");
  } finally {
    isShowConfirm.value = false;
  }
};

const showToast = ref(false); const toastType = ref('success'); const toastMessage = ref('');
const triggerToast = (message, type = 'danger') => {
  toastMessage.value = message; toastType.value = type; showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000); 
};

const listData = ref([]); const showModal = ref(false); const modalMode = ref('ADD');
const currentPage = ref(1); const itemsPerPage = ref(10);
const filter = reactive({ keyword: '', trangThai: '' });
const form = reactive({ id: null, maThuongHieu: '', tenThuongHieu: '', trangThai: 1 });

const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/thuong-hieu');
    listData.value = res.data;
  } catch (err) {
    triggerToast("Không thể kết nối Backend để lấy dữ liệu!", "danger");
  }
};

const filteredData = computed(() => {
  let result = listData.value;
  if (filter.keyword.trim()) {
    const kw = filter.keyword.toLowerCase().trim();
    result = result.filter(item => 
      (item.maThuongHieu && item.maThuongHieu.toLowerCase().includes(kw)) ||
      (item.tenThuongHieu && item.tenThuongHieu.toLowerCase().includes(kw))
    );
  }
  if (filter.trangThai !== '') {
    result = result.filter(item => (item.trangThai === 1 || item.trangThai === true) === (filter.trangThai === '1'));
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value) || 1);
const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value));
const changePage = (page) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page; };
watch([() => filter.keyword, () => filter.trangThai, itemsPerPage], () => currentPage.value = 1);
const resetFilter = () => { filter.keyword = ''; filter.trangThai = ''; currentPage.value = 1; };

const openModal = (mode, item = null) => {
  modalMode.value = mode;
  if (mode === 'VIEW' && item) {
    Object.assign(form, {
      id: item.id,
      maThuongHieu: item.maThuongHieu,
      tenThuongHieu: item.tenThuongHieu,
      trangThai: (item.trangThai === true || item.trangThai === 1) ? 1 : 0
    });
  } else {
    Object.assign(form, { id: null, maThuongHieu: '', tenThuongHieu: '', trangThai: 1 });
  }
  showModal.value = true;
};
const closeModal = () => { showModal.value = false; };


onMounted(() => { fetchData(); });
</script>

<style scoped>
.cursor-pointer { cursor: pointer; } .h-38 { height: 38px !important; font-size: 13.5px !important; }
.view-icon-hover { transition: transform 0.15s ease-in-out; }
.view-icon-hover:hover { transform: scale(1.2); color: #0d6efd !important; }
.form-control:focus, .form-select:focus { border-color: #cbb3a1 !important; box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25) !important; }
.table-hover tbody tr:hover { background-color: #fcfaf8; }
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.quick-edit-modal { width: 450px; }
.custom-modal-header { background-color: #f8ece3; color: #5a4031; padding: 16px 20px; border-bottom: 1px solid #e0e0e0; border-top: 4px solid #5a4031; }
.pill-btn { border: 1px solid #ccc; border-radius: 20px; padding: 4px 16px; font-size: 13px; background: white; color: #333; font-weight: 600; }
.btn-hoan-tat { background-color: #dccbc0; color: #5a4031; font-weight: 600; border: none; border-radius: 20px !important; }
.btn-hoan-tat:hover { background-color: #cbb8ac; }
</style>