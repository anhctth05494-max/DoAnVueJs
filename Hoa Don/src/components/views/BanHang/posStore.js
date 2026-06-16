import { defineStore } from 'pinia';
import axios from 'axios';

export const usePosStore = defineStore('pos', {
  state: () => ({
    dsHoaDonCho: [],
    hoaDonActive: null,
    dsSanPhamTrongGio: [],
    khachHangSelected: null,
    isGiaoHang: false,
    formGiaoHang: {
       soDienThoai: '', diaChiCuThe: '', tinhThanh: '', quanHuyen: '', phuongXa: '', ghiChu: ''
    }
  }),

  getters: {
    tongTienHang: (state) => {
      return state.dsSanPhamTrongGio.reduce((total, item) => total + (item.giaBan * item.soLuong), 0);
    }
  },

  actions: {
    async fetchHoaDonCho() {
      try {
        const res = await axios.get('http://localhost:8080/api/hoadon/cho-xac-nhan'); 
        this.dsHoaDonCho = res.data || [];
        if (this.dsHoaDonCho.length > 0 && !this.hoaDonActive) {
           this.setHoaDonActive(this.dsHoaDonCho[0]);
        }
      } catch (error) { console.error("Lỗi fetch hóa đơn:", error); }
    },

    async setHoaDonActive(hd) {
       this.hoaDonActive = hd;
       // Gọi API lấy detail giỏ hàng...
    },
    
    resetKhachHang() {
       this.khachHangSelected = null;
       this.formGiaoHang = { soDienThoai: '', diaChiCuThe: '', tinhThanh: '', quanHuyen: '', phuongXa: '', ghiChu: '' };
    }
  }
});