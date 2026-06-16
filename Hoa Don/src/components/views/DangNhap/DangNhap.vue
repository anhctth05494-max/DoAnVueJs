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
        <RouterLink to="/quen-mat-khau" class="link-secondary">Quên mật khẩu?</RouterLink>
        <RouterLink to="/register" class="link-secondary">Đăng ký tài khoản</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const loginForm = ref({
  username: 'NV01',
  password: '123456'
})

// const handleLogin = async () => {
//   try {
//     const response = await axios.post('http://localhost:8080/api/login', loginForm.value)

//     if (response.data.success) {
//       if (response.data.role === 'nhanvien') {
//         alert('Chào mừng Nhân viên quay trở lại!')
//         router.push('/san-pham') // Điều hướng đến trang dashboard sau khi đăng nhập thành công
//       } else if (response.data.role === 'khachhang') {
//         alert('Đăng nhập thành công (Khách hàng)!')
//       }
//     } else {
//       alert(response.data.message || 'Đăng nhập thất bại!')
//     }
//   } catch (error) {
//     console.error('Lỗi đăng nhập:', error)
//     alert('Có lỗi xảy ra kết nối đến server.')
//   }
// }
const handleLogin = async () => {
  // Giả lập việc bấm nút là đúng luôn mà không cần gọi API thật
  const mockResponse = {
    data: {
      success: true,
      role: 'nhanvien' // hoặc 'khachhang'
    }
  }

  if (mockResponse.data.success) {
    if (mockResponse.data.role === 'nhanvien') {
      alert('Chào mừng Nhân viên quay trở lại!')
      router.push('/san-pham') // Điều hướng đến trang dashboard sau khi đăng nhập thành công
    } else if (mockResponse.data.role === 'khachhang') {
      alert('Đăng nhập thành công (Khách hàng)!')
    }
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
  background: #f8fafc; /* Light grayish-blue background */
}

.auth-card {
  width: min(480px, 100%);
  background: #ffffff; /* Clean white card */
  border: 1px solid #e2e8f0; /* Subtle border */
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.auth-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1e293b; /* Deep dark slate for headers */
}

.auth-header p {
  margin: 0;
  color: #64748b; /* Soft slate for description */
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
  color: #334155; /* Readable dark label */
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #f1f5f9; /* Soft input background */
  color: #1e293b;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5; /* Classic Indigo focus border */
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15); /* Soft Indigo outer glow */
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
  background: #4f46e5; /* Crisp Indigo background - permanently visible! */
  color: #ffffff;
  border: none;
  cursor: pointer; /* Makes it instantly obvious it's a clickable button */
  transition: filter 0.2s ease;
}

.btn-primary:hover {
  filter: brightness(1.1); /* Lightens slightly on hover */
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
  color: #4f46e5; /* Hovering over links turns them Indigo */
}
</style>