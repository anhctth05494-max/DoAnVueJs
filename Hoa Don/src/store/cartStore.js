import { reactive, computed, watch } from 'vue'

// 1. KHỞI TẠO TỪ LOCAL STORAGE
const savedCart = localStorage.getItem('giai_dai_cart')

export const cartState = reactive({
  items: savedCart ? JSON.parse(savedCart) : [],
})

// 2. TỰ ĐỘNG LƯU VÀO LOCAL STORAGE KHI CÓ THAY ĐỔI
watch(
  () => cartState.items,
  (newItems) => {
    localStorage.setItem('giai_dai_cart', JSON.stringify(newItems))
  },
  { deep: true } 
)

// ==========================================
// ĐÃ FIX: TRẢ VỀ OBJECT KẾT QUẢ, KHÔNG DÙNG ALERT
// ==========================================
export const addToCart = (product, size, quantity) => {
  const stock = product.stock || product.so_luong_ton || product.soLuongTon || 0;

  const existingItem = cartState.items.find((item) => {
    // Ưu tiên 1: Có ID biến thể thì so sánh là chuẩn nhất
    if (item.idSpct && product.idSpct) {
      return item.idSpct === product.idSpct;
    }

    // Ưu tiên 2: So sánh bộ 4 (Tránh trùng màu nhưng khác tên v.v..)
    const sameId = item.id === product.id;
    const sameSize = item.size === size;
    const sameName = item.name === product.name; 
    const pColor = product.color || product.tenMau || product.mauSac || '';
    const iColor = item.color || item.tenMau || item.mauSac || '';
    const sameColor = pColor === iColor;

    return sameId && sameSize && sameColor && sameName;
  });

  if (existingItem) {
    const totalRequested = existingItem.quantity + quantity;
    if (totalRequested > stock) {
      return { 
        success: false, 
        message: `Thêm thất bại! Kho chỉ còn ${stock} sản phẩm.\n(Bạn đã có sẵn ${existingItem.quantity} sản phẩm này trong giỏ)` 
      };
    }
    existingItem.quantity += quantity;
  } else {
    if (quantity > stock) {
      return { 
        success: false, 
        message: `Thêm thất bại! Kho chỉ còn ${stock} sản phẩm.` 
      };
    }
    cartState.items.push({ ...product, size, quantity, selected: true });
  }
  
  return { 
    success: true, 
    message: 'Đã thêm sản phẩm vào giỏ hàng thành công!' 
  };
}

export const removeFromCart = (index) => {
  cartState.items.splice(index, 1)
}

export const cartCount = computed(() => {
  return cartState.items.reduce((total, item) => total + (item.quantity || 1), 0)
})