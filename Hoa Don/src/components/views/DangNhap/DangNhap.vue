<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div>
          <h1>Đăng Nhập</h1>
          <p>Vui lòng nhập tài khoản để truy cập hệ thống.</p>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const loginForm = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    // Gọi API đến Spring Boot công bằng giao thức http://
    const response = await axios.post('http://localhost:8080/api/login', loginForm.value);

    if (response.data.success) {
  const role = response.data.role // Nhận về "quanly", "nhanvien", hoặc "khachhang"

  // Lưu thẻ đi đường
  sessionStorage.setItem('userRole', role)

  if (role === 'quanly') {
    alert('Chào mừng Quản lý quay trở lại!')
    router.push('/thong-ke') // Quản lý vào thẳng trang Thống kê/Tổng quan
  } else if (role === 'nhanvien') {
    alert('Chào mừng Nhân viên bán hàng!')
    router.push('/ban-hang') // Nhân viên thường vào thẳng trang Bán hàng
  } else if (role === 'khachhang') {
    alert('Đăng nhập thành công!')
    router.push('/')
  }
} else {
      alert(response.data.message || 'Đăng nhập thất bại!')
    }
  } catch (error) {
    console.error('Lỗi kết nối:', error)
    if (error.response && error.response.data) {
      alert(error.response.data.message)
    } else {
      alert('Không thể kết nối đến server Spring Boot.')
    }
  }
}
</script>

<style scoped>
/* Giữ nguyên phần CSS cũ của bạn */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
}

.auth-card {
  width: min(480px, 100%);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.auth-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.auth-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}

.auth-form {
  margin-top: 1.75rem;
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
  background: #f1f5f9;
  color: #1e293b;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
}

.btn-block {
  width: 100%;
}

.btn-primary {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.95rem 1rem;
  border-radius: 999px;
  background: #4f46e5;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.btn-primary:hover {
  filter: brightness(1.1);
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
</style>