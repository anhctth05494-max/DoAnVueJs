<template>
  <div class="container-fluid py-3 px-4 pos-container">
    
    <div v-if="toast.show" class="toast-container-custom">
      <div class="toast-custom shadow-lg" :class="toast.type">
        <i v-if="toast.type === 'error'" class="bi bi-x-circle-fill text-danger fs-4 me-3"></i>
        <i v-if="toast.type === 'success'" class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
        <span class="fw-bold text-dark" style="font-size: 15px;">{{ toast.message }}</span>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4 pos-header bg-white rounded shadow-sm p-3 border">
      <div class="d-flex align-items-center gap-3">
        <span class="badge pos-badge px-3 py-2 fs-6">POS</span>
        <div>
          <h5 class="m-0 fw-bold text-dark">Bán hàng tại quầy</h5>
          <small class="text-muted">Đồng bộ Tồn Kho Thời Gian Thực <i class="bi bi-broadcast text-success"></i></small>
        </div>
      </div>
      <div class="d-flex gap-3 align-items-center">
        <span class="text-muted small fw-medium border rounded px-3 py-1">Đang mở {{ dsHoaDonCho.length }}/5</span>
        <button class="btn btn-tao-don shadow-sm fw-bold" @click="confirmTaoHoaDon" :disabled="dsHoaDonCho.length >= 5">
          <i class="bi bi-plus-lg me-1"></i> Tạo đơn hàng
        </button>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8 d-flex flex-column gap-4">
        
        <div class="pos-card bg-white rounded shadow-sm border p-3">
          <h6 class="fw-bold mb-3 d-flex align-items-center gap-2"><i class="bi bi-receipt"></i> Hóa đơn chờ</h6>
          <div class="d-flex gap-3 overflow-auto pb-2 custom-scrollbar">
            <div v-if="dsHoaDonCho.length === 0" class="text-muted small fst-italic py-2 w-100 text-center">
              Chưa có hóa đơn chờ nào. Vui lòng bấm "Tạo đơn hàng"!
            </div>

            <div 
              v-for="hd in dsHoaDonCho" 
              :key="hd.id" 
              class="hd-card border rounded p-2 flex-shrink-0 cursor-pointer" 
              :class="{ 'active-hd': hoaDonActive?.id === hd.id }"
              @click="chonHoaDon(hd)" 
            >
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold text-dark text-truncate-custom" :title="hd.maHoaDon">{{ hd.maHoaDon }}</span>
                <i class="bi bi-x text-muted fs-5 cursor-pointer hover-danger" @click.stop="confirmXoaHoaDon(hd)"></i>
              </div>
              <span class="badge bg-warning text-dark mb-2 px-2 py-1" style="font-size: 11px">Chờ xử lý</span>
              <div class="text-muted" style="font-size: 12px">{{ hd.so_san_pham || 0 }} sản phẩm</div>
            </div>
          </div>
        </div>

        <div class="pos-card bg-white rounded shadow-sm border p-3 flex-grow-1">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0 d-flex align-items-center gap-2"><i class="bi bi-cart3"></i> Giỏ hàng</h6>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-medium" @click="moModalQR">
                <i class="bi bi-qr-code-scan"></i> Quét QR
              </button>
              <button class="btn btn-tao-don btn-sm rounded-pill px-3 fw-medium" @click="moModalThemSP">
                <i class="bi bi-plus"></i> Thêm sản phẩm
              </button>
            </div>
          </div>
          <CartTable 
            :cartItems="dsSanPhamTrongGio" 
            @update-qty="capNhatSoLuongSP" 
            @delete-item="confirmXoaSPKhoiGio" 
          />
        </div>

        <div class="pos-card bg-white rounded shadow-sm border p-3" style="transition: all 0.3s ease;">
          <div class="d-flex align-items-center gap-2 mb-3">
            <div class="form-check form-switch m-0">
              <input class="form-check-input shadow-none cursor-pointer custom-switch" type="checkbox" role="switch" v-model="isGiaoHang">
            </div>
            <span class="fw-bold small" :style="{ color: isGiaoHang ? '#5a4031' : '#6c757d' }">
               {{ isGiaoHang ? 'Giao hàng' : 'Tại quầy' }}
            </span>
          </div>
          
          <div class="d-flex justify-content-between align-items-center mb-2">
             <div>
                <h6 class="fw-bold mb-1">Khách hàng</h6>
                <small class="text-muted">Thông tin người mua</small>
             </div>
             <div class="d-flex gap-2" v-if="isGiaoHang">
                <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" @click="moModalKhachHang">Chọn khách hàng</button>
                <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" @click="chonKhachLe">Khách lẻ</button>
             </div>
          </div>
          <hr class="text-muted opacity-25 mb-3">

          <div class="d-flex align-items-center gap-4 mb-3">
             <div class="small text-muted" style="width: 120px;">Tên khách hàng</div>
             <div class="fw-bold small" style="color: #5a4031;">
               {{ khachHangSelected ? (khachHangSelected.hoTen || khachHangSelected.tenKhachHang || khachHangSelected.tenKH || 'Khách hàng') : (isGiaoHang ? 'Chưa chọn khách hàng' : 'Khách lẻ') }}
             </div>
          </div>

          <div v-if="isGiaoHang" class="delivery-form-container mt-3 pt-3 border-top border-dashed">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small text-muted mb-1">Số điện thoại <span class="text-danger">*</span></label>
                <input type="text" v-model="formGiaoHang.soDienThoai" class="form-control form-control-sm rounded-pill px-3 py-2 shadow-none border-secondary-subtle" placeholder="Nhập số điện thoại...">
              </div>
              <div class="col-md-8">
                <label class="form-label small text-muted mb-1">Địa chỉ cụ thể <span class="text-danger">*</span></label>
                <input type="text" v-model="formGiaoHang.diaChiCuThe" class="form-control form-control-sm rounded-pill px-3 py-2 shadow-none border-secondary-subtle" placeholder="Số nhà, ngõ, đường...">
              </div>
              
              <div class="col-md-4">
                <select class="form-select form-select-sm rounded-pill px-3 py-2 shadow-none border-secondary-subtle text-muted" v-model="formGiaoHang.tinhThanh" @change="handleProvinceChange">
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  <option v-for="prov in provinces" :key="prov.code" :value="prov.name">{{ prov.name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <select class="form-select form-select-sm rounded-pill px-3 py-2 shadow-none border-secondary-subtle text-muted" v-model="formGiaoHang.quanHuyen" :disabled="!formGiaoHang.tinhThanh" @change="handleDistrictChange">
                  <option value="">Chọn Quận/Huyện</option>
                  <option v-for="dist in districts" :key="dist.code" :value="dist.name">{{ dist.name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <select class="form-select form-select-sm rounded-pill px-3 py-2 shadow-none border-secondary-subtle text-muted" v-model="formGiaoHang.phuongXa" :disabled="!formGiaoHang.quanHuyen">
                  <option value="">Chọn Phường/Xã</option>
                  <option v-for="ward in wards" :key="ward.code" :value="ward.name">{{ ward.name }}</option>
                </select>
              </div>

              <div class="col-12 mt-3">
                <label class="form-label small text-muted mb-1">Ghi chú</label>
                <input type="text" v-model="formGiaoHang.ghiChu" class="form-control form-control-sm rounded-pill px-3 py-2 shadow-none border-secondary-subtle" placeholder="Nhập ghi chú giao hàng...">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <PaymentPanel 
          :hoaDonActive="hoaDonActive"
          :tongTienHang="tongTienHang"
          :isGiaoHang="isGiaoHang"
          :hasProducts="hasProducts"
          :missingDeliveryInfo="missingDeliveryInfo"
          @thanh-toan="xacNhanThanhToan"
        />
      </div>
    </div>

    <!-- MODAL CUSTOM CONFIRM -->
    <div v-if="confirmModal.show" class="custom-modal-overlay" style="z-index: 9999;">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white p-4 text-center" style="max-width: 420px; animation: popIn 0.3s ease;">
        <div class="mb-3 d-flex justify-content-center">
          <div class="d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; background-color: #8c6b5d; color: white; border-radius: 12px; transform: rotate(45deg);">
             <i class="bi bi-box-seam fs-2" style="transform: rotate(-45deg);"></i>
          </div>
        </div>
        <h5 class="fw-bold mb-3" style="color: #5a4031;">{{ confirmModal.title }}</h5>
        <p class="text-muted mb-4" style="font-size: 15px;" v-html="confirmModal.message"></p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-light rounded-pill px-4 fw-medium" style="background-color: #e2e6ea; border: none; color: #495057" @click="closeConfirm">Hủy bỏ</button>
          <button class="btn btn-tao-don rounded-pill px-4 fw-medium" @click="executeConfirm">Xác nhận</button>
        </div>
      </div>
    </div>

    <ProductSearch 
      :show="showModalSanPham"
      :dsSanPhamChiTiet="dsSanPhamChiTiet"
      @close="showModalSanPham = false"
      @add-to-cart="themSPVaoGio"
    />

    <!-- MODAL QUÉT QR -->
    <div v-if="showModalQR" class="custom-modal-overlay">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 500px; width: 100%">
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom" style="background-color: #f8ece3;">
          <h6 class="mb-0 fw-bold" style="color: #5a4031"><i class="bi bi-qr-code-scan me-2"></i>QUÉT MÃ QR SẢN PHẨM</h6>
          <i class="bi bi-x-lg cursor-pointer fs-5" style="color: #5a4031" @click="dongModalQR"></i>
        </div>
        <div class="p-4 text-center bg-light">
          <div id="readerPOS" style="width: 100%; border-radius: 12px; overflow: hidden; border: 2px dashed #cbb3a1; background: white"></div>
          <p class="text-muted small mt-3 mb-0 fw-medium">
             Đưa mã QR của sản phẩm vào khung hình.<br>Hệ thống sẽ tự động thêm vào Giỏ hàng!
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL CHỌN KHÁCH HÀNG -->
    <div v-if="showModalKhachHang" class="custom-modal-overlay">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 650px; width: 100%">
        <div class="p-3 border-bottom" style="background-color: #f5ece5;">
          <h6 class="mb-0 fw-bold" style="color: #5a4031">KHÁCH HÀNG</h6>
        </div>
        <div class="p-3">
           <input type="text" class="form-control rounded-pill shadow-none mb-3 border-secondary-subtle" placeholder="Tìm theo tên / SĐT/ Email khách hàng ........." v-model="tuKhoaTimKH">
           <div class="border rounded-3 overflow-hidden">
              <table class="table table-hover align-middle mb-0 custom-modal-table">
                <thead style="background-color: white;">
                  <tr>
                    <th class="ps-3 border-bottom text-dark fw-bold">Tên KH</th>
                    <th class="border-bottom text-dark fw-bold">SĐT</th>
                    <th class="border-bottom text-dark fw-bold">EMAIL</th>
                    <th class="border-bottom text-end pe-3"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kh in paginatedKhachHang" :key="kh.id">
                    <td class="ps-3 fw-bold text-dark">{{ kh.hoTen || kh.tenKhachHang || kh.tenKH || '---' }}</td>
                    <td class="text-muted">{{ kh.soDienThoai || kh.sdt || '---' }}</td>
                    <td class="text-muted">{{ kh.email || '---' }}</td>
                    <td class="text-end pe-3">
                      <button class="btn btn-sm rounded-pill px-3 fw-medium" style="background-color: #dccbc0; border: none; color: #5a4031; font-size: 13px" @click="chonKhachHangDich(kh)">Chọn</button>
                    </td>
                  </tr>
                  <tr v-if="paginatedKhachHang.length === 0">
                    <td colspan="4" class="text-center py-4 text-danger fw-bold">Không tải được hoặc Không có Khách hàng nào!</td>
                  </tr>
                </tbody>
              </table>
              <div v-if="totalPagesKH > 1" class="d-flex justify-content-center align-items-center gap-2 py-2 border-top bg-white">
                 <button class="btn btn-sm btn-link text-muted shadow-none" @click="changePageKH(currentPageKH - 1)" :disabled="currentPageKH === 1"><i class="bi bi-chevron-left"></i></button>
                 <button v-for="page in totalPagesKH" :key="page" class="btn btn-sm shadow-none rounded" :class="currentPageKH === page ? 'fw-bold text-white' : 'text-muted'" :style="currentPageKH === page ? 'background-color: #8c6b5d;' : ''" @click="changePageKH(page)">{{ page }}</button>
                 <button class="btn btn-sm btn-link text-muted shadow-none" @click="changePageKH(currentPageKH + 1)" :disabled="currentPageKH === totalPagesKH"><i class="bi bi-chevron-right"></i></button>
              </div>
           </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import CartTable from './CartTable.vue';
import PaymentPanel from './PaymentPanel.vue';
import ProductSearch from './ProductSearch.vue';

const toast = ref({ show: false, message: '', type: 'error' });
const showToast = (message, type = 'error') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
};

const anhLoi = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
const getImage = (link) => {
  if (!link) return anhLoi;
  if (link.startsWith('http') || link.startsWith('data:')) return link;
  return `http://localhost:8080/images/${link}`; 
};

const isGiaoHang = ref(false);
const formGiaoHang = ref({ soDienThoai: '', diaChiCuThe: '', tinhThanh: '', quanHuyen: '', phuongXa: '', ghiChu: '' });
const rawLocations = ref([]); const provinces = ref([]); const districts = ref([]); const wards = ref([]);

const fetchProvinces = async () => {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
    rawLocations.value = await response.json();
    provinces.value = rawLocations.value.map(p => ({ name: p.name, code: p.code, districts: p.districts }));
  } catch (error) { console.error(error); }
};

const handleProvinceChange = () => {
  const p = rawLocations.value.find(x => x.name === formGiaoHang.value.tinhThanh);
  districts.value = p ? p.districts : [];
  formGiaoHang.value.quanHuyen = ''; formGiaoHang.value.phuongXa = ''; wards.value = [];
};

const handleDistrictChange = () => {
  const d = districts.value.find(x => x.name === formGiaoHang.value.quanHuyen);
  wards.value = d ? d.wards : []; formGiaoHang.value.phuongXa = '';
};

const dsHoaDonCho = ref([]); 
const hoaDonActive = ref(null);
const dsSanPhamTrongGio = ref([]);

const tongTienHang = computed(() => {
   return dsSanPhamTrongGio.value.reduce((total, item) => total + (item.giaBan * item.soLuong), 0);
});
const hasProducts = computed(() => dsSanPhamTrongGio.value.length > 0);
const missingDeliveryInfo = computed(() => {
   return isGiaoHang.value && (!formGiaoHang.value.soDienThoai || !formGiaoHang.value.diaChiCuThe);
});

const chonHoaDon = async (hd) => {
  hoaDonActive.value = hd;
  try {
    const res = await axios.get(`http://localhost:8080/api/hoadon/${hd.maHoaDon}`);
    if (res.data && res.data.details) {
      dsSanPhamTrongGio.value = res.data.details.map(item => ({
          id: item.ma_sp, maSku: item.ma_sp, tenSanPham: item.ten_san_pham,
          mauSac: item.ten_mau, kichCo: item.ten_kich_co, soLuong: item.so_luong,
          soLuongTon: item.so_luong_ton, giaBan: item.don_gia, hinhAnh: getImage(item.hinh_anh || item.HINH_ANH)
      }));
    } else dsSanPhamTrongGio.value = [];
  } catch (error) { dsSanPhamTrongGio.value = []; }
};

const fetchHoaDonCho = async (autoSelect = true) => {
  try {
    const res = await axios.get('http://localhost:8080/api/hoadon/cho-xac-nhan'); 
    dsHoaDonCho.value = res.data || [];
    if (dsHoaDonCho.value.length > 0) {
      if (autoSelect && !hoaDonActive.value) {
         chonHoaDon(dsHoaDonCho.value[0]);
      }
    } else { 
      hoaDonActive.value = null; 
      dsSanPhamTrongGio.value = []; 
    }
  } catch (error) { console.error(error); }
};

const confirmModal = ref({ show: false, title: '', message: '', action: null });
const openConfirm = (title, message, action) => { confirmModal.value = { show: true, title, message, action }; };
const closeConfirm = () => { confirmModal.value.show = false; };
const executeConfirm = () => { if (confirmModal.value.action) confirmModal.value.action(); closeConfirm(); };

const confirmTaoHoaDon = () => {
  openConfirm("Xác Nhận Tạo Mới", "Tạo thêm 1 hóa đơn chờ tại quầy?", async () => {
      try {
        const res = await axios.post('http://localhost:8080/api/hoadon/tao-moi', {});
        await fetchHoaDonCho(); 
        const hdMoi = dsHoaDonCho.value.find(h => h.maHoaDon === res.data.maHoaDon);
        if(hdMoi) chonHoaDon(hdMoi);
        showToast("Tạo hóa đơn thành công", "success");
      } catch (error) { showToast("Lỗi hệ thống khi tạo hóa đơn!", "error"); }
    });
};

const confirmXoaHoaDon = (hd) => {
  openConfirm("Xác Nhận Xóa Đơn", `Xóa vĩnh viễn hóa đơn [${hd.maHoaDon}]?`, async () => {
      try {
        await axios.delete(`http://localhost:8080/api/hoadon/${hd.maHoaDon}`);
        dsHoaDonCho.value = dsHoaDonCho.value.filter(item => item.id !== hd.id);
        if(hoaDonActive.value?.id === hd.id) {
            if(dsHoaDonCho.value.length > 0) chonHoaDon(dsHoaDonCho.value[0]);
            else { hoaDonActive.value = null; dsSanPhamTrongGio.value = []; }
        }
        showToast("Đã hủy đơn hàng thành công", "success");
      } catch (error) { showToast("Lỗi hệ thống khi xóa hóa đơn!", "error"); }
    });
};

const showModalKhachHang = ref(false); 
const dsKhachHang = ref([]); 
const tuKhoaTimKH = ref(''); 
const khachHangSelected = ref(null);
const currentPageKH = ref(1); 
const itemsPerPageKH = ref(5); 

const chonKhachLe = () => {
  khachHangSelected.value = null;
  formGiaoHang.value = { soDienThoai: '', diaChiCuThe: '', tinhThanh: '', quanHuyen: '', phuongXa: '', ghiChu: '' };
};
watch(isGiaoHang, (newVal) => { if (!newVal) chonKhachLe(); });

const moModalKhachHang = async () => {
   showModalKhachHang.value = true; tuKhoaTimKH.value = ''; currentPageKH.value = 1; 
   try {
      const res = await axios.get('http://localhost:8080/api/khach-hang');
      dsKhachHang.value = res.data.content || res.data || [];
   } catch (error) { console.error(error); }
};

const dsKhachHangLoc = computed(() => {
   let result = dsKhachHang.value;
   if (tuKhoaTimKH.value) {
      const keyword = tuKhoaTimKH.value.toLowerCase();
      result = result.filter(kh => {
          const ten = (kh.hoTen || kh.tenKhachHang || kh.tenKH || '').toLowerCase();
          const sdt = (kh.soDienThoai || kh.sdt || '').toLowerCase();
          return ten.includes(keyword) || sdt.includes(keyword);
      });
   }
   return result;
});
const totalPagesKH = computed(() => Math.ceil(dsKhachHangLoc.value.length / itemsPerPageKH.value) || 1);
const paginatedKhachHang = computed(() => {
   const start = (currentPageKH.value - 1) * itemsPerPageKH.value;
   return dsKhachHangLoc.value.slice(start, start + itemsPerPageKH.value);
});
const changePageKH = (page) => { if (page >= 1 && page <= totalPagesKH.value) currentPageKH.value = page; };
watch(tuKhoaTimKH, () => { currentPageKH.value = 1; });

const chonKhachHangDich = async (kh) => {
   showModalKhachHang.value = false;
   try {
      const res = await axios.get(`http://localhost:8080/api/khach-hang/${kh.id}`);
      khachHangSelected.value = res.data;
      let diaChiMacDinh = null;
      if(res.data.danhSachDiaChi && res.data.danhSachDiaChi.length > 0) {
         diaChiMacDinh = res.data.danhSachDiaChi.find(dc => dc.isMacDinh) || res.data.danhSachDiaChi[0];
      }
      formGiaoHang.value.soDienThoai = diaChiMacDinh ? (diaChiMacDinh.sdtNguoiNhan || res.data.soDienThoai || '') : (res.data.soDienThoai || '');
      formGiaoHang.value.diaChiCuThe = diaChiMacDinh ? (diaChiMacDinh.diaChiCuThe || '') : '';
      if (diaChiMacDinh && diaChiMacDinh.tinhThanh) {
         formGiaoHang.value.tinhThanh = diaChiMacDinh.tinhThanh; handleProvinceChange();
         setTimeout(() => {
             if (diaChiMacDinh.quanHuyen) {
                 formGiaoHang.value.quanHuyen = diaChiMacDinh.quanHuyen; handleDistrictChange();
                 setTimeout(() => { if (diaChiMacDinh.phuongXa) formGiaoHang.value.phuongXa = diaChiMacDinh.phuongXa; }, 100);
             }
         }, 100);
      } else { formGiaoHang.value.tinhThanh = ''; formGiaoHang.value.quanHuyen = ''; formGiaoHang.value.phuongXa = ''; }
   } catch (error) { khachHangSelected.value = kh; }
};

const showModalSanPham = ref(false); 
const dsSanPhamChiTiet = ref([]);
const showModalQR = ref(false); 
let html5QrcodeScanner = null;

const fetchSanPhamChiTiet = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/hoadon/danhsach-sanpham');
    dsSanPhamChiTiet.value = res.data || [];
  } catch (error) { console.error(error); }
};

