<template>
  <div class="position-relative select-thong-minh" v-click-outside="closeDropdown">
    <div class="position-relative d-flex align-items-center" @click="toggleDropdown">
      <input
        type="text"
        :class="[customClass || 'form-control custom-input', 'pe-4']"
        :placeholder="placeholder"
        v-model="searchQuery"
        @input="onInput"
        style="padding-right: 28px !important;"
      />
      <span class="position-absolute end-0 me-2 border-0 bg-transparent cursor-pointer icon-wrapper">
        <i class="bi bi-chevron-down text-muted small-icon" :class="{ 'rotate-180': isOpen }"></i>
      </span>
    </div>


    <ul v-if="isOpen" class="dropdown-menu show w-100 shadow-sm overflow-auto" style="max-height: 200px; z-index: 1050; border: 1px solid #e0e0e0; border-radius: 6px;">
      <li v-if="searchQuery.trim() !== ''" class="dropdown-item text-primary fw-bold border-bottom cursor-pointer bg-light-blue py-2" @click="handleQuickAdd">
        <i class="bi bi-plus-circle-fill me-2"></i> Thêm nhanh "{{ searchQuery }}"
      </li>


      <li
        v-for="item in filteredItems"
        :key="item.id"
        class="dropdown-item cursor-pointer d-flex justify-content-between align-items-center py-2 dropdown-item-custom"
        :class="{ 'active-item': item.id === modelValue }"
        @click="selectItem(item)"
      >
        <span>{{ item[labelKey] }}</span>
      </li>


      <li v-if="filteredItems.length === 0 && searchQuery.trim() === ''" class="dropdown-item text-muted text-center py-3">
        Không có dữ liệu
      </li>
    </ul>


    <div v-if="showModal" class="custom-modal-overlay" tabindex="-1">
      <div class="custom-modal-content quick-edit-modal shadow-lg">
        <div class="custom-modal-header d-flex justify-content-between align-items-center">
          <h5 class="m-0 fw-bold fs-6 text-uppercase" style="color: #5a4031;"><i class="bi bi-plus-lg me-1"></i> Thêm Nhanh {{ title }}</h5>
          <button type="button" class="btn-close" @click="closeModal" style="font-size: 12px;"></button>
        </div>
        <div class="modal-body py-4 px-4 bg-white">
         
          <div class="mb-3" v-if="requiresCode">
            <label class="form-label fw-bold">Mã {{ title.toLowerCase() }} <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control custom-input w-100"
              v-model="quickForm.ma"
              :placeholder="'Nhập mã ' + title.toLowerCase() + ' (Ví dụ: CL1, KD1, CA1...)'"
            />
          </div>


          <div class="mb-3">
            <label class="form-label fw-bold">Tên {{ title }} <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control custom-input w-100"
              v-model="quickForm.ten"
              :placeholder="'Nhập tên ' + title.toLowerCase() + '...'"
            />
          </div>


          <div class="mb-1">
            <label class="form-label fw-bold d-block mb-2">Trạng thái</label>
            <div>
              <span class="badge bg-success px-3 py-2 rounded-pill fw-normal fs-6" style="background-color: #198754 !important;">Đang kinh doanh</span>
            </div>
          </div>
        </div>
        <div class="modal-footer bg-light border-top-0 px-4 py-3 d-flex justify-content-end gap-2">
          <button type="button" class="pill-btn" @click="closeModal">Hủy</button>
          <button type="button" class="btn btn-hoan-tat px-4 rounded-pill py-1 fs-6" style="border-radius: 20px !important;" @click="submitQuickAdd">Xác nhận thêm</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, reactive } from 'vue';
import axios from 'axios';


const props = defineProps({
  modelValue: [String, Number],
  items: { type: Array, default: () => [] },
  labelKey: { type: String, default: 'ten' },
  placeholder: { type: String, default: 'Chọn...' },
  title: { type: String, default: 'Thuộc tính' },
  apiEndpoint: String,
  customClass: [Object, String, Array]
});


// Khai báo các kết nối truyền tín hiệu lên màn hình trang cha tổng
const emit = defineEmits(['update:modelValue', 'refresh', 'input', 'toast']);


const isOpen = ref(false);
const showModal = ref(false);
const searchQuery = ref('');


const quickForm = reactive({ ma: '', ten: '' });


// ✅ ĐÃ DI CHUYỂN LÊN TRÊN: Kiểm tra phân hệ nào cần quản lý mã
const requiresCode = computed(() => {
  const t = props.title.toLowerCase();
  return t.includes('thương hiệu') ||
         t.includes('danh mục') ||
         t.includes('màu sắc');
});


// ✅ ĐÃ DI CHUYỂN LÊN TRÊN: Tự động map đúng tên biến JSON gửi sang Backend
const codeKey = computed(() => {
  const t = props.labelKey;
  if (t === 'tenThuongHieu') return 'maThuongHieu';
  if (t === 'tenDanhMuc') return 'maDanhMuc';
  if (t === 'tenMau') return 'maMau';
  if (t === 'tenChatLieu') return 'maChatLieu';
  if (t === 'tenKieuDang') return 'maKieuDang';
  if (t === 'tenCoAo') return 'maCoAo';
  if (t === 'tenTayAo') return 'maTayAo';
  return 'ma';
});


// Theo dõi sự thay đổi của giá trị được chọn để hiển thị text lên ô Input
watch(() => props.modelValue, (newVal) => {
  const selectedItem = props.items.find(i => i.id === newVal);
  searchQuery.value = selectedItem ? selectedItem[props.labelKey] : '';
}, { immediate: true });


// Bộ lọc tìm kiếm Client-side
const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.items;
  return props.items.filter(item => {
    const text = (item[props.labelKey] || '').toLowerCase();
    return text.includes(query);
  });
});


const toggleDropdown = () => { isOpen.value = !isOpen.value; };
const closeDropdown = () => { isOpen.value = false; };


const onInput = () => {
  isOpen.value = true;
  emit('update:modelValue', '');
  emit('input');
};


const selectItem = (item) => {
  searchQuery.value = item[props.labelKey];
  emit('update:modelValue', item.id);
  isOpen.value = false;
};


const handleQuickAdd = () => {
  quickForm.ma = '';
  quickForm.ten = searchQuery.value;
  showModal.value = true;
  isOpen.value = false;
};


const closeModal = () => { showModal.value = false; };


// ✅ HÀM XỬ LÝ LƯU (SUBMIT QUICK ADD) ĐÃ ĐƯỢC ĐỒNG BỘ CHUẨN
const submitQuickAdd = async () => {
  // Thực hiện validate trống
  if (requiresCode.value && !quickForm.ma.trim()) {
    return emit('toast', `Vui lòng nhập mã cho ${props.title.toLowerCase()}!`, "danger");
  }
  if (!quickForm.ten.trim()) {
    return emit('toast', `Vui lòng không để trống tên ${props.title.toLowerCase()}!`, "danger");
  }


  const payload = {
    [props.labelKey]: quickForm.ten.trim(),
    trangThai: 1
  };


  if (requiresCode.value) {
    payload[codeKey.value] = quickForm.ma.trim().toUpperCase();
  }


  try {
    const res = await axios.post(props.apiEndpoint, payload);
   
    // Báo thông báo Toast xanh lá thành công lên màn hình lớn
    emit('toast', `Thêm nhanh ${props.title} thành công!`, "success");
   
    emit('refresh');
    emit('update:modelValue', res.data.id);
    searchQuery.value = res.data[props.labelKey];
   
    showModal.value = false;
  } catch (err) {
    console.error("Chi tiết lỗi API tại component con:", err);
   
    // Đón câu thông báo chữ Tiếng Việt trả về từ Controller của Spring Boot (Bất kể lỗi 400 hay lỗi khác)
    const serverMessage = err.response?.data;
    if (serverMessage && typeof serverMessage === 'string') {
      emit('toast', serverMessage, "danger");
    } else {
      emit('toast', `Không thể thêm nhanh ${props.title}. Vui lòng kiểm tra lại hệ thống Backend!`, "danger");
    }
  }
};


// Custom Directive hỗ trợ click ra vùng ngoài tự đóng dropdown
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};
</script>


<style scoped>
/* ================= CSS GIỮ NGUYÊN ĐỂ ĐẢM BẢO PHOM GIAO DIỆN UX ================= */
.toast {
  animation: slideInRight 0.4s ease-out;
}


@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.cursor-pointer { cursor: pointer; }
.rotate-180 { transform: rotate(180deg); }
.bg-light-blue { background-color: #f7ede6 !important; color: #5a4031 !important; transition: background 0.2s; }
.bg-light-blue:hover { background-color: #e5d4c8 !important; }
.active-item { background-color: #5a4031 !important; color: white !important; }
.dropdown-item-custom:hover { background-color: #f7ede6; color: #5a4031; }
.select-thong-minh { width: 100%; }
.select-thong-minh input { border: 1px solid #d1d1d1; border-radius: 6px !important; font-size: 13.5px !important; padding: 8px 12px !important; color: #333; width: 100%; height: 38px !important; }
.select-thong-minh input:focus { border-color: #cbb3a1 !important; box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25) !important; outline: none; }
.icon-wrapper { height: 100%; display: flex; align-items: center; top: 0; pointer-events: none; z-index: 10; }
.small-icon { font-size: 11px !important; color: #6c757d !important; display: block; }
.dropdown-menu { font-size: 13.5px !important; margin-top: 4px; }
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); animation: slideDown 0.2s ease-out; }
.quick-edit-modal { width: 450px; }
.custom-modal-header { background-color: #f8ece3; color: #5a4031; padding: 16px 20px; border-bottom: 1px solid #e0e0e0; border-top: 4px solid #5a4031; }
.form-label { font-size: 13px; color: #555; font-weight: 500; margin-bottom: 6px; }
.pill-btn { border: 1px solid #ccc; border-radius: 20px; padding: 4px 16px; font-size: 13px; background: white; color: #333; font-weight: 600; }
.btn-hoan-tat { background-color: #dccbc0; color: #5a4031; font-weight: 600; border: none; }
.btn-hoan-tat:hover { background-color: #cbb8ac; }
@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>



