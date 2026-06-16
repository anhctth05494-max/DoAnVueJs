import { reactive, computed } from 'vue'

export const cartState = reactive({
  items: [],
})

export const addToCart = (product, size, quantity) => {
  const existingItem = cartState.items.find((item) => item.id === product.id && item.size === size)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartState.items.push({ ...product, size, quantity, selected: true })
  }
}

export const removeFromCart = (index) => {
  cartState.items.splice(index, 1)
}

export const cartCount = computed(() => {
  return cartState.items.reduce((total, item) => total + item.quantity, 0)
})