const moModalThemSP = () => {
   if(!hoaDonActive.value) { showToast("Vui lòng chọn Hóa Đơn trước khi thêm!", "error"); return; }
   showModalSanPham.value = true;
};

const themSPVaoGio = async (spct) => {
  try {
    const itemTrongGio = dsSanPhamTrongGio.value.find(item => item.maSku === spct.ma_sp);
    const targetQty = itemTrongGio ? (itemTrongGio.soLuong + 1) : 1;
    await axios.post(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/sanpham`, {
      ma_sp: spct.ma_sp, so_luong: targetQty, don_gia: spct.don_gia
    });
    showModalSanPham.value = false;
    await chonHoaDon(hoaDonActive.value);
    await fetchHoaDonCho(); 
    await fetchSanPhamChiTiet(); 
    showToast("Thêm sản phẩm thành công", "success");
  } catch (error) { 
     const errorMsg = error.response?.data?.message || "Kho không đủ hàng!";
     showToast(errorMsg, "error"); 
  }
};

const capNhatSoLuongSP = async ({ item, qty }) => {
  if (qty <= 0) return; 
  try {
    await axios.post(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/sanpham`, {
      ma_sp: item.maSku, so_luong: qty, don_gia: item.giaBan
    });
    await chonHoaDon(hoaDonActive.value); 
    await fetchHoaDonCho(); 
    await fetchSanPhamChiTiet(); 
  } catch (error) { 
     const errorMsg = error.response?.data?.message || "Kho không đủ hàng!";
     showToast(errorMsg, "error"); 
  }
};

