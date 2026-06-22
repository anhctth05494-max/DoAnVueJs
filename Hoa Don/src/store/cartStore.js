import { reactive, computed, watch } from 'vue'

// ==========================================
// 1. LẤY TÊN TÀI KHOẢN HIỆN TẠI
// ==========================================
const getCurrentUsername = () => {
  return localStorage.getItem('username') || sessionStorage.getItem('username') || 'Guest'
}

const getCartKey = () => {
  return `giai_dai_cart_${getCurrentUsername()}`
}

// Biến theo dõi tài khoản hiện tại để phát hiện Đăng nhập/Đăng xuất
let currentUserTracker = getCurrentUsername()

const initCart = () => {
  const savedCart = localStorage.getItem(getCartKey())
  return savedCart ? JSON.parse(savedCart) : []
}

export const cartState = reactive({
  items: initCart(),
})

// ==========================================
// 2. LƯU TỰ ĐỘNG KHI CÓ THAY ĐỔI
// ==========================================
watch(
  () => cartState.items,
  (newItems) => {
    localStorage.setItem(getCartKey(), JSON.stringify(newItems))
  },
  { deep: true } 
)

export const reloadCartForCurrentUser = () => {
  cartState.items = initCart()
}

// ==========================================
// FIX CÔ LẬP: CHỈ CHUYỂN NGĂN KÉO, TUYỆT ĐỐI KHÔNG GÔP ĐỒ TỪ GUEST SANG
// ==========================================
setInterval(() => {
  const current = getCurrentUsername()
  // Nếu phát hiện trạng thái tài khoản thay đổi (Vừa Login hoặc vừa Logout)
  if (current !== currentUserTracker) {
    currentUserTracker = current
    // Chỉ tải lại đúng giỏ hàng riêng biệt của tài khoản đó, giữ nguyên tính độc lập
    reloadCartForCurrentUser()
  }
}, 300) // Quét nhanh để giao diện nhảy ngay lập tức

// ==========================================
// LOGIC XỬ LÝ SẢN PHẨM GIỮ NGUYÊN HOÀN TOÀN CỦA BẠN
// ==========================================
export const addToCart = (product, size, quantity) => {
  const stock = product.stock || product.so_luong_ton || product.soLuongTon || 0;

  const existingItem = cartState.items.find((item) => {
    if (item.idSpct && product.idSpct) {
      return item.idSpct === product.idSpct;
    }

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