<template>
  <div class="employee-management-wrapper">

    <div class="independent-filter-card">
      <div class="filter-card-header mb-3">
        <i class="bi bi-funnel text-dark me-2 fs-5"></i>
        <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm</h6>
      </div>

      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label text-muted small mb-1">Tìm kiếm nhân viên</label>
          <div class="search-input-wrapper">
            <span class="search-icon-inside"><i class="bi bi-search"></i></span>
            <input v-model="filters.searchKeyword" type="text"
              class="form-control rounded-pill shadow-none border-secondary-subtle" style="padding-left: 40px;"
              placeholder="Tìm theo mã, tên, SĐT..." @input="handleSearchInput" />
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label text-muted small mb-1">Chức vụ</label>
          <select v-model="filters.chucVu"
            class="form-select rounded-pill shadow-none border-secondary-subtle text-muted" @change="handleFilter">
            <option value="">Tất cả chức vụ</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Nhân viên">Nhân viên</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label text-muted small mb-1">Trạng thái</label>
          <select v-model="filters.trangThai"
            class="form-select rounded-pill shadow-none border-secondary-subtle text-muted" @change="handleFilter">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Còn làm</option>
            <option value="0">Đã nghỉ</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center gap-2 mt-4">
        <button
          class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
          @click="clearFilter">
          <i class="bi bi-arrow-clockwise"></i> Đặt lại
        </button>
        <button
          class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
          @click="handleExportExcel" :disabled="loading">
          <i class="bi bi-file-earmark-excel"></i> Xuất Excel
        </button>
        <button class="btn rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
          style="background-color: #dccbc0; color: #5a4031"
          @click="$router.push({ path: '/nhan-vien/add', state: { totalElements: totalElements } })">
          + Tạo mới
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-3 mt-4">
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table table-hover table-sm align-middle text-nowrap text-center small">
            <thead>
              <tr>
                <th class="py-3 px-3 border-0 rounded-start fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031; width: 60px;">
                  #
                </th>
                <th class="py-3 px-3 border-0 fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031; width: 80px;">
                  ẢNH
                </th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                  TÀI KHOẢN
                </th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                  HỌ TÊN
                </th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                  SĐT
                </th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                  EMAIL
                </th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                  ĐỊA CHỈ
                </th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                  CHỨC VỤ
                </th>
                <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">
                  TRẠNG THÁI
                </th>
                <th class="py-3 px-3 border-0 rounded-end fw-semibold"
                  style="background-color: #dccbc0; color: #5a4031; width: 120px;">
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody class="border-top-0 text-secondary">
              <tr v-for="(emp, index) in employees" :key="emp.id">
                <td class="py-3 px-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3 px-3">
                  <img :src="emp.anh_dai_dien || 'https://www.svgrepo.com/show/507442/user-circle.svg'"
                    class="rounded-circle employee-avatar mx-auto" />
                </td>
                <td class="py-3 px-3 text-dark">{{ emp.ten_tai_khoan }}</td>
                <td class="py-3 px-3 text-dark fw-medium">{{ emp.ho_ten }}</td>
                <td class="py-3 px-3">{{ emp.so_dien_thoai }}</td>
                <td class="py-3 px-3 text-lowercase">{{ emp.email }}</td>
                <td class="py-3 px-3">
                  <div style="max-width: 250px; white-space: normal; word-break: break-word; text-align: left; margin: 0 auto;">
                    {{ emp.dia_chi }}
                  </div>
                </td>
                <td class="py-3 px-3">
                  <span class="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-normal">
                    {{ emp.chuc_vu }}
                  </span>
                </td>
                <td class="py-3 px-3">
                  <span v-if="emp.trang_thai === 1"
                    class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-normal">
                    Còn làm
                  </span>
                  <span v-else class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-normal">
                    Đã nghỉ
                  </span>
                </td>
                <td class="py-3 px-3">
                  <div class="d-flex justify-content-center gap-3 align-items-center">
                    <div class="form-check form-switch mb-0" title="Bật/Tắt trạng thái">
                      <input class="form-check-input shadow-none" type="checkbox" role="switch"
                        :checked="emp.trang_thai === 1" @change="handleToggleStatus(emp)"
                        :disabled="emp.ten_tai_khoan === currentUsername"
                        :style="emp.ten_tai_khoan === currentUsername ? 'cursor: not-allowed;' : 'cursor: pointer;'" />
                    </div>
                    <span class="bi bi-eye fs-5 text-primary" style="cursor: pointer" title="Xem chi tiết"
                      @click="$router.push(`/nhan-vien/edit/${emp.id}`)">
                    </span>
                  </div>
                </td>
              </tr>
              <tr v-if="employees.length === 0">
                <td colspan="10" class="text-center py-5 text-danger fw-medium">
                  Không tìm thấy nhân viên nào phù hợp với bộ lọc.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalElements > 0"
          class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small flex-wrap gap-3">
          <div>
            Hiển thị <span class="fw-bold text-dark">{{ employees.length }}</span> /
            <span class="fw-bold text-dark">{{ totalElements }}</span> bản ghi
          </div>
          <div class="d-flex gap-1 align-items-center">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0"
              class="btn btn-sm btn-light border shadow-none px-2 rounded">
              &lt;
            </button>
            <button v-for="pageIdx in totalPages" :key="pageIdx" @click="changePage(pageIdx - 1)"
              class="btn btn-sm shadow-none px-3 rounded fw-medium"
              :class="currentPage === (pageIdx - 1) ? 'btn-secondary text-white' : 'btn-light border text-muted'"
              :style="currentPage === (pageIdx - 1) ? 'background-color: #8c6b5d; border-color: #8c6b5d;' : ''">
              {{ pageIdx }}
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages - 1"
              class="btn btn-sm btn-light border shadow-none px-2 rounded">
              &gt;
            </button>
          </div>
          <div class="d-flex align-items-center gap-2">
            <select v-model="pageSize" @change="handleSizeChange"
              class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted pe-4"
              style="width: auto">
              <option :value="5">Hiển thị 5 bản ghi / trang</option>
              <option :value="10">Hiển thị 10 bản ghi / trang</option>
              <option :value="20">Hiển thị 20 bản ghi / trang</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin-top: 20px;">
    <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3"
      :style="toast.type === 'success' ? 'background-color: #f4fbf7; border-left: 4px solid #2e7d32 !important;' : 'background-color: #fff5f5; border-left: 4px solid #ef4444 !important;'">
      <div class="d-flex align-items-center gap-2 px-2 py-1">
        <i class="bi fs-5" :class="toast.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'"></i>
        <span class="fw-medium small text-dark">{{ toast.message }}</span>
      </div>
    </div>
  </div>

  <Teleport to="body" v-if="confirmModal.show">
    <div class="confirm-overlay">
      <div class="confirm-modal-card">
        <div class="confirm-icon-area"><i class="bi bi-person-fill-gear"></i></div>
        <h5 class="confirm-title">{{ confirmModal.title }}</h5>
        <p class="confirm-message">{{ confirmModal.message }}</p>
        <div class="confirm-actions">
          <button @click="confirmModal.show = false" class="btn-cancel-custom">Hủy bỏ</button>
          <button @click="confirmModal.onConfirm" class="btn-confirm-custom">Xác nhận</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentUsername = ref(localStorage.getItem('username') || 'Guest');
