<template>
  <div class="container-fluid p-0">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h5 class="fw-bold mb-1" style="color: #5a4031">Chi tiết sản phẩm | {{ maSanPhamHienTai }}</h5>
      
        <RouterLink to="/san-pham" class="text-decoration-none small" style="color: #8c6b5d">
          <i class="bi bi-chevron-left"></i> Danh sách sản phẩm
        </RouterLink>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4 rounded-3">
      <div class="card-body p-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 border-secondary-subtle rounded-start-pill"><i class="bi bi-search"></i></span>
              <input v-model="filter.keyword" class="form-control border-start-0 shadow-none border-secondary-subtle rounded-end-pill" placeholder="Mã SKU / Tên..." />
            </div>
          </div>

          <div class="col-md-3">
            <label class="small text-muted mb-1 d-flex justify-content-between">
              <span>Giá từ 0đ</span> <span>đến {{ formatCurrency(filter.maxPrice) }}</span>
            </label>
            <input type="range" class="form-range" v-model="filter.maxPrice" min="0" max="5000000" step="50000" />
          </div>

          <div class="col-md-6 d-flex gap-2 justify-content-end">
            <button @click="resetFilter" class="btn btn-outline-secondary rounded-pill px-3 shadow-none"><i class="bi bi-arrow-clockwise"></i> Đặt lại</button>
            <button @click="openModal('ADD')" class="btn text-white rounded-pill px-3 shadow-none" style="background-color: #8c6b5d">+ Thêm biến thể</button>
            <RouterLink to="/san-pham/danh-sach-chi-tiet" class="btn btn-outline-secondary rounded-pill px-3 shadow-none">|| Xem toàn bộ biến thể</RouterLink>
          </div>
        </div>

        <div class="row g-3 mt-2">
  <div class="col-md-2">
    <select v-model="filter.thuongHieu" class="form-select rounded-pill">
      <option value="">Tất cả Thương hiệu</option>
      <option v-for="th in listThuongHieu" :key="th.id" :value="th.tenThuongHieu">{{ th.tenThuongHieu }}</option>
    </select>
  </div>
  <div class="col-md-2">
    <select v-model="filter.mauSac" class="form-select rounded-pill">
      <option value="">Tất cả Màu sắc</option>
      <option v-for="mau in listMauSac" :key="mau.id" :value="mau.tenMau">{{ mau.tenMau }}</option>
    </select>
  </div>
  <div class="col-md-2">
    <select v-model="filter.kichCo" class="form-select rounded-pill">
      <option value="">Tất cả Kích cỡ</option>
      <option v-for="size in listKichCo" :key="size.id" :value="size.tenKichCo">{{ size.tenKichCo }}</option>
    </select>
  </div>
  <div class="col-md-2">
    <select v-model="filter.coAo" class="form-select rounded-pill">
      <option value="">Tất cả Cổ áo</option>
      <option v-for="co in listCoAo" :key="co.id" :value="co.tenCoAo">{{ co.tenCoAo }}</option>
    </select>
  </div>
  <div class="col-md-2">
    <select v-model="filter.tayAo" class="form-select rounded-pill">
      <option value="">Tất cả Tay áo</option>
      <option v-for="tay in listTayAo" :key="tay.id" :value="tay.tenTayAo">{{ tay.tenTayAo }}</option>
    </select>
  </div>
  <div class="col-md-2">
    <div class="form-check form-switch mt-2">
      <input v-model="filter.conHang" class="form-check-input" type="checkbox" role="switch" />
      <label class="form-check-label small text-muted">Chỉ tồn kho > 0</label>
    </div>
  </div>
