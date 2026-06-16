import { createRouter, createWebHistory } from 'vue-router'

// 1. IMPORT TRANG KHÁCH HÀNG (Client)
import TrangChuKhachHang from '../components/views/Client/TrangChu.vue'
import SanPhamKhachHang from '../components/views/Client/SanPham.vue'
import VoucherKhachHang from '../components/views/Client/Voucher.vue'
import LienHeKhachHang from '../components/views/Client/Lienhe.vue'
import GioHangKhachHang from '../components/views/Client/GioHang.vue'
// 2. IMPORT GIAO DIỆN QUẢN TRỊ (Admin)
import QuanLySanPham from '../components/views/SanPham/QuanLySanPham.vue'
import ThemSanPham from '../components/views/SanPham/ThemSanPham.vue'
import DanhSachChiTiet from '../components/views/SanPham/DanhSachChiTiet.vue'
import ChiTietSanPham from '../components/views/SanPham/ChiTietSanPham.vue'
import TrangHoaDon from '../components/views/HoaDon/TrangHoaDon.vue'
import QuanLyKhachHang from '../components/views/KhachHang/QuanLyKhachHang.vue'

// Nhóm thuộc tính sản phẩm
import ThuongHieu from '../components/views/SanPham/ThuongHieu.vue'
import DanhMuc from '../components/views/SanPham/DanhMuc.vue'
import ChatLieu from '../components/views/SanPham/ChatLieu.vue'
import KieuDang from '../components/views/SanPham/KieuDang.vue'
import CoAo from '../components/views/SanPham/CoAo.vue'
import TayAo from '../components/views/SanPham/TayAo.vue'
import MauSac from '../components/views/SanPham/MauSac.vue'
import KichCo from '../components/views/SanPham/KichCo.vue'

const routes = [
  // --- TRANG KHÁCH HÀNG ---
  { path: '/', name: 'TrangChu', component: TrangChuKhachHang },
  { path: '/cua-hang', name: 'CuaHang', component: SanPhamKhachHang },
  { path: '/san-voucher', name: 'Voucher', component: VoucherKhachHang },
  { path: '/lien-he', name: 'LienHe', component: LienHeKhachHang },
  { path: '/gio-hang', name: 'GioHang', component: GioHangKhachHang },

  // --- TRANG QUẢN TRỊ (ADMIN) ---
  { path: '/san-pham', name: 'QuanLySanPham', component: QuanLySanPham },
  { path: '/san-pham/them', name: 'ThemSanPham', component: ThemSanPham },
  { path: '/san-pham/chi-tiet/:id', name: 'ChiTietSanPham', component: ChiTietSanPham },
  { path: '/san-pham/danh-sach-chi-tiet', name: 'DanhSachChiTiet', component: DanhSachChiTiet },

  // Nhóm thuộc tính
  { path: '/thuong-hieu', component: ThuongHieu },
  { path: '/danh-muc', component: DanhMuc },
  { path: '/chat-lieu', component: ChatLieu },
  { path: '/kieu-dang', component: KieuDang },
  { path: '/co-ao', component: CoAo },
  { path: '/tay-ao', component: TayAo },
  { path: '/mau-sac', component: MauSac },
  { path: '/kich-co', component: KichCo },

  // Nhóm khác
  { path: '/hoa-don', component: TrangHoaDon },
  { path: '/khach-hang', component: QuanLyKhachHang },
  { path: '/thong-ke', component: { template: '<div>Trang Thống kê</div>' } },
  { path: '/ban-hang', component: { template: '<div>Trang Bán hàng</div>' } },
  { path: '/dot-giam-gia', component: { template: '<div>Trang Đợt giảm giá</div>' } },
  { path: '/phieu-giam-gia', component: { template: '<div>Trang Phiếu giảm giá</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