const toast = reactive({ show: false, message: '', type: 'success' });
const confirmModal = reactive({ show: false, title: '', message: '', onConfirm: null });

const showToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3000);
};

const employees = ref([]);
const loading = ref(true);
const currentPage = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const pageSize = ref(5);
const filters = reactive({ hoTen: '', contact: '', chucVu: '', trangThai: '', searchKeyword: '' });

// Quản lý kết nối WebSocket toàn cục trong component
const socket = ref(null);
const authChannel = new BroadcastChannel('auth-channel');

// Thiết lập hàm khởi tạo kết nối WebSocket xuyên suốt hệ thống
const initWebSocket = () => {
  // Thay thế đường dẫn phù hợp với Endpoint WebSocket cấu hình ở Spring Boot của bạn
  socket.value = new WebSocket('ws://localhost:8080/ws/employee-sync');

  socket.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Nếu nhận bản tin đổi trạng thái từ trình duyệt khác gửi lên server
      if (data.action === 'employee_deactivated') {
        // Tải lại danh sách data trên màn hình hiện tại để cập nhật UI đồng bộ
        fetchEmployees();
        
        // Phát tiếp một xung cục bộ bằng BroadcastChannel để đồng bộ tab Lịch làm việc kề cạnh
        authChannel.postMessage(data);
      } else if (data.action === 'kick_user') {
        authChannel.postMessage(data);
      }
    } catch (e) {
      console.error('Lỗi xử lý bản tin gửi về từ Socket Server:', e);
    }
  };

  socket.value.onclose = () => {
    // Tự động kích hoạt cơ chế reconect lại sau 5 giây đề phòng mất mạng đột ngột
    setTimeout(initWebSocket, 5000);
  };
};