</div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-3">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
          <thead style="background-color: #f8f5f2">
            <tr>
              <th class="py-3 px-3">STT</th><th class="py-3 px-3">ẢNH</th><th class="py-3 px-3">MÃ SP</th>
              <th class="py-3 px-3">MÃ SKU</th><th class="py-3 px-3">THƯƠNG HIỆU</th><th class="py-3 px-3">MÀU SẮC</th>
              <th class="py-3 px-3">KÍCH CỠ</th><th class="py-3 px-3">GIÁ BÁN</th><th class="py-3 px-3">TỒN KHO</th>
              <th class="py-3 px-3">TRẠNG THÁI</th><th class="py-3 px-3 text-center">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredProducts" :key="item.id">
              <td class="px-3">{{ idx + 1 }}</td>
              <td class="px-3"><img :src="item.hinhAnh || '/placeholder.png'" class="rounded" width="40" height="40" style="object-fit: cover" /></td>
             <td class="px-3 fw-bold">{{ maSanPhamHienTai }}</td>
              <td class="px-3 fw-bold">{{ item.maSku }}</td>
              <td class="px-3">{{ item.tenThuongHieu }}</td>
              <td class="px-3">{{ item.tenMau }}</td>
              <td class="px-3">{{ item.tenKichCo }}</td>
              <td class="px-3">{{ formatCurrency(item.giaBan) }}</td>
              <td class="px-3">{{ item.soLuongTon }}</td>
              <td class="px-3">
                <span class="badge rounded-pill" :class="item.trangThai === 1 ? 'bg-primary' : 'bg-danger'">
                  {{ item.trangThai === 1 ? 'Kinh doanh' : 'Ngừng KD' }}
                </span>
              </td>
              <td class="px-3 text-center">
                <i @click="openModal('EDIT', item)" class="bi bi-eye fs-5 text-dark" style="cursor: pointer" title="Cập nhật"></i>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="11" class="text-center py-4 text-muted">Không có dữ liệu phù hợp.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0" style="background-color: #f8f5f2">
            <h5 class="modal-title fw-bold" style="color: #5a4031">{{ modalMode === 'ADD' ? 'Thêm biến thể mới' : 'Cập nhật biến thể' }}</h5>
            <button type="button" class="btn-close shadow-none" @click="closeModal"></button>
          </div>

          <div class="modal-body p-4">
            <div v-if="errorMessage" class="alert alert-danger py-2 small">{{ errorMessage }}</div>

            <div v-if="modalMode === 'EDIT'" class="row g-3 mb-4 pb-3 border-bottom">
              <div class="col-12"><h6 class="fw-bold mb-0 text-muted">Thông tin gốc (Không thể sửa)</h6></div>
              <div class="col-md-3"><label class="form-label small text-muted">Danh mục</label><input :value="formInfo.tenDanhMuc" class="form-control bg-light" readonly /></div>
              <div class="col-md-3"><label class="form-label small text-muted">Thương hiệu</label><input :value="formInfo.tenThuongHieu" class="form-control bg-light" readonly /></div>
              <div class="col-md-3"><label class="form-label small text-muted">Kiểu dáng</label><input :value="formInfo.tenKieuDang" class="form-control bg-light" readonly /></div>
              <div class="col-md-3"><label class="form-label small text-muted">Chất liệu</label><input :value="formInfo.tenChatLieu" class="form-control bg-light" readonly /></div>
            </div>

            <div class="row g-3">
              <div class="col-12" v-if="modalMode === 'EDIT'"><h6 class="fw-bold mb-0 text-muted">Thuộc tính biến thể</h6></div>
              
              <div class="col-md-6">
                <label class="form-label small text-muted">Mã SKU (Tự động)</label>
                <input :value="modalMode === 'ADD' ? generateSku : form.maSku" type="text" class="form-control bg-light" readonly />
              </div>
              <div class="col-md-6">
                <label class="form-label small text-muted">Trạng thái *</label>
                <select v-model="form.trangThai" class="form-select">
                  <option :value="1">Kinh doanh</option>
                  <option :value="0">Ngừng kinh doanh</option>
                </select>
              </div>

              <div class="col-md-3">
                <label class="form-label small text-muted">Màu sắc *</label>
                <select v-model="form.idMauSac" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="mau in listMauSac" :key="mau.id" :value="mau.id">{{ mau.tenMau }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small text-muted">Kích cỡ *</label>
                <select v-model="form.idKichCo" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="size in listKichCo" :key="size.id" :value="size.id">{{ size.tenKichCo }}</option>
                </select>
              </div>

              <div v-if="modalMode === 'EDIT'" class="col-md-3">
                <label class="form-label small text-muted">Cổ áo *</label>
                <select v-model="form.idCoAo" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="co in listCoAo" :key="co.id" :value="co.id">{{ co.tenCoAo }}</option>
                </select>
              </div>
              <div v-if="modalMode === 'EDIT'" class="col-md-3">
                <label class="form-label small text-muted">Tay áo *</label>
                <select v-model="form.idTayAo" class="form-select">
                  <option value="">-- Chọn --</option>
                  <option v-for="tay in listTayAo" :key="tay.id" :value="tay.id">{{ tay.tenTayAo }}</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label small text-muted">Giá nhập *</label>
                <input :value="formatInput(form.giaNhap)" @input="parseInput($event, 'giaNhap')" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label small text-muted">Giá bán *</label>
                <input :value="formatInput(form.giaBan)" @input="parseInput($event, 'giaBan')" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label small text-muted">Số lượng tồn *</label>
                <input v-model.number="form.soLuongTon" type="number" class="form-control" min="0" />
              </div>

              <div class="col-12 mt-3">
                <label class="form-label small text-muted">Hình ảnh (Upload từ máy) *</label>
                <input type="file" @change="handleFileUpload" class="form-control" accept="image/*" />
                <div v-if="previewImage" class="mt-2">
                  <img :src="previewImage" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #ccc" />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer border-0">
            <button @click="closeModal" class="btn btn-light rounded-pill px-4 shadow-none">Hủy</button>
            <button @click="saveData" class="btn text-white rounded-pill px-4 shadow-none" style="background-color: #8c6b5d">
              {{ modalMode === 'ADD' ? 'Thêm mới' : 'Cập nhật' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const listProducts = ref([]);
const route = useRoute();


const maSanPhamHienTai = ref('Đang tải...'); 

// Xóa hẳn hàm fetchThongTinSanPhamCha đi, chỉ dùng 1 hàm này thôi:
const fetchChiTietMaSP = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${route.params.id}`);
    listProducts.value = res.data;
    
    if (listProducts.value.length > 0) {
        // Lấy maSku (VD: "SP1_WHT_S") và cắt lấy phần trước dấu "_" để ra "SP1"
        const sku = listProducts.value[0].maSku || '';
        maSanPhamHienTai.value = sku.split('_')[0] || `SP${route.params.id}`; 
    } else {
        // Nếu sản phẩm mới tinh chưa có biến thể, tự động tạo mã SP + ID (VD: SP1)
        maSanPhamHienTai.value = `SP${route.params.id}`;
    }
  } catch (err) { 
    console.error('Lỗi khi fetch dữ liệu:', err);
    // Lỗi mạng thì vẫn cho nó hiện đúng SP1 để không bị lỗi giao diện
    maSanPhamHienTai.value = `SP${route.params.id}`; 
  }
};

onMounted(() => {
  fetchChiTietMaSP(); 
  fetchThuocTinh();
});

// ======================== API ĐỔ DỮ LIỆU COMBOBOX THÊM/SỬA ========================
const listMauSac = ref([]);
const listKichCo = ref([]);
const listCoAo = ref([]);
const listTayAo = ref([]);
const listThuongHieu = ref([]); // Đừng quên khai báo cái này nhé

const fetchThuocTinh = async () => {
  try {
    const [resMau, resSize, resCo, resTay, resThuongHieu] = await Promise.all([
      axios.get('http://localhost:8080/api/mau-sac'),
      axios.get('http://localhost:8080/api/kich-co'),
      axios.get('http://localhost:8080/api/co-ao'),
      axios.get('http://localhost:8080/api/tay-ao'),
      axios.get('http://localhost:8080/api/thuong-hieu') // Đảm bảo API này tồn tại
    ]);

    listMauSac.value = resMau.data;
    listKichCo.value = resSize.data;
    listCoAo.value = resCo.data;
    listTayAo.value = resTay.data;
    listThuongHieu.value = resThuongHieu.data; // Lưu dữ liệu vào biến
  } catch (err) {
    console.error("Lỗi lấy dữ liệu thuộc tính:", err);
  }
};

// ======================== LOGIC BỘ LỌC TÌM KIẾM ========================
const filter = reactive({ keyword: '', maxPrice: 5000000, thuongHieu: '', mauSac: '', kichCo: '', coAo: '', tayAo: '', conHang: false });

const filterOptions = computed(() => {
  const options = { mauSac: new Set(), kichCo: new Set(), thuongHieu: new Set(), coAo: new Set(), tayAo: new Set() };
  listProducts.value.forEach(item => {
    if (item.tenMau) options.mauSac.add(item.tenMau);
    if (item.tenKichCo) options.kichCo.add(item.tenKichCo);
    if (item.tenThuongHieu) options.thuongHieu.add(item.tenThuongHieu);
    if (item.tenCoAo) options.coAo.add(item.tenCoAo);
    if (item.tenTayAo) options.tayAo.add(item.tenTayAo);
  });
  return {
    mauSac: Array.from(options.mauSac), kichCo: Array.from(options.kichCo),
    thuongHieu: Array.from(options.thuongHieu), coAo: Array.from(options.coAo), tayAo: Array.from(options.tayAo)
  };
});

const filteredProducts = computed(() => {
  const keyword = filter.keyword.toLowerCase();
  return listProducts.value.filter(item => {
    // Đã fix lỗi toLowerCase() làm crash Vue khi giá trị null
    const matchKeyword = !filter.keyword || 
                         (item.maSku || '').toLowerCase().includes(keyword) || 
                         (item.tenSanPham || '').toLowerCase().includes(keyword);
    const matchPrice = item.giaBan <= filter.maxPrice;
    const matchThuongHieu = !filter.thuongHieu || item.tenThuongHieu === filter.thuongHieu;
    const matchMauSac = !filter.mauSac || item.tenMau === filter.mauSac;
    const matchKichCo = !filter.kichCo || item.tenKichCo === filter.kichCo;
    const matchCoAo = !filter.coAo || item.tenCoAo === filter.coAo;
    const matchTayAo = !filter.tayAo || item.tenTayAo === filter.tayAo;
    const matchTonKho = !filter.conHang || item.soLuongTon > 0;
    
    return matchKeyword && matchPrice && matchThuongHieu && matchMauSac && matchKichCo && matchCoAo && matchTayAo && matchTonKho;
  });
});

const resetFilter = () => { Object.assign(filter, { keyword: '', maxPrice: 5000000, thuongHieu: '', mauSac: '', kichCo: '', coAo: '', tayAo: '', conHang: false }); };

// ======================== LOGIC MODAL FORM ========================
const showModal = ref(false);
const modalMode = ref('ADD');
const errorMessage = ref('');
const previewImage = ref(null);

const form = reactive({
  id: null, maSku: '', idMauSac: '', idKichCo: '', idCoAo: '', idTayAo: '',
  soLuongTon: 0, giaNhap: 0, giaBan: 0, trangThai: 1, fileAnh: null
});
const formInfo = reactive({ tenDanhMuc: '', tenThuongHieu: '', tenKieuDang: '', tenChatLieu: '' });

const generateSku = computed(() => {
  if (modalMode.value !== 'ADD') return form.maSku;
  const parentCode = maSanPhamHienTai.value;
  const mauObj = listMauSac.value.find(m => m.id === form.idMauSac);
  const sizeObj = listKichCo.value.find(s => s.id === form.idKichCo);
  
  // Tạm lấy tên làm mã viết tắt nếu không có mã riêng
  const mau = mauObj ? (mauObj.maVietTat || 'M') : 'XX';
  const size = sizeObj ? (sizeObj.maVietTat || 'S') : 'X';
  return `${parentCode}_${mau}_${size}`;
});

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN').format(val || 0) + 'đ';
const formatInput = (val) => new Intl.NumberFormat('vi-VN').format(val || 0);
const parseInput = (event, field) => {
  let rawValue = event.target.value.replace(/[^0-9]/g, '');
  form[field] = rawValue ? parseInt(rawValue, 10) : 0;
  event.target.value = formatInput(form[field]);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.fileAnh = file;
    previewImage.value = URL.createObjectURL(file);
  }
};


const openModal = (mode, data = null) => {
  modalMode.value = mode;
  errorMessage.value = '';
  previewImage.value = null;

  if (mode === 'EDIT' && data) {
    // ✅ ĐÃ SỬA: Map ID trực tiếp từ dữ liệu phẳng của item để ô Select nhận diện đúng ID dữ liệu cũ
    Object.assign(form, {
      id: data.id, 
      maSku: data.maSku, 
      soLuongTon: data.soLuongTon, 
      giaNhap: data.giaNhap, 
      giaBan: data.giaBan, 
      trangThai: data.trangThai, 
      fileAnh: null,
      idMauSac: data.idMauSac || data.mauSac?.id || '', 
      idKichCo: data.idKichCo || data.kichCo?.id || '', 
      idCoAo: data.idCoAo || data.coAo?.id || '', 
      idTayAo: data.idTayAo || data.tayAo?.id || ''
    });
    
    Object.assign(formInfo, {
      tenDanhMuc: data.tenDanhMuc, 
      tenThuongHieu: data.tenThuongHieu, 
      tenKieuDang: data.tenKieuDang, 
      tenChatLieu: data.tenChatLieu
    });
    
    previewImage.value = data.hinhAnh;
  } else {
    Object.assign(form, { 
      id: null, maSku: '', idMauSac: '', idKichCo: '', idCoAo: '', idTayAo: '', 
      soLuongTon: 0, giaNhap: 0, giaBan: 0, trangThai: 1, fileAnh: null 
    });
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const saveData = async () => {
  // Validate không bỏ trống
  if (form.idMauSac === '' || form.idKichCo === '') {
    errorMessage.value = "Vui lòng chọn Màu sắc và Kích cỡ!"; return;
  }
  if (modalMode.value === 'EDIT' && (form.idCoAo === '' || form.idTayAo === '')) {
    errorMessage.value = "Vui lòng chọn Cổ áo và Tay áo!"; return;
  }
  if (form.soLuongTon === '' || form.giaNhap === '' || form.giaBan === '') {
    errorMessage.value = "Vui lòng nhập đầy đủ giá và số lượng!"; return;
  }
  if (modalMode.value === 'ADD' && !form.fileAnh) {
    errorMessage.value = "Vui lòng chọn hình ảnh từ máy tính!"; return;
  }
  
  const formData = new FormData();
  if (form.fileAnh) formData.append("file", form.fileAnh);
  
  // Chuẩn bị cục JSON để gửi đi (Map đúng cấu trúc Entity của Java)
  const submitData = {
    id: form.id,
    maSku: modalMode.value === 'ADD' ? generateSku.value : form.maSku,
    giaNhap: form.giaNhap,
    giaBan: form.giaBan,
    soLuongTon: form.soLuongTon,
    trangThai: form.trangThai,
    sanPham: { id: route.params.id },
    mauSac: { id: form.idMauSac },
    kichCo: { id: form.idKichCo }
  };
  
  // Nếu là edit thì mới gán coAo và tayAo vào submitData
  if (modalMode.value === 'EDIT') {
    submitData.coAo = { id: form.idCoAo };
    submitData.tayAo = { id: form.idTayAo };
  }

  formData.append("data", JSON.stringify(submitData));

  try {
    const url = modalMode.value === 'ADD' ? '/api/sanpham-chitiet/them' : `/api/sanpham-chitiet/cap-nhat/${form.id}`;
    // TỚ ĐÃ UNCOMMENT DÒNG NÀY, NÓ SẼ CHẠY THẬT RỒI NHÉ!
    await axios.post(`http://localhost:8080${url}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Lưu thành công!');
    fetchChiTiet();
    closeModal();
  } catch (err) {
    errorMessage.value = "Lỗi khi lưu! Vui lòng kiểm tra lại.";
    console.error(err);
  }
};

const fetchChiTiet = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${route.params.id}`);
    listProducts.value = res.data;
  }  catch (err) { console.error(err); }
};

onMounted(() => {
  fetchChiTiet();
  fetchThuocTinh(); // Đừng quên dòng này! Nếu thiếu, danh sách Màu/Size sẽ là mảng rỗng []
});

</script>

<style scoped>
.form-select, .form-control { border-color: #dee2e6; font-size: 0.9rem; }
.form-control:focus, .form-select:focus { box-shadow: none; border-color: #8c6b5d; }
.table thead th { font-size: 0.8rem; color: #5a4031; font-weight: 700; white-space: nowrap; }
.form-range { accent-color: #8c6b5d; }
.bg-light { background-color: #f8f9fa !important; pointer-events: none; }
</style>