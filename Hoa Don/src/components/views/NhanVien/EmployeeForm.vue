<template>
  <div class="mx-auto my-2 page-form-container" style="max-width: 1200px; padding: 0 10px">

    <div class="form-header-navigation d-flex justify-content-between align-items-center mb-4">
      <div class="page-title-wrap">
        <h2 class="main-title">
          <span>👤</span> {{ isEditMode ? 'CẬP NHẬT THÔNG TIN NHÂN VIÊN' : 'THÊM MỚI NHÂN VIÊN' }}
        </h2>
        <p class="sub-title-text">Vui lòng điền đầy đủ các thông tin dưới đây.</p>
      </div>
      <button type="button" class="btn-back-list" @click="$router.push('/nhan-vien')">
        ← Quay lại danh sách
      </button>
    </div>

    <div class="custom-card mb-4 bg-white">
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

          <div class="qr-scanner-box mt-3 mx-auto" style="max-width: 320px;">
            <button type="button" class="btn btn-sm px-3 rounded-pill shadow-none mb-2"
              style="background-color: #e5d4c8; color: #5a4031; font-weight: 600; font-size: 13px;"
              @click="toggleQRScanner">
              <i class="bi bi-qr-code-scan me-1"></i> {{ isScanning ? 'Đóng Camera Quét' : 'Quét QR' }}
            </button>
            <div v-show="isScanning" id="qr-reader" class="border rounded-3 overflow-hidden bg-light shadow-sm"></div>
          </div>
        </div>

        <div class="row g-3">
          
          <div class="col-md-6">
            <label class="form-label-custom">Mã nhân viên</label>
            <input v-model="form.ma_nhan_vien" type="text" class="form-control custom-input input-disabled-gray" placeholder="Nhập mã nhân viên" disabled />
            <div v-if="errors.ma_nhan_vien" class="error-msg-text">{{ errors.ma_nhan_vien }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Tên nhân viên</label>
            <input v-model="form.ho_ten" type="text" class="form-control custom-input active-input-style" placeholder="Nhập tên nhân viên" />
            <div v-if="errors.ho_ten" class="error-msg-text">{{ errors.ho_ten }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Chức vụ</label>
            <select v-model="form.chuc_vu" class="form-select custom-input">
              <option value="">-- Chọn chức vụ --</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Nhân viên">Nhân viên</option>
            </select>
            <div v-if="errors.chuc_vu" class="error-msg-text">{{ errors.chuc_vu }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label-custom">Giới tính</label>
            <div class="gender-radio-group custom-input d-flex align-items-center gap-3">
              <label class="radio-container">
                <input type="radio" v-model="form.gioi_tinh" :value="1" name="gender" /> Nam
              </label>
              <label class="radio-container">
                <input type="radio" v-model="form.gioi_tinh" :value="0" name="gender" /> Nữ
              </label>
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
              <input v-model="form.ngay_sinh" type="date" class="form-control custom-input" :max="eighteenYearsAgoStr" />
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

          <div class="col-md-6" v-if="isEditMode">
            <label class="form-label-custom">Tài khoản</label>
            <input v-model="form.ten_tai_khoan" type="text" class="form-control custom-input input-disabled-gray" disabled />
            <div v-if="errors.ten_tai_khoan" class="error-msg-text">{{ errors.ten_tai_khoan }}</div>
          </div>

          <div class="col-md-6" v-if="isEditMode">
            <label class="form-label-custom">Mật khẩu</label>
            <div class="password-input-wrapper">
              <input v-model="form.mat_khau" :type="showPassword ? 'text' : 'password'" class="form-control custom-input pe-5" placeholder="Nhập mật khẩu mới" />
              <span class="password-toggle-eye" @click="showPassword = !showPassword" title="Xem mật khẩu">
                👁️
              </span>
            </div>
            <div v-if="errors.mat_khau" class="error-msg-text">{{ errors.mat_khau }}</div>
          </div>

        </div> <p class="text-muted italic-note mt-4">Vui lòng điền đầy đủ các thông tin.</p>

        <div class="d-flex justify-content-end align-items-center gap-2 mt-4">
          <button type="button" class="btn btn-outline-secondary rounded-pill px-4 shadow-none small fw-medium" @click="$router.push('/nhan-vien')">Hủy</button>
          <button type="submit" class="btn rounded-pill px-4 shadow-none small fw-medium" style="background-color: #dccbc0; color: #5a4031">Lưu nhân viên</button>
        </div>

      </form>
    </div>

    <div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin-top: 20px;">
      <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3"
        :style="toast.type === 'success' ? 'background-color: #f4fbf7; border-left: 4px solid #2e7d32 !important;' : 'background-color: #fff5f5; border-left: 4px solid #ef4444 !important;'">
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

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from 'vue'; // Thêm onUnmounted vào dòng import cũ
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode'; // 🌟 Import bộ quét QR nội bộ
const todayObj = new Date();
const maxYear = todayObj.getFullYear() - 18;
const maxMonth = String(todayObj.getMonth() + 1).padStart(2, '0');
const maxDay = String(todayObj.getDate()).padStart(2, '0');
const eighteenYearsAgoStr = `${maxYear}-${maxMonth}-${maxDay}`;
const toast = reactive({ show: false, message: '', type: 'success' });
const confirmModal = reactive({ show: false, title: '', message: '', onConfirm: null });

const showToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3000);
};
const isScanning = ref(false);
let html5QrcodeScanner = null;

const toggleQRScanner = () => {
  if (isScanning.value) {
    stopScanner();
  } else {
    startScanner();
  }
};

const startScanner = () => {
  isScanning.value = true;
  // Chờ DOM render khung chứa camera trong 100ms
  setTimeout(() => {
    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    html5QrcodeScanner.start(
      { facingMode: "environment" }, // Ưu tiên dùng camera sau của điện thoại
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        // Callback chạy khi quét thành công
        parseCCCDData(decodedText);
        stopScanner();
      },
      (errorMessage) => { /* Bỏ qua log lỗi quét trượt liên tục của thư viện */ }
    ).catch(err => {
      console.error("Không thể mở camera:", err);
      alert("Không tìm thấy thiết bị camera hoặc quyền truy cập bị từ chối!");
      isScanning.value = false;
    });
  }, 100);
};

