import { createRouter, createWebHistory } from 'vue-router'

// Import các Views chính
import QuanLySanPham from '../components/views/SanPham/QuanLySanPham.vue'
import ThemSanPham from '../components/views/SanPham/ThemSanPham.vue'
import DanhSachChiTiet from '../components/views/SanPham/DanhSachChiTiet.vue'
import TrangHoaDon from '../components/views/HoaDon/TrangHoaDon.vue'

// ✅ BƯỚC 1: IMPORT GIAO DIỆN QUẢN LÝ KHÁCH HÀNG VÀO ĐÂY
import QuanLyKhachHang from '../components/views/KhachHang/QuanLyKhachHang.vue'

import DotGiamGia from '../components/views/GiamGia/DotGiamGia.vue';
import PhieuGiamGia from '../components/views/GiamGia/PhieuGiamGia.vue';

// Import các View thuộc tính sản phẩm
import ThuongHieu from '../components/views/SanPham/ThuongHieu.vue'
import DanhMuc from '../components/views/SanPham/DanhMuc.vue'
import ChatLieu from '../components/views/SanPham/ChatLieu.vue'
import KieuDang from '../components/views/SanPham/KieuDang.vue'
import CoAo from '../components/views/SanPham/CoAo.vue'
import TayAo from '../components/views/SanPham/TayAo.vue'
import MauSac from '../components/views/SanPham/MauSac.vue'
import KichCo from '../components/views/SanPham/KichCo.vue'

// // ✅ BỔ SUNG LẠI CÁC IMPORT NHÂN VIÊN BỊ THIẾU
// import EmployeeManagement from '@/EmployeeManagement.vue'
// import EmployeeTable from '@/EmployeeTable.vue'
// import EmployeeForm from '@/EmployeeForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/san-pham/chi-tiet/:id',
      name: 'ChiTietSanPham',
      component: () => import('../components/views/SanPham/ChiTietSanPham.vue'),
    },
    { path: '/', redirect: '/san-pham' },

    // Nhóm Quản lý sản phẩm (Đã sửa comment từ -- thành //)
    {
      path: '/san-pham',
      name: 'QuanLySanPham',
      component: QuanLySanPham,
    },
    {
      path: '/san-pham/them',
      name: 'ThemSanPham',
      component: ThemSanPham,
    },
    {
      path: '/san-pham/danh-sach-chi-tiet',
      name: 'DanhSachChiTiet',
      component: DanhSachChiTiet,
    },

    // Nhóm Thuộc tính sản phẩm
    { path: '/thuong-hieu', component: ThuongHieu },
    { path: '/danh-muc', component: DanhMuc },
    { path: '/chat-lieu', component: ChatLieu },
    { path: '/kieu-dang', component: KieuDang },
    { path: '/co-ao', component: CoAo },
    { path: '/tay-ao', component: TayAo },
    { path: '/mau-sac', component: MauSac },
    { path: '/kich-co', component: KichCo },

    // Nhóm các module khác
    { path: '/hoa-don', component: TrangHoaDon },
    { path: '/thong-ke', component: { template: '<div>Trang Thống kê</div>' } },
    { path: '/ban-hang', component: { template: '<div>Trang Bán hàng</div>' } },

    // ✅ BƯỚC 2: SỬA LẠI ĐƯỜNG DẪN TRANG KHÁCH HÀNG
    {
      path: '/khach-hang',
      name: 'QuanLyKhachHang',
      component: QuanLyKhachHang,
    },

    // Nhóm Giảm giá
    { path: '/dot-giam-gia', component: { template: '<div>Trang Đợt giảm giá</div>' } },
    { path: '/phieu-giam-gia', component: { template: '<div>Trang Phiếu giảm giá</div>' } },

  { 
    path: '/dot-giam-gia', 
    name: 'DotGiamGia',
    component: DotGiamGia 
},
{ 
    path: '/phieu-giam-gia', 
    name: 'PhieuGiamGia',
    component: PhieuGiamGia 
},



    
    // Nhóm Nhân viên
    // {
    //   path: '/nhan-vien',
    //   component: EmployeeManagement,
    //   children: [
    //     {
    //       path: '', // Khi vào /nhan-vien -> Nạp bảng danh sách
    //       component: EmployeeTable,
    //     },
    //     {
    //       path: 'add', // Khi vào /nhan-vien/add -> Nạp Form thêm mới
    //       component: EmployeeForm,
    //     },
    //     {
    //       path: 'edit/:id', // Khi vào /nhan-vien/edit/:id -> Nạp Form sửa
    //       component: EmployeeForm,
    //     },
    //   ],
    // },
  ],
})

export default router