const confirmXoaSPKhoiGio = (item) => {
  openConfirm("Xác nhận xóa", `Loại bỏ <strong>${item.tenSanPham}</strong> khỏi giỏ?`, async () => {
    try {
      await axios.delete(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/sanpham/${item.maSku}`);
      await chonHoaDon(hoaDonActive.value);
      await fetchHoaDonCho(); 
      await fetchSanPhamChiTiet(); 
      showToast("Đã xóa sản phẩm khỏi giỏ", "success");
    } catch (error) { showToast("Lỗi xóa sản phẩm!", "error"); }
  });
};

const moModalQR = () => {
   if(!hoaDonActive.value) { showToast("Vui lòng chọn Hóa đơn trước khi quét!", "error"); return; }
   showModalQR.value = true;
   setTimeout(() => {
      if (!html5QrcodeScanner) html5QrcodeScanner = new Html5QrcodeScanner('readerPOS', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      html5QrcodeScanner.render(onScanSuccess);
   }, 300);
};

const dongModalQR = () => {
   if (html5QrcodeScanner) { html5QrcodeScanner.clear().catch(err => console.error(err)); html5QrcodeScanner = null; }
   showModalQR.value = false;
};

const onScanSuccess = async (decodedText) => {
   let cleanText = decodedText.trim();
   if (cleanText.toUpperCase().startsWith('SKU:')) cleanText = cleanText.replace(/SKU:\s*/i, '').trim();
   const spct = dsSanPhamChiTiet.value.find(sp => sp.ma_sp === cleanText);
   if (spct) {
      if (spct.so_luong_ton <= 0) { showToast(`Sản phẩm [${cleanText}] đã hết hàng!`, "error"); return; }
      dongModalQR();
      await themSPVaoGio(spct);
   } else { showToast(`Không tìm mã SKU: ${cleanText}`, "error"); dongModalQR(); }
};

const xacNhanThanhToan = async (payload) => {
   openConfirm("Xác Nhận Thanh Toán", `Chốt đơn hàng <strong>${hoaDonActive.value.maHoaDon}</strong> với tổng thu <strong>${formatCurrency(payload.khachCanTra)}</strong>?`, async () => {
       try {
          // ==========================================
          // ĐÃ FIX: TRUYỀN SỐ 5 ĐỂ HOÀN THÀNH ĐƠN TẠI QUẦY
          // ==========================================
          const trangThaiMoi = isGiaoHang.value ? 2 : 5;
          
          await axios.put(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/status`, {
             trang_thai: trangThaiMoi,
             id_voucher: payload.idVoucher,            
             tien_ship: payload.tienShip,              
             tien_giam_gia: payload.tienGiamGia,       
             tong_tien_thanh_toan: payload.khachCanTra 
          });
          showToast(`Thanh toán thành công hóa đơn ${hoaDonActive.value.maHoaDon}`, "success");
          
          isGiaoHang.value = false;
          chonKhachLe();
          hoaDonActive.value = null;
          dsSanPhamTrongGio.value = [];
          await fetchHoaDonCho(false);
       } catch (error) { showToast("Lỗi hệ thống khi thanh toán!", "error"); }
   });
};

let syncRadarInterval = null;
const dongBoThoiGianThuc = async () => {
   try {
      const resSP = await axios.get('http://localhost:8080/api/hoadon/danhsach-sanpham');
      dsSanPhamChiTiet.value = resSP.data || [];
      if (hoaDonActive.value) {
         const resHD = await axios.get(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}`);
         if (resHD.data && resHD.data.details) {
            dsSanPhamTrongGio.value = resHD.data.details.map(item => ({
                id: item.ma_sp, maSku: item.ma_sp, tenSanPham: item.ten_san_pham,
                mauSac: item.ten_mau, kichCo: item.ten_kich_co, soLuong: item.so_luong,
                soLuongTon: item.so_luong_ton, giaBan: item.don_gia, hinhAnh: getImage(item.hinh_anh || item.HINH_ANH)
            }));
         }
      }
   } catch (error) {}
};

onMounted(() => { 
  fetchHoaDonCho(); fetchSanPhamChiTiet(); fetchProvinces(); 
  syncRadarInterval = setInterval(() => { dongBoThoiGianThuc(); }, 3000);
});

onUnmounted(() => { if (syncRadarInterval) { clearInterval(syncRadarInterval); } });
</script>

<style scoped>
.pos-container { background-color: #f8f9fa; min-height: 100vh; position: relative; }
.pos-badge { background-color: #e5d4c8; color: #5a4031; letter-spacing: 1px; }
.btn-tao-don { background-color: #dccbc0; color: #5a4031; transition: all 0.2s; border: none; }
.btn-tao-don:hover { background-color: #cbb8ac; }

.toast-container-custom { position: fixed; top: 30px; right: 30px; z-index: 99999; animation: slideInRight 0.3s ease-out; }
.toast-custom { display: flex; align-items: center; background: white; padding: 18px 25px; border-radius: 8px; min-width: 280px; }
.toast-custom.error { border-left: 6px solid #dc3545; }
.toast-custom.success { border-left: 6px solid #198754; }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

.text-truncate-custom { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 105px; display: inline-block; vertical-align: middle; }
.hd-card { width: 155px; min-height: 80px; border-color: #eef0f2; transition: all 0.2s; }
.active-hd { background-color: #fdfaf8; border-color: #dccbc0 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.hover-danger:hover { color: #dc3545 !important; }

.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bbb; }

.custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 2050; display: flex; align-items: center; justify-content: center; }
.custom-modal-content { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
.custom-modal-table th { font-size: 13px; color: #495057; font-weight: 600; padding-top: 12px; padding-bottom: 12px; }
.custom-modal-table td { padding-top: 10px; padding-bottom: 10px; vertical-align: middle; }

@keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.border-dashed { border-top-style: dashed !important; border-top-color: #dee2e6 !important; }
.cursor-pointer { cursor: pointer; }
.custom-switch { width: 40px !important; height: 20px !important; cursor: pointer; }
.custom-switch:checked { background-color: #8c6b5d !important; border-color: #8c6b5d !important; }
.form-control::placeholder { font-size: 13px; color: #adb5bd; }
</style>