const stopScanner = () => {
  if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
    html5QrcodeScanner.stop().then(() => {
      isScanning.value = false;
    }).catch(err => console.error("Lỗi đóng camera:", err));
  } else {
    isScanning.value = false;
  }
};

// Hàm bóc tách chuỗi dữ liệu của CCCD gắn chíp
const parseCCCDData = (qrString) => {
  if (!qrString || !qrString.includes('|')) {
    // 🌟 Thay thế alert lỗi bằng Toast màu đỏ cảnh báo
    showToast("Mã QR không đúng định dạng của CCCD gắn chíp!", "danger");
    return;
  }

  const parts = qrString.split('|');

  // 1. Điền Họ Tên (Mục số 2 trong chuỗi)
  if (parts[2]) form.value.ho_ten = parts[2].trim();

  // 2. Điền Ngày Sinh (Mục số 3 - Định dạng gốc: DDMMYYYY -> Cần chuyển về YYYY-MM-DD)
  const dobRaw = parts[3];
  if (dobRaw && dobRaw.length === 8) {
    const day = dobRaw.substring(0, 2);
    const month = dobRaw.substring(2, 4);
    const year = dobRaw.substring(4, 8);
    form.value.ngay_sinh = `${year}-${month}-${day}`;
  }

  // 3. Điền Giới tính (Mục số 4 - Gốc: Nam/Nữ -> Chuyển về số 1/0)
  if (parts[4]) {
    form.value.gioi_tinh = parts[4].trim() === 'Nam' ? 1 : 0;
  }

  // 4. Bóc tách địa chỉ thông minh để tự chọn dropdown Tỉnh/Huyện
  const addressRaw = parts[5] || '';
  if (addressRaw) {
    // Lưu địa chỉ thô vào ô tên đường trước
    addressParts.value.chi_tiet = addressRaw.trim();

    // Tự động nhận diện Tỉnh/Thành phố
    if (addressRaw.toLowerCase().includes('hà nội')) {
      addressParts.value.tinh = 'Hà Nội';
    } else if (addressRaw.toLowerCase().includes('hồ chí minh') || addressRaw.toLowerCase().includes('tp.hcm')) {
      addressParts.value.tinh = 'TP.HCM';
    }

    // Tự động nhận diện và so khớp Quận/Huyện dựa vào dữ liệu có sẵn trong hệ thống select của bạn
    const listDistricts = [
      "Quận Ba Đình", "Quận Bắc Từ Liêm", "Quận Cầu Giấy", "Quận Đống Đa", "Quận Hà Đông", "Quận Hai Bà Trưng", "Quận Hoàn Kiếm", "Quận Hoàng Mai", "Quận Long Biên", "Quận Nam Từ Liêm", "Quận Tây Hồ", "Quận Thanh Xuân",
      "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12", "Thành phố Thủ Đức", "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú"
    ];
    for (const d of listDistricts) {
      const coreName = d.replace("Quận ", "").replace("Thành phố ", "").toLowerCase();
      if (addressRaw.toLowerCase().includes(coreName)) {
        addressParts.value.phuong = d;
        break;
      }
    }
  }

  // 🌟 Thay thế alert thành công bằng Toast màu xanh lá tự ẩn cực mượt
  showToast("Đã đồng bộ thông tin từ CCCD thành công!", "success");
};

