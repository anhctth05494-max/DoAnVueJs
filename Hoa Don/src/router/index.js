import { createRouter, createWebHistory } from 'vue-router'

// ==========================================
// 1. IMPORT CÁC VIEWS BÊN KHÁCH HÀNG (Client)
// ==========================================
import TrangChuKhachHang from '../components/KhachHang/TrangChu.vue'
import SanPhamKhachHang from '../components/KhachHang/SanPham.vue'
import VoucherKhachHang from '../components/KhachHang/Voucher.vue'
import LienHeKhachHang from '../components/KhachHang/LienHe.vue'
import GioHangKhachHang from '../components/KhachHang/GioHang.vue'

// ==========================================
// 2. IMPORT CÁC VIEWS BÊN QUẢN TRỊ (Admin)
// ==========================================
import QuanLySanPham from '../components/views/SanPham/QuanLySanPham.vue'
import ThemSanPham from '../components/views/SanPham/ThemSanPham.vue'
import DanhSachChiTiet from '../components/views/SanPham/DanhSachChiTiet.vue'
import ChiTietSanPham from '../components/views/SanPham/ChiTietSanPham.vue'
import TrangHoaDon from '../components/views/HoaDon/TrangHoaDon.vue'
import QuanLyKhachHang from '../components/views/KhachHang/QuanLyKhachHang.vue'
import DotGiamGia from '../components/views/GiamGia/DotGiamGia.vue'
import PhieuGiamGia from '../components/views/GiamGia/PhieuGiamGia.vue'
import BanHang from '../components/views/BanHang/BanHang.vue'
import DangNhap from '../components/views/DangNhap/DangNhap.vue'
import Register from '../components/views/DangNhap/Register.vue'
import QuenMatKhau from '../components/views/DangNhap/QuenMatKhau.vue'
import LichLamViec from '../components/views/LichLamViec/LichLamViec.vue'

// Import thuộc tính sản phẩm
import ThuongHieu from '../components/views/SanPham/ThuongHieu.vue'
import DanhMuc from '../components/views/SanPham/DanhMuc.vue'
import ChatLieu from '../components/views/SanPham/ChatLieu.vue'
import KieuDang from '../components/views/SanPham/KieuDang.vue'
import CoAo from '../components/views/SanPham/CoAo.vue'
import TayAo from '../components/views/SanPham/TayAo.vue'
import MauSac from '../components/views/SanPham/MauSac.vue'
import KichCo from '../components/views/SanPham/KichCo.vue'

// Import nhân viên
import EmployeeManagement from '../components/views/NhanVien/EmployeeManagement.vue'
import EmployeeTable from '../components/views/NhanVien/EmployeeTable.vue'
import EmployeeForm from '../components/views/NhanVien/EmployeeForm.vue'

