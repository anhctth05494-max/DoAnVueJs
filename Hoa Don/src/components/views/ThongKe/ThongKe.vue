<template>
  <div class="container-fluid p-4" style="background-color: #fdfaf5; min-height: 100vh;">
    <h4 class="fw-bold mb-4" style="color: #3e2723;"><i class="bi bi-bar-chart-fill me-2"></i> Thống kê</h4>

    <div class="row g-3 mb-4">
      <div class="col-xl-3 col-md-6" v-for="(card, index) in summaryCards" :key="index">
        <div class="card border-0 shadow-sm rounded-4 h-100" style="border-top: 4px solid #cfb9a3 !important;">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted fw-medium">{{ card.title }}</span>
              <div class="icon-box rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: #f8f1ea;">
                <i :class="card.icon" style="color: #cfb9a3;"></i>
              </div>
            </div>
            <h3 class="fw-bold mb-3" style="color: #3e2723;">{{ card.revenue }} <span class="fs-6 text-muted">đ</span></h3>
            <div class="text-muted small mb-3">Sản phẩm đã bán <strong>{{ card.products }}</strong> • Đơn hàng <strong>{{ card.orders }}</strong></div>
            <div class="d-flex gap-2">
              <div class="badge-status bg-success-subtle text-success"><div class="small">Hoàn thành</div><strong class="fs-6">{{ card.completed }}</strong></div>
              <div class="badge-status bg-warning-subtle text-warning-emphasis"><div class="small">Xử lý</div><strong class="fs-6">{{ card.processing }}</strong></div>
              <div class="badge-status bg-danger-subtle text-danger"><div class="small">Hủy</div><strong class="fs-6">{{ card.canceled }}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-start mb-4 border-bottom pb-3">
          <div>
            <h5 class="fw-bold mb-1" style="color: #3e2723;">Bộ Lọc Tìm Kiếm</h5>
            <small class="text-muted">Chọn khoảng thời gian để xem chi tiết biểu đồ</small>
          </div>
          <div class="d-flex gap-2">
            <div class="btn-group shadow-sm" role="group">
              <button type="button" class="btn" :class="filterType === 'hom_nay' ? 'btn-brand' : 'btn-white border'" @click="applyFilter('hom_nay')">Hôm nay</button>
              <button type="button" class="btn" :class="filterType === 'tuan_nay' ? 'btn-brand' : 'btn-white border'" @click="applyFilter('tuan_nay')">Tuần này</button>
              <button type="button" class="btn" :class="filterType === 'thang_nay' ? 'btn-brand' : 'btn-white border'" @click="applyFilter('thang_nay')">Tháng này</button>
              <button type="button" class="btn" :class="filterType === 'nam_nay' ? 'btn-brand' : 'btn-white border'" @click="applyFilter('nam_nay')">Năm nay</button>
            </div>
            <button type="button" class="btn btn-white border shadow-sm" @click="filterType = 'tuy_chinh'">Tùy chỉnh</button>
            <button class="btn btn-white border shadow-sm ms-2"><i class="bi bi-file-earmark-excel me-1 text-success"></i> Xuất Excel</button>
          </div>
        </div>

        <div v-if="filterType === 'tuy_chinh'" class="row g-3 mb-4 p-3 bg-light rounded-3">
           <div class="col-md-3">
             <label class="form-label text-muted small mb-1">Từ ngày</label>
             <input type="date" class="form-control form-control-sm" v-model="customStartDate">
           </div>
           <div class="col-md-3">
             <label class="form-label text-muted small mb-1">Đến ngày</label>
             <input type="date" class="form-control form-control-sm" v-model="customEndDate">
           </div>
           <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-brand btn-sm w-100" @click="applyCustomFilter"><i class="bi bi-search"></i> Lọc dữ liệu</button>
           </div>
        </div>

        <div class="row text-center align-items-center">
          <div class="col"><div class="text-muted small mb-1">Số đơn hàng</div><h5 class="fw-bold mb-0">{{ filterStats.orders }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Số sản phẩm</div><h5 class="fw-bold mb-0">{{ filterStats.products }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Hoàn thành</div><h5 class="fw-bold text-success mb-0">{{ filterStats.completed }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Đang xử lý</div><h5 class="fw-bold text-warning mb-0">{{ filterStats.processing }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Hủy</div><h5 class="fw-bold text-danger mb-0">{{ filterStats.canceled }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Doanh thu</div><h5 class="fw-bold mb-0" style="color: #3e2723;">{{ filterStats.revenue }} đ</h5></div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-graph-up-arrow me-2"></i> Biểu đồ doanh thu ({{ currentRangeText }})</h6>
          </div>
          <div class="card-body p-4">
            <div style="height: 320px; width: 100%;">
              <canvas id="doanhThuLineChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-pie-chart-fill me-2"></i> Phân bổ trạng thái</h6>
          </div>
          <div class="card-body p-4 d-flex flex-column align-items-center justify-content-center">
            <div style="position: relative; height: 250px; width: 100%; display: flex; justify-content: center;">
              <canvas id="trangThaiDonHangChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

   <div class="row g-4">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
           <div class="card-header text-white rounded-top-4 p-3 d-flex justify-content-between" style="background-color: #3e2723;">
             <span class="fw-bold"><i class="bi bi-trophy-fill me-2 text-warning"></i> Top bán chạy</span>
             <span class="badge text-dark" style="background-color: #cfb9a3;">Top 10</span>
           </div>
           <div class="card-body p-0">
              <table class="table table-hover align-middle mb-0 text-sm">
                <tbody>
                  <tr v-for="(sp, index) in topSanPhamData" :key="index">
                    <td class="text-center fw-bold text-muted" style="width: 50px;">#{{ index + 1 }}</td>
                    <td class="fw-medium">{{ sp.tenSanPham }}</td>
                    <td class="text-end pe-4 text-muted">Đã bán: <strong class="text-dark">{{ sp.soLuongBan }}</strong></td>
                  </tr>
                  <tr v-if="topSanPhamData.length === 0">
                    <td colspan="3" class="text-center py-4 text-muted">Chưa có dữ liệu</td>
                  </tr>
                </tbody>
              </table>
           </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
           <div class="card-header text-white rounded-top-4 p-3 d-flex justify-content-between" style="background-color: #3e2723;">
             <span class="fw-bold"><i class="bi bi-receipt me-2"></i> Đơn hàng gần đây</span>
           </div>
           <div class="card-body p-0">
              <table class="table table-hover align-middle mb-0 text-sm">
                <tbody>
                  <tr v-for="(dh, index) in donHangGanDayData" :key="index">
                    <td class="ps-4 fw-medium text-primary">{{ dh.maHoaDon }}</td>
                    <td>{{ dh.tenKhachHang }}<br><small class="text-muted">{{ dh.ngayTao }}</small></td>
                    <td class="fw-bold" style="color: #3e2723;">{{ dh.tongTien.toLocaleString('vi-VN') }} đ</td>
                    <td class="text-end pe-4">
                      <span class="badge" :class="getBadgeTrangThai(dh.trangThai)">{{ getTextTrangThai(dh.trangThai) }}</span>
                    </td>
                  </tr>
                  <tr v-if="donHangGanDayData.length === 0">
                    <td colspan="4" class="text-center py-4 text-muted">Chưa có dữ liệu</td>
                  </tr>
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';

// ==========================================
// CÁC BIẾN STATE
// ==========================================
const filterType = ref('thang_nay');
const customStartDate = ref('');
const customEndDate = ref('');
const currentRangeText = ref(''); 

let doanhThuChartInstance = null;
let trangThaiChartInstance = null; // Thêm biến lưu chart tròn

const filterStats = ref({ orders: 0, products: 0, completed: 0, processing: 0, canceled: 0, revenue: '0' });

const summaryCards = ref([
  { title: 'Hôm nay', icon: 'bi-calendar-day', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0 },
  { title: 'Tuần này', icon: 'bi-calendar-week', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0 },
  { title: 'Tháng này', icon: 'bi-calendar-month', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0 },
  { title: 'Năm nay', icon: 'bi-calendar', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0 },
]);

// ==========================================
// HÀM TIỆN ÍCH
// ==========================================
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(formatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

// ==========================================
// HÀM GỌI API & VẼ GIAO DIỆN CHÍNH
// ==========================================
const loadDuLieuTheoKhoangThoiGian = async (startDate, endDate) => {
  try {
    // 1. Gọi API Lấy số liệu cho Bộ Lọc
    const resStats = await axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${startDate}&endDate=${endDate}`);
    const dataStats = resStats.data;
    
    filterStats.value.orders = dataStats.tongDonHang;
    filterStats.value.products = dataStats.sanPhamDaBan || 0; 
    filterStats.value.completed = dataStats.donHoanThanh;
    filterStats.value.processing = dataStats.donDangXuLy;
    filterStats.value.canceled = dataStats.donHuy;
    filterStats.value.revenue = dataStats.doanhThu.toLocaleString('vi-VN');

    // MÓC DỮ LIỆU ĐỔ VÀO BIỂU ĐỒ TRÒN NGAY LẬP TỨC
    if (trangThaiChartInstance) trangThaiChartInstance.destroy();
    const ctxPie = document.getElementById('trangThaiDonHangChart');
    trangThaiChartInstance = new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['Hoàn thành', 'Đang xử lý', 'Đã hủy'],
        datasets: [{
          data: [dataStats.donHoanThanh, dataStats.donDangXuLy, dataStats.donHuy], 
          backgroundColor: ['#20c997', '#FFD700', '#dc3545'], 
          borderWidth: 2, borderColor: '#fff'
        }]
      },
      options: { 
        responsive: true, maintainAspectRatio: false, cutout: '65%', 
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } 
      }
    });

    // 2. Gọi API Lấy dữ liệu vẽ Biểu đồ đường
    const resChart = await axios.get(`http://localhost:8080/api/thong-ke/bieu-do-custom?startDate=${startDate}&endDate=${endDate}`);
    const chartDataFromApi = resChart.data;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateLabels = getDatesInRange(start, end);
    
    // Tạo nhãn trục X chỉ chứa Ngày (Xóa năm tháng)
    const displayLabels = dateLabels.map(dateStr => parseInt(dateStr.split('-')[2]));

    const revenueData = dateLabels.map(dateLabel => {
      const found = chartDataFromApi.find(item => item.ngay === dateLabel);
      return found ? found.doanhThu : 0;
    });

    if (doanhThuChartInstance) doanhThuChartInstance.destroy();
    const ctxLine = document.getElementById('doanhThuLineChart');
    doanhThuChartInstance = new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: displayLabels, // Đã thay bằng mảng chỉ có ngày
        datasets: [{
          label: 'Doanh thu',
          data: revenueData,
          borderColor: '#cfb9a3',
          backgroundColor: 'rgba(207, 185, 163, 0.2)',
          borderWidth: 2, tension: 0.4, fill: true,
          pointBackgroundColor: '#fff', pointBorderColor: '#cfb9a3', pointRadius: 3
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, suggestedMax: 1000000, ticks: { callback: value => value === 0 ? '0' : (value >= 1000000 ? (value/1000000)+'M' : (value/1000)+'K') } }
        }
      }
    });

  } catch (error) {
    console.error("Lỗi lấy dữ liệu tùy chỉnh:", error);
  }
};

const topSanPhamData = ref([]);
const donHangGanDayData = ref([]);

// Thêm các hàm này vào
const loadTopVaGanDay = async () => {
  try {
    const resTop = await axios.get('http://localhost:8080/api/thong-ke/top-san-pham');
    topSanPhamData.value = resTop.data;

    const resDon = await axios.get('http://localhost:8080/api/thong-ke/don-hang-gan-day');
    donHangGanDayData.value = resDon.data;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu bảng dưới:", error);
  }
};

// Hàm phụ trợ map màu và text cho trạng thái đơn hàng
const getTextTrangThai = (status) => {
  if (status === 5) return "Hoàn thành";
  if (status === 1) return "Hủy";
  return "Xử lý";
};

const getBadgeTrangThai = (status) => {
  if (status === 5) return "bg-success-subtle text-success";
  if (status === 1) return "bg-danger-subtle text-danger";
  return "bg-warning-subtle text-warning-emphasis";
};

const applyFilter = (type) => {
  filterType.value = type;
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();

  if (type === 'hom_nay') {
    currentRangeText.value = 'Hôm nay';
  } 
  else if (type === 'tuan_nay') {
    currentRangeText.value = 'Tuần này';
    const day = today.getDay();
    const diff = today.getDate() - day + (day == 0 ? -6 : 1);
    startDate = new Date(today.setDate(diff));
  } 
  else if (type === 'thang_nay') {
    currentRangeText.value = 'Tháng này';
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } 
  else if (type === 'nam_nay') {
    currentRangeText.value = 'Năm nay';
    startDate = new Date(today.getFullYear(), 0, 1);
  }

  endDate = new Date(); 
  loadDuLieuTheoKhoangThoiGian(formatDate(startDate), formatDate(endDate));
};

const applyCustomFilter = () => {
  if (!customStartDate.value || !customEndDate.value) {
    alert("Vui lòng chọn đầy đủ Từ ngày và Đến ngày!");
    return;
  }
  if (customStartDate.value > customEndDate.value) {
    alert("Từ ngày không thể lớn hơn Đến ngày!");
    return;
  }
  currentRangeText.value = `${customStartDate.value} đến ${customEndDate.value}`;
  loadDuLieuTheoKhoangThoiGian(customStartDate.value, customEndDate.value);
};

const loadTongQuanCards = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/thong-ke/tong-quan-cards');
    const data = res.data;
    summaryCards.value[0].revenue = data.homNay.doanhThu.toLocaleString('vi-VN');
    summaryCards.value[0].orders = data.homNay.tongDonHang;
    summaryCards.value[0].completed = data.homNay.donHoanThanh;
    summaryCards.value[0].canceled = data.homNay.donHuy;
    summaryCards.value[0].processing = data.homNay.donDangXuLy;

    summaryCards.value[1].revenue = data.tuanNay.doanhThu.toLocaleString('vi-VN');
    summaryCards.value[1].orders = data.tuanNay.tongDonHang;
    summaryCards.value[1].completed = data.tuanNay.donHoanThanh;
    summaryCards.value[1].canceled = data.tuanNay.donHuy;
    summaryCards.value[1].processing = data.tuanNay.donDangXuLy;

    summaryCards.value[2].revenue = data.thangNay.doanhThu.toLocaleString('vi-VN');
    summaryCards.value[2].orders = data.thangNay.tongDonHang;
    summaryCards.value[2].completed = data.thangNay.donHoanThanh;
    summaryCards.value[2].canceled = data.thangNay.donHuy;
    summaryCards.value[2].processing = data.thangNay.donDangXuLy;

    summaryCards.value[3].revenue = data.namNay.doanhThu.toLocaleString('vi-VN');
    summaryCards.value[3].orders = data.namNay.tongDonHang;
    summaryCards.value[3].completed = data.namNay.donHoanThanh;
    summaryCards.value[3].canceled = data.namNay.donHuy;
    summaryCards.value[3].processing = data.namNay.donDangXuLy;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu thẻ tổng quan:", error);
  }
};

onMounted(() => {
  loadTongQuanCards();
  applyFilter('thang_nay');
  loadTopVaGanDay();
});
</script>

<style scoped>
.btn-brand { background-color: #3e2723 !important; color: #fff !important; border-color: #3e2723 !important; font-weight: 500; }
.btn-white { background-color: #fff; color: #6c757d; }
.btn-white:hover { background-color: #f8f9fa; color: #3e2723; }
.badge-status { flex: 1; padding: 8px; border-radius: 8px; text-align: center; }
.bg-success-subtle { background-color: #d1e7dd; }
.bg-danger-subtle { background-color: #f8d7da; }
.bg-warning-subtle { background-color: #fff3cd; }
</style>
