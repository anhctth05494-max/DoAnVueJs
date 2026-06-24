import { createRouter, createWebHistory } from 'vue-router'

// ==========================================
// 1. IMPORT CÁC VIEWS BÊN KHÁCH HÀNG (Client)
// ==========================================
import TrangChuKhachHang from '../components/KhachHang/TrangChu.vue'
import SanPhamKhachHang from '../components/KhachHang/SanPham.vue'
import GioiThieuKhachHang from '../components/KhachHang/GioiThieu.vue'
import DonHangKhachHang from '../components/KhachHang/DonHang.vue'
import LienHeKhachHang from '../components/KhachHang/LienHe.vue'
import GioHangKhachHang from '../components/KhachHang/GioHang.vue'
import TrangThanhToan from '../components/KhachHang/ThanhToan.vue'
import TraCuuDonHang from '../components/KhachHang/TraCuuDonHang.vue' // THÊM IMPORT TRA CỨU ĐƠN HÀNG

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
import CaLamViec from '../components/views/LichLamViec/CaLamViec.vue'

// Import thuộc tính sản phẩm
import ThuongHieu from '../components/views/SanPham/ThuongHieu.vue'
import DanhMuc from '../components/views/SanPham/DanhMuc.vue'
import ChatLieu from '../components/views/SanPham/ChatLieu.vue'
import KieuDang from '../components/views/SanPham/KieuDang.vue'
import CoAo from '../components/views/SanPham/CoAo.vue'
import TayAo from '../components/views/SanPham/TayAo.vue'
import MauSac from '../components/views/SanPham/MauSac.vue'
import KichCo from '../components/views/SanPham/KichCo.vue'
import SelectThongMinh from '../components/views/SanPham/SelectThongMinh.vue'
import ThongKe from '../components/views/ThongKe/ThongKe.vue'