// Giả định thêm view Đăng nhập nếu chưa có
// import DangNhap from '../components/Auth/DangNhap.vue' 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ==========================================
    // NHÓM ROUTER KHÔNG CẦN LOGIN (Hoặc trang Auth)
    // ==========================================
    // { path: '/dang-nhap', name: 'DangNhap', component: DangNhap },

    // ==========================================
    // NHÓM ROUTER KHÁCH HÀNG (Trang chủ mặc định)
    // ==========================================
    { 
      path: '/', 
      name: 'TrangChuClient', 
      component: TrangChuKhachHang,
      meta: { requiresRole: 'khachhang' }, 
    },
    { 
      path: '/cua-hang', 
      name: 'CuaHangClient', 
      component: SanPhamKhachHang,
      meta: { requiresRole: 'khachhang' },
    },
    { 
      path: '/san-voucher', 
      name: 'VoucherClient', 
      component: VoucherKhachHang,
      meta: { requiresRole: 'khachhang' }, 
    },
    { 
      path: '/lien-he', 
      name: 'LienHeClient', 
      component: LienHeKhachHang,
      meta: { requiresRole: 'khachhang' }, 
    },
    { 
      path: '/gio-hang', 
      name: 'GioHangClient', 
      component: GioHangKhachHang,
      meta: { requiresRole: 'khachhang' },
    },

    // ==========================================
    // NHÓM ROUTER QUẢN TRỊ ADMIN (Đã gộp meta lại làm một)
    // ==========================================
    // MODULE: QUẢN LÝ SẢN PHẨM & CHI TIẾT
    {
      path: '/san-pham',
      name: 'QuanLySanPham',
      component: QuanLySanPham,
      meta: { title: 'Quản Lý Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Danh sách', requiresRole: 'nhanvien' },
    },
    {
      path: '/san-pham/them',
      name: 'ThemSanPham',
      component: ThemSanPham,
      meta: { title: 'Thêm Mới Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Thêm mới', requiresRole: 'nhanvien' },
    },
    {
      path: '/san-pham/danh-sach-chi-tiet',
      name: 'DanhSachChiTiet',
      component: DanhSachChiTiet,
      meta: { title: 'Biến Thể Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Danh sách chi tiết', requiresRole: 'nhanvien' },
    },
    {
      path: '/san-pham/chi-tiet/:id',
      name: 'ChiTietSanPham',
      component: ChiTietSanPham,
      meta: { title: 'Chi Tiết Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Chi tiết sản phẩm', requiresRole: 'nhanvien' },
    },

    // MODULE: THUỘC TÍNH SẢN PHẨM
    {
      path: '/thuong-hieu',
      component: ThuongHieu,
      meta: { title: 'Quản Lý Thương Hiệu', breadcrumb: 'Trang chủ | Sản phẩm | Thương hiệu', requiresRole: 'nhanvien' },
    },
    {
      path: '/danh-muc',
      component: DanhMuc,
      meta: { title: 'Quản Lý Danh Mục', breadcrumb: 'Trang chủ | Sản phẩm | Danh mục', requiresRole: 'nhanvien' },
    },
    {
      path: '/chat-lieu',
      component: ChatLieu,
      meta: { title: 'Quản Lý Chất Liệu', breadcrumb: 'Trang chủ | Sản phẩm | Chất liệu', requiresRole: 'nhanvien' },
    },
    {
      path: '/kieu-dang',
      component: KieuDang,
      meta: { title: 'Quản Lý Kiểu Dáng', breadcrumb: 'Trang chủ | Sản phẩm | Kiểu dáng', requiresRole: 'nhanvien' },
    },
    {
      path: '/co-ao',
      component: CoAo,
      meta: { title: 'Quản Lý Cổ Áo', breadcrumb: 'Trang chủ | Sản phẩm | Cổ áo', requiresRole: 'nhanvien' },
    },
    {
      path: '/tay-ao',
      component: TayAo,
      meta: { title: 'Quản Lý Tay Áo', breadcrumb: 'Trang chủ | Sản phẩm | Tay áo', requiresRole: 'nhanvien' },
    },
    {
      path: '/mau-sac',
      component: MauSac,
      meta: { title: 'Quản Lý Màu Sắc', breadcrumb: 'Trang chủ | Sản phẩm | Màu sắc', requiresRole: 'nhanvien' },
    },
    {
      path: '/kich-co',
      component: KichCo,
      meta: { title: 'Quản Lý Kích Cỡ', breadcrumb: 'Trang chủ | Sản phẩm | Kích cỡ', requiresRole: 'nhanvien' },
    },

    // MODULE: CÁC MODULE CHÍNH KHÁC
    {
      path: '/hoa-don',
      component: TrangHoaDon,
      meta: { title: 'Quản Lý Hóa Đơn', breadcrumb: 'Trang chủ | Hóa đơn', requiresRole: 'nhanvien' },
    },
    {
      path: '/khach-hang',
      name: 'QuanLyKhachHang',
      component: QuanLyKhachHang,
      meta: { title: 'Quản Lý Khách Hàng', breadcrumb: 'Trang chủ | Khách hàng', requiresRole: 'nhanvien' },
    },

    // MODULE: GIẢM GIÁ
    {
      path: '/dot-giam-gia',
      name: 'DotGiamGia',
      component: DotGiamGia,
      meta: { title: 'Đợt Giảm Giá', breadcrumb: 'Trang chủ | Giảm giá | Đợt giảm giá', requiresRole: 'nhanvien' },
    },
    {
      path: '/phieu-giam-gia',
      name: 'PhieuGiamGia',
      component: PhieuGiamGia,
      meta: { title: 'Quản Lý Phiếu Giảm Giá', breadcrumb: 'Trang chủ | Giảm giá | Phiếu giảm giá', requiresRole: 'nhanvien' },
    },
    {
      path: '/ban-hang',
      name: 'BanHang',
      component: BanHang,
      meta: { title: 'Bán Hàng Tại Quầy', requiresRole: 'nhanvien' },
    },
    
    // MODULE: QUẢN LÝ NHÂN VIÊN (Route lồng nhau - Nested Routes)
    {
      path: '/nhan-vien',
      component: EmployeeManagement,
      meta: { requiresRole: 'nhanvien' }, // Quyền áp dụng cho cả cụm con
      children: [
        {
          path: '',
          component: EmployeeTable,
          meta: { title: 'Quản Lý Nhân Viên', breadcrumb: 'Trang chủ | Nhân viên | Danh sách' },
        },
        {
          path: 'add',
          component: EmployeeForm,
          meta: { title: 'Thêm Mới Nhân Viên', breadcrumb: 'Trang chủ | Nhân viên | Thêm mới' },
        },
        {
          path: 'edit/:id',
          component: EmployeeForm,
          meta: { title: 'Cập Nhật Nhân Viên', breadcrumb: 'Trang chủ | Nhân viên | Chỉnh sửa' },
        },
      ],
    },
      {
    path: '/dang-nhap',
    name: 'DangNhap',
    component: DangNhap,
    meta: { title: 'Đăng Nhập', breadcrumb: 'Trang chủ | Đăng nhập' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Đăng Ký', breadcrumb: 'Trang chủ | Đăng ký' },
  },
  {
    path: '/quen-mat-khau',
    name: 'QuenMatKhau',
    component: QuenMatKhau,
    meta: { title: 'Quên Mật Khẩu', breadcrumb: 'Trang chủ | Quên mật khẩu' },
  },
  {
    path: '/lich-lam-viec',
    name: 'LichLamViec',
    component: LichLamViec,
    meta: { title: 'Xếp Lịch Nhân Viên', breadcrumb: 'Trang chủ | Lịch làm việc | Xếp lịch nhân viên', requiresRole: 'nhanvien' },
  },

  ],
})

// Guard bảo mật kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole')

  // 1. Nếu cố tình vào Đăng nhập / Đăng ký khi ĐÃ ĐĂNG NHẬP rồi
  if ((to.path === '/dang-nhap' || to.path === '/register') && userRole) {
    if (userRole === 'nhanvien') return next('/ban-hang')
    if (userRole === 'khachhang') return next('/')
  }

  // Lấy ra role yêu cầu (Hỗ trợ tốt cho cả route con lồng nhau)
  const requiredRole = to.matched.reduce((role, record) => record.meta.requiresRole || role, undefined)

  // 2. Kiểm tra phân quyền các trang bảo mật
  if (requiredRole) {
    
    // Chưa đăng nhập mà đòi vào trang bảo mật
    if (!userRole) {
      return next('/dang-nhap')
    }

    // ĐÃ ĐĂNG NHẬP nhưng sai quyền truy cập
    if (requiredRole !== userRole) {
      alert('Bạn không có quyền truy cập vào trang này!')
      
      if (userRole === 'khachhang') {
        return next('/')
      }
      if (userRole === 'nhanvien') {
        return next('/ban-hang')
      }
      
      return next('/dang-nhap')
    }
  }

  // Hợp lệ, cho đi tiếp
  next()
})

export default router