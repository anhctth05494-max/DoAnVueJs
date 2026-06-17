<template>
  <div class="container-fluid p-4" style="background-color: #f4f6f8; min-height: 100vh;">
    <h4 class="fw-bold mb-4" style="color: #3e2723;"><i class="bi bi-bar-chart-fill me-2"></i> Thống kê doanh thu</h4>

    <div class="row g-3 mb-4">
      <div class="col-xl-3 col-md-6" v-for="(card, index) in summaryCards" :key="index">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted fw-medium">{{ card.title }}</span>
              <div class="icon-box rounded-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: #f8f1ea;">
                <i :class="card.icon" style="color: #cbb7a3;"></i>
              </div>
            </div>
            
            <div class="d-flex align-items-center gap-2 mb-3">
              <h3 class="fw-bold mb-0" style="color: #3e2723;">{{ card.revenue }} <span class="fs-6 text-muted">đ</span></h3>
              <span v-if="card.growth !== undefined" 
                    class="badge rounded-pill fw-medium px-2 py-1"
                    :class="card.isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                    style="font-size: 0.75rem;">
                <i :class="card.isUp ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short'"></i> {{ card.growth }}%
              </span>
            </div>

            <div class="text-muted small mb-3">Sản phẩm đã bán <strong>{{ card.products }}</strong> • Đơn hàng <strong>{{ card.orders }}</strong></div>
            
            <div class="d-flex gap-2">
              <div class="badge-status bg-status-success"><div class="small">Hoàn thành</div><strong class="fs-6">{{ card.completed }}</strong></div>
              <div class="badge-status bg-status-warning"><div class="small">Xử lý</div><strong class="fs-6">{{ card.processing }}</strong></div>
              <div class="badge-status bg-status-danger"><div class="small">Hủy</div><strong class="fs-6">{{ card.canceled }}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4" style="border-radius: 10px;">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-start mb-4 border-bottom pb-3">
          <div>
            <h6 class="fw-bold mb-1" style="color: #3e2723;"><i class="bi bi-funnel me-2"></i> Bộ lọc tìm kiếm</h6>
            <small class="text-muted">Chọn khoảng thời gian để xem chi tiết biểu đồ</small>
          </div>
          <div class="d-flex gap-2">
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-sm" :class="filterType === 'hom_nay' ? 'btn-brand' : 'btn-outline-custom'" @click="applyFilter('hom_nay')">Hôm nay</button>
              <button type="button" class="btn btn-sm" :class="filterType === 'tuan_nay' ? 'btn-brand' : 'btn-outline-custom'" @click="applyFilter('tuan_nay')">Tuần này</button>
              <button type="button" class="btn btn-sm" :class="filterType === 'thang_nay' ? 'btn-brand' : 'btn-outline-custom'" @click="applyFilter('thang_nay')">Tháng này</button>
              <button type="button" class="btn btn-sm" :class="filterType === 'nam_nay' ? 'btn-brand' : 'btn-outline-custom'" @click="applyFilter('nam_nay')">Năm nay</button>
            </div>
            <button type="button" class="btn btn-sm btn-outline-custom ms-1" @click="filterType = 'tuy_chinh'">Tùy chỉnh</button>
            <button class="btn btn-sm btn-outline-custom ms-2"><i class="bi bi-download me-1"></i> Xuất Excel</button>
          </div>
        </div>

        <div v-if="filterType === 'tuy_chinh'" class="row g-3 mb-4 p-3 rounded-2" style="background-color: #f8f9fa;">
           <div class="col-md-3">
             <label class="form-label text-muted small mb-1">Từ ngày</label>
             <input type="date" class="form-control form-control-sm border-0 shadow-sm" v-model="customStartDate">
           </div>
           <div class="col-md-3">
             <label class="form-label text-muted small mb-1">Đến ngày</label>
             <input type="date" class="form-control form-control-sm border-0 shadow-sm" v-model="customEndDate">
           </div>
           <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-brand btn-sm w-100" @click="applyCustomFilter"><i class="bi bi-search me-1"></i> Lọc dữ liệu</button>
           </div>
        </div>

        <div class="row text-center align-items-center">
          <div class="col"><div class="text-muted small mb-1">Số đơn hàng</div><h5 class="fw-bold mb-0" style="color: #3e2723;">{{ filterStats.orders }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Số sản phẩm</div><h5 class="fw-bold mb-0" style="color: #3e2723;">{{ filterStats.products }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Hoàn thành</div><h5 class="fw-bold mb-0" style="color: #4EA87D;">{{ filterStats.completed }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Đang xử lý</div><h5 class="fw-bold mb-0" style="color: #F0B247;">{{ filterStats.processing }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Hủy</div><h5 class="fw-bold mb-0" style="color: #E26B6B;">{{ filterStats.canceled }}</h5></div>
          <div class="col border-start"><div class="text-muted small mb-1">Doanh thu</div><h5 class="fw-bold mb-0" style="color: #d9534f;">{{ filterStats.revenue }} đ</h5></div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;">Biểu đồ doanh thu ({{ currentRangeText }})</h6>
          </div>
          <div class="card-body p-4 pt-5">
            <div style="height: 300px; width: 100%;">
              <canvas id="doanhThuLineChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;">Phân bổ trạng thái</h6>
          </div>
          <div class="card-body p-4 d-flex flex-column align-items-center justify-content-center">
            <div style="position: relative; height: 260px; width: 100%; display: flex; justify-content: center;">
              <canvas id="trangThaiDonHangChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px; overflow: hidden;">
           <div class="card-header border-bottom-0 p-3 d-flex align-items-center" style="background-color: #dfd3c3;">
             <h6 class="fw-bold mb-0" style="color: #4a3b32; letter-spacing: 0.5px;">Top sản phẩm bán chạy</h6>
           </div>
           <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead class="bg-white">
                    <tr>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 60px; font-size: 0.85rem;">STT</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 80px; font-size: 0.85rem;">Ảnh</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Tên Sản Phẩm</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 90px; font-size: 0.85rem;">Kích Cỡ</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Giá</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 80px; font-size: 0.85rem;">Bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sp, index) in topSanPhamData" :key="index">
                      <td class="text-center text-muted fw-medium">{{ index + 1 }}</td>
                      <td class="text-center py-2">
                        <img v-if="sp.anh" :src="sp.anh" alt="IMG" class="rounded" style="width: 40px; height: 40px; object-fit: cover; border: 1px solid #eee;">
                        <div v-else class="text-muted small d-flex align-items-center justify-content-center mx-auto" style="width: 40px; height: 40px; background: #f8f9fa; border-radius: 6px;">No Img</div>
                      </td>
                      <td class="text-center">
                        <div class="fw-bold" style="color: #3e2723; font-size: 0.9rem;">{{ sp.tenSanPham }}</div>
                      </td>
                      <td class="text-center">
                        <span class="badge bg-light text-dark border px-2 py-1" style="font-size: 0.8rem;">{{ sp.kichCo }}</span>
                      </td>
                      <td class="text-center fw-bold" style="color: #d9534f; font-size: 0.9rem;">
                        {{ (sp.gia || 0).toLocaleString('vi-VN') }} đ
                      </td>
                      <td class="text-center">
                        <span class="badge rounded-pill" style="background-color: #e7f1ff; color: #0d6efd; font-weight: 500; padding: 6px 10px;">
                          {{ sp.soLuongBan }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="topSanPhamData.length === 0"><td colspan="6" class="text-center py-5 text-muted">Chưa có dữ liệu</td></tr>
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px; overflow: hidden;">
           <div class="card-header border-bottom-0 p-3 d-flex align-items-center" style="background-color: #dfd3c3;">
             <h6 class="fw-bold mb-0" style="color: #4a3b32; letter-spacing: 0.5px;">Đơn hàng gần đây</h6>
           </div>
           <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead class="bg-white">
                    <tr>
                      <th class="ps-4 text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Mã HĐ</th>
                      <th class="text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Khách hàng</th>
                      <th class="text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Tổng tiền TT</th>
                      <th class="text-end pe-4 text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(dh, index) in donHangGanDayData" :key="index">
                      <td class="ps-4 fw-bold" style="color: #3e2723; font-size: 0.9rem;">{{ dh.maHoaDon }}</td>
                      <td>
                        <div class="fw-medium text-dark" style="font-size: 0.9rem;">{{ dh.tenKhachHang }}</div>
                        <div class="text-muted" style="font-size: 0.75rem;">{{ dh.ngayTao }}</div>
                      </td>
                      <td class="fw-bold" style="color: #d9534f; font-size: 0.9rem;">
                        {{ (dh.tongTien || 0).toLocaleString('vi-VN') }} đ
                      </td>
                      <td class="text-end pe-4">
                        <span class="badge rounded-pill px-3 py-2" :class="getBadgeTrangThai(dh.trangThai)" style="font-weight: 500;">
                          {{ getTextTrangThai(dh.trangThai) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="donHangGanDayData.length === 0"><td colspan="4" class="text-center py-5 text-muted">Chưa có dữ liệu</td></tr>
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px; overflow: hidden;">
           <div class="card-header border-bottom-0 p-3 d-flex align-items-center" style="background-color: #dfd3c3;">
             <h6 class="fw-bold mb-0" style="color: #4a3b32; letter-spacing: 0.5px;">Sản phẩm sắp hết hàng</h6>
           </div>
           <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead class="bg-white">
                    <tr>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 60px; font-size: 0.85rem;">STT</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 80px; font-size: 0.85rem;">Ảnh</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Tên Sản Phẩm</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 90px; font-size: 0.85rem;">Kích Cỡ</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="width: 110px; font-size: 0.85rem;">Tồn Kho</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sp, index) in sapHetHangData" :key="index">
                      <td class="text-center text-muted fw-medium">{{ index + 1 }}</td>
                      <td class="text-center py-2">
                        <img v-if="sp.anh" :src="sp.anh" alt="IMG" class="rounded" style="width: 40px; height: 40px; object-fit: cover; border: 1px solid #eee;">
                        <div v-else class="text-muted small d-flex align-items-center justify-content-center mx-auto" style="width: 40px; height: 40px; background: #f8f9fa; border-radius: 6px;">No Img</div>
                      </td>
                      <td class="text-center">
                        <div class="fw-bold" style="color: #3e2723; font-size: 0.9rem;">{{ sp.tenSanPham }}</div>
                      </td>
                      <td class="text-center">
                        <span class="badge bg-light text-dark border px-2 py-1" style="font-size: 0.8rem;">{{ sp.kichCo }}</span>
                      </td>
                      <td class="text-center">
                        <span class="badge rounded-pill" style="background-color: #FCEAEA; color: #B34444; font-weight: 500; padding: 6px 12px;">
                          Chỉ còn {{ sp.soLuongTon }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="sapHetHangData.length === 0"><td colspan="5" class="text-center py-5 text-muted">Tồn kho đang ổn định</td></tr>
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px; overflow: hidden;">
           <div class="card-header border-bottom-0 p-3 d-flex align-items-center" style="background-color: #dfd3c3;">
             <h6 class="fw-bold mb-0" style="color: #4a3b32; letter-spacing: 0.5px;">Top Khách hàng VIP</h6>
           </div>
           <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead class="bg-white">
                    <tr>
                      <th class="ps-4 text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Mã KH</th>
                      <th class="text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Khách hàng</th>
                      <th class="text-center text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Số Đơn</th>
                      <th class="text-end pe-4 text-muted fw-semibold border-bottom py-3" style="font-size: 0.85rem;">Tổng Chi Tiêu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(vip, index) in topVipData" :key="index">
                      <td class="ps-4 fw-bold" style="color: #3e2723; font-size: 0.9rem;">
                        {{ vip.maKhachHang }}
                      </td>
                      <td>
                        <div class="fw-medium text-dark" style="font-size: 0.9rem;">{{ vip.hoTen }}</div>
                        <div class="text-muted" style="font-size: 0.75rem;">{{ vip.soDienThoai }}</div>
                      </td>
                      <td class="text-center">
                        <span class="badge rounded-pill bg-light text-dark border px-2">{{ vip.soDonHang }}</span>
                      </td>
                      <td class="text-end pe-4 fw-bold" style="color: #d9534f; font-size: 0.9rem;">
                        {{ (vip.tongChiTieu || 0).toLocaleString('vi-VN') }} đ
                      </td>
                    </tr>
                    <tr v-if="topVipData.length === 0"><td colspan="4" class="text-center py-5 text-muted">Chưa có dữ liệu</td></tr>
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // Bổ sung onUnmounted
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
let trangThaiChartInstance = null; 

const filterStats = ref({ orders: 0, products: 0, completed: 0, processing: 0, canceled: 0, revenue: '0' });

const summaryCards = ref([
  { title: 'Hôm nay', icon: 'bi-calendar-day', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0, growth: 0, isUp: true },
  { title: 'Tuần này', icon: 'bi-calendar-week', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0, growth: 0, isUp: true },
  { title: 'Tháng này', icon: 'bi-calendar-month', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0, growth: 0, isUp: true },
  { title: 'Năm nay', icon: 'bi-calendar', revenue: '0', products: 0, orders: 0, completed: 0, canceled: 0, processing: 0, growth: 0, isUp: true },
]);

const topSanPhamData = ref([]);
const donHangGanDayData = ref([]);
const sapHetHangData = ref([]);
const topVipData = ref([]);

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

const getTextTrangThai = (status) => {
  if (status === 5) return "Hoàn thành";
  if (status === 1) return "Hủy";
  return "Xử lý";
};

const getBadgeTrangThai = (status) => {
  if (status === 5) return "bg-status-success"; 
  if (status === 1) return "bg-status-danger";  
  return "bg-status-warning";                   
};

// ==========================================
// HÀM GỌI API & VẼ GIAO DIỆN CHÍNH
// ==========================================
const loadDuLieuTheoKhoangThoiGian = async (startDate, endDate) => {
  try {
    const resStats = await axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${startDate}&endDate=${endDate}`);
    const dataStats = resStats.data;
    
    filterStats.value.orders = dataStats.tongDonHang;
    filterStats.value.products = dataStats.sanPhamDaBan || 0; 
    filterStats.value.completed = dataStats.donHoanThanh;
    filterStats.value.processing = dataStats.donDangXuLy;
    filterStats.value.canceled = dataStats.donHuy;
    filterStats.value.revenue = (dataStats.doanhThu || 0).toLocaleString('vi-VN');

    // 1. PLUGIN CHO BIỂU ĐỒ TRÒN
    const customOuterLabelsPlugin = {
      id: 'customOuterLabels',
      afterDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = '11px "Inter", sans-serif';
        ctx.textBaseline = 'middle';

        const meta = chart.getDatasetMeta(0);
        const data = chart.data.datasets[0].data;
        const total = data.reduce((a, b) => a + b, 0);

        if (total === 0) {
            ctx.restore();
            return; 
        }

        meta.data.forEach((arc, index) => {
          const value = data[index];
          if (value === 0) return; 

          const percentage = ((value / total) * 100).toFixed(1) + '%';
          const label = chart.data.labels[index];
          const text1 = label;
          const text2 = `${value} (${percentage})`;

          const centerX = arc.x;
          const centerY = arc.y;
          const angle = (arc.startAngle + arc.endAngle) / 2;
          const outerRadius = arc.outerRadius;

          const xLine1 = centerX + Math.cos(angle) * outerRadius;
          const yLine1 = centerY + Math.sin(angle) * outerRadius;

          const xLine2 = centerX + Math.cos(angle) * (outerRadius + 15);
          const yLine2 = centerY + Math.sin(angle) * (outerRadius + 15);

          const isRight = xLine2 > centerX;
          const xLine3 = xLine2 + (isRight ? 25 : -25);

          ctx.beginPath();
          ctx.moveTo(xLine1, yLine1);
          ctx.lineTo(xLine2, yLine2);
          ctx.lineTo(xLine3, yLine2);
          ctx.strokeStyle = chart.data.datasets[0].backgroundColor[index];
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.fillStyle = '#5b4a42'; 
          ctx.textAlign = isRight ? 'left' : 'right';
          const textX = isRight ? xLine3 + 5 : xLine3 - 5;

          ctx.fillText(text1, textX, yLine2 - 7);
          ctx.font = 'bold 11px "Inter", sans-serif'; 
          ctx.fillText(text2, textX, yLine2 + 7);
          ctx.font = '11px "Inter", sans-serif'; 
        });
        ctx.restore();
      }
    };

    if (trangThaiChartInstance) trangThaiChartInstance.destroy();
    const ctxPie = document.getElementById('trangThaiDonHangChart');
    trangThaiChartInstance = new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['Hoàn thành', 'Đang xử lý', 'Đã hủy'],
        datasets: [{
          data: [dataStats.donHoanThanh, dataStats.donDangXuLy, dataStats.donHuy], 
          backgroundColor: ['#4EA87D', '#F0B247', '#E26B6B'], 
          borderWidth: 2, borderColor: '#fff'
        }]
      },
      options: { 
        responsive: true, maintainAspectRatio: false, cutout: '60%', layout: { padding: 40 },
        plugins: { 
          tooltip: { enabled: false },
          legend: { position: 'bottom', labels: { usePointStyle: false, boxWidth: 25, padding: 20, font: {family: "'Inter', sans-serif"} } } 
        } 
      },
      plugins: [customOuterLabelsPlugin] 
    });


    // 2. PLUGIN HIỆN SỐ TRÊN ĐỈNH CỘT
    const barDataLabelsPlugin = {
      id: 'barDataLabels',
      afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = 'bold 11px "Inter", sans-serif'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);

        meta.data.forEach((bar, index) => {
          const value = dataset.data[index];
          if (value > 0) {
            let text = value;
            if (value >= 1000000) {
              text = (value / 1000000).toFixed(1).replace('.0', '') + 'M';
            } else if (value >= 1000) {
              text = (value / 1000).toFixed(0) + 'K';
            } else {
              text = value.toLocaleString('vi-VN');
            }
            ctx.fillStyle = '#d9534f'; 
            ctx.fillText(text, bar.x, bar.y - 5); 
          }
        });
        ctx.restore();
      }
    };

    // 3. KHỞI TẠO BIỂU ĐỒ CỘT (BAR CHART)
    const resChart = await axios.get(`http://localhost:8080/api/thong-ke/bieu-do-custom?startDate=${startDate}&endDate=${endDate}`);
    const chartDataFromApi = resChart.data;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let displayLabels = [];
    let revenueData = [];

    if (diffDays > 31) {
      const monthlyData = {};
      let currentMonth = new Date(start.getFullYear(), start.getMonth(), 1);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
      
      while (currentMonth <= endMonth) {
        const y = currentMonth.getFullYear();
        const m = String(currentMonth.getMonth() + 1).padStart(2, '0');
        monthlyData[`${y}-${m}`] = 0;
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }

      chartDataFromApi.forEach(item => {
        const monthKey = item.ngay.substring(0, 7);
        if (monthlyData[monthKey] !== undefined) {
          monthlyData[monthKey] += item.doanhThu;
        }
      });

      displayLabels = Object.keys(monthlyData).map(key => `Tháng ${parseInt(key.split('-')[1])}`);
      revenueData = Object.values(monthlyData);

    } else {
      const dateLabels = getDatesInRange(start, end);
      displayLabels = dateLabels.map(dateStr => parseInt(dateStr.split('-')[2])); 
      revenueData = dateLabels.map(dateLabel => {
        const found = chartDataFromApi.find(item => item.ngay === dateLabel);
        return found ? found.doanhThu : 0;
      });
    }

    if (doanhThuChartInstance) doanhThuChartInstance.destroy();
    const ctxLine = document.getElementById('doanhThuLineChart').getContext('2d');

    doanhThuChartInstance = new Chart(ctxLine, {
      type: 'bar',
      data: {
        labels: displayLabels, 
        datasets: [{
          label: 'Doanh thu',
          data: revenueData,
          backgroundColor: '#d0bba6', 
          hoverBackgroundColor: '#c2a88f',
          borderRadius: { topLeft: 4, topRight: 4 }, 
          barPercentage: 0.5, 
          maxBarThickness: 45
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, 
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(74, 59, 50, 0.9)',
            titleFont: { size: 13, family: "'Inter', sans-serif" },
            bodyFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
            callbacks: {
              label: function(context) {
                return context.parsed.y.toLocaleString('vi-VN') + ' đ';
              }
            }
          }
        },
        scales: {
          x: { 
            grid: { display: false, drawBorder: true }, 
            ticks: { 
              font: {family: "'Inter', sans-serif", size: 11}, 
              color: '#999',
              maxTicksLimit: 31, 
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0
            } 
          },
          y: { 
            beginAtZero: true, 
            suggestedMax: Math.max(...revenueData) * 1.2 || 1000000,
            border: { display: false }, 
            grid: { color: '#f0f0f0', borderDash: [5, 5] },
            ticks: { 
              font: {family: "'Inter', sans-serif", size: 11}, 
              color: '#999',
              callback: value => value === 0 ? '0' : (value >= 1000000 ? (value/1000000)+'M' : (value/1000)+'K') 
            } 
          }
        }
      },
      plugins: [barDataLabelsPlugin]
    });

  } catch (error) {
    console.error("Lỗi lấy dữ liệu tùy chỉnh:", error);
  }
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

    const assignCardData = (index, dataObj) => {
      summaryCards.value[index].revenue = (dataObj.doanhThu || 0).toLocaleString('vi-VN');
      summaryCards.value[index].orders = dataObj.tongDonHang;
      summaryCards.value[index].products = dataObj.sanPhamDaBan || 0; 
      summaryCards.value[index].completed = dataObj.donHoanThanh;
      summaryCards.value[index].canceled = dataObj.donHuy;
      summaryCards.value[index].processing = dataObj.donDangXuLy;
      summaryCards.value[index].growth = dataObj.phanTramTangTruong; 
      summaryCards.value[index].isUp = dataObj.isTang;
    };

    if(data.homNay) assignCardData(0, data.homNay);
    if(data.tuanNay) assignCardData(1, data.tuanNay);
    if(data.thangNay) assignCardData(2, data.thangNay);
    if(data.namNay) assignCardData(3, data.namNay);

  } catch (error) {
    console.error("Lỗi lấy dữ liệu thẻ tổng quan:", error);
  }
};

const loadTopVaGanDay = async () => {
  try {
    const resTop = await axios.get('http://localhost:8080/api/thong-ke/top-san-pham');
    topSanPhamData.value = resTop.data;

    const resDon = await axios.get('http://localhost:8080/api/thong-ke/don-hang-gan-day');
    donHangGanDayData.value = resDon.data;
    
    const resSapHet = await axios.get('http://localhost:8080/api/thong-ke/sap-het-hang');
    sapHetHangData.value = resSapHet.data;

    const resVip = await axios.get('http://localhost:8080/api/thong-ke/khach-hang-vip');
    topVipData.value = resVip.data;
    
  } catch (error) {
    console.error("Lỗi lấy dữ liệu bảng dưới:", error);
  }
};

// Gom tất cả hàm load dữ liệu vào 1 chỗ để tái sử dụng
const loadDataAll = () => {
  loadTongQuanCards();
  
  if (filterType.value === 'tuy_chinh') {
     if (customStartDate.value && customEndDate.value) {
        loadDuLieuTheoKhoangThoiGian(customStartDate.value, customEndDate.value);
     }
  } else {
     applyFilter(filterType.value);
  }
  
  loadTopVaGanDay();
};

// Hàm xử lý khi người dùng Click / Focus lại vào Tab
const handleFocus = () => {
  console.log("Tab được focus, đang cập nhật dữ liệu mới nhất...");
  loadDataAll();
};

onMounted(() => {
  // Đảm bảo có giá trị mặc định cho biểu đồ khi mới mở
  if(!filterType.value) filterType.value = 'thang_nay';
  
  loadDataAll();
  
  // Lắng nghe sự kiện người dùng quay lại tab này (Mấu chốt của Cách 2)
  window.addEventListener('focus', handleFocus);
});

// Xóa sự kiện lắng nghe khi người dùng rời khỏi trang này (Dọn dẹp RAM)
onUnmounted(() => {
  window.removeEventListener('focus', handleFocus);
});
</script>

<style scoped>
/* =========================================
   STYLE ĐỒNG BỘ CHUẨN MỰC
========================================= */

.table {
  border-collapse: separate;
  border-spacing: 0;
}
.table td {
  border-bottom: 1px solid #f0f0f0;
  padding: 1rem 0.5rem;
}
.table tbody tr:hover {
  background-color: #fafafa;
}

.btn-brand {
  background-color: #dfd3c3 !important; 
  color: #4a3b32 !important;
  border-color: #dfd3c3 !important;
  font-weight: 600;
  border-radius: 50px !important; 
  padding: 6px 18px;
}
.btn-outline-custom {
  background-color: #fff;
  color: #888;
  border: 1px solid #e0e0e0;
  border-radius: 50px !important; 
  padding: 6px 18px;
  transition: all 0.2s ease-in-out;
}
.btn-outline-custom:hover {
  background-color: #f8f9fa;
  color: #4a3b32;
  border-color: #dfd3c3;
}

.badge-status {
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
}

.bg-status-success { background-color: #E8F5EE; color: #307B57; }
.bg-status-warning { background-color: #FDF5E8; color: #B57F26; }
.bg-status-danger  { background-color: #FCEAEA; color: #B34444; }
</style>