const handleToggleStatus = (emp) => {
  const trạngTháiMới = emp.trang_thai === 1 ? 0 : 1;

  confirmModal.title = 'Thay đổi trạng thái';
  confirmModal.message = `Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của nhân viên:\n[${emp.ma_nhan_vien || emp.id}] - ${emp.ho_ten} không?`;

  confirmModal.onConfirm = async () => {
    confirmModal.show = false;
    try {
      const updatedData = { ...emp, trang_thai: trạngTháiMới };
      await axios.put(`http://localhost:8080/api/employees/${emp.id}`, updatedData);

      emp.trang_thai = trạngTháiMới;
      showToast('Cập nhật trạng thái nhân viên thành công!', 'success');

      if (trạngTháiMới === 0) {
        const payloadDeactivate = {
          action: 'employee_deactivated',
          employeeId: emp.id,
          employeeName: emp.ho_ten,
          employeeCode: emp.ma_nhan_vien || emp.id
        };

        // Gửi tín hiệu lên kênh tổng WebSocket Server để truyền tới toàn bộ các profile/trình duyệt khác
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
          socket.value.send(JSON.stringify(payloadDeactivate));
        }

        // Đồng thời bắn nội bộ cục bộ luôn cho trình duyệt hiện tại
        authChannel.postMessage(payloadDeactivate);
        authChannel.postMessage({ action: 'kick_user', username: emp.ten_tai_khoan });
      }

    } catch (error) {
      console.error(error);
      showToast('Không thể cập nhật trạng thái hoạt động!', 'danger');
    }
  };
  confirmModal.show = true;
};

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const params = { page: currentPage.value, size: pageSize.value };
    if (filters.chucVu) params.chucVu = filters.chucVu;
    if (filters.trangThai !== '') params.trangThai = filters.trangThai;
    if (filters.searchKeyword) {
      const kv = filters.searchKeyword.trim();
      params.searchKeyword = kv;
    }

    const response = await axios.get('http://localhost:8080/api/employees', { params });
    const currentLoggedUser = localStorage.getItem('username');
    let rawList = response.data.content || response.data || [];

    if (currentLoggedUser) {
      rawList.sort((a, b) => {
        if (a.ten_tai_khoan === currentLoggedUser) return -1;
        if (b.ten_tai_khoan === currentLoggedUser) return 1;
        return 0;
      });
    }

    employees.value = rawList;
    totalPages.value = response.data.totalPages || 0;
    totalElements.value = response.data.totalElements || 0;
  } catch (error) {
    console.error('Lỗi tải dữ liệu:', error);
    showToast('Không thể tải danh sách nhân viên!', 'danger');
  } finally {
    loading.value = false;
  }
};

const handleExportExcel = async () => {
  try {
    const params = {};
    if (filters.chucVu) params.chucVu = filters.chucVu;
    if (filters.trangThai !== '') params.trangThai = filters.trangThai;
    if (filters.searchKeyword) params.searchKeyword = filters.searchKeyword.trim();

    const response = await axios.get('http://localhost:8080/api/employees/export', {
      params, responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Danh_Sach_Nhan_Vien_${dateStr}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Lỗi khi xuất tệp Excel:', error);
    showToast('Không thể xuất file Excel!', 'danger');
  }
};

const changePage = (pageIdx) => {
  if (pageIdx >= 0 && pageIdx < totalPages.value) {
    currentPage.value = pageIdx;
    fetchEmployees();
  }
};
const handleFilter = () => { currentPage.value = 0; fetchEmployees(); };
const clearFilter = () => {
  filters.chucVu = ''; filters.trangThai = ''; filters.searchKeyword = '';
  currentPage.value = 0; fetchEmployees();
};
const handleSizeChange = () => { currentPage.value = 0; fetchEmployees(); };

let searchTimeout;
const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => { currentPage.value = 0; fetchEmployees(); }, 300);
};

onMounted(() => {
  fetchEmployees();
  initWebSocket(); // Khởi chạy lắng nghe cổng đẩy thời gian thực từ Backend
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>

<style scoped>
/* Giữ nguyên toàn bộ phần CSS tùy biến giao diện của bạn */
.employee-management-wrapper { padding: 0; background-color: transparent; }
.independent-filter-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02); }
.filter-card-header { display: flex; align-items: center; gap: 8px; }
.search-input-wrapper { position: relative; display: flex; align-items: center; }
.search-icon-inside { position: absolute; left: 16px; color: #8c8c8c; font-size: 14px; pointer-events: none; }
.employee-avatar { width: 42px; height: 42px; object-fit: cover; }
.confirm-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 99999; backdrop-filter: blur(3px); }
.confirm-modal-card { background: white; padding: 30px; border-radius: 16px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); animation: modalFadeIn 0.25s ease-out; }
.confirm-icon-area { font-size: 45px; color: #8a6d5b; margin-bottom: 15px; }
.confirm-title { font-weight: 700; color: #5a4031; margin-bottom: 10px; }
.confirm-message { font-size: 14px; color: #6c757d; line-height: 1.6; margin-bottom: 25px; white-space: pre-line; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }
.btn-cancel-custom { background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; padding: 8px 24px; border-radius: 50px; font-weight: 500; cursor: pointer; }
.btn-confirm-custom { background-color: #ebdcd0; color: #5a4031; border: 1px solid #cbb3a1; padding: 8px 24px; border-radius: 50px; font-weight: 600; cursor: pointer; }
.btn-confirm-custom:hover { background-color: #dccbc0; transform: translateY(-1px); }
@keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.table tbody tr td { font-size: 0.84rem; padding-left: 0px !important; padding-right: 8px !important; }
.table td:last-child, .table th:last-child { width: 100px !important; }
</style>