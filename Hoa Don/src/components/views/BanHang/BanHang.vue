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
                <button class="btn btn-outline-secondary btn-sm rounded-pill px-3"
        @click.stop.prevent="moModalKhachHang">
    Chọn khách hàng
</button> <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" @click="chonKhachLe">Khách lẻ</button>
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
   :hasInvalidProducts="coSanPhamLoi"
   :tienShip="tienShip"
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


  </div>


  <!-- MODAL CHỌN KHÁCH HÀNG -->
  <div v-if="showModalKhachHang" class="custom-modal-overlay">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white overflow-hidden" style="max-width: 650px; width: 100%">
       
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom" style="background-color: #f5ece5;">
          <h6 class="mb-0 fw-bold" style="color: #5a4031">CHỌN KHÁCH HÀNG</h6>
          <i class="bi bi-x-lg cursor-pointer fs-5 text-secondary hover-danger" @click="showModalKhachHang = false"></i>
        </div>


        <div class="p-3">
           <input type="text" class="form-control rounded-pill shadow-none mb-3 border-secondary-subtle" placeholder="Tìm theo tên / SĐT / Email khách hàng ........." v-model="tuKhoaTimKH">
           
           <div class="border rounded-3 overflow-hidden">
              <table class="table align-middle mb-0 custom-modal-table">
                <thead style="background-color: #f8f9fa;">
                  <tr>
                    <th class="ps-3 border-bottom text-dark fw-bold">Tên KH</th>
                    <th class="border-bottom text-dark fw-bold">SĐT</th>
                    <th class="border-bottom text-dark fw-bold">EMAIL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kh in paginatedKhachHang" :key="kh.id"
                      class="cursor-pointer row-hover-custom"
                      @click="chonKhachHangDich(kh)" title="Click để chọn khách hàng này">
                    <td class="ps-3 fw-bold text-dark">{{ kh.hoTen || kh.tenKhachHang || kh.tenKH || '---' }}</td>
                    <td class="text-muted">{{ kh.soDienThoai || kh.sdt || '---' }}</td>
                    <td class="text-muted">{{ kh.email || '---' }}</td>
                  </tr>
                  <tr v-if="paginatedKhachHang.length === 0">
                    <td colspan="3" class="text-center py-4 text-danger fw-bold">Không tìm thấy Khách hàng nào!</td>
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
</template>




<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import CartTable from './CartTable.vue';
import PaymentPanel from './PaymentPanel.vue';
import ProductSearch from './ProductSearch.vue';
const isUpdating = ref(false);
const dsThongBaoGia = ref([]);
const toast = ref({ show: false, message: '', type: 'error' });
const showToast = (message, type = 'error') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};




const lichSuDoiGia = ref({});


const debounceTimers = ref({});
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
// === DÁN ĐOẠN TÍNH TIỀN SHIP VÀO ĐÂY ===
const tienShip = ref(0);


watch([() => formGiaoHang.value.tinhThanh, () => formGiaoHang.value.quanHuyen, isGiaoHang], () => {
    // Nếu tắt giao hàng (mua tại quầy) thì ship = 0
    if (!isGiaoHang.value) {
        tienShip.value = 0;
        return;
    }
   
    // Nếu đã chọn cụ thể địa chỉ
    if (formGiaoHang.value.tinhThanh && formGiaoHang.value.quanHuyen) {
        if (formGiaoHang.value.tinhThanh.includes('Hà Nội')) {
            tienShip.value = 20000; // Ưu tiên riêng Hà Nội là 20k (bạn có thể đổi thành 40k luôn nếu thích)
        } else {
            tienShip.value = 40000; // Các tỉnh khác là 40k
        }
    } else {
        // MẶC ĐỊNH: Vừa bật giao hàng lên hoặc vừa chọn khách xong là lấy luôn 40.000đ
        tienShip.value = 40000;
    }
});
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


