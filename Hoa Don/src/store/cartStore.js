import { reactive, computed } from 'vue'

export const cartState = reactive({
  items: [], // Danh sách sản phẩm trong giỏ
})

export const addToCart = (product, size, quantity) => {
  // Kiểm tra xem sản phẩm cùng size đã có trong giỏ chưa
  const existingItem = cartState.items.find((item) => item.id === product.id && item.size === size)
  if (existingItem) {
    existingItem.quantity += quantity // Cộng dồn số lượng
  } else {
    // Thêm mới (mặc định cho selected = true để tích sẵn checkbox như Shopee)
    cartState.items.push({ ...product, size, quantity, selected: true })
  }
}

export const removeFromCart = (index) => {
  cartState.items.splice(index, 1)
}

// Tổng số lượng badge hiển thị trên icon giỏ hàng
export const cartCount = computed(() => {
  return cartState.items.reduce((total, item) => total + item.quantity, 0)
})