// Import nhân viên
import EmployeeManagement from '../components/views/NhanVien/EmployeeManagement.vue'
import EmployeeTable from '../components/views/NhanVien/EmployeeTable.vue'
import EmployeeForm from '../components/views/NhanVien/EmployeeForm.vue'
import HoaDonChiTiet from '../components/views/HoaDon/HoaDonChiTiet.vue'
import CaViecNV from '../components/views/LichLamViec/CaViecNV.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ==========================================
    // NHÓM ROUTER KHÁCH HÀNG
    // ==========================================
    {
      path: '/',
      name: 'TrangChuClient',
      component: TrangChuKhachHang,
      meta: { requiresRole: ['khachhang', null] },
    },
    {
      path: '/cua-hang',
      name: 'CuaHangClient',
      component: SanPhamKhachHang,
      meta: { requiresRole: ['khachhang', null] },
    },
    {
      path: '/gioi-thieu',
      name: 'GioiThieuClient',
      component: GioiThieuKhachHang,
      meta: { requiresRole: ['khachhang', null] },
    },
    {
      path: '/don-hang',
      name: 'DonHangClient',
      component: DonHangKhachHang,
      meta: { requiresRole: ['khachhang'] }, // Bắt buộc đăng nhập mới xem được đơn hàng
    },
    {
      path: '/tra-cuu', // THÊM ROUTE TRA CỨU ĐƠN HÀNG
      name: 'TraCuuDonHang',
      component: TraCuuDonHang,
      meta: { requiresRole: ['khachhang', null] }, // Cả khách vãng lai (null) và đã đăng nhập đều dùng được
    },
    {
      path: '/lien-he',
      name: 'LienHeClient',
      component: LienHeKhachHang,
      meta: { requiresRole: ['khachhang', null] },
    },
    {
      path: '/gio-hang',
      name: 'GioHangClient',
      component: GioHangKhachHang,
      meta: { requiresRole: ['khachhang', null] },
    },
    {
      path: '/thanh-toan',
      name: 'ThanhToanClient',
      component: TrangThanhToan,
      meta: { requiresRole: ['khachhang', null] },
    },

    // ==========================================
    // NHÓM ROUTER QUẢN TRỊ ADMIN
    // ==========================================

    // MODULE: LỊCH LÀM VIỆC & CA LÀM VIỆC
    {
      path: '/lich-lam-viec',
      name: 'LichLamViec',
      component: LichLamViec,
      meta: {
        title: 'Xếp Lịch Nhân Viên',
        breadcrumb: 'Trang chủ | Lịch làm việc | Xếp lịch nhân viên',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/lich-lam-viec/quan-ly-ca',
      name: 'QuanLyCa',
      component: CaLamViec,
      meta: {
        title: 'Quản Lý Ca Làm Việc',
        breadcrumb: 'Trang chủ | Lịch làm việc | Quản lý ca',
        requiresRole: 'quanly',
      },
    },

    // MODULE: QUẢN LÝ SẢN PHẨM & CHI TIẾT
    {
      path: '/san-pham',
      name: 'QuanLySanPham',
      component: QuanLySanPham,
      meta: {
        title: 'Quản Lý Sản Phẩm',
        breadcrumb: 'Trang chủ | Sản phẩm | Danh sách',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/san-pham/them',
      name: 'ThemSanPham',
      component: ThemSanPham,
      meta: {
        title: 'Thêm Mới Sản Phẩm',
        breadcrumb: 'Trang chủ | Sản phẩm | Thêm mới',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/san-pham/select-thong-minh',
      name: 'SelectThongMinh',
      component: SelectThongMinh,
      meta: {
        title: 'Chọn Thông Minh',
        breadcrumb: 'Trang chủ | Sản phẩm | Chọn thông minh',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/san-pham/danh-sach-chi-tiet',
      name: 'DanhSachChiTiet',
      component: DanhSachChiTiet,
      meta: {
        title: 'Biến Thể Sản Phẩm',
        breadcrumb: 'Trang chủ | Sản phẩm | Danh sách chi tiết',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/san-pham/chi-tiet/:id',
      name: 'ChiTietSanPham',
      component: ChiTietSanPham,
      meta: {
        title: 'Chi Tiết Sản Phẩm',
        breadcrumb: 'Trang chủ | Sản phẩm | Chi tiết sản phẩm',
        requiresRole: 'quanly',
      },
    },

    // MODULE: THUỘC TÍNH SẢN PHẨM
    {
      path: '/thuong-hieu',
      component: ThuongHieu,
      meta: {
        title: 'Quản Lý Thương Hiệu',
        breadcrumb: 'Trang chủ | Sản phẩm | Thương hiệu',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/danh-muc',
      component: DanhMuc,
      meta: {
        title: 'Quản Lý Danh Mục',
        breadcrumb: 'Trang chủ | Sản phẩm | Danh mục',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/chat-lieu',
      component: ChatLieu,
      meta: {
        title: 'Quản Lý Chất Liệu',
        breadcrumb: 'Trang chủ | Sản phẩm | Chất liệu',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/kieu-dang',
      component: KieuDang,
      meta: {
        title: 'Quản Lý Kiểu Dáng',
        breadcrumb: 'Trang chủ | Sản phẩm | Kiểu dáng',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/co-ao',
      component: CoAo,
      meta: {
        title: 'Quản Lý Cổ Áo',
        breadcrumb: 'Trang chủ | Sản phẩm | Cổ áo',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/tay-ao',
      component: TayAo,
      meta: {
        title: 'Quản Lý Tay Áo',
        breadcrumb: 'Trang chủ | Sản phẩm | Tay áo',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/mau-sac',
      component: MauSac,
      meta: {
        title: 'Quản Lý Màu Sắc',
        breadcrumb: 'Trang chủ | Sản phẩm | Màu sắc',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/kich-co',
      component: KichCo,
      meta: {
        title: 'Quản Lý Kích Cỡ',
        breadcrumb: 'Trang chủ | Sản phẩm | Kích cỡ',
        requiresRole: 'quanly',
      },
    },

    // MODULE: CÁC MODULE CHÍNH KHÁC
    {
      path: '/hoa-don',
      component: TrangHoaDon,
      meta: {
        title: 'Quản Lý Hóa Đơn',
        breadcrumb: 'Trang chủ | Hóa đơn',
        requiresRole: ['quanly', 'nhanvien'],
      },
    },
    {
      path: '/hoa-don/chi-tiet/:id',
      name: 'HoaDonChiTiet',
      component: HoaDonChiTiet,
      meta: {
        title: 'Chi Tiết Hóa Đơn',
        breadcrumb: 'Trang chủ | Hóa đơn | Chi tiết',
        requiresRole: ['quanly', 'nhanvien'],
      },
    },
    {
      path: '/khach-hang',
      name: 'QuanLyKhachHang',
      component: QuanLyKhachHang,
      meta: {
        title: 'Quản Lý Khách Hàng',
        breadcrumb: 'Trang chủ | Khách hàng',
        requiresRole: 'quanly',
      },
    },

    // MODULE: GIẢM GIÁ
    {
      path: '/dot-giam-gia',
      name: 'DotGiamGia',
      component: DotGiamGia,
      meta: {
        title: 'Đợt Giảm Giá',
        breadcrumb: 'Trang chủ | Giảm giá | Đợt giảm giá',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/phieu-giam-gia',
      name: 'PhieuGiamGia',
      component: PhieuGiamGia,
      meta: {
        title: 'Quản Lý Phiếu Giảm Giá',
        breadcrumb: 'Trang chủ | Giảm giá | Phiếu giảm giá',
        requiresRole: 'quanly',
      },
    },
    {
      path: '/ban-hang',
      name: 'BanHang',
      component: BanHang,
      meta: { title: 'Bán Hàng Tại Quầy', requiresRole: ['quanly', 'nhanvien'] },
    },
    {
      path: '/thong-ke',
      name: 'ThongKe',
      component: ThongKe,
      meta: {
        title: 'Thống Kê',
        breadcrumb: 'Trang chủ | Thống kê',
        requiresRole: ['quanly', 'nhanvien'],
      },
    },
    {
      path: '/ca-viec-nhan-vien',
      name: 'CaViecNV',
      component: CaViecNV,
      meta: {
        title: 'Ca Việc Nhân Viên',
        breadcrumb: 'Trang chủ | Ca Việc Nhân Viên',
        requiresRole: ['quanly', 'nhanvien'],
      },
    },

    // MODULE: QUẢN LÝ NHÂN VIÊN (Nested Routes)
    {
      path: '/nhan-vien',
      component: EmployeeManagement,
      meta: { requiresRole: 'quanly' },
      children: [
        {
          path: '',
          component: EmployeeTable,
          meta: { title: 'Quản Lý Nhân Viên', breadcrumb: 'Trang chủ | Nhân viên | Danh sách', requiresRole: 'quanly' },
        },
        {
          path: 'add',
          component: EmployeeForm,
          meta: { title: 'Thêm Mới Nhân Viên', breadcrumb: 'Trang chủ | Nhân viên | Thêm mới', requiresRole: 'quanly' },
        },
        {
          path: 'edit/:id',
          component: EmployeeForm,
          meta: { title: 'Cập Nhật Nhân Viên', breadcrumb: 'Trang chủ | Nhân viên | Chỉnh sửa', requiresRole: 'quanly' },
        },
      ],
    },

    // MODULE: TÀI KHOẢN / AUTH
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
  ],
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole') // Trả về chuỗi hoặc null nếu không tồn tại

  // 1. Nếu cố tình vào Đăng nhập / Đăng ký / Quên mật khẩu khi ĐÃ ĐĂNG NHẬP rồi
  if ((to.path === '/dang-nhap' || to.path === '/register' || to.path === '/quen-mat-khau') && userRole) {
    if (userRole === 'quanly') return next('/thong-ke')  
    if (userRole === 'nhanvien') return next('/ban-hang')
    if (userRole === 'khachhang') return next('/')
  }

  // 2. Lấy ra tất cả role yêu cầu của route hiện tại
  const requiredRoles = to.matched.flatMap((record) => {
    const required = record.meta.requiresRole
    if (!required) return []
    return Array.isArray(required) ? required : [required]
  })

  // 3. Kiểm tra phân quyền các trang bảo mật
  if (requiredRoles.length > 0) {
    
    // Kiểm tra xem route hiện tại có chấp nhận Khách vãng lai (null hoặc chuỗi rỗng) không
    const allowsGuest = requiredRoles.includes(null) || requiredRoles.includes('')

    // Nếu route cho phép khách VÀ người dùng hiện tại chưa đăng nhập -> Cho qua luôn
    if (allowsGuest && !userRole) {
      return next()
    }

    // Nếu route KHÔNG cho phép khách, mà người dùng chưa đăng nhập -> Đá về Login
    if (!userRole) {
      return next('/dang-nhap')
    }

    // Kiểm tra xem quyền hiện tại của user có khớp với danh sách cho phép không
    if (!requiredRoles.includes(userRole)) {
      alert('Bạn không có quyền truy cập vào trang này!')
      
      if (userRole === 'quanly') return next('/thong-ke')  
      if (userRole === 'nhanvien') return next('/ban-hang')
      if (userRole === 'khachhang') return next('/')        
      
      return next('/dang-nhap')
    }
  }

  next()
})

export default router