// Hàm này sẽ gọi MỖI KHI Radar quét về, HOẶC khi bạn tải lại chi tiết hóa đơn
const kiemTraVaCapNhatGia = (danhSachMoi) => {
    // Nếu giỏ hàng đang trống thì không cần so sánh, cứ gán thẳng luôn
    if (dsSanPhamTrongGio.value.length === 0) {
        dsSanPhamTrongGio.value = danhSachMoi;
        return;
    }


    danhSachMoi.forEach(spMoi => {
        // Soi xem sản phẩm này lúc nãy trên màn hình giá bao nhiêu
        const spCu = dsSanPhamTrongGio.value.find(s => s.maSku === spMoi.maSku);
       
        // Nếu phát hiện giá bị lệch
        if (spCu && spCu.giaBan !== spMoi.giaBan) {
            dsThongBaoGia.value.push({
                id: Date.now() + Math.random(),
                maSku: spMoi.maSku,
                tenSanPham: spMoi.tenSanPham, // Kéo theo tên hiển thị cho đẹp
                giaCu: spCu.giaBan,
                giaMoi: spMoi.giaBan
            });


            // Tự diệt thông báo sau 6 giây
            setTimeout(() => {
                dsThongBaoGia.value.shift();
            }, 6000);
        }
    });


    // CHỐT: Đè dữ liệu mới lên giao diện (Bao gồm cả giá mới)
    dsSanPhamTrongGio.value = danhSachMoi;
};


const chonHoaDon = async (hd) => {
    hoaDonActive.value = hd;
    try {
        const res = await axios.get(`http://localhost:8080/api/hoadon/${hd.maHoaDon}`);
        if (res.data && res.data.details) {
            dsSanPhamTrongGio.value = res.data.details.map(item => {
                const spGoc = dsSanPhamChiTiet.value.find(s => s.maSku === item.ma_sp);
                const trangThaiMoiNhat = (spGoc && spGoc.trangThai === 1) ? 1 : 0;
                const tonKhoMoiNhat = spGoc ? spGoc.soLuongTon : 0;


                const keyLichSu = `${hd.maHoaDon}_${item.ma_sp}`;
                const giaCu = lichSuDoiGia.value[keyLichSu] || null;
                const giaHienTai = spGoc ? spGoc.giaBan : item.don_gia;


                return {
                    id: item.ma_sp, maSku: item.ma_sp, tenSanPham: item.ten_san_pham,
                    mauSac: item.ten_mau, kichCo: item.ten_kich_co, soLuong: item.so_luong,
                    soLuongTon: tonKhoMoiNhat,
                    giaBan: giaHienTai,
                    giaCu: giaCu !== giaHienTai ? giaCu : null,
                    hinhAnh: getImage(item.hinh_anh || item.HINH_ANH),
                    trangThai: trangThaiMoiNhat
                };
            });
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
    // SỬA ĐƯỜNG LINK Ở DÒNG DƯỚI ĐÂY:
    const res = await axios.get('http://localhost:8080/api/sanpham-chitiet/all-dto');
    dsSanPhamChiTiet.value = res.data || [];
  } catch (error) { console.error(error); }
};




const moModalThemSP = () => {
   if(!hoaDonActive.value) { showToast("Vui lòng chọn Hóa Đơn trước khi thêm!", "error"); return; }
   showModalSanPham.value = true;
};




const themSPVaoGio = async (spct) => {
  try {
    // 1. Dùng maSku của DTO thay vì ma_sp
    const itemTrongGio = dsSanPhamTrongGio.value.find(item => item.maSku === spct.maSku);
    const targetQty = itemTrongGio ? (itemTrongGio.soLuong + 1) : 1;
   
    // 2. Lấy giá thực tế (Nếu có giảm giá thì lấy giaSauGiam, không thì lấy giaBan)
    const giaThucTe = (spct.phanTramGiam && spct.phanTramGiam > 0) ? spct.giaSauGiam : spct.giaBan;


    // 3. Đóng gói đúng format Backend Java đang chờ (ma_sp và don_gia)
    await axios.post(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/sanpham`, {
      ma_sp: spct.maSku,
      so_luong: targetQty,
      don_gia: giaThucTe
    });


    showModalSanPham.value = false;
    await chonHoaDon(hoaDonActive.value);
    await fetchHoaDonCho();
    await fetchSanPhamChiTiet();
    showToast("Thêm sản phẩm thành công", "success");
  } catch (error) {
     const errorMsg = error.response?.data?.message || "Kho không đủ hàng hoặc lỗi hệ thống!";
     showToast(errorMsg, "error");
  }
};




const capNhatSoLuongSP = ({ item, qty }) => {
    if (qty <= 0) return;


    // 1. KHÓA RADAR NGAY LẬP TỨC CHỨ KHÔNG CHỜ DEBOUNCE NỮA
    isUpdating.value = true;


    const chenhLech = qty - item.soLuong;
    const soLuongCu = item.soLuong;
    const tonKhoCu = item.soLuongTon;


    const spTrongGio = dsSanPhamTrongGio.value.find(s => s.maSku === item.maSku);
    if (spTrongGio) {
        spTrongGio.soLuong = qty;
        spTrongGio.soLuongTon = spTrongGio.soLuongTon - chenhLech;
    }


    if (debounceTimers.value[item.maSku]) {
        clearTimeout(debounceTimers.value[item.maSku]);
    }


    debounceTimers.value[item.maSku] = setTimeout(async () => {
        try {
            await axios.post(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/sanpham`, {
                ma_sp: item.maSku,
                so_luong: qty,
                don_gia: item.giaBan
            });
            await chonHoaDon(hoaDonActive.value);
        } catch (error) {
            if (spTrongGio) {
                spTrongGio.soLuong = soLuongCu;
                spTrongGio.soLuongTon = tonKhoCu;
            }
            showToast("Lỗi cập nhật số lượng! Vui lòng thử lại.", "error");
        } finally {
            // Chỉ mở khóa khi mọi thứ đã gọi xong xuôi
            isUpdating.value = false;
            delete debounceTimers.value[item.maSku];
        }
    }, 500);
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
   
   // Tìm theo maSku thay vì ma_sp
   const spct = dsSanPhamChiTiet.value.find(sp => sp.maSku === cleanText);
   
   if (spct) {
      if (spct.soLuongTon <= 0) { showToast(`Sản phẩm [${cleanText}] đã hết hàng!`, "error"); return; }
      dongModalQR();
      await themSPVaoGio(spct);
   } else {
      showToast(`Không tìm thấy mã SKU: ${cleanText}`, "error");
      dongModalQR();
   }
};