// Đóng camera giải phóng bộ nhớ nếu người dùng chuyển trang đột ngột
onUnmounted(() => {
  if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
    html5QrcodeScanner.stop();
  }
});

// Hàm khử dấu tiếng Việt và tự sinh tên tài khoản theo quy tắc
const generateUsername = (hoTen, maNhanVien) => {
  if (!hoTen || !maNhanVien) return '';

  // Khử dấu tiếng Việt chuẩn hóa về chữ thường
  const noAccent = hoTen.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim();

  const parts = noAccent.split(/\s+/);
  if (parts.length === 0) return '';

  // Lấy tên chính ở cuối cùng (Ví dụ: "anh")
  const firstName = parts[parts.length - 1];

  // Lấy các chữ cái đầu của họ và tên đệm (Ví dụ: "c", "t")
  let initials = '';
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i]) initials += parts[i].charAt(0);
  }

  // Lọc lấy phần số của mã nhân viên (Ví dụ: "NV120" -> "120")
  const numberPart = maNhanVien.toLowerCase().replace('nv', '').trim();

  // Trả về kết quả chuỗi hoàn chỉnh (Ví dụ: anhct120)
  return firstName + initials + numberPart;
}; // <-- Dấu đóng ngoặc nhọn của hàm bị thiếu trước đó đã được bù vào đây

const route = useRoute();
const router = useRouter();

const isEditMode = ref(false);
const fileInput = ref(null);

const form = ref({
  ho_ten: '', ma_nhan_vien: '', email: '', chuc_vu: '', ngay_sinh: '', so_dien_thoai: '', gioi_tinh: 1, ten_tai_khoan: '', mat_khau: '', anh_dai_dien: '', trang_thai: 1
});

const addressParts = ref({ tinh: '', phuong: '', chi_tiet: '' });

