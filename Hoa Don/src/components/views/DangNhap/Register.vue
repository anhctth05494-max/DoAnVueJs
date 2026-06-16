<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4 shadow-sm">
          <h3 class="text-center mb-4">Đăng Ký</h3>
          <form>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-control" required />
            </div>
            <button class="btn btn-primary w-100">Đăng ký</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card { max-width: 100%; }
</style>