const xacNhanThanhToan = async (payload) => {
   // BƯỚC 1: Chỉ mở Modal Confirm lên (TUYỆT ĐỐI KHÔNG GỌI API Ở ĐÂY)
   openConfirm(
       "Xác Nhận Thanh Toán", 
       `Chốt đơn hàng <strong>${hoaDonActive.value.maHoaDon}</strong> với tổng thu <strong>${formatCurrency(payload.khachCanTra)}</strong>?`, 
       
       // BƯỚC 2: Toàn bộ khối async () => { ... } này CHỈ CHẠY khi bạn bấm "Xác nhận"
       async () => {
           try {
              // Xử lý trạng thái: 2 (Giao hàng) hoặc 5 (Tại quầy)
              const trangThaiMoi = isGiaoHang.value ? 2 : 5;
             
              // Gọi API chốt đơn và trừ voucher ở DB
              await axios.put(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/status`, {
                 trang_thai: trangThaiMoi,
                 id_voucher: payload.idVoucher,            
                 tien_ship: payload.tienShip,              
                 tien_giam_gia: payload.tienGiamGia,       
                 tong_tien_thanh_toan: payload.khachCanTra,

                 // ==========================================
                 // FIX CHỐT HẠ: CHÈN BIẾN PHƯƠNG THỨC THANH TOÁN VÀO ĐÂY
                 // ==========================================
                 phuongThucTT: payload.phuongThucTT,
                 pttt: payload.phuongThucTT
              });
              
              showToast(`Thanh toán thành công hóa đơn ${hoaDonActive.value.maHoaDon}`, "success");
             
              // Dọn dẹp giao diện sau khi thanh toán xong
              isGiaoHang.value = false;
              chonKhachLe();
              hoaDonActive.value = null;
              dsSanPhamTrongGio.value = [];
              await fetchHoaDonCho(false);
              
           } catch (error) { 
              // ==========================================
              // BẮT LỖI RACE CONDITION VOUCHER (Chỉ hiện khi đã ấn Confirm)
              // ==========================================
              const errorMsg = error.response?.data?.message || error.response?.data || "";
              
              if (typeof errorMsg === 'string' && errorMsg.includes("VOUCHER_HET_LUOT")) {
                  // Báo đỏ cho nhân viên biết
                  showToast("Rất tiếc! Mã giảm giá này vừa bị khách hàng khác nhanh tay dùng hết.", "error");
                  
                  // Load lại đúng hóa đơn đó để nó update lại tổng tiền (gỡ phần giảm giá ảo ra)
                  if (hoaDonActive.value) {
                      await chonHoaDon(hoaDonActive.value); 
                  }
              } else {
                  // Lỗi mạng, sập server...
                  showToast(typeof errorMsg === 'string' && errorMsg ? errorMsg : "Lỗi hệ thống khi thanh toán!", "error"); 
              }
           }
       }
   );
};

let syncRadarInterval = null;


const dongBoThoiGianThuc = async () => {
    if (isUpdating.value) return; // Không quét khi đang bấm nút + -


    try {
        const resSP = await axios.get(`http://localhost:8080/api/sanpham-chitiet/all-dto?t=${new Date().getTime()}`);
        dsSanPhamChiTiet.value = resSP.data || [];


        if (hoaDonActive.value) {
            const resHD = await axios.get(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}`);
            if (resHD.data && resHD.data.details) {
               
                let coSanPhamNgungKD = false;


                dsSanPhamTrongGio.value = resHD.data.details.map(item => {
                    const spGoc = dsSanPhamChiTiet.value.find(s => s.maSku === item.ma_sp);
                    const trangThaiMoiNhat = (spGoc && spGoc.trangThai === 1) ? 1 : 0;
                    const tonKhoMoiNhat = spGoc ? spGoc.soLuongTon : 0;
                   
                    if (trangThaiMoiNhat === 0) coSanPhamNgungKD = true;


                    // ==================================================
                    // BỘ NÃO ĐỒNG BỘ GIÁ TỰ ĐỘNG
                    // ==================================================
                    const keyLichSu = `${hoaDonActive.value.maHoaDon}_${item.ma_sp}`; // Tạo khóa riêng cho từng SP trong từng HĐ


                    if (spGoc && item.don_gia !== spGoc.giaBan) {
                        // Nếu DB Giỏ Hàng khác DB Kho Hàng -> Có sự đổi giá!
                        if (!lichSuDoiGia.value[keyLichSu]) {
                            lichSuDoiGia.value[keyLichSu] = item.don_gia; // Ghi nhớ giá cũ
                        }


                        // Ép Java cập nhật ngầm ngay lập tức
                        axios.put(`http://localhost:8080/api/hoadon/${hoaDonActive.value.maHoaDon}/cap-nhat-gia-sp`, {
                            ma_sp: item.ma_sp,
                            don_gia_moi: spGoc.giaBan
                        }).catch(err => console.log("Lỗi đồng bộ giá DB:", err));
                    }


                    const giaCu = lichSuDoiGia.value[keyLichSu] || null;
                    const giaHienTai = spGoc ? spGoc.giaBan : item.don_gia;


                    return {
                        id: item.ma_sp, maSku: item.ma_sp, tenSanPham: item.ten_san_pham,
                        mauSac: item.ten_mau, kichCo: item.ten_kich_co, soLuong: item.so_luong,
                        soLuongTon: tonKhoMoiNhat,
                        giaBan: giaHienTai, // ÉP GIAO DIỆN HIỆN GIÁ MỚI LUÔN VÀ NGAY
                        giaCu: giaCu !== giaHienTai ? giaCu : null, // Gắn cờ giá cũ để hiện thông báo vàng
                        hinhAnh: getImage(item.hinh_anh || item.HINH_ANH),
                        trangThai: trangThaiMoiNhat
                    };
                });


                if (coSanPhamNgungKD && !toast.value.show) {
                    showToast("CẢNH BÁO: Có sản phẩm ngừng kinh doanh!", "error");
                }
            }
        }
    } catch (error) {}
};


