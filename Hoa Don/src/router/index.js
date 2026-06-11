import { createRouter, createWebHistory } from 'vue-router'

// Import các Views chính
import QuanLySanPham from '../components/views/SanPham/QuanLySanPham.vue'
import ThemSanPham from '../components/views/SanPham/ThemSanPham.vue'
import DanhSachChiTiet from '../components/views/SanPham/DanhSachChiTiet.vue'
import TrangHoaDon from '../components/views/HoaDon/TrangHoaDon.vue'
import QuanLyKhachHang from '../components/views/KhachHang/QuanLyKhachHang.vue'
import DotGiamGia from '../components/views/GiamGia/DotGiamGia.vue'
import PhieuGiamGia from '../components/views/GiamGia/PhieuGiamGia.vue'
import ChiTietSanPham from '../components/views/SanPham/ChiTietSanPham.vue'
// Import các View thuộc tính sản phẩm
import ThuongHieu from '../components/views/SanPham/ThuongHieu.vue'
import DanhMuc from '../components/views/SanPham/DanhMuc.vue'
import ChatLieu from '../components/views/SanPham/ChatLieu.vue'
import KieuDang from '../components/views/SanPham/KieuDang.vue'
import CoAo from '../components/views/SanPham/CoAo.vue'
import TayAo from '../components/views/SanPham/TayAo.vue'
import MauSac from '../components/views/SanPham/MauSac.vue'
import KichCo from '../components/views/SanPham/KichCo.vue'

// Import các View thuộc tính nhân viên
import EmployeeManagement from '../components/views/NhanVien/EmployeeManagement.vue'
import EmployeeTable from '../components/views/NhanVien/EmployeeTable.vue'
import EmployeeForm from '../components/views/NhanVien/EmployeeForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/san-pham' },

    // ==========================================
    // MODULE: QUẢN LÝ SẢN PHẨM & CHI TIẾT
    // ==========================================
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
      component: ChiTietSanPham, // <-- Thay bằng biến tĩnh đã import ở đầu trang
      meta: { title: 'Chi Tiết Sản Phẩm', breadcrumb: 'Trang chủ | Sản phẩm | Chi tiết sản phẩm' },
    },

    // ==========================================
    // MODULE: THUỘC TÍNH SẢN PHẨM
    // ==========================================
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

    // ==========================================
    // MODULE: CÁC MODULE CHÍNH KHÁC
    // ==========================================
    {
      path: '/hoa-don',
      component: TrangHoaDon,
      meta: { title: 'Quản Lý Hóa Đơn', breadcrumb: 'Trang chủ | Hóa đơn' },
    },
    {
      path: '/thong-ke',
      component: { template: '<div class="p-3 fw-bold text-secondary">Trang Thống kê</div>' },
      meta: { title: 'Thống Kê Doanh Thu', breadcrumb: 'Trang chủ | Thống kê' },
    },
    {
      path: '/ban-hang',
      component: { template: '<div class="p-3 fw-bold text-secondary">Trang Bán hàng</div>' },
      meta: { title: 'Quản Lý Bán Hàng Tại Quầy', breadcrumb: 'Trang chủ | Bán hàng' },
    },
    {
      path: '/khach-hang',
      name: 'QuanLyKhachHang',
      component: QuanLyKhachHang,
      meta: { title: 'Quản Lý Khách Hàng', breadcrumb: 'Trang chủ | Khách hàng' },
    },

    // ==========================================
    // MODULE: GIẢM GIÁ
    // ==========================================
    {
      path: '/dot-giam-gia',
      name: 'DotGiamGia',
      component: DotGiamGia,
      meta: {
        title: 'Đợt Giảm Giá (Chương trình khuyến mãi)',
        breadcrumb: 'Trang chủ | Giảm giá | Đợt giảm giá',
      },
    },
    {
      path: '/phieu-giam-gia',
      name: 'PhieuGiamGia',
      component: PhieuGiamGia,
      meta: {
        title: 'Quản Lý Phiếu Giảm Giá (Voucher)',
        breadcrumb: 'Trang chủ | Giảm giá | Phiếu giảm giá',
      },
    },

    // ==========================================
    // MODULE: QUẢN LÝ NHÂN VIÊN (Lồng nhau - Children)
    // ==========================================
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
          meta: {
            title: 'Cập Nhật Thông Tin Nhân Viên',
            breadcrumb: 'Trang chủ | Nhân viên | Chỉnh sửa',
          },
        },
      ],
    },
  ],
})

export default router
