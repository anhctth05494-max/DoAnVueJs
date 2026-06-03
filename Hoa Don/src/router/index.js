import { createRouter, createWebHistory } from 'vue-router'

// Import các Views chính
import QuanLySanPham from '../components/views/SanPham/QuanLySanPham.vue'
import ThemSanPham from '../components/views/SanPham/ThemSanPham.vue'
import DanhSachChiTiet from '../components/views/SanPham/DanhSachChiTiet.vue'
import TrangHoaDon from '../components/views/TrangHoaDon.vue'

// Import các View thuộc tính sản phẩm
import ThuongHieu from '../components/views/SanPham/ThuongHieu.vue'
import DanhMuc from '../components/views/SanPham/DanhMuc.vue'
import ChatLieu from '../components/views/SanPham/ChatLieu.vue'
import KieuDang from '../components/views/SanPham/KieuDang.vue'
import CoAo from '../components/views/SanPham/CoAo.vue'
import TayAo from '../components/views/SanPham/TayAo.vue'
import MauSac from '../components/views/SanPham/MauSac.vue'
import KichCo from '../components/views/SanPham/KichCo.vue'

import EmployeeManagement from '@/EmployeeManagement.vue';
import EmployeeTable from '../components/EmployeeTable.vue'; // 🌟 Import component bảng danh sách vào đây
import EmployeeForm from '../components/EmployeeForm.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/san-pham/chi-tiet/:id',
      name: 'ChiTietSanPham',
      component: () => import('../components/views/SanPham/ChiTietSanPham.vue'), // Sửa đường dẫn này
    },
    { path: '/', redirect: '/san-pham' },

    // Nhóm Quản lý sản phẩm
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
    { path: '/phieu-giam-gia', component: { template: '<div>Trang Phiếu giảm giá</div>' } },
    { path: '/khach-hang', component: { template: '<div>Trang Khách hàng</div>' } },
    {path: "/employees", component: EmployeeManagement,
      children: [
        { 
          path: "", // Khi truy cập đúng /employees -> Sẽ nạp bảng danh sách
          component: EmployeeTable 
        }, 
        { 
          path: "add", // Khi truy cập /employees/add -> Nạp Form thêm mới
          component: EmployeeForm 
        }, 
        { 
          path: "edit/:id", // Khi truy cập /employees/edit/:id -> Nạp Form sửa
          component: EmployeeForm 
        }
      ]
    },
  ],
})

export default router
