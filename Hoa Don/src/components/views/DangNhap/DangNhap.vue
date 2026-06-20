<template>
  <div class="auth-page">
    <div class="auth-container">

      <div class="auth-form-section">
        <div class="form-wrapper">

          <div class="auth-header">
            <h1 class="welcome-title">Chào mừng quay trở lại <span class="wave-emoji"></span></h1>
            <p class="welcome-subtitle">Vui lòng nhập thông tin đăng nhập hệ thống</p>
          </div>

          <form class="main-form" @submit.prevent="handleLogin">

            <div class="form-group">
              <label class="form-label">Email hoặc Số điện thoại</label>
              <div class="input-field-wrapper">
                <input type="text" v-model="loginForm.emailOrPhone" class="form-control"
                  placeholder="Nhập email hoặc số điện thoại" autocomplete="email" required />
                <i class="bi bi-envelope-fill input-icon"
                  v-if="loginForm.emailOrPhone && loginForm.emailOrPhone.includes('@')"></i>
                <i class="bi bi-telephone-fill input-icon" v-else></i>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Mật khẩu</label>
              <div class="input-field-wrapper">
                <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.password" class="form-control"
                  placeholder="Nhập mật khẩu" autocomplete="current-password" required />
                <button type="button" class="password-toggle-btn" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" class="custom-checkbox" />
                <span>Ghi nhớ trong 30 ngày</span>
              </label>
              <RouterLink to="" class="forgot-link">Quên mật khẩu?</RouterLink>
            </div>

            <button type="submit" class="btn btn-login-submit">Đăng nhập</button>
          </form>

          <div class="auth-footer-note">
            <p>Chỉ tài khoản nhân viên đang hoạt động mới có quyền truy cập quản trị.</p>
          </div>

        </div>
      </div>

      <div class="auth-image-section">
        <div class="image-cover-wrapper">
          <img src="/left-banner.png" alt="Áo Dài Banner" class="side-banner-img" />
        </div>
      </div>

    </div>

    <div v-if="showToast" class="toast-wrapper">
      <div class="toast-card" :class="toastType === 'success' ? 'toast-success' : 'toast-danger'">
        <div class="toast-content">
          <i
            :class="toastType === 'success' ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-triangle-fill text-danger'"></i>
          <div>
            <div class="toast-title">{{ toastType === 'success' ? 'Thành công' : 'Lỗi' }}</div>
            <div class="toast-message">{{ toastMessage }}</div>
          </div>
        </div>
        <button type="button" class="btn-close" @click="showToast = false"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loginForm = ref({ emailOrPhone: '', password: '' })
const showToast = ref(false)
const toastType = ref('success')
const toastMessage = ref('')
const showPassword = ref(false)

const displayToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3200)
}

const handleLogin = async () => {
  try {
    const payload = {
      username: loginForm.value.emailOrPhone.trim(),
      password: loginForm.value.password
    }

    const response = await axios.post('http://localhost:8080/api/login', payload, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (response.data.success) {
  const role = response.data.role

  // 🌟 LƯU CHO TẤT CẢ CÁC BÊN (Quản lý, Nhân viên, Khách hàng đều cần)
  localStorage.setItem('userRole', role)
  
  const displayName = response.data.username;
  localStorage.setItem('username', displayName)

  // RẼ NHÁNH ĐIỀU HƯỚNG THEO ĐÚNG VAI TRÒ
  if (role === 'quanly') {
    displayToast('Chào mừng Quản lý quay trở lại!', 'success')
    setTimeout(() => router.push('/thong-ke'), 400)
  } else if (role === 'nhanvien') {
    displayToast('Chào mừng Nhân viên bán hàng!', 'success')
    setTimeout(() => router.push('/ban-hang'), 400)
  } else if (role === 'khachhang') {
    // 🌟 KHÁCH HÀNG ĐĂNG NHẬP THÀNH CÔNG THÌ ĐẨY VỀ TRANG CHỦ MUA SẮM
    displayToast('Đăng nhập tài khoản Khách hàng thành công!', 'success')
    setTimeout(() => router.push('/'), 400)
  } else {
    displayToast('Đăng nhập thành công!', 'success')
    setTimeout(() => router.push('/'), 400)
  }
} else {
  displayToast(response.data.message || 'Đăng nhập thất bại!', 'danger')
}
  } catch (error) {
    console.error('Lỗi kết nối:', error)
    const message = error.response?.data?.message || 'Không thể kết nối đến server Spring Boot.'
    displayToast(message, 'danger')
  }
}
</script>

<style scoped>
/* Giữ nguyên toàn bộ phần CSS chỉnh chu ban đầu của bạn */

.auth-page {
  min-height: 100vh;
  width: 100%;
  background-color: #27170F;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  box-sizing: border-box;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: min(1120px, 100%);
  background-color: #ffffff;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
  min-height: 680px;
}

.auth-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3.5rem;
  background-color: #ffffff;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  margin-bottom: 2.5rem;
}

.welcome-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #27170F;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.wave-emoji {
  display: inline-block;
}

.welcome-subtitle {
  color: #8A6242;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.main-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #27170F;
}

.input-field-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1.25rem;
  padding-right: 3rem;
  border: 1px solid #C4A47C;
  border-radius: 50px;
  background-color: #F4EFEA;
  color: #27170F;
  font-size: 0.95rem;
  font-weight: 500;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-control::placeholder {
  color: rgba(39, 23, 15, 0.4);
}

.form-control:focus {
  outline: none;
  border-color: #8A6242;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(138, 98, 66, 0.15);
}

.input-icon,
.password-toggle-btn {
  position: absolute;
  right: 1.2rem;
  color: #8A6242;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  background: none;
  border: none;
}

.password-toggle-btn {
  cursor: pointer;
  padding: 0;
}

.password-toggle-btn:hover {
  color: #27170F;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.88rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #8A6242;
  cursor: pointer;
  font-weight: 500;
}

.custom-checkbox {
  accent-color: #8A6242;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-link {
  color: #27170F;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #8A6242;
  text-decoration: underline;
}

.btn-login-submit {
  width: 100%;
  padding: 0.9rem;
  border-radius: 50px;
  background-color: #8A6242;
  color: #ffffff;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(138, 98, 66, 0.25);
}

.btn-login-submit:hover {
  background-color: #27170F;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(39, 23, 15, 0.35);
}

.auth-footer-note {
  margin-top: 2.5rem;
  text-align: center;
}

.auth-footer-note p {
  font-size: 0.8rem;
  color: rgba(39, 23, 15, 0.5);
  margin: 0;
  line-height: 1.4;
}

.auth-image-section {
  padding: 1.25rem;
  background-color: #ffffff;
}

.image-cover-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.05);
}

.side-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.toast-wrapper {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 3000;
}

.toast-card {
  min-width: 320px;
  background: #ffffff;
  border-left: 5px solid transparent;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(39, 23, 15, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.toast-success {
  border-left-color: #22c55e;
}

.toast-danger {
  border-left-color: #ef4444;
}

.toast-content {
  display: flex;
  gap: 0.75rem;
  color: #27170F;
  text-align: left;
}

.toast-title {
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.toast-message {
  font-size: 0.9rem;
  color: #64748b;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
}



@media (max-width: 992px) {

  .auth-page {
    padding: 1.5rem 1rem;
  }

  .auth-container {
    grid-template-columns: 1fr;
    border-radius: 30px;
    min-height: auto;
  }

  .auth-image-section {
    display: none;
  }

  .auth-form-section {
    padding: 3.5rem 2rem;
  }

}
</style>