import { createRouter, createWebHistory } from 'vue-router'

// Import các Views chính
import QuanLySanPham from '../components/views/SanPham/QuanLySanPham.vue'
import ThemSanPham from '../components/views/SanPham/ThemSanPham.vue'
import DanhSachChiTiet from '../components/views/SanPham/DanhSachChiTiet.vue'
import ChiTietSanPham from '../components/views/SanPham/ChiTietSanPham.vue'
import TrangHoaDon from '../components/views/HoaDon/TrangHoaDon.vue'
import QuanLyKhachHang from '../components/views/KhachHang/QuanLyKhachHang.vue'
import DotGiamGia from '../components/views/GiamGia/DotGiamGia.vue'
import PhieuGiamGia from '../components/views/GiamGia/PhieuGiamGia.vue'

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
import LichLamViec from '../components/views/LichLamViec/LichLamViec.vue'
import DangNhap from '../components/views/DangNhap/DangNhap.vue'
import Register from '../components/views/DangNhap/Register.vue'
import QuenMatKhau from '../components/views/DangNhap/QuenMatKhau.vue'
import ThongKe from '../components/views/ThongKe/ThongKe.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dang-nhap' },
     
    {
      path: '/thong-ke',
      name: 'ThongKe',
      component: ThongKe, 
      meta: { title: 'Thống Kê Doanh Thu', breadcrumb: 'Trang chủ | Thống kê' },
    },
    // MODULE: QUẢN LÝ SẢN PHẨM & CHI TIẾT
    {
      path: '/san-pham',
      name: 'QuanLySanPham',
      component: QuanLySanPham,
      meta: { title: 'Quản Lý Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Danh sách' },
    },
    {
      path: '/san-pham/them',
      name: 'ThemSanPham',
      component: ThemSanPham,
      meta: { title: 'Thêm Mới Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Thêm mới' },
    },
    {
      path: '/san-pham/danh-sach-chi-tiet',
      name: 'DanhSachChiTiet',
      component: DanhSachChiTiet,
      meta: { title: 'Biến Thể Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Danh sách chi tiết' },
    },
    {
      path: '/san-pham/chi-tiet/:id',
      name: 'ChiTietSanPham',
      component: ChiTietSanPham,
      meta: { title: 'Chi Tiết Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Chi tiết sản phẩm' },
    },

    // MODULE: THUỘC TÍNH SẢN PHẨM
    {
      path: '/thuong-hieu',
      component: ThuongHieu,
      meta: { title: 'Quản Lý Thương Hiệu', breadcrumb: 'Trang chủ | Sản phẩm | Thương hiệu' },
    },
    {
      path: '/danh-muc',
      component: DanhMuc,
      meta: { title: 'Quản Lý Danh Mục', breadcrumb: 'Trang chủ | Sản phẩm | Danh mục' },
    },
    {
      path: '/chat-lieu',
      component: ChatLieu,
      meta: { title: 'Quản Lý Chất Liệu', breadcrumb: 'Trang chủ | Sản phẩm | Chất liệu' },
    },
    {
      path: '/kieu-dang',
      component: KieuDang,
      meta: { title: 'Quản Lý Kiểu Dáng', breadcrumb: 'Trang chủ | Sản phẩm | Kiểu dáng' },
    },
    {
      path: '/co-ao',
      component: CoAo,
      meta: { title: 'Quản Lý Cổ Áo', breadcrumb: 'Trang chủ | Sản phẩm | Cổ áo' },
    },
    {
      path: '/tay-ao',
      component: TayAo,
      meta: { title: 'Quản Lý Tay Áo', breadcrumb: 'Trang chủ | Sản phẩm | Tay áo' },
    },
    {
      path: '/mau-sac',
      component: MauSac,
      meta: { title: 'Quản Lý Màu Sắc', breadcrumb: 'Trang chủ | Sản phẩm | Màu sắc' },
    },
    {
      path: '/kich-co',
      component: KichCo,
      meta: { title: 'Quản Lý Kích Cỡ', breadcrumb: 'Trang chủ | Sản phẩm | Kích cỡ' },
    },

    // MODULE: CÁC MODULE CHÍNH KHÁC
    {
      path: '/hoa-don',
      component: TrangHoaDon,
      meta: { title: 'Quản Lý Hóa Đơn', breadcrumb: 'Trang chủ | Hóa đơn' },
    },
    {
      path: '/khach-hang',
      name: 'QuanLyKhachHang',
      component: QuanLyKhachHang,
      meta: { title: 'Quản Lý Khách Hàng', breadcrumb: 'Trang chủ | Khách hàng' },
    },

    // MODULE: GIẢM GIÁ
    {
      path: '/dot-giam-gia',
      name: 'DotGiamGia',
      component: DotGiamGia,
      meta: { title: 'Đợt Giảm Giá', breadcrumb: 'Trang chủ | Giảm giá | Đợt giảm giá' },
    },
    {
      path: '/phieu-giam-gia',
      name: 'PhieuGiamGia',
      component: PhieuGiamGia,
      meta: {
        title: 'Quản Lý Phiếu Giảm Giá',
        breadcrumb: 'Trang chủ | Giảm giá | Phiếu giảm giá',
      },
    },
    {
      path: '/lich-lam-viec',
      name: 'LichLamViec',
      component: LichLamViec,
      meta: { title: 'Xếp Lịch Nhân Viên', breadcrumb: 'Trang chủ | Lịch làm việc | Xếp lịch nhân viên' },
    },

    {
      path: '/dang-nhap',
      name: 'DangNhap',
      component: DangNhap,
      meta: { title: 'Đăng Nhập', breadcrumb: 'Trang chủ | Đăng nhập', noLayout: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { title: 'Đăng Ký', breadcrumb: 'Trang chủ | Đăng ký', noLayout: true },
    },
    {
      path: '/quen-mat-khau',
      name: 'QuenMatKhau',
      component: QuenMatKhau,
      meta: { title: 'Quên Mật Khẩu', breadcrumb: 'Trang chủ | Quên mật khẩu', noLayout: true },
    },

    // MODULE: QUẢN LÝ NHÂN VIÊN
    {
      path: '/nhan-vien',
      component: EmployeeManagement,
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
  ],
})

export default router
