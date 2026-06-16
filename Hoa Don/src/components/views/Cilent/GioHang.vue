<template>
  <div class="container py-5">
    <h2 class="mb-4">Giỏ hàng</h2>
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white d-flex align-items-center py-3">
        <input type="checkbox" @change="toggleAll" :checked="isAllSelected" />
        <span class="ms-3">Sản phẩm</span>
      </div>

      <div class="card-body">
        <div
          v-for="item in cartItems"
          :key="item.cartId"
          class="row align-items-center mb-3 border-bottom pb-3"
        >
          <div class="col-1"><input type="checkbox" v-model="item.selected" /></div>
          <div class="col-2"><img :src="item.image" class="w-100" /></div>
          <div class="col-3">
            <h6>{{ item.name }}</h6>
            <button class="btn btn-sm btn-outline-secondary" @click="openEditModal(item)">
              {{ item.size }} - {{ item.color }} <i class="bi bi-chevron-down"></i>
            </button>
            <small class="d-block text-danger">Còn: {{ getStock(item) }}</small>
          </div>
          <div class="col-2">
            <del v-if="item.oldPrice" class="text-muted small">{{
              formatPrice(item.oldPrice)
            }}</del>
            <div class="fw-bold">{{ formatPrice(item.price) }}</div>
          </div>
          <div class="col-2">
            <input type="number" v-model="item.quantity" class="form-control w-50" min="1" />
          </div>
          <div class="col-2">
            <button class="btn btn-link text-danger" @click="removeItem(item.cartId)">Xóa</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 p-3 bg-white shadow-sm d-flex justify-content-between align-items-center">
      <div>
        Tổng thanh toán: <span class="h4 text-danger">{{ formatPrice(totalAmount) }}</span>
      </div>
      <button class="btn btn-danger px-5 py-2">Mua hàng</button>
    </div>
  </div>
</template>

<script setup>
// Sử dụng computed để tính totalAmount dựa trên các item có selected === true
const totalAmount = computed(() => {
  return cartItems.value.filter((i) => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0)
})
</script>

