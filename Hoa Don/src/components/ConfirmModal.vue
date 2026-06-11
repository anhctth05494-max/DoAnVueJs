<template>
  <Teleport to="body">
    <div v-if="modelValue" class="confirm-overlay">
      <div class="confirm-modal-card">
        <div class="confirm-icon-area">
          <i class="bi bi-box-seam-fill"></i>
        </div>
        <h5 class="confirm-title">{{ title }}</h5>
        <p class="confirm-message">
          {{ message }}<br>
          <strong class="text-dark">{{ itemName }}</strong> không?
        </p>
        <div class="confirm-actions">
          <button @click="$emit('update:modelValue', false)" class="btn-cancel-custom">Hủy bỏ</button>
          <button @click="$emit('confirm')" class="btn-confirm-custom">Xác nhận</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps(['modelValue', 'title', 'message', 'itemName']);
defineEmits(['update:modelValue', 'confirm']);
</script>

<style scoped>
/* Cậu dán toàn bộ đoạn CSS mà cậu gửi tớ ở trên vào đây nhé */
.confirm-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 99999; backdrop-filter: blur(3px); }
.confirm-modal-card { background: white; padding: 30px; border-radius: 16px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); }
.confirm-icon-area { font-size: 45px; color: #8a6d5b; margin-bottom: 15px; }
.confirm-title { font-weight: 700; color: #5a4031; margin-bottom: 10px; }
.confirm-message { font-size: 14px; color: #6c757d; line-height: 1.6; margin-bottom: 25px; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }
.btn-cancel-custom { background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; padding: 8px 24px; border-radius: 50px; font-weight: 500; cursor: pointer; }
.btn-confirm-custom { background-color: #ebdcd0; color: #5a4031; border: 1px solid #cbb3a1; padding: 8px 24px; border-radius: 50px; font-weight: 600; cursor: pointer; }
</style>