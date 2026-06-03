<template>
  <div class="employee-form-page">
    <div class="form-header-navigation d-flex justify-content-between align-items-center mb-4">
      <div class="page-title-wrap">
        <h2 class="main-title">
          <span>👤</span> {{ isEditMode ? 'CẬP NHẬT THÔNG TIN NHÂN VIÊN' : 'THÊM MỚI NHÂN VIÊN' }}
        </h2>
        <p class="sub-title-text">Vui lòng điền đầy đủ các thông tin dưới đây.</p>
      </div>
      <button type="button" class="btn-back-list" @click="$router.push('/employees')">
        ← Quay lại danh sách
      </button>
    </div>

    <div class="form-content-card shadow-sm">
      <form @submit.prevent="submitForm" novalidate>
        
        <div class="avatar-section-wrapper text-center mb-4">
          <div class="avatar-circle-box mx-auto" @click="triggerFileInput">
            <img v-if="form.anh_dai_dien" :src="form.anh_dai_dien" class="preview-img" />
            <div v-else class="upload-placeholder">
              <span class="plus-text">NV</span>
            </div>
          </div>
          <p class="avatar-format-note mt-2">PNG, JPG, JPEG - tối đa 5MB.</p>
          <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileChange" />
        </div>

        <div class="row g-3">
          
          <div class="col-md-6">
            <label class="form-label-custom">Mã nhân viên</label>
            <input v-model="form.ma_nhan_vien" type="text" class="form-control custom-input" placeholder="Nhập mã nhân viên" :disabled="isEditMode" />
            <div v-if="errors.ma_nhan_vien" class="error-msg-text">{{ errors.ma_nhan_vien }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Chức vụ</label>
            <select v-model="form.chuc_vu" class="form-select custom-input">
              <option value="">-- Chọn chức vụ --</option>
              <option value="Kho">Kho</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Bán hàng">Bán hàng</option>
            </select>
            <div v-if="errors.chuc_vu" class="error-msg-text">{{ errors.chuc_vu }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Tên nhân viên</label>
            <input v-model="form.ho_ten" type="text" class="form-control custom-input active-input-style" placeholder="Nhập tên nhân viên" />
            <div v-if="errors.ho_ten" class="error-msg-text">{{ errors.ho_ten }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Giới tính</label>
            <div class="gender-radio-group custom-input d-flex align-items-center gap-3">
              <label class="radio-container"><input type="radio" v-model="form.gioi_tinh" :value="1" name="gender" /> Nam</label>
              <label class="radio-container"><input type="radio" v-model="form.gioi_tinh" :value="0" name="gender" /> Nữ</label>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Số điện thoại</label>
            <input v-model="form.so_dien_thoai" type="text" class="form-control custom-input" placeholder="VD: 0912345678" />
            <div v-if="errors.so_dien_thoai" class="error-msg-text">{{ errors.so_dien_thoai }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Email</label>
            <input v-model="form.email" type="email" class="form-control custom-input" placeholder="VD: abc@gmail.com" />
            <div v-if="errors.email" class="error-msg-text">{{ errors.email }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Ngày sinh</label>
            <div class="input-group">
              <input v-model="form.ngay_sinh" type="date" class="form-control custom-input" placeholder="dd/mm/yyyy" />
            </div>
            <div v-if="errors.ngay_sinh" class="error-msg-text">{{ errors.ngay_sinh }}</div>
          </div>

          <div class="col-md-6">
  <label class="form-label-custom">Tỉnh/Thành phố</label>
  <select v-model="addressParts.tinh" class="form-select custom-input" @change="handleTinhChange">
    <option value="">-- Chọn Tỉnh/Thành phố --</option>
    <option value="Hà Nội">Hà Nội</option>
    <option value="TP.HCM">TP.HCM</option>
  </select>
</div>

<div class="col-md-6">
  <label class="form-label-custom">Chọn Quận/Huyện</label>
  <select v-model="addressParts.phuong" class="form-select custom-input">
    
    <template v-if="!addressParts.tinh">
      <option value="">-- Vui lòng chọn Tỉnh/Thành phố trước --</option>
    </template>

    <template v-else-if="addressParts.tinh === 'Hà Nội'">
  <option value="">-- Chọn Quận/Huyện/Thị xã tại Hà Nội --</option>
  <option value="Quận Ba Đình">Quận Ba Đình</option>
  <option value="Quận Bắc Từ Liêm">Quận Bắc Từ Liêm</option>
  <option value="Quận Cầu Giấy">Quận Cầu Giấy</option>
  <option value="Quận Đống Đa">Quận Đống Đa</option>
  <option value="Quận Hà Đông">Quận Hà Đông</option>
  <option value="Quận Hai Bà Trưng">Quận Hai Bà Trưng</option>
  <option value="Quận Hoàn Kiếm">Quận Hoàn Kiếm</option>
  <option value="Quận Hoàng Mai">Quận Hoàng Mai</option>
  <option value="Quận Long Biên">Quận Long Biên</option>
  <option value="Quận Nam Từ Liêm">Quận Nam Từ Liêm</option>
  <option value="Quận Tây Hồ">Quận Tây Hồ</option>
  <option value="Quận Thanh Xuân">Quận Thanh Xuân</option>
  <option value="Thị xã Sơn Tây">Thị xã Sơn Tây</option>
  <option value="Huyện Ba Vì">Huyện Ba Vì</option>
  <option value="Huyện Chương Mỹ">Huyện Chương Mỹ</option>
  <option value="Huyện Đan Phượng">Huyện Đan Phượng</option>
  <option value="Huyện Đông Anh">Huyện Đông Anh</option>
  <option value="Huyện Gia Lâm">Huyện Gia Lâm</option>
  <option value="Huyện Hoài Đức">Huyện Hoài Đức</option>
  <option value="Huyện Mê Linh">Huyện Mê Linh</option>
  <option value="Huyện Mỹ Đức">Huyện Mỹ Đức</option>
  <option value="Huyện Phú Xuyên">Huyện Phú Xuyên</option>
  <option value="Huyện Phúc Thọ">Huyện Phúc Thọ</option>
  <option value="Huyện Quốc Oai">Huyện Quốc Oai</option>
  <option value="Huyện Sóc Sơn">Huyện Sóc Sơn</option>
  <option value="Huyện Thạch Thất">Huyện Thạch Thất</option>
  <option value="Huyện Thanh Oai">Huyện Thanh Oai</option>
  <option value="Huyện Thanh Trì">Huyện Thanh Trì</option>
  <option value="Huyện Thường Tín">Huyện Thường Tín</option>
  <option value="Huyện Ứng Hòa">Huyện Ứng Hòa</option>
</template>

<template v-else-if="addressParts.tinh === 'TP.HCM'">
  <option value="">-- Chọn Quận/Huyện/Thành phố tại TP.HCM --</option>
  <option value="Thành phố Thủ Đức">Thành phố Thủ Đức</option>
  <option value="Quận 1">Quận 1</option>
  <option value="Quận 3">Quận 3</option>
  <option value="Quận 4">Quận 4</option>
  <option value="Quận 5">Quận 5</option>
  <option value="Quận 6">Quận 6</option>
  <option value="Quận 7">Quận 7</option>
  <option value="Quận 8">Quận 8</option>
  <option value="Quận 10">Quận 10</option>
  <option value="Quận 11">Quận 11</option>
  <option value="Quận 12">Quận 12</option>
  <option value="Quận Bình Tân">Quận Bình Tân</option>
  <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
  <option value="Quận Gò Vấp">Quận Gò Vấp</option>
  <option value="Quận Phú Nhuận">Quận Phú Nhuận</option>
  <option value="Quận Tân Bình">Quận Tân Bình</option>
  <option value="Quận Tân Phú">Quận Tân Phú</option>
  <option value="Huyện Bình Chánh">Huyện Bình Chánh</option>
  <option value="Huyện Cần Giờ">Huyện Cần Giờ</option>
  <option value="Huyện Củ Chi">Huyện Củ Chi</option>
  <option value="Huyện Hóc Môn">Huyện Hóc Môn</option>
  <option value="Huyện Nhà Bè">Huyện Nhà Bè</option>
</template>

  </select>
</div>

          <div class="col-md-6">
            <label class="form-label-custom">Tên đường</label>
            <input v-model="addressParts.chi_tiet" type="text" class="form-control custom-input" placeholder="Số nhà, tên đường..." />
            <div v-if="errors.dia_chi" class="error-msg-text">{{ errors.dia_chi }}</div>
          </div>

          <div class="col-md-6">

            <label class="form-label-custom">Tài khoản</label>

            <input v-model="form.ten_tai_khoan" type="text" class="form-control custom-input" placeholder="Nhập tài khoản đăng nhập" />

            <div v-if="errors.ten_tai_khoan" class="error-msg-text">{{ errors.ten_tai_khoan }}</div>

          </div>



          <div class="col-md-6">

            <label class="form-label-custom">Mật khẩu</label>

            <input v-model="form.mat_khau" type="password" class="form-control custom-input" placeholder="Nhập mật khẩu" />

            <div v-if="errors.mat_khau" class="error-msg-text">{{ errors.mat_khau }}</div>

          </div>

        </div>

        <p class="text-muted italic-note mt-3">Vui lòng điền đầy đủ các thông tin.</p>

        <div class="d-flex justify-content-end align-items-center gap-2 mt-4">
          <button type="button" class="btn-cancel-flat" @click="$router.push('/employees')">Hủy</button>
          <button type="submit" class="btn-submit-blue">Lưu nhân viên</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const isEditMode = ref(false);
const fileInput = ref(null);

const form = ref({
  ho_ten: '', ma_nhan_vien: '', email: '', chuc_vu: '', ngay_sinh: '', so_dien_thoai: '', gioi_tinh: 1, ten_tai_khoan: '', mat_khau: '', anh_dai_dien: '', trang_thai: 1
});

const addressParts = ref({ tinh: '', phuong: '', chi_tiet: '' });

const handleTinhChange = () => {
  // Ngay khi Tỉnh/Thành phố thay đổi -> Ép ô Phường quay về giá trị trống "" ban đầu
  addressParts.value.phuong = '';
}; 
const errors = reactive({
  ho_ten: '', ma_nhan_vien: '', email: '', chuc_vu: '', ngay_sinh: '', so_dien_thoai: '', ten_tai_khoan: '', mat_khau: '', dia_chi: ''
});

const clearErrors = () => { Object.keys(errors).forEach(key => errors[key] = ''); };

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!form.value.ho_ten || form.value.ho_ten.trim() === '') { errors.ho_ten = 'Họ và tên bắt buộc phải nhập.'; isValid = false; }
  const codeRegex = /^[a-zA-Z0-9]+$/;
  if (!form.value.ma_nhan_vien || form.value.ma_nhan_vien.trim() === '') { errors.ma_nhan_vien = 'Mã nhân viên không được để trống.'; isValid = false; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email || !emailRegex.test(form.value.email)) { errors.email = 'Định dạng Email không hợp lệ.'; isValid = false; }
  if (!form.value.chuc_vu) { errors.chuc_vu = 'Vui lòng chọn một chức vụ.'; isValid = false; }
  if (!form.value.ngay_sinh) { errors.ngay_sinh = 'Vui lòng chọn ngày sinh.'; isValid = false; }
  const phoneRegex = /^(03|05|07|08|09)+([0-9]{8})$/;
  if (!form.value.so_dien_thoai || !phoneRegex.test(form.value.so_dien_thoai.trim())) { errors.so_dien_thoai = 'Số điện thoại không đúng định dạng.'; isValid = false; }
  if (!form.value.ten_tai_khoan) { errors.ten_tai_khoan = 'Tài khoản không được để trống.'; isValid = false; }
  if (!form.value.mat_khau || form.value.mat_khau.length < 6) { errors.mat_khau = 'Mật khẩu phải chứa ít nhất 6 ký tự.'; isValid = false; }
  if (!addressParts.value.tinh || !addressParts.value.phuong || !addressParts.value.chi_tiet.trim()) { errors.dia_chi = 'Vui lòng điền đầy đủ địa chỉ.'; isValid = false; }

  return isValid;
};

// Hàm nạp dữ liệu cũ lên nếu phát hiện ID trên URL (Chế độ Edit)
// Hàm nạp dữ liệu chi tiết nhân viên lên Form sửa thông tin
const loadEmployeeData = async (id) => {
  try {
    // Gọi thẳng API chi tiết theo ID thay vì gọi API danh sách phân trang
    const response = await axios.get(`http://localhost:8080/api/employees/${id}`);
    const emp = response.data; // Dữ liệu trả về chính là đối tượng nhân viên luôn
    
    if (emp) {
      // Đổ dữ liệu vào form, cắt chuỗi lấy đúng định dạng ngày YYYY-MM-DD cho ô Input Date
      form.value = { 
        ...emp, 
        ngay_sinh: emp.ngay_sinh ? emp.ngay_sinh.slice(0, 10) : '' 
      };
      
      // Tách ngược chuỗi địa chỉ tổng hợp đổ lại vào 3 ô select/input địa chỉ con
      if (emp.dia_chi) {
        const parts = emp.dia_chi.split(', ');
        addressParts.value = { 
          chi_tiet: parts[0] || '', 
          phuong: parts[1] || '', 
          tinh: parts[2] || '' 
        };
      }
    }
  } catch (error) {
    console.error('Lỗi nghiêm trọng khi nạp thông tin nhân viên:', error);
    alert('Không thể tải dữ liệu nhân viên này từ hệ thống!');
  }
};

const triggerFileInput = () => { fileInput.value.click(); };
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { form.value.anh_dai_dien = e.target.result; };
    reader.readAsDataURL(file);
  }
};

const submitForm = async () => {
  // 1. Kiểm tra tính hợp lệ dữ liệu trước (Validation)
  if (!validateForm()) return;

  try {
    const dia_chi_tong_hop = `${addressParts.value.chi_tiet.trim()}, ${addressParts.value.phuong}, ${addressParts.value.tinh}`;
    const dataToSend = { ...form.value, dia_chi: dia_chi_tong_hop };

    // 2. Thêm hộp thoại xác nhận tùy thuộc vào chế độ Thêm mới hoặc Cập nhật
    if (isEditMode.value) {
      // Hộp thoại xác nhận cho chế độ SỬA thông tin
      if (!confirm(`Bạn có chắc chắn muốn cập nhật thông tin nhân viên [${form.value.ho_ten}] không?`)) {
        return; // Nếu bấm "Hủy" (Cancel) -> Dừng lại luôn, không gọi API
      }
      
      await axios.put(`http://localhost:8080/api/employees/${route.params.id}`, dataToSend);
      alert('Cập nhật thông tin nhân viên thành công!');
      
    } else {
      // Hộp thoại xác nhận cho chế độ THÊM MỚI nhân viên (Đúng yêu cầu của bạn)
      if (!confirm('Bạn có chắc chắn muốn thêm nhân viên mới vào hệ thống không?')) {
        return; // Nếu bấm "Hủy" (Cancel) -> Dừng lại luôn, không gọi API
      }
      
      await axios.post('http://localhost:8080/api/employees', dataToSend);
      alert('Thêm nhân viên mới thành công!');
    }
    
    // Lưu thành công -> Đẩy người dùng quay trở lại trang danh sách bảng nhân viên
    router.push('/employees'); 
    
  } catch (error) {
    console.error(error);
    alert('Có lỗi xảy ra trong quá trình lưu dữ liệu (Trùng mã nhân viên hoặc tài khoản)!');
  }
};

onMounted(() => {
  // Kiểm tra xem ID có xuất hiện trên URL hay không để quyết định Mode
  if (route.params.id) {
    isEditMode.value = true;
    loadEmployeeData(route.params.id);
  }
});
</script>

<style scoped>
.employee-form-page {
  padding: 0 24px;
}
.main-title { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0; }
.sub-title-text { font-size: 13px; color: #64748b; margin-top: 4px; }
.btn-back-list { background: #fff; border: 1px solid #cbd5e1; color: #334155; font-weight: 500; border-radius: 8px; padding: 6px 14px; font-size: 13px; }

/* Khung bọc Form trắng tinh giản */
.form-content-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 40px;
  border: 1px solid #f1f5f9;
}

/* Khung tròn Avatar ghi chữ NV xám nhạt */
.avatar-circle-box {
  width: 100px;
  height: 100px;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #f8fafc;
}
.preview-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.plus-text { font-size: 20px; color: #334155; font-weight: 600; letter-spacing: 0.5px; }
.avatar-format-note { font-size: 11px; color: #94a3b8; }

/* Hệ thống nhãn mác Label xám chữ nhỏ thanh thoát */
.form-label-custom { 
  font-weight: 500; 
  font-size: 13px; 
  color: #475569; 
  margin-bottom: 4px; 
}

/* Ô nhập liệu bo góc nhẹ, viền mảnh chuẩn mẫu */
.custom-input { 
  border-radius: 8px !important; 
  border: 1px solid #cbd5e1; 
  padding: 9px 14px; 
  font-size: 14px; 
  color: #334155;
  background-color: #fff;
}
.custom-input::placeholder {
  color: #94a3b8;
  font-size: 13.5px;
}

/* Viền xanh dương mỏng khi đang focus click vào ô nhập */
.active-input-style {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

/* Các ô tự động khóa (Tài khoản/Mật khẩu) màu xám nhạt dịu mắt */
.input-disabled-gray {
  background-color: #f1f5f9 !important;
  border-color: #e2e8f0 !important;
  color: #64748b;
}

.radio-container { font-weight: 400; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px; color: #334155; }
.error-msg-text { color: #ef4444; font-size: 12px; margin-top: 4px; }
.italic-note { font-size: 12px; font-style: italic; color: #94a3b8; }

/* 🌟 PHÂN TÁCH CSS NÚT BẤM (Hủy phẳng không viền, Lưu xanh dương đậm rực rỡ) */
.btn-submit-blue { 
  background-color: #0066ff; 
  color: #fff; 
  border: none; 
  font-weight: 500; 
  padding: 9px 24px; 
  border-radius: 8px; 
  cursor: pointer; 
  font-size: 14px; 
}
.btn-submit-blue:hover { 
  background-color: #0052cc; 
}

.btn-cancel-flat { 
  background: transparent; 
  color: #1e293b; 
  border: none; 
  font-weight: 500; 
  padding: 9px 20px; 
  cursor: pointer; 
  font-size: 14px; 
}
.btn-cancel-flat:hover {
  color: #64748b;
}
</style>