<template>
  <div class="employee-management-wrapper">
   
  <div class="independent-filter-card">
  <div class="row g-3 align-items-center">
    
    <div class="col-md-3">
      <input v-model="filters.searchKeyword" class="form-control rounded-pill-custom" placeholder="Tìm tên, SĐT, email..." @input="handleSearchInput" />
    </div>

    <div class="col-md-2">
      <select v-model="filters.chucVu" class="form-select rounded-pill-custom" @change="handleFilter">
        <option value="">Chọn chức vụ</option>
        <option value="Kho">Kho</option>
        <option value="Quản lý">Quản lý</option>
        <option value="Bán hàng">Bán hàng</option>
      </select>
    </div>
    
    <div class="col-md-2">
      <select v-model="filters.trangThai" class="form-select rounded-pill-custom" @change="handleFilter">
        <option value="">Chọn trạng thái</option>
        <option value="1">Còn làm</option>
        <option value="0">Đã nghỉ</option>
      </select>
    </div>
    
    <div class="col-md-5 d-flex justify-content-end align-items-center gap-2 ms-auto">
      <!-- <button class="btn btn-filter-submit" @click="handleFilter">Bộ lọc</button> -->
      <button class="btn btn-filter-clear" @click="clearFilter">Đặt lại</button>
      <button class="btn btn-export-excel" @click="handleExportExcel" :disabled="loading">
            📊 Xuất Excel
      </button>
      <button class="btn btn-add-employee" @click="$router.push('/employees/add')">+ Thêm nhân viên</button>
    </div>

  </div>
</div>

    <div class="table-container-card">
      <div v-if="loading" class="text-center my-4">Đang tải dữ liệu...</div>
      
      <div v-else>
        <table class="table align-middle mb-0 text-center"> <thead class="custom-table-header">
        <tr>  
          <th scope="col" style="padding-left: 20px; width: 60px;">STT</th>
          <th scope="col" style="width: 80px;">Ảnh</th>
          <th scope="col">Tên tài khoản</th>
          <th scope="col">Họ tên</th>
          <th scope="col">SĐT</th>
          <th scope="col">Email</th>
          <th scope="col" class="text-start" style="max-width: 250px;">Địa chỉ</th>
          <th scope="col">Chức vụ</th>
          <th scope="col">Trạng thái</th>
          <th scope="col" style="padding-right: 20px; width: 120px;">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(emp, index) in employees" :key="emp.id" class="custom-table-row">
          
          <td style="padding-left: 20px;" class="fw-medium text-secondary">
            {{ currentPage * pageSize + index + 1 }}
          </td>
          
          <td>
            <img :src="emp.anh_dai_dien || 'https://randomuser.me/api/portraits/lego/1.jpg'" class="rounded-circle employee-avatar mx-auto" />
          </td>
          
          <td class="text-secondary">{{ emp.ten_tai_khoan}}</td>
          
          <td class="fw-semibold text-dark">{{ emp.ho_ten }}</td>
          
          <td>{{ emp.so_dien_thoai }}</td>
          
          <td class="text-lowercase text-secondary">{{ emp.email }}</td>
          
          <td class="text-start text-wrap small" style="max-width: 250px; line-height: 1.4;">
            {{ emp.dia_chi || 'Chưa cập nhật' }}
          </td>
          
          <td>
            <span class="badge-chuc-vu">{{ emp.chuc_vu || 'Nhân viên' }}</span>
          </td>
          
          <td>
            <span v-if="emp.trang_thai === 1" class="badge-status bg-status-success">Còn làm</span>
            <span v-else class="badge-status bg-status-danger">Đã nghỉ</span>
          </td>
          
          <td style="padding-right: 20px;">
            <div class="d-flex align-items-center justify-content-center gap-2 action-icons-wrap">
              
              <div class="form-check form-switch mb-0">
                <input 
                  class="form-check-input custom-switch" 
                  type="checkbox" 
                  :checked="emp.trang_thai === 1" 
                  @change="handleToggleStatus(emp)"
                />
              </div>

              <!-- <span class="eye-btn" title="Xem mật khẩu" @click="togglePassword(emp)">👁️</span> -->
              
              <span class="edit-btn" title="Sửa chi tiết" @click="$router.push(`/employees/edit/${emp.id}`)">📝</span>
            </div>
          </td>

        </tr>
        <tr v-if="employees.length === 0">
          <td colspan="10" class="text-center text-muted py-5">Không tìm thấy nhân viên nào phù hợp.</td>
        </tr>
      </tbody>
    </table>

        <div class="d-flex justify-content-between align-items-center mt-4 p-3 border-top">
  
  <div class="d-flex align-items-center gap-2 text-muted small">
    <span>Hiển thị</span>
    <select v-model="pageSize" class="form-select form-select-sm rounded-custom-select" style="width: auto;" @change="handleSizeChange">
      <option :value="5">5</option>
      <option :value="10">10</option>
      <option :value="20">20</option>
    </select>
    <span>/ Tổng số {{ totalElements }} bản ghi</span>
  </div>

  <nav v-if="totalPages > 1">
    <ul class="pagination pagination-sm mb-0 align-items-center gap-1">
      
      <li class="page-item" :class="{ disabled: currentPage === 0 }">
        <button class="page-link custom-page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 0">
          &lt;
        </button>
      </li>

      <li v-for="pageIdx in totalPages" :key="pageIdx" class="page-item" :class="{ active: currentPage === (pageIdx - 1) }">
        <button class="page-link custom-page-num" @click="changePage(pageIdx - 1)">
          {{ pageIdx }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
        <button class="page-link custom-page-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages - 1">
          &gt;
        </button>
      </li>

    </ul>
  </nav>
</div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="custom-modal-card">
        <div class="modal-header-title d-flex align-items-center gap-2 mb-4">
          <div class="icon-avatar-wrap">👤</div>
          <h2>{{ isEditMode ? 'THÔNG TIN NHÂN VIÊN' : 'THÊM NHÂN VIÊN' }}</h2>
        </div>

        <form @submit.prevent="submitForm" novalidate>
          <div class="row g-3">

            <div class="col-md-8">
              <div class="row g-3">
                <div class="col-md-7">
                  <label class="form-label-custom">Họ và tên</label>
                  <input v-model="form.ho_ten" type="text" class="form-control custom-input" placeholder="Nhập họ và tên" />
                  <div v-if="errors.ho_ten" class="error-msg-text">{{ errors.ho_ten }}</div>
                </div>

                <div class="col-md-5">
                  <label class="form-label-custom">Mã nhân viên</label>
                  <input v-model="form.ma_nhan_vien" type="text" class="form-control custom-input" placeholder="Nhập mã nhân viên" :disabled="isEditMode" />
                  <div v-if="errors.ma_nhan_vien" class="error-msg-text">{{ errors.ma_nhan_vien }}</div>
                </div>

                <div class="col-md-12">
                  <label class="form-label-custom">Email</label>
                  <input v-model="form.email" type="email" class="form-control custom-input" placeholder="Nhập email" />
                  <div v-if="errors.email" class="error-msg-text">{{ errors.email }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label-custom">Chức vụ</label>
                  <select v-model="form.chuc_vu" class="form-select custom-input">
                    <option value="">Chọn chức vụ</option>
                    <option value="Kho">Kho</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Bán hàng">Bán hàng</option>
                  </select>
                  <div v-if="errors.chuc_vu" class="error-msg-text">{{ errors.chuc_vu }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label-custom">Ngày sinh</label>
                  <input v-model="form.ngay_sinh" type="date" class="form-control custom-input" />
                  <div v-if="errors.ngay_sinh" class="error-msg-text">{{ errors.ngay_sinh }}</div>
                </div>
              </div>
            </div>

            <div class="col-md-4 d-flex flex-column align-items-center justify-content-start pt-2">
              <label class="form-label-custom mb-2">Ảnh cá nhân</label>
              <div class="avatar-upload-box" @click="triggerFileInput">
                <img v-if="form.anh_dai_dien" :src="form.anh_dai_dien" class="preview-uploaded-img" />
                <span v-else class="plus-icon">+</span>
              </div>
              <!-- <div class="camera-icon-badge mt-2">📷</div> -->
              <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileChange" />
            </div>

            <div class="col-md-6">
              <label class="form-label-custom">Số điện thoại</label>
              <input v-model="form.so_dien_thoai" type="text" class="form-control custom-input" placeholder="Nhập số điện thoại" />
              <div v-if="errors.so_dien_thoai" class="error-msg-text">{{ errors.so_dien_thoai }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label-custom d-block mb-2">Giới tính</label>
              <div class="d-flex gap-4 pt-2">
                <label class="radio-container"><input type="radio" v-model="form.gioi_tinh" :value="1" name="gender" /> Nam</label>
                <label class="radio-container"><input type="radio" v-model="form.gioi_tinh" :value="2" name="gender" /> Nữ</label>
                <label class="radio-container"><input type="radio" v-model="form.gioi_tinh" :value="3" name="gender" /> Khác</label>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label-custom">Tài khoản</label>
              <input v-model="form.tai_khoan" type="text" class="form-control custom-input" placeholder="Nhập tài khoản" />
              <div v-if="errors.tai_khoan" class="error-msg-text">{{ errors.tai_khoan }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label-custom">Mật khẩu</label>
              <input v-model="form.mat_khau" type="password" class="form-control custom-input" placeholder="Nhập mật khẩu" />
              <div v-if="errors.mat_khau" class="error-msg-text">{{ errors.mat_khau }}</div>
            </div>

            <div class="col-md-12">
              <label class="form-label-custom">Trạng thái làm việc</label>
              <div class="d-flex gap-4 pt-2">
                <label class="radio-container"><input type="radio" v-model="form.trang_thai" :value="1" name="trangthai" /> Còn làm</label>
                <label class="radio-container"><input type="radio" v-model="form.trang_thai" :value="0" name="trangthai" /> Đã nghỉ</label>
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label-custom">Địa chỉ</label>
              <div class="address-group-box row g-2">
                <div class="col-md-4">
                  <select v-model="addressParts.tinh" class="form-select custom-input-sub">
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <select v-model="addressParts.phuong" class="form-select custom-input-sub">
                    <option value="">Chọn phường/xã</option>
                    <option value="ABC">ABC</option>
                    <option value="Phường Láng Hạ">Phường Láng Hạ</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <input v-model="addressParts.chi_tiet" type="text" class="form-control custom-input-sub" placeholder="Nhập địa chỉ chi tiết" />
                </div>
              </div>
              <div v-if="errors.dia_chi" class="error-msg-text">{{ errors.dia_chi }}</div>
            </div>

          </div>

          <div class="d-flex justify-content-center gap-3 mt-4">
            <button type="submit" class="btn-action-submit">
              {{ isEditMode ? '+ Cập nhật nhân viên' : '+ Thêm nhân viên' }}
            </button>
            <button type="button" class="btn-action-cancel" @click="closeModal">+ Hủy</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

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

const togglePassword = (emp) => { emp.showPassword = !emp.showPassword; };
const handleToggleStatus = async (emp) => {
  const trạngTháiMới = emp.trang_thai === 1 ? 0 : 1;
  try {
    // Tận dụng chính API cập nhật thông tin đã có của bạn
    const updatedData = { ...emp, trang_thai: trạngTháiMới };
    await axios.put(`http://localhost:8080/api/employees/${emp.id}`, updatedData);
    
    // Cập nhật local để giao diện đổi màu badge ngay lập tức mà không cần load lại toàn trang
    emp.trang_thai = trạngTháiMới; 
  } catch (error) {
    console.error(error);
    alert('Không thể cập nhật trạng thái hoạt động!');
  }
};
const openAddModal = () => {
  isEditMode.value = false;
  editingEmployeeId.value = null;
  resetForm();
  clearErrors();
  showModal.value = true;
};

const openEditModal = (emp) => {
  isEditMode.value = true;
  editingEmployeeId.value = emp.id;
  clearErrors();
  let formattedDate = '';
  if (emp.ngay_sinh) { formattedDate = emp.ngay_sinh.slice(0, 10); }

  form.value = {
    ho_ten: emp.ho_ten || '',
    ma_nhan_vien: emp.ma_nhan_vien || '',
    email: emp.email || '',
    chuc_vu: emp.chuc_vu || '',
    ngay_sinh: formattedDate,
    so_dien_thoai: emp.so_dien_thoai || '',
    gioi_tinh: emp.gioi_tinh || 1,
    tai_khoan: emp.tai_khoan || emp.ma_nhan_vien || '', 
    mat_khau: emp.mat_khau || '',
    anh_dai_dien: emp.anh_dai_dien || '',
    trang_thai: emp.trang_thai !== undefined ? emp.trang_thai : 1
  };

  if (emp.dia_chi) {
    const parts = emp.dia_chi.split(', ');
    addressParts.value = { chi_tiet: parts[0] || '', phuong: parts[1] || '', tinh: parts[2] || '' };
  } else {
    addressParts.value = { tinh: '', phuong: '', chi_tiet: '' };
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; resetForm(); };
const triggerFileInput = () => { fileInput.value.click(); };

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { form.value.anh_dai_dien = e.target.result; };
    reader.readAsDataURL(file);
  }
};

const resetForm = () => {
  form.value = { ho_ten: '', ma_nhan_vien: '', email: '', chuc_vu: '', ngay_sinh: '', so_dien_thoai: '', gioi_tinh: 1, tai_khoan: '', mat_khau: '', anh_dai_dien: '', trang_thai: 1 };
  addressParts.value = { tinh: '', phuong: '', chi_tiet: '' };
};

// Hàm Submit được bảo vệ bởi lớp kiểm tra Validation
const submitForm = async () => {
  // 🌟 Chặn hoàn toàn không cho gửi đi nếu form phát sinh lỗi nhập liệu
  if (!validateForm()) {
    return; 
  }

  try {
    const dia_chi_tong_hop = `${addressParts.value.chi_tiet.trim()}, ${addressParts.value.phuong}, ${addressParts.value.tinh}`;
    const dataToSend = { ...form.value, dia_chi: dia_chi_tong_hop };

    if (isEditMode.value) {
      await axios.put(`http://localhost:8080/api/employees/${editingEmployeeId.value}`, dataToSend);
      alert('Cập nhật thông tin nhân viên thành công!');
    } else {
      await axios.post('http://localhost:8080/api/employees', dataToSend);
      alert('Thêm nhân viên mới thành công!');
    }
    closeModal();
    fetchEmployees();
  } catch (error) {
    console.error(error);
    alert('Lỗi khi lưu dữ liệu hoặc trùng mã nhân viên/tài khoản!');
  }
};

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
.employee-management-wrapper { padding: 0 16px; background-color: transparent; }
.independent-filter-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px 24px;
  margin-bottom: 24px;
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
.custom-switch:checked {
  background-color: #10b981 !important; /* Xanh lục chuẩn mẫu hoạt động */
  border-color: #10b981 !important;
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
</style>