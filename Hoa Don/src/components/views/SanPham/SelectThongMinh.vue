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

    <ul v-if="isOpen" class="dropdown-menu show w-100 shadow-sm overflow-auto" style="max-height: 220px; z-index: 1050; border: 1px solid #eef0f2; border-radius: 8px;">
      
      <li v-if="searchQuery.trim() !== '' && !exactMatchExists" class="dropdown-item border-bottom cursor-pointer py-2 quick-add-btn" @click="handleQuickAdd">
        <div class="d-flex align-items-center">
          <i class="bi bi-plus-circle me-2 fs-6"></i>
          <span>Thêm mới: <strong class="fst-italic">"{{ searchQuery }}"</strong></span>
        </div>
      </li>

      <li
        v-for="item in filteredItems"
        :key="item.id"
        class="dropdown-item cursor-pointer d-flex justify-content-between align-items-center py-2 dropdown-item-custom"
        :class="{ 'active-item': item.id === modelValue }"
        @click="selectItem(item)"
      >
        <span>{{ item[labelKey] }}</span>
        <i v-if="item.id === modelValue" class="bi bi-check2"></i>
      </li>

      <li v-if="filteredItems.length === 0 && searchQuery.trim() === ''" class="dropdown-item text-muted text-center py-3 small">
        Chưa có dữ liệu
      </li>
    </ul>

    <div v-if="showModal" class="custom-modal-overlay" tabindex="-1">
      <div class="custom-modal-content quick-edit-modal shadow-lg">
        <div class="custom-modal-header d-flex justify-content-between align-items-center">
          <h6 class="m-0 fw-bold text-uppercase" style="color: #5a4031;"><i class="bi bi-plus-lg me-1"></i> Thêm Nhanh {{ title }}</h6>
          <button type="button" class="btn-close shadow-none" @click="closeModal" style="font-size: 12px;"></button>
        </div>
        <div class="modal-body py-4 px-4 bg-white">
          <div class="mb-3">
            <label class="form-label fw-bold small text-muted">Tên {{ title }} <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control custom-input w-100" 
              v-model="quickForm.ten"
              :placeholder="'Nhập tên ' + title.toLowerCase() + '...'"
            />
          </div>

          <div class="mb-1">
            <label class="form-label fw-bold small text-muted d-block mb-2">Trạng thái</label>
            <div>
              <span class="badge px-3 py-2 rounded-pill fw-medium" style="background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;">
                <i class="bi bi-circle-fill me-1" style="font-size: 8px;"></i> Đang kinh doanh
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer bg-light border-top-0 px-4 py-3 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light border rounded-pill px-4" @click="closeModal">Hủy bỏ</button>
          <button type="button" class="btn btn-hoan-tat px-4 rounded-pill" @click="submitQuickAdd">Xác nhận thêm</button>
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

const emit = defineEmits(['update:modelValue', 'refresh', 'input', 'toast']);

const isOpen = ref(false);
const showModal = ref(false);
const searchQuery = ref('');

const quickForm = reactive({ ten: '' });

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

watch(() => props.modelValue, (newVal) => {
  const selectedItem = props.items.find(i => i.id === newVal);
  searchQuery.value = selectedItem ? selectedItem[props.labelKey] : '';
}, { immediate: true });

// 🌟 ĐÃ SỬA: Sắp xếp mảng để thằng ID to nhất (mới nhất) lên đầu tiên
const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => b.id - a.id);
});

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return sortedItems.value;
  return sortedItems.value.filter(item => {
    const text = (item[props.labelKey] || '').toLowerCase();
    return text.includes(query);
  });
});

// 🌟 THÊM MỚI: Check xem từ khóa gõ vào đã khớp y chang thằng nào trong list chưa
const exactMatchExists = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return false;
  return props.items.some(item => (item[props.labelKey] || '').toLowerCase() === query);
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
  quickForm.ten = searchQuery.value;
  showModal.value = true;
  isOpen.value = false;
};

const closeModal = () => { showModal.value = false; };

const submitQuickAdd = async () => {
  if (!quickForm.ten.trim()) {
    return emit('toast', `Vui lòng không để trống tên ${props.title.toLowerCase()}!`, "danger");
  }

  const randomCode = `${props.title.charAt(0).toUpperCase()}_${Date.now().toString().slice(-4)}`;

  const payload = {
    [props.labelKey]: quickForm.ten.trim(),
    [codeKey.value]: randomCode, 
    trangThai: 1 
  };

  try {
    const res = await axios.post(props.apiEndpoint, payload);
    emit('toast', `Thêm nhanh ${props.title} thành công!`, "success");
    
    emit('refresh'); 
    emit('update:modelValue', res.data.id); 
    searchQuery.value = res.data[props.labelKey];
    
    showModal.value = false;
  } catch (err) {
    const serverMessage = err.response?.data;
    if (serverMessage && typeof serverMessage === 'string') {
      emit('toast', serverMessage, "danger");
    } else {
      emit('toast', `Không thể thêm nhanh ${props.title}. Vui lòng kiểm tra lại hệ thống Backend!`, "danger");
    }
  }
};

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
.cursor-pointer { cursor: pointer; }
.rotate-180 { transform: rotate(180deg); }

/* CSS NÚT THÊM NHANH LÀM MỀM HƠN */
.quick-add-btn { 
  background-color: #fdfaf8; 
  color: #8c6b5d; 
  transition: all 0.2s ease;
  font-size: 13.5px;
}
.quick-add-btn:hover { 
  background-color: #f7ede6; 
  color: #5a4031; 
}

/* CSS DANH SÁCH DROPDOWN */
.active-item { 
  background-color: #f7ede6 !important; 
  color: #5a4031 !important; 
  font-weight: bold;
}
.dropdown-item-custom {
  padding: 8px 16px;
  font-size: 13.5px;
  color: #495057;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s;
}
.dropdown-item-custom:hover { 
  background-color: #fdfaf8; 
  color: #5a4031; 
}

/* INPUT CƠ BẢN */
.select-thong-minh { width: 100%; }
.select-thong-minh input { 
  border: 1px solid #dee2e6; 
  border-radius: 6px !important; 
  font-size: 13.5px !important; 
  padding: 8px 12px !important; 
  color: #333; 
  width: 100%; 
  height: 38px !important; 
}
.select-thong-minh input:focus { 
  border-color: #cbb3a1 !important; 
  box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25) !important; 
  outline: none; 
}
.icon-wrapper { height: 100%; display: flex; align-items: center; top: 0; pointer-events: none; z-index: 10; }
.small-icon { font-size: 11px !important; color: #6c757d !important; display: block; transition: transform 0.2s; }
.dropdown-menu { margin-top: 4px; padding: 0; overflow: hidden; }

/* MODAL THÊM NHANH */
.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(2px); }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); animation: slideDown 0.2s ease-out; }
.quick-edit-modal { width: 420px; }
.custom-modal-header { background-color: #f8ece3; padding: 14px 20px; border-bottom: 1px solid #eef0f2; border-top: 4px solid #5a4031; }
.btn-hoan-tat { background-color: #5a4031; color: white; border: none; font-weight: 500; font-size: 13.5px; transition: all 0.2s; }
.btn-hoan-tat:hover { background-color: #4a3427; color: white; }

@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>