const showPassword = ref(false);

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

  if (!form.value.ho_ten || (form.value.ho_ten || '').trim() === '') { errors.ho_ten = 'Họ và tên bắt buộc phải nhập.'; isValid = false; }
  if (!form.value.ma_nhan_vien || (form.value.ma_nhan_vien || '').trim() === '') { errors.ma_nhan_vien = 'Mã nhân viên không được để trống.'; isValid = false; }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email || !emailRegex.test(form.value.email)) { errors.email = 'Định dạng Email không hợp lệ.'; isValid = false; }
  if (!form.value.chuc_vu) { errors.chuc_vu = 'Vui lòng chọn một chức vụ.'; isValid = false; }
  if (!form.value.ngay_sinh) {
    errors.ngay_sinh = 'Vui lòng chọn ngày sinh.';
    isValid = false;
  } else {
    const birthDate = new Date(form.value.ngay_sinh);
    const today = new Date();

    // Tính mốc ngày tối đa mà người đó phải sinh ra để vừa đủ hoặc hơn 18 tuổi tính đến hôm nay
    const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (birthDate > today) {
      errors.ngay_sinh = 'Ngày sinh không thể nằm ở tương lai.';
      isValid = false;
    } else if (birthDate > maxBirthDate) {
      errors.ngay_sinh = 'Nhân viên phải từ 12-06-2008 trở về trước (Đủ 18 tuổi).';
      isValid = false;
    }
  }

  const phoneRegex = /^(03|05|07|08|09)+([0-9]{8})$/;
  const sdtHienTai = (form.value.so_dien_thoai || '').trim();
  if (!form.value.so_dien_thoai || !phoneRegex.test(sdtHienTai)) { errors.so_dien_thoai = 'Số điện thoại không đúng định dạng.'; isValid = false; }

  // 🌟 KHÔNG kiểm tra Tài khoản / Mật khẩu khi thêm mới (isEditMode = false)
  if (isEditMode.value) {
    if (!form.value.ten_tai_khoan) { errors.ten_tai_khoan = 'Tài khoản không được để trống.'; isValid = false; }
    if (!form.value.mat_khau || form.value.mat_khau.length < 6) { errors.mat_khau = 'Mật khẩu phải chứa ít nhất 6 ký tự.'; isValid = false; }
  }

  if (!addressParts.value.tinh || !addressParts.value.phuong || !(addressParts.value.chi_tiet || '').trim()) {
    errors.dia_chi = 'Vui lòng điền đầy đủ địa chỉ.';
    isValid = false;
  }

  return isValid;
};

// Hàm nạp dữ liệu chi tiết nhân viên lên Form sửa thông tin
const loadEmployeeData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/employees/${id}`);
    const emp = response.data;

    if (emp) {
      form.value = {
        ...emp,
        ngay_sinh: emp.ngay_sinh ? emp.ngay_sinh.slice(0, 10) : ''
      };

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
  if (!validateForm()) return;

  const dia_chi_tong_hop = `${(addressParts.value.chi_tiet || '').trim()}, ${addressParts.value.phuong}, ${addressParts.value.tinh}`;

  if (!isEditMode.value) {
    form.value.ten_tai_khoan = generateUsername(form.value.ho_ten, form.value.ma_nhan_vien);
    form.value.mat_khau = '12345678';
  }

  const dataToSend = { ...form.value, dia_chi: dia_chi_tong_hop };

  // Thiết lập nội dung cho Modal xác nhận đồng bộ hệ thống
  confirmModal.title = isEditMode.value ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên';
  confirmModal.message = isEditMode.value
    ? `Bạn có chắc chắn muốn cập nhật thông tin nhân viên [${form.value.ho_ten}] không?`
    : 'Bạn có chắc chắn muốn thêm nhân viên mới vào hệ thống không?';

  confirmModal.onConfirm = async () => {
    confirmModal.show = false; // Đóng modal ngay khi bấm xác nhận
    try {
      if (isEditMode.value) {
        await axios.put(`http://localhost:8080/api/employees/${route.params.id}`, dataToSend);
        showToast('Cập nhật thông tin nhân viên thành công!', 'success');
      } else {
        await axios.post('http://localhost:8080/api/employees', dataToSend);
        showToast(`Thêm mới thành công! Tài khoản [${form.value.ten_tai_khoan}] đã được gửi qua email.`, 'success');
      }
      // Chờ hiệu ứng toast hiển thị mượt mà rồi mới chuyển trang
      setTimeout(() => router.push('/nhan-vien'), 1200);
    } catch (error) {
      console.error(error);
      showToast('Có lỗi xảy ra trong quá trình lưu dữ liệu!', 'danger');
    }
  };
  confirmModal.show = true; // Kích hoạt mở modal lên màn hình
};

onMounted(() => {
  if (route.params.id) {
    isEditMode.value = true;
    loadEmployeeData(route.params.id);
  } else {
    // Lấy tổng số bản ghi từ state của router (bảng employeeTable truyền sang)
    const totalCount = window.history.state?.totalElements || 0;
    
    // Tự động gán mã nhân viên theo công thức: NV + (tổng số hàng + 1)
    form.value.ma_nhan_vien = `NV${totalCount + 1}`;
  }
});
watch(() => form.value.ho_ten, (newHoTen) => {
  if (!isEditMode.value && form.value.ma_nhan_vien) {
    form.value.ten_tai_khoan = generateUsername(newHoTen, form.value.ma_nhan_vien);
  }
});
</script>

<style scoped>
.page-form-container {
  width: 100%;
}

/* Định dạng lại khung card giống hệt bên sản phẩm */
.custom-card {
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

/* Hạ độ cao các ô nhập liệu xuống 38px cho thanh thoát */
.custom-input {
  height: 38px;
  border-radius: 6px !important;
  font-size: 13.5px;
  border: 1px solid #dee2e6;
  padding: 8px 14px;
  color: #334155;
  background-color: #fff;
}

/* Đổi màu hiệu ứng focus khi click chuột vào ô nhập */
.custom-input:focus,
.active-input-style:focus {
  border-color: #cbb3a1 !important;
  box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25) !important;
  outline: none;
}

.main-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.sub-title-text {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.btn-back-list {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-weight: 500;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
}

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

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.plus-text {
  font-size: 20px;
  color: #334155;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.avatar-format-note {
  font-size: 11px;
  color: #94a3b8;
}

/* Hệ thống nhãn mác Label xám chữ nhỏ thanh thoát */
.form-label-custom {
  font-weight: 500;
  font-size: 13px;
  color: #475569;
  margin-bottom: 4px;
}

/* Ô nhập liệu bo góc nhẹ, viền mảnh chuẩn mẫu */
.custom-input {
  border-radius: 50px !important;
  /* Đổi từ 8px sang 50px để thành dạng pill giống bộ lọc bên table */
  border: 1px solid #d9d9d9;
  padding: 8px 20px;
  font-size: 14px;
  color: #262626;
  height: 40px;
  background-color: #fff;
}

.custom-input::placeholder {
  color: #94a3b8;
  font-size: 13.5px;
}

/* Viền xanh dương mỏng khi đang focus click vào ô nhập */
.active-input-style:focus,
.custom-input:focus {
  border-color: #beaa9e !important;
  box-shadow: 0 0 0 2px rgba(206, 185, 173, 0.2) !important;
  outline: none;
}

/* Các ô tự động khóa (Tài khoản/Mật khẩu) màu xám nhạt dịu mắt */
.input-disabled-gray {
  background-color: #f1f5f9 !important;
  border-color: #e2e8f0 !important;
  color: #64748b;
}

.radio-container {
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #334155;
}

.error-msg-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.italic-note {
  font-size: 12px;
  font-style: italic;
  color: #94a3b8;
}

/* Khung bọc ô mật khẩu để định vị tuyệt đối cho con mắt */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Ép ô input không bị vỡ layout và chừa khoảng trống bên phải cho icon */
.password-input-wrapper .custom-input {
  width: 100%;
  padding-right: 40px !important;
}

/* Cấu hình vị trí con mắt nằm gọn bên phải ô input */
.password-toggle-eye {
  position: absolute;
  right: 14px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  transition: opacity 0.2s ease;
}

.password-toggle-eye:hover {
  opacity: 0.7;
}

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

/* Ép hàng row bên trong form không tự động phình lề âm sang 2 bên */
.employee-management-wrapper .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* Đồng bộ khoảng đệm phía trong card y hệt employeetable */
.employee-management-wrapper .card-body {
  padding: 24px !important;
}

.text-brown {
  color: #a67c52 !important;
}

.btn-brown {
  background-color: #a67c52;
  color: white;
  border: none;
}

.btn-brown:hover {
  background-color: #8c6b5d;
  color: white;
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 2050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal-content {
  width: 100%;
  animation: modalFadeIn 0.25s ease-out;
}

@keyframes modalFadeIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>