// Tính toán xem có sản phẩm nào ngừng kinh doanh không
const coSanPhamLoi = computed(() => {
   return dsSanPhamTrongGio.value.some(item => item.trangThai === 0);
});


// ==========================================
// ON MOUNTED - KHỞI TẠO VÀ LẮNG NGHE LÚC MỞ TRANG
// ==========================================
onMounted(() => {
    fetchHoaDonCho();
    fetchSanPhamChiTiet();
    fetchProvinces();
   
    // Bật radar quét mỗi 1 giây (để check tồn kho)
    syncRadarInterval = setInterval(dongBoThoiGianThuc, 1000);


    // Lắng nghe loa từ tab Chi tiết sản phẩm báo sang
   
});


onUnmounted(() => {
    if (syncRadarInterval) {
        clearInterval(syncRadarInterval);
    }
});
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
/* Style cho cục thông báo nổi lên góc dưới bên phải */
.price-alert-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 350px;
}


/* Hiệu ứng trượt ra trượt vào của Vue TransitionGroup */
.list-enter-active, .list-leave-active {
    transition: all 0.4s ease;
}
.list-enter-from {
    opacity: 0;
    transform: translateX(50px);
}
.list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
.row-hover-custom { transition: background-color 0.2s ease; }
.row-hover-custom:hover { background-color: #fef8f5 !important; }
</style>





