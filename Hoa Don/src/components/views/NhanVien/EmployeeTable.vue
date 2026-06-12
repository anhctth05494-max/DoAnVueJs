<template>
  <div class="employee-management-wrapper">
   
  <div class="independent-filter-card">
    <div class="filter-card-header mb-3">
      <i class="bi bi-funnel text-dark me-2 fs-5"></i>
      <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm</h6>
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label text-muted small mb-1">Tìm kiếm nhân viên</label>
        <div class="search-input-wrapper">
          <span class="search-icon-inside"><i class="bi bi-search"></i></span>
          <input 
            v-model="filters.searchKeyword" 
            class="form-select rounded-pill shadow-none border-secondary-subtle text-muted" 
            placeholder="Tìm theo mã, tên, SĐT, Email..." 
            @input="handleSearchInput" 
          />
        </div>
      </div>

      <div class="col-md-4">
        <label class="form-label text-muted small mb-1">Chức vụ</label>
        <select v-model="filters.chucVu" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted" @change="handleFilter">
          <option value="">Tất cả chức vụ</option>
          <option value="Quản lý">Quản lý</option>
          <option value="Nhân viên">Nhân viên</option>
        </select>
      </div>
      
      <div class="col-md-4">
        <label class="form-label text-muted small mb-1">Trạng thái</label>
        <select v-model="filters.trangThai" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted" @change="handleFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="1">Còn làm</option>
          <option value="0">Đã nghỉ</option>
        </select>
      </div>
    </div>

    <div class="d-flex justify-content-end align-items-center gap-2 mt-4">
      <button class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2" @click="clearFilter">
        <i class="bi bi-arrow-clockwise"></i> Đặt lại
      </button>
      <button class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2" @click="handleExportExcel" :disabled="loading">
        <i class="bi bi-file-earmark-excel"></i> Xuất Excel
      </button>
      <button class="btn rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
            style="background-color: #dccbc0; color: #5a4031" @click="$router.push('/nhan-vien/add')">
        + Tạo mới
      </button>
    </div>
  </div>

    <div class="card border-0 shadow-sm rounded-3 mt-4">
  <div class="card-body p-4">
    <div v-if="loading" class="text-center my-4">Đang tải dữ liệu...</div>
    
    <div v-else>
      <div class="table-responsive">
        <table class="table table-hover table-sm align-middle text-nowrap text-center small">
          <thead>
            <tr>
              <th class="py-3 px-3 border-0 rounded-start fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 60px;">
                #
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 80px;">
                ẢNH
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                TÀI KHOẢN
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                HỌ TÊN
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                SĐT
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                EMAIL
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                ĐỊA CHỈ
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                CHỨC VỤ
              </th>
              <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                TRẠNG THÁI
              </th>
              <th class="py-3 px-3 border-0 rounded-end fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 120px;">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>
          <tbody class="border-top-0 text-secondary">
            <tr v-for="(emp, index) in employees" :key="emp.id">
              <td class="py-3 px-3">{{ currentPage * pageSize + index + 1 }}</td>
              
              <td class="py-3 px-3">
                <img :src="emp.anh_dai_dien || 'https://www.svgrepo.com/show/507442/user-circle.svg'" class="rounded-circle employee-avatar mx-auto" />
              </td>
              
              <td class="py-3 px-3 text-dark">{{ emp.ten_tai_khoan }}</td>
              <td class="py-3 px-3 text-dark fw-medium">{{ emp.ho_ten }}</td>
              <td class="py-3 px-3">{{ emp.so_dien_thoai }}</td>
              <td class="py-3 px-3 text-lowercase">{{ emp.email }}</td>
              <td class="py-3 px-3 text-lowercase">
                <div style="max-width: 250px; white-space: normal; word-break: break-word; text-align: left; margin: 0 auto;">
                  {{ emp.dia_chi }}
                </div>
              </td>
              <td class="py-3 px-3">
                <span class="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-normal">
                  {{ emp.chuc_vu }}
                </span>
              </td>
              
              <td class="py-3 px-3">
                <span v-if="emp.trang_thai === 1" class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-normal">
                  Còn làm
                </span>
                <span v-else class="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill fw-normal">
                  Đã nghỉ
                </span>
              </td>
              
              <td class="py-3 px-3">
                <div class="d-flex justify-content-center gap-3 align-items-center">
                  <div class="form-check form-switch mb-0" title="Bật/Tắt trạng thái">
                    <input
                      class="form-check-input shadow-none custom-switch"
                      type="checkbox"
                      role="switch"
                      :checked="emp.trang_thai === 1"
                      @change="handleToggleStatus(emp)"
                      style="cursor: pointer"
                    />
                  </div>
                  
                  <span class="bi bi-eye fs-5 text-primary"
                      style="cursor: pointer"
                      title="Xem chi tiết" @click="$router.push(`/nhan-vien/edit/${emp.id}`)">
            
                  </span>
                </div>
              </td>
            </tr>
            
            <tr v-if="employees.length === 0">
              <td colspan="9" class="text-center py-5 text-danger fw-medium">
                Không tìm thấy nhân viên nào phù hợp với bộ lọc.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalElements > 0" class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small flex-wrap gap-3">
        <div>
          Hiển thị <span class="fw-bold text-dark">{{ employees.length }}</span> /
          <span class="fw-bold text-dark">{{ totalElements }}</span> bản ghi
        </div>

        <div class="d-flex gap-1 align-items-center">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 0"
            class="btn btn-sm btn-light border shadow-none px-2 rounded"
          >
            &lt;
          </button>
          
          <button
            v-for="pageIdx in totalPages"
            :key="pageIdx"
            @click="changePage(pageIdx - 1)"
            class="btn btn-sm shadow-none px-3 rounded fw-medium"
            :class="currentPage === (pageIdx - 1) ? 'btn-secondary text-white' : 'btn-light border text-muted'"
            :style="currentPage === (pageIdx - 1) ? 'background-color: #8c6b5d; border-color: #8c6b5d;' : ''"
          >
            {{ pageIdx }}
          </button>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages - 1"
            class="btn btn-sm btn-light border shadow-none px-2 rounded"
          >
            &gt;
          </button>
        </div>

        <div class="d-flex align-items-center gap-2">
          <select
            v-model="pageSize"
            @change="handleSizeChange"
            class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted pe-4"
            style="width: auto"
          >
            <option :value="5">Hiển thị 5 bản ghi / trang</option>
            <option :value="10">Hiển thị 10 bản ghi / trang</option>
            <option :value="20">Hiển thị 20 bản ghi / trang</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</div>

  </div>
<div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin-top: 20px;">
      <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3" 
           :style="toast.type === 'success' ? 'background-color: #f4fbf7; border-left: 4px solid #2e7d32 !important;' : 'background-color: #fff5f5; border-left: 4px solid #ef4444 !important.'">
        <div class="d-flex align-items-center gap-2 px-2 py-1">
          <i class="bi fs-5" :class="toast.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'"></i>
          <span class="fw-medium small text-dark">{{ toast.message }}</span>
        </div>
      </div>
    </div>

    <div v-if="confirmModal.show" class="custom-modal-overlay" @click.self="confirmModal.show = false">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 450px;">
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
          <h6 class="mb-0 fw-bold text-dark">{{ confirmModal.title }}</h6>
          <i class="bi bi-x-lg cursor-pointer text-muted fs-6" @click="confirmModal.show = false"></i>
        </div>
        <div class="p-4 bg-white text-secondary small">
          {{ confirmModal.message }}
        </div>
        <div class="p-3 border-top d-flex justify-content-end gap-2 bg-light">
          <button class="btn btn-outline-secondary btn-sm px-4 rounded-pill shadow-none" @click="confirmModal.show = false">Hủy</button>
          <button class="btn btn-brown btn-sm px-4 rounded-pill shadow-none" @click="confirmModal.onConfirm">Xác nhận</button>
        </div>
      </div>
    </div>
    <Teleport to="body" v-if="confirmModal.show">
      <div class="confirm-overlay">
        <div class="confirm-modal-card">
          <div class="confirm-icon-area">
            <i class="bi bi-person-fill-gear"></i>
          </div>
          <h5 class="confirm-title">{{ confirmModal.title }}</h5>
          <p class="confirm-message">
            {{ confirmModal.message }}
          </p>
          <div class="confirm-actions">
            <button @click="confirmModal.show = false" class="btn-cancel-custom">
              Hủy bỏ
            </button>
            <button @click="confirmModal.onConfirm" class="btn-confirm-custom">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
const toast = reactive({ show: false, message: '', type: 'success' });
const confirmModal = reactive({ show: false, title: '', message: '', onConfirm: null });

const showToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3000);
};

const employees = ref([]);
const loading = ref(true);
const showModal = ref(false);
const fileInput = ref(null);

const isEditMode = ref(false);
const editingEmployeeId = ref(null);

const currentPage = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const pageSize = ref(5);
const filters = reactive({ hoTen: '', contact: '',chucVu: '', trangThai: '', searchKeyword: '' });

const form = ref({
  ho_ten: '', ten_tai_khoan: '', email: '', chuc_vu: '', ngay_sinh: '', so_dien_thoai: '', gioi_tinh: 1, tai_khoan: '', mat_khau: '', anh_dai_dien: '', trang_thai: 1
});

const addressParts = ref({ tinh: '', phuong: '', chi_tiet: '' });

// 🌟 ĐỐI TƯỢNG LƯU TRỮ LỖI ĐỂ HIỂN THỊ LÊN GIAO DIỆN
const errors = reactive({
  ho_ten: '',
  ma_nhan_vien: '',
  email: '',
  chuc_vu: '',
  ngay_sinh: '',
  so_dien_thoai: '',
  tai_khoan: '',
  mat_khau: '',
  dia_chi: ''
});

// Hàm dọn sạch thông báo lỗi cũ
const clearErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '');
};
const handleExportExcel = async () => {
  try {
    // Giữ nguyên bộ lọc hiện tại của người dùng để xuất đúng dữ liệu đang tìm kiếm
    const params = {};
    if (filters.chucVu) params.chucVu = filters.chucVu;
    if (filters.trangThai !== '') params.trangThai = filters.trangThai;
    if (filters.searchKeyword) params.searchKeyword = filters.searchKeyword.trim();

    alert('Hệ thống đang chuẩn bị tệp Excel, vui lòng đợi trong giây lát...');

    // Gọi API xuất file với cấu hình responseType là 'blob' bắt buộc
    const response = await axios.get('http://localhost:8080/api/employees/export', {
      params,
      responseType: 'blob' 
    });

    // Tạo link tải file ảo từ Blob nhận được từ Spring Boot
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Đặt tên file khi tải về máy kèm thời gian hiện tại
    const dateStr = new Date().toISOString().slice(0,10);
    link.setAttribute('download', `Danh_Sach_Nhan_Vien_${dateStr}.xlsx`);
    
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp bộ nhớ sau khi tải xong
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Lỗi khi xuất tệp Excel:', error);
    alert('Không thể xuất file Excel. Vui lòng kiểm tra lại kết nối API Backend!');
  }
};
// 🌟 HÀM CHECK VALIDATION (LOGIC CHÍNH)
const validateForm = () => {
  clearErrors();
  let isValid = true;

  // 1. Kiểm tra Họ và tên
  if (!form.value.ho_ten || form.value.ho_ten.trim() === '') {
    errors.ho_ten = 'Họ và tên bắt buộc phải nhập.';
    isValid = false;
  } else if (form.value.ho_ten.trim().length < 2) {
    errors.ho_ten = 'Họ và tên phải chứa ít nhất 2 ký tự.';
    isValid = false;
  }

  // 2. Kiểm tra Mã nhân viên
  const codeRegex = /^[a-zA-Z0-9]+$/;
  if (!form.value.ma_nhan_vien || form.value.ma_nhan_vien.trim() === '') {
    errors.ma_nhan_vien = 'Mã nhân viên không được để trống.';
    isValid = false;
  } else if (!codeRegex.test(form.value.ma_nhan_vien)) {
    errors.ma_nhan_vien = 'Mã nhân viên chỉ được chứa chữ cái và số (không khoảng trắng, không dấu).';
    isValid = false;
  }

  // 3. Kiểm tra Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email || form.value.email.trim() === '') {
    errors.email = 'Email không được để trống.';
    isValid = false;
  } else if (!emailRegex.test(form.value.email)) {
    errors.email = 'Định dạng Email không hợp lệ (Ví dụ: abc@gmail.com).';
    isValid = false;
  }

  // 4. Kiểm tra Chức vụ
  if (!form.value.chuc_vu) {
    errors.chuc_vu = 'Vui lòng chọn một chức vụ phù hợp.';
    isValid = false;
  }

  // 5. Kiểm tra Ngày sinh
  if (!form.value.ngay_sinh) {
    errors.ngay_sinh = 'Vui lòng chọn ngày sinh.';
    isValid = false;
  } else {
    const birthDate = new Date(form.value.ngay_sinh);
    const today = new Date();
    if (birthDate > today) {
      errors.ngay_sinh = 'Ngày sinh không thể nằm ở tương lai.';
      isValid = false;
    }
  }

  // 6. Kiểm tra Số điện thoại (Đầu số VN quy chuẩn)
  const phoneRegex = /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/;
  if (!form.value.so_dien_thoai || form.value.so_dien_thoai.trim() === '') {
    errors.so_dien_thoai = 'Số điện thoại bắt buộc phải nhập.';
    isValid = false;
  } else if (!phoneRegex.test(form.value.so_dien_thoai.trim())) {
    errors.so_dien_thoai = 'Số điện thoại không đúng định dạng Việt Nam (phải gồm 10 số).';
    isValid = false;
  }

  // 7. Kiểm tra Tài khoản
  if (!form.value.tai_khoan || form.value.tai_khoan.trim() === '') {
    errors.tai_khoan = 'Tài khoản đăng nhập không được để trống.';
    isValid = false;
  }

  // 8. Kiểm tra Mật khẩu
  if (!form.value.mat_khau || form.value.mat_khau.length < 8) {
    errors.mat_khau = 'Mật khẩu phải chứa ít nhất 8 ký tự để đảm bảo bảo mật.';
    isValid = false;
  }

  // 9. Kiểm tra Cụm địa chỉ
  if (!addressParts.value.tinh || !addressParts.value.phuong || !addressParts.value.chi_tiet.trim()) {
    errors.dia_chi = 'Vui lòng điền và chọn đầy đủ Tỉnh/Thành, Phường/Xã và Số nhà chi tiết.';
    isValid = false;
  }

  return isValid;
};

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value // Gửi số lượng dòng (5/10/20) trực tiếp sang Spring Boot
    };
    if (filters.hoTen) params.hoTen = filters.hoTen.trim();
    if (filters.contact) params.contact = filters.contact.trim();
    if (filters.email) params.email = filters.email;
    if (filters.chucVu) params.chucVu = filters.chucVu;
    if (filters.trangThai !== '') params.trangThai = filters.trangThai;
    if (filters.searchKeyword) params.searchKeyword = filters.searchKeyword.trim();

    const response = await axios.get('http://localhost:8080/api/employees', { params });
    employees.value = response.data.content.map(emp => ({ ...emp, showPassword: false }));
    totalPages.value = response.data.totalPages;
    totalElements.value = response.data.totalElements;
  } catch (error) {
    console.error('Lỗi tải dữ liệu:', error);
  } finally {
    loading.value = false;
  }
};

const changePage = (pageIdx) => {
  if (pageIdx >= 0 && pageIdx < totalPages.value) {
    currentPage.value = pageIdx;
    fetchEmployees();
  }
};
const handleFilter = () => { currentPage.value = 0; fetchEmployees(); };
const clearFilter = () => {
  filters.hoTen = ''; filters.contact = '';filters.chucVu = ''; filters.trangThai = ''; filters.searchKeyword = '';
  currentPage.value = 0; fetchEmployees();
};

const handleSizeChange = () => {
  currentPage.value = 0; // Đưa về trang gốc để tính toán lại tổng số trang mới
  fetchEmployees();      // Tải lại dữ liệu ngay lập tức
};

let searchTimeout;
const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => { currentPage.value = 0; fetchEmployees(); }, 300);
};

// const togglePassword = (emp) => { emp.showPassword = !emp.showPassword; };
const handleToggleStatus = (emp) => {
  const trạngTháiMới = emp.trang_thai === 1 ? 0 : 1;

  // Cấu hình thông tin hiển thị lên modal trùng khít form của sản phẩm
  confirmModal.title = 'Thay đổi trạng thái';
  confirmModal.message = `Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của nhân viên:\n[${emp.ma_nhan_vien || emp.id}] - ${emp.ho_ten} không?`;
  
  confirmModal.onConfirm = async () => {
    confirmModal.show = false; // Đóng modal ngay lập tức
    
    try {
      const updatedData = { ...emp, trang_thai: trạngTháiMới };
      await axios.put(`http://localhost:8080/api/employees/${emp.id}`, updatedData);
      
      // Cập nhật giá trị local để giao diện đổi màu badge ngay lập tức
      emp.trang_thai = trạngTháiMới; 
      
      showToast('Cập nhật trạng thái nhân viên thành công!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Không thể cập nhật trạng thái hoạt động!', 'danger');
    }
  };

  // Kích hoạt hiển thị modal lên body
  confirmModal.show = true;
};
// const openAddModal = () => {
//   isEditMode.value = false;
//   editingEmployeeId.value = null;
//   resetForm();
//   clearErrors();
//   showModal.value = true;
// };

// const openEditModal = (emp) => {
//   isEditMode.value = true;
//   editingEmployeeId.value = emp.id;
//   clearErrors();
//   let formattedDate = '';
//   if (emp.ngay_sinh) { formattedDate = emp.ngay_sinh.slice(0, 10); }

//   form.value = {
//     ho_ten: emp.ho_ten || '',
//     ma_nhan_vien: emp.ma_nhan_vien || '',
//     email: emp.email || '',
//     chuc_vu: emp.chuc_vu || '',
//     ngay_sinh: formattedDate,
//     so_dien_thoai: emp.so_dien_thoai || '',
//     gioi_tinh: emp.gioi_tinh || 1,
//     tai_khoan: emp.tai_khoan || emp.ma_nhan_vien || '', 
//     mat_khau: emp.mat_khau || '',
//     anh_dai_dien: emp.anh_dai_dien || '',
//     trang_thai: emp.trang_thai !== undefined ? emp.trang_thai : 1
//   };

//   if (emp.dia_chi) {
//     const parts = emp.dia_chi.split(', ');
//     addressParts.value = { chi_tiet: parts[0] || '', phuong: parts[1] || '', tinh: parts[2] || '' };
//   } else {
//     addressParts.value = { tinh: '', phuong: '', chi_tiet: '' };
//   }
//   showModal.value = true;
// };

// const closeModal = () => { showModal.value = false; resetForm(); };
// const triggerFileInput = () => { fileInput.value.click(); };

// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => { form.value.anh_dai_dien = e.target.result; };
//     reader.readAsDataURL(file);
//   }
// };

const resetForm = () => {
  form.value = { ho_ten: '', ma_nhan_vien: '', email: '', chuc_vu: '', ngay_sinh: '', so_dien_thoai: '', gioi_tinh: 1, tai_khoan: '', mat_khau: '', anh_dai_dien: '', trang_thai: 1 };
  addressParts.value = { tinh: '', phuong: '', chi_tiet: '' };
};

// // Hàm Submit được bảo vệ bởi lớp kiểm tra Validation
// const submitForm = async () => {
//   // 🌟 Chặn hoàn toàn không cho gửi đi nếu form phát sinh lỗi nhập liệu
//   if (!validateForm()) {
//     return; 
//   }

//   try {
//     const dia_chi_tong_hop = `${addressParts.value.chi_tiet.trim()}, ${addressParts.value.phuong}, ${addressParts.value.tinh}`;
//     const dataToSend = { ...form.value, dia_chi: dia_chi_tong_hop };

//     if (isEditMode.value) {
//       await axios.put(`http://localhost:8080/api/employees/${editingEmployeeId.value}`, dataToSend);
//       alert('Cập nhật thông tin nhân viên thành công!');
//     } else {
//       await axios.post('http://localhost:8080/api/employees', dataToSend);
//       alert('Thêm nhân viên mới thành công!');
//     }
//     closeModal();
//     fetchEmployees();
//   } catch (error) {
//     console.error(error);
//     alert('Lỗi khi lưu dữ liệu hoặc trùng mã nhân viên/tài khoản!');
//   }
// };

onMounted(() => { fetchEmployees(); });
</script>

<style scoped>
.btn-export-excel {
  background-color: #a3b899;
  color: #fff;
  font-weight: 600;
  border-radius: 12px;
  padding: 10px 20px;
  border: none;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.btn-export-excel:hover:not(:disabled) {
  background-color: #8fa385;
  box-shadow: 0 2px 4px rgba(143, 163, 133, 0.3);
}
.btn-export-excel:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}
.employee-management-wrapper { padding: 0; background-color: transparent; }
.independent-filter-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.filter-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-icon {
  font-size: 16px;
  color: #555;
}
.filter-title {
  font-size: 15px;
  color: #262626;
  font-weight: 600;
}

.filter-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 6px;
  display: block;
}

/* Ép các ô input và select bo tròn dài và có màu viền mảnh dịu mắt */
.rounded-pill-custom {
  border-radius: 50px !important;
  border: 1px solid #d9d9d9;
  padding: 8px 16px;
  font-size: 14px;
  color: #262626;
  height: 40px;
  background-color: #fff;
}
.rounded-pill-custom:focus {
  border-color: #beaa9e;
  box-shadow: 0 0 0 2px rgba(206, 185, 173, 0.2);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon-inside {
  position: absolute;
  left: 16px;
  color: #8c8c8c;
  font-size: 14px;
  pointer-events: none;
}

.btn-filter-submit {
  background-color: #fff;
  border: 1px solid #bda89b;
  color: #5d4037;
  font-weight: 500;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  white-space: nowrap; /* Giữ chữ trên một hàng, không bị xuống dòng */
}
.btn-filter-submit:hover {
  background-color: #fcfbf9;
}

/* Nút xóa bộ lọc */
.btn-filter-clear {
  background-color: #e4e4e7;
  color: #3f3f46;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  white-space: nowrap;
}
.btn-filter-clear:hover {
  background-color: #d4d4d8;
}

/* Nút thêm nhân viên tone màu nâu đất chủ đạo */
.btn-add-employee {
  background-color: #ceb9ad;
  color: #fff;
  font-weight: 600;
  border-radius: 12px;
  padding: 10px 20px;
  border: none;
  font-size: 14px;
  white-space: nowrap;
}
.btn-add-employee:hover {
  background-color: #beaa9e;
}
.btn-filter-clear-outline {
  background-color: #fff;
  border: 1px solid #434343;
  color: #434343;
  border-radius: 50px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  transition: all 0.2s ease;
}
.btn-filter-clear-outline:hover {
  background-color: #f5f5f5;
}

/* Nút Xuất Excel mượt mà */
.btn-export-excel-custom {
  background-color: #a3b899;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  transition: all 0.2s ease;
}
.btn-export-excel-custom:hover:not(:disabled) {
  background-color: #8fa385;
}

/* Nút Thêm nhân viên mới bo tròn màu tone pastel giống ảnh mẫu */
.btn-add-employee-custom {
  background-color: #d1c0b5; /* Màu nâu be nhạt tương đồng ảnh mẫu */
  color: #4a3b32;
  font-weight: 600;
  border-radius: 50px;
  padding: 8px 24px;
  border: none;
  font-size: 14px;
  height: 40px;
  transition: all 0.2s ease;
}
.btn-add-employee-custom:hover {
  background-color: #c5b2a6;
}
.table-container-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; }
.custom-table-header { background-color: #ded1ca !important; }
.custom-table-header th { background-color: transparent !important; color: #4e342e !important; font-weight: 600; font-size: 14px; padding: 16px 12px; border-bottom: none; }
.custom-table-row td { padding: 14px 12px; font-size: 14px; color: #4a4a4a; border-bottom: 1px solid #f1f1f1; }
.employee-avatar { width: 42px; height: 42px; object-fit: cover; }
.badge-status { padding:4px 7px; border-radius: 20px; font-size: 12px; font-weight: 500; display: inline-block; }
.bg-status-success { background-color: #d4eddd; color: #628c73; }
.bg-status-danger { background-color: #fee2e2; color: #ef4444; }
.password-text { letter-spacing: 2px; color: #666; }
.action-icons-wrap span { cursor: pointer; font-size: 18px; transition: opacity 0.2s; }
.action-icons-wrap span:hover { opacity: 0.6; }
.badge-chuc-vu {
  background-color: #f1f3f5;
  color: #6c757d;
  padding: 4px 14px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

/* Định dạng lại công tắc gạt Switch Bootstrap cho chuẩn tone xanh lục của ảnh mẫu */
.custom-switch {
  cursor: pointer;
  width: 2.2em !important;
  height: 1.1em !important;
}


/* Ép tiêu đề bảng chữ đậm, gọn gàng */
.custom-table-header th {
  font-size: 13px !important;
  letter-spacing: 0.5px;
}
.page-item-custom { display: inline-block; }
.page-num-link { background: transparent; border: none; color: #4a4a4a; width: 32px; height: 32px; border-radius: 6px; font-size: 14px; font-weight: 500; }
.active .page-num-link { background-color: #835f52 !important; color: #fff !important; }
.page-nav-link { background: #fff; border: 1px solid #e4e4e7; color: #a1a1aa; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.page-item-custom.disabled .page-nav-link { background: #f443360a; opacity: 0.4; cursor: not-allowed; }
.rounded-custom-select {
  border-radius: 8px !important;
  border: 1px solid #ceb9ad;
  padding: 2px 24px 2px 8px;
  font-size: 13px;
  color: #5d4037;
  background-color: #fff;
  cursor: pointer;
}

/* Nút bấm chuyển hướng mũi tên (< và >) */
.custom-page-btn {
  background-color: #fff !important;
  border: 1px solid #ceb9ad !important;
  color: #5d4037 !important;
  border-radius: 8px !important;
  padding: 6px 12px !important;
  font-weight: 600;
  transition: all 0.2s ease;
}
.custom-page-btn:hover:not(:disabled) {
  background-color: #fcfbf9 !important;
  border-color: #beaa9e !important;
}

/* Các nút số trang bình thường (1, 2, 3...) */
.custom-page-num {
  background-color: #fff !important;
  border: 1px solid #e2e8f0 !important;
  color: #4b5563 !important;
  border-radius: 8px !important;
  padding: 6px 12px !important;
  font-weight: 500;
  transition: all 0.2s ease;
}
.custom-page-num:hover {
  background-color: #f4f4f5 !important;
  color: #1f2937 !important;
}

/* Trạng thái trang đang được click chọn (Active - Nổi bật tone màu Nâu nhạt của bạn) */
.page-item.active .custom-page-num {
  background-color: #ceb9ad !important;
  border-color: #ceb9ad !important;
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(206, 185, 173, 0.3);
}

/* Khi nút bị khóa (Disabled) */
.page-item.disabled .custom-page-btn {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f4f4f5 !important;
  border-color: #e4e4e7 !important;
}
/* CSS CHI TIẾT CHO CÁC DÒNG THÔNG BÁO LỖI ĐỎ */
.error-msg-text {
  color: #dc3545;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  padding-left: 4px;
}

/* CSS MODAL WINDOW */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 1050; }
.custom-modal-card { background: #fff; width: 100%; max-width: 750px; padding: 30px; border-radius: 24px; max-height: 90vh; overflow-y: auto; }
.modal-header-title h2 { font-size: 20px; font-weight: 700; color: #5d4037; margin: 0; }
.icon-avatar-wrap { font-size: 22px; background: #efebe9; padding: 6px 10px; border-radius: 8px; }
.form-label-custom { font-weight: 600; font-size: 14px; color: #111; margin-bottom: 6px; }
.custom-input { border-radius: 12px !important; border: 1px solid #bda89b; padding: 10px 14px; font-size: 14px; }
.address-group-box { border: 1px solid #bda89b; border-radius: 14px; padding: 8px; background-color: #fff; }
.custom-input-sub { border: none !important; background: transparent; font-size: 14px; padding: 6px; }
.avatar-upload-box { width: 120px; height: 120px; border: 2px dashed #9e9e9e; border-radius: 16px; display: flex; justify-content: center; align-items: center; cursor: pointer; overflow: hidden; background: #fafafa; }
.plus-icon { font-size: 32px; color: #757575; }
.preview-uploaded-img { width: 100%; height: 100%; object-fit: cover; }
.camera-icon-badge { background: #9e9e9e; color: white; padding: 2px 10px; border-radius: 8px; font-size: 12px; }
.radio-container { font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.btn-action-submit { background-color: #ceb9ad; color: #fff; border: none; font-weight: bold; padding: 10px 24px; border-radius: 20px; cursor: pointer; }
.btn-action-cancel { background-color: #bdbdbd; color: white; border: none; font-weight: bold; padding: 10px 24px; border-radius: 20px; cursor: pointer; }
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(3px); /* Làm mờ nền phía sau */
}

.confirm-modal-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.25s ease-out; /* Tạo hiệu ứng mượt khi hiện */
}

.confirm-icon-area {
  font-size: 45px;
  color: #8a6d5b;
  margin-bottom: 15px;
}

.confirm-title {
  font-weight: 700;
  color: #5a4031;
  margin-bottom: 10px;
}

.confirm-message {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 25px;
  white-space: pre-line; /* Giúp các ký tự xuống dòng \n hoạt động chuẩn */
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel-custom {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel-custom:hover {
  background: #e2e8f0;
}

.btn-confirm-custom {
  background-color: #ebdcd0;
  color: #5a4031;
  border: 1px solid #cbb3a1;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-custom:hover {
  background-color: #dccbc0;
  transform: translateY(-1px);
}

/* Hiệu ứng phóng to nhẹ nhàng kết hợp hiện hình mờ đúng chuẩn mẫu sản phẩm */
@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.table tbody tr td {
  font-size: 0.84rem;
  padding-left: 2px !important;   /* Thu hẹp khoảng cách chiều ngang giữa các cột */
  padding-right: 8px !important;  /* Thu hẹp khoảng cách chiều ngang giữa các cột */
}
.table td:last-child, 
.table th:last-child {
  width: 100px !important; /* Khóa cứng độ rộng cột Hành động để không bị méo */
}
</style>