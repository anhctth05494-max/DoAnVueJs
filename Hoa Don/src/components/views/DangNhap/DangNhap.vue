<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-card-header">
        <div>
          <h1>Đăng nhập</h1>
          <p>Nhập thông tin tài khoản để bắt đầu sử dụng hệ thống.</p>
        </div>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Tài khoản (Email/Username)</label>
          <input
            type="text"
            v-model="loginForm.username"
            class="form-control"
            placeholder="Nhập email hoặc tên đăng nhập"
            autocomplete="username"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <input
            type="password"
            v-model="loginForm.password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-block">Đăng nhập</button>
      </form>

      <div class="auth-footer">
        <RouterLink to="" class="link-secondary">Quên mật khẩu?</RouterLink>
        <RouterLink to="" class="link-secondary">Đăng ký tài khoản</RouterLink>
      </div>
    </div>

    <div v-if="showToast" class="toast-wrapper">
      <div
        class="toast-card"
        :class="toastType === 'success' ? 'toast-success' : 'toast-danger'"
      >
        <div class="toast-content">
          <i
            :class="toastType === 'success' ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-triangle-fill text-danger'"
          ></i>
          <div>
            <div class="toast-title">
              {{ toastType === 'success' ? 'Thành công' : 'Lỗi' }}
            </div>
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
const loginForm = ref({ username: '', password: '' })
const showToast = ref(false)
const toastType = ref('success')
const toastMessage = ref('')

const displayToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3200)
}

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/login', loginForm.value)
    if (response.data.success) {
      const role = response.data.role
      sessionStorage.setItem('userRole', role)
      sessionStorage.setItem('username', loginForm.value.username)

      if (role === 'quanly') {
        displayToast('Chào mừng Quản lý quay trở lại!', 'success')
        setTimeout(() => router.push('/thong-ke'), 400)
      } else if (role === 'nhanvien') {
        displayToast('Chào mừng Nhân viên bán hàng!', 'success')
        setTimeout(() => router.push('/ban-hang'), 400)
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
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
}

.auth-card {
  width: min(520px, 100%);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
  padding: 2.25rem;
}

.auth-card-header {
  margin-bottom: 1.75rem;
}

.auth-card-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #0f172a;
}

.auth-card-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}

.auth-form {
  margin-top: 0.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #334155;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  color: #0f172a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
}

.btn-block {
  width: 100%;
}

.btn-primary {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.95rem 1rem;
  border-radius: 999px;
  background: #4f46e5;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.btn-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.auth-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.link-secondary {
  color: #64748b;
  font-size: 0.95rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.link-secondary:hover {
  color: #4f46e5;
}

.toast-wrapper {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2100;
  display: flex;
  justify-content: flex-end;
  width: auto;
}

.toast-card {
  min-width: 320px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  border-radius: 18px;
  padding: 1rem 1rem 0.9rem;
  border: 1px solid transparent;
  background: #ffffff;
  animation: slideIn 0.25s ease-out;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.toast-success {
  border-color: #22c55e;
}

.toast-danger {
  border-color: #ef4444;
}

.toast-content {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: #0f172a;
  flex: 1;
}

.toast-title {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.toast-message {
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.5;
}

.btn-close {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.25rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

