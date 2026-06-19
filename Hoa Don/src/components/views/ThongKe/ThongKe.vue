<template>
  <div class="container-fluid p-4" style="background-color: #f4f6f8; min-height: 100vh;">
    <!-- Tiêu đề -->
    <h4 class="fw-bold mb-4" style="color: #3e2723;"><i class="bi bi-bar-chart-fill me-2"></i> Thống kê doanh thu</h4>

    <!-- TẦNG 1: DẢI CHỈ SỐ NHỎ GỌN -->
    <div class="row g-3 mb-4 row-cols-2 row-cols-md-3 row-cols-xl-5">
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small bg-success-subtle text-success mb-2" style="background-color: #e8f5ee !important; color: #307B57 !important;"><i class="bi bi-graph-up-arrow"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.doanhThuGoc || 0).toLocaleString('vi-VN') }} đ</h5>
            <div class="text-muted small fw-medium">Tổng doanh thu</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small bg-success-subtle text-success mb-2" style="background-color: #e8f5ee !important; color: #307B57 !important;"><i class="bi bi-graph-up-arrow"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.doanhThuThucTe || 0).toLocaleString('vi-VN') }} đ</h5>
            <div class="text-muted small fw-medium">Doanh thu thực tế</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small bg-primary-subtle text-primary mb-2" style="background-color: #eef2ff !important; color: #4361ee !important;"><i class="bi bi-cart3"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.tongDonHang || 0).toLocaleString('vi-VN') }}</h5>
            <div class="text-muted small fw-medium">Tổng đơn hàng</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small bg-purple-subtle text-purple mb-2" style="background-color: #f3e8ff !important; color: #6f42c1 !important;"><i class="bi bi-credit-card"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.aov || 0).toLocaleString('vi-VN') }} đ</h5>
            <div class="text-muted small fw-medium">Giá trị trung bình đơn (AOV)</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small bg-warning-subtle text-warning mb-2" style="background-color: #fff8e1 !important; color: #fd7e14 !important;"><i class="bi bi-box-seam"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.sanPhamDaBan || 0).toLocaleString('vi-VN') }}</h5>
            <div class="text-muted small fw-medium">Sản phẩm đã bán</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TẦNG 2: BỘ LỌC THỐNG KÊ DOANH THU CHUNG -->
    <div class="card border-0 shadow-sm mb-4" style="border-radius: 10px;">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-funnel fs-5" style="color: #212b36;"></i>
            <h6 class="fw-bold mb-0" style="color: #212b36;">Bộ lọc thống kê</h6>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'hom_nay' }" @click="applyFilter('hom_nay')">Hôm nay</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === '7_ngay' }" @click="applyFilter('7_ngay')">7 ngày qua</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'thang_nay' }" @click="applyFilter('thang_nay')">Tháng này</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'thang_truoc' }" @click="applyFilter('thang_truoc')">Tháng trước</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'nam_nay' }" @click="applyFilter('nam_nay')">Năm nay</button>
          </div>
        </div>

        <div class="row g-3 align-items-end mb-3">
          <div class="col-md-2">
            <label class="form-label text-muted small fw-medium mb-1">Từ ngày</label>
            <div class="input-group input-group-sm filter-input-group">
              <span class="input-group-text bg-transparent border-0 text-muted"><i class="bi bi-calendar3"></i></span>
              <input type="date" class="form-control border-0 bg-transparent ps-0" v-model="customStartDate" @change="onCustomDateChange">
            </div>
          </div>
          <div class="col-md-2">
            <label class="form-label text-muted small fw-medium mb-1">Đến ngày</label>
            <div class="input-group input-group-sm filter-input-group">
              <span class="input-group-text bg-transparent border-0 text-muted"><i class="bi bi-calendar3"></i></span>
              <input type="date" class="form-control border-0 bg-transparent ps-0" v-model="customEndDate" @change="onCustomDateChange">
            </div>
          </div>
          <div class="col-md-2">
            <label class="form-label text-muted small fw-medium mb-1">Thống kê</label>
            <div class="filter-input-group px-2 py-1">
              <select class="form-select form-select-sm border-0 bg-transparent shadow-none" v-model="thongKeTheo" @change="onThongKeTheoChange">
                <option value="ngay">Theo ngày</option>
                <option value="thang">Theo tháng</option>
                <option value="nam">Theo năm</option>
              </select>
            </div>
          </div>
          <div class="col-md-2">
            <label class="form-label text-muted small fw-medium mb-1">Thương hiệu</label>
            <div class="filter-input-group px-2 py-1 d-flex align-items-center">
              <i class="bi bi-shop text-muted ms-1 me-2"></i>
              <select class="form-select form-select-sm border-0 bg-transparent shadow-none px-0" v-model="thuongHieuId" @change="loadDataAll">
                <option value="">Tất cả thương hiệu</option>
                <option v-for="th in thuongHieuList" :key="th.id" :value="th.id">{{ th.tenThuongHieu }}</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Tìm sản phẩm</label>
            <div class="filter-input-group px-2 py-1 d-flex align-items-center">
              <i class="bi bi-search text-muted ms-1 me-2"></i>
              <input type="text" class="form-control form-control-sm border-0 bg-transparent shadow-none px-0" placeholder="Mã hoặc tên sản phẩm" v-model="searchSP" @keyup.enter="loadDataAll">
            </div>
          </div>
          <div class="col-md-1">
            <button class="btn btn-sm btn-light w-100 rounded-pill border py-1 fw-medium text-muted" @click="resetFilters" style="height: 34px;">
              <i class="bi bi-arrow-counterclockwise"></i> Đặt lại
            </button>
          </div>
        </div>

        <div class="d-flex align-items-center mt-2 px-1">
          <div style="width: 6px; height: 6px; background-color: #0d6efd; border-radius: 50%; margin-right: 8px;"></div>
          <span class="text-dark small fw-medium">
            Đang hiển thị dữ liệu thống kê từ ngày <strong>{{ formatDateDisplay(customStartDate) }}</strong> đến ngày <strong>{{ formatDateDisplay(customEndDate) }}</strong>
          </span>
        </div>
      </div>
    </div>

    <!-- TẦNG 3: BIỂU ĐỒ (SẢN PHẨM BÁN ĐƯỢC VÀ THƯƠNG HIỆU) -->
    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-bar-chart-line me-2" style="color: #8b6b5d;"></i> Sản phẩm bán được theo thời gian ({{ currentRangeText }})</h6>
          </div>
          <div class="card-body p-4 pt-5">
            <div style="height: 300px; width: 100%;">
              <canvas id="sanPhamBanDuocChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-pie-chart me-2" style="color: #8b6b5d;"></i> Thương hiệu</h6>
            <div class="px-2 py-1 bg-light rounded text-muted small fw-medium border">Theo doanh thu</div>
          </div>
          <div class="card-body p-4">
            <div style="position: relative; height: 220px; width: 100%; display: flex; justify-content: center; margin-bottom: 20px;">
              <canvas id="doanhThuThuongHieuChart"></canvas>
            </div>
            
            <div class="d-flex flex-wrap justify-content-center gap-3 mb-4">
              <div v-for="item in doanhThuThuongHieuData" :key="item.tenThuongHieu" class="d-flex align-items-center" style="font-size: 0.8rem;">
                <span :style="{ backgroundColor: item.color }" style="width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 6px;"></span>
                <span class="text-muted fw-medium">{{ item.tenThuongHieu }}</span>
              </div>
            </div>

            <div class="brand-list-container mt-2">
              <div v-for="item in doanhThuThuongHieuData" :key="item.tenThuongHieu" class="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style="background-color: #f8f9fa;">
                <div class="d-flex align-items-center">
                  <span :style="{ backgroundColor: item.color }" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 12px;"></span>
                  <span class="fw-bold text-dark" style="font-size: 0.9rem;">{{ item.tenThuongHieu }}</span>
                </div>
                <div class="fw-bold" style="color: #3e2723; font-size: 0.95rem;">
                  {{ (item.doanhThu || 0).toLocaleString('vi-VN') }} đ
                </div>
              </div>
              <div v-if="doanhThuThuongHieuData.length === 0" class="text-center text-muted small">
                Chưa có dữ liệu thương hiệu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TẦNG 3.5: BẢNG CHU KỲ VÀ CHART TRẠNG THÁI -->
    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-calendar-check me-2" style="color: #8b6b5d;"></i> Thống kê theo chu kỳ thời gian</h6>
          </div>
          <div class="card-body p-4 pt-3">
             <div class="table-responsive" style="border-radius: 8px; overflow: hidden;">
                <table class="table align-middle mb-0">
                  <thead class="thead-brand">
                    <tr style="font-size: 0.8rem; letter-spacing: 0.5px;" class="text-uppercase">
                      <th class="py-3 fw-bold border-0">Thời gian</th>
                      <th class="py-3 fw-bold text-center border-0">Doanh thu gốc</th>
                      <th class="py-3 fw-bold text-center border-0">Doanh thu thực tế</th>
                      <th class="py-3 fw-bold text-center border-0">Số đơn</th>
                      <th class="py-3 fw-bold text-center border-0">AOV (Trung bình/đơn)</th>
                      <th class="py-3 fw-bold text-end border-0 pe-3">Tăng trưởng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in chuKyData" :key="index">
                      <td class="fw-bold text-dark py-3">{{ item.title }}</td>
                      <td class="text-center text-muted fw-medium">{{ (item.revenueGoc || 0).toLocaleString('vi-VN') }} đ</td>
                      <td class="text-center fw-bold" style="color: #4EA87D;">{{ (item.revenueThuc || 0).toLocaleString('vi-VN') }} đ</td>
                      <td class="text-center fw-medium text-dark">{{ item.orders }}</td>
                      <td class="text-center text-muted">{{ item.orders > 0 ? Math.round(item.revenueThuc / item.orders).toLocaleString('vi-VN') : 0 }} đ</td>
                      <td class="text-end pe-3">
                         <span class="badge rounded-pill fw-medium px-2 py-1"
                              :class="item.isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                              style="font-size: 0.75rem; background-color: #e8f5ee; padding: 6px 10px;">
                          <i :class="item.isUp ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short'"></i> 
                          {{ item.growth > 0 ? '+' : '' }}{{ item.growth }}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-pie-chart me-2" style="color: #8b6b5d;"></i> Cơ cấu trạng thái đơn hàng</h6>
          </div>
          <div class="card-body p-4 d-flex flex-column align-items-center justify-content-center">
            <div style="position: relative; height: 260px; width: 100%; display: flex; justify-content: center; margin-bottom: 10px;">
              <canvas id="trangThaiDonHangChart"></canvas>
            </div>
             <div class="d-flex flex-wrap justify-content-center gap-3">
              <div class="d-flex align-items-center" style="font-size: 0.8rem;">
                <span style="background-color: #E26B6B; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px;"></span>
                <span class="text-muted fw-medium">Đã hủy</span>
              </div>
              <div class="d-flex align-items-center" style="font-size: 0.8rem;">
                <span style="background-color: #4EA87D; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px;"></span>
                <span class="text-muted fw-medium">Hoàn thành</span>
              </div>
              <div class="d-flex align-items-center" style="font-size: 0.8rem;">
                <span style="background-color: #F0B247; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px;"></span>
                <span class="text-muted fw-medium">Đang xử lý</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TẦNG 4: BẢNG SẢN PHẨM PHÂN TRANG -->
    <div class="card border-0 shadow-sm mb-4" style="border-radius: 10px; overflow: hidden;">
      <div class="card-header bg-white p-4 border-0 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="d-flex align-items-center">
          <h6 class="fw-bold mb-0 me-3" style="color: #4a3b32;"><i class="bi bi-box-seam me-2" style="color: #8b6b5d;"></i> Thống kê sản phẩm</h6>
          <!-- Đã xóa ô đếm badge "X sản phẩm" ở đây -->
        </div>
        
        <div class="d-flex flex-wrap align-items-center gap-2">
          <div class="input-group input-group-sm filter-input-group d-flex align-items-center py-1 px-2" style="width: 250px;">
            <i class="bi bi-search text-muted ms-1 me-2"></i>
            <input type="text" class="form-control border-0 bg-transparent ps-0 shadow-none" placeholder="Mã, tên, thương hiệu" v-model="localTableSearch">
          </div>
          
          <!-- Đã kéo rộng ô Sắp xếp lên 200px để không bị mất chữ -->
          <div class="filter-input-group px-2 py-1" style="width: 200px;">
            <select class="form-select form-select-sm border-0 bg-transparent shadow-none" v-model="localSortBy">
              <option value="ban_chay">Bán chạy nhất</option>
              <option value="doanh_thu_cao">Doanh thu cao nhất</option>
              <option value="ton_kho_thap">Tồn kho thấp nhất</option>
              <option value="ton_kho_cao">Tồn kho cao nhất</option>
            </select>
          </div>
          <button class="btn btn-sm btn-light rounded-pill border py-1 fw-medium text-muted px-3" @click="resetLocalTableFilters" style="height: 34px;">
            <i class="bi bi-arrow-counterclockwise"></i> Đặt lại
          </button>
        </div>
      </div>

      <div class="card-body p-4 pt-0">
        <div class="table-responsive" style="border-radius: 8px; overflow: hidden;">
          <table class="table align-middle table-hover mb-0 border-bottom">
            <thead class="thead-brand">
              <tr style="font-size: 0.85rem;" class="text-uppercase">
                <th class="ps-4 py-3 fw-bold border-0" style="width: 60px;">STT</th>
                <th class="py-3 fw-bold border-0" style="width: 150px;">Mã Sản Phẩm</th>
                <th class="py-3 fw-bold border-0">Tên Sản Phẩm</th>
                <th class="py-3 fw-bold border-0">Thương Hiệu</th>
                <th class="text-center py-3 fw-bold border-0">Đã Bán</th>
                <th class="text-center py-3 fw-bold border-0">Số Lượng Trả</th>
                <th class="text-center py-3 fw-bold border-0">Doanh Thu</th>
                <th class="text-center pe-4 py-3 fw-bold border-0">Tồn Kho</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sp, index) in paginatedSP" :key="index">
                <td class="ps-4 text-muted">{{ startIndex + index + 1 }}</td>
                <td class="fw-bold text-dark">{{ sp.maSanPham }}</td>
                <td>
                  <div class="d-flex align-items-center py-1">
                    <div class="d-flex align-items-center justify-content-center border rounded me-3 bg-white" style="width: 45px; height: 45px;">
                      <img v-if="sp.anh" :src="sp.anh" alt="" class="rounded" style="width: 100%; height: 100%; object-fit: cover;">
                      <i v-else class="bi bi-box text-muted"></i>
                    </div>
                    <div>
                      <div class="fw-medium" style="color: #212b36; font-size: 0.95rem;">{{ sp.tenSanPham }}</div>
                      <div v-if="sp.kichCo" class="text-muted" style="font-size: 0.8rem;">Size: {{ sp.kichCo }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-dark">{{ sp.thuongHieu }}</span>
                </td>
                <td class="text-center text-dark">{{ sp.daBan }}</td>
                <td class="text-center" style="color: #E26B6B;">{{ sp.soLuongTra }}</td>
                <td class="text-center" style="color: #212b36;">{{ (sp.doanhThu || 0).toLocaleString('vi-VN') }} đ</td>
                <td class="text-center pe-4">
                  <span :class="sp.tonKho <= 10 ? 'text-danger' : 'text-success'">{{ sp.tonKho }}</span>
                </td>
              </tr>
              <tr v-if="paginatedSP.length === 0"><td colspan="8" class="text-center py-5 text-muted">Không tìm thấy sản phẩm nào phù hợp.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 pt-3" style="border-top: 1px solid #f0f0f0;" v-if="totalItems > 0">
          <div class="text-muted" style="font-size: 0.85rem;">
            Hiển thị <strong>{{ endIndex }} / {{ totalItems }}</strong> bản ghi
          </div>
          
          <ul class="pagination pagination-sm mb-0 custom-pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--"><i class="bi bi-chevron-left"></i></a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++"><i class="bi bi-chevron-right"></i></a>
            </li>
          </ul>

          <div>
             <select class="form-select form-select-sm text-muted bg-white custom-select-paginate" v-model="itemsPerPage">
               <option :value="5">Hiển thị 5 bản ghi / trang</option>
               <option :value="10">Hiển thị 10 bản ghi / trang</option>
               <option :value="20">Hiển thị 20 bản ghi / trang</option>
               <option :value="30">Hiển thị 30 bản ghi / trang</option>
             </select>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';

// ==========================================
// STATE CHUNG
// ==========================================
const filterType = ref('thang_nay');
const customStartDate = ref('');
const customEndDate = ref('');
const currentRangeText = ref(''); 
const thongKeTheo = ref('ngay'); 
const thuongHieuId = ref('');
const searchSP = ref('');
const thuongHieuList = ref([]); 

const tongQuanKpi = ref({ doanhThuGoc: 0, doanhThuThucTe: 0, tongDonHang: 0, donHoanThanh: 0, donHuy: 0, donDangXuLy: 0, sanPhamDaBan: 0, aov: 0 });

const chuKyData = ref([
  { title: 'Hôm nay', revenueGoc: 0, revenueThuc: 0, orders: 0, growth: 0, isUp: true },
  { title: 'Tuần này', revenueGoc: 0, revenueThuc: 0, orders: 0, growth: 0, isUp: true },
  { title: 'Tháng này', revenueGoc: 0, revenueThuc: 0, orders: 0, growth: 0, isUp: true },
  { title: 'Năm nay', revenueGoc: 0, revenueThuc: 0, orders: 0, growth: 0, isUp: true },
]);

const tieuChiThuongHieu = ref('doanhThu'); 
const doanhThuThuongHieuData = ref([]);

let sanPhamBanDuocChartInstance = null; 
let doanhThuThuongHieuChartInstance = null; 
let trangThaiDonHangChartInstance = null;

const danhSachThongKeSP = ref([]); 
const localTableSearch = ref('');
const localSortBy = ref('ban_chay');
const currentPage = ref(1);
const itemsPerPage = ref(10);

watch([localTableSearch, localSortBy, itemsPerPage], () => { currentPage.value = 1; });

const filteredAndSortedSP = computed(() => {
  let result = danhSachThongKeSP.value;
  if (localTableSearch.value) {
    const lowerSearch = localTableSearch.value.toLowerCase();
    result = result.filter(sp => (sp.maSanPham && sp.maSanPham.toLowerCase().includes(lowerSearch)) || (sp.tenSanPham && sp.tenSanPham.toLowerCase().includes(lowerSearch)) || (sp.thuongHieu && sp.thuongHieu.toLowerCase().includes(lowerSearch)));
  }
  
  if (localSortBy.value === 'ban_chay') result = result.slice().sort((a, b) => b.daBan - a.daBan);
  else if (localSortBy.value === 'doanh_thu_cao') result = result.slice().sort((a, b) => b.doanhThu - a.doanhThu);
  else if (localSortBy.value === 'ton_kho_thap') result = result.slice().sort((a, b) => a.tonKho - b.tonKho);
  else if (localSortBy.value === 'ton_kho_cao') result = result.slice().sort((a, b) => b.tonKho - a.tonKho);
  return result;
});

const totalItems = computed(() => filteredAndSortedSP.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value) || 1);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value));
const paginatedSP = computed(() => filteredAndSortedSP.value.slice(startIndex.value, endIndex.value));

const resetLocalTableFilters = () => { localTableSearch.value = ''; localSortBy.value = 'ban_chay'; currentPage.value = 1; };

const formatDate = (date) => {
  if(!date) return ''; const d = new Date(date);
  let month = '' + (d.getMonth() + 1); let day = '' + d.getDate(); const year = d.getFullYear();
  if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};
const formatDateDisplay = (dateString) => {
  if(!dateString) return '...'; const parts = dateString.split('-'); if(parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};
const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime()); const dates = [];
  while (date <= endDate) { dates.push(formatDate(new Date(date))); date.setDate(date.getDate() + 1); }
  return dates;
};

// ==========================================
// HÀM GỌI API THẬT
// ==========================================
const loadThuongHieu = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/thuong-hieu/list-active'); 
    thuongHieuList.value = res.data;
  } catch (error) { console.warn("Lỗi load Thương hiệu."); thuongHieuList.value = []; }
};

const getFilterParams = () => {
  let params = '';
  if (thuongHieuId.value) params += `&thuongHieuId=${thuongHieuId.value}`;
  if (searchSP.value) params += `&searchSP=${searchSP.value}`;
  return params;
};

const generateBrandColors = (count) => {
  const baseColors = ['#E26B6B', '#F0B247', '#4EA87D', '#5A9BD5', '#8E44AD', '#FF8C00', '#16A085', '#D35400', '#2C3E50', '#C0392B'];
  let colors = [];
  for(let i = 0; i < count; i++) { colors.push(baseColors[i % baseColors.length]); }
  return colors;
}

const veLaiBieuDoTronThuongHieu = () => {
  if (doanhThuThuongHieuChartInstance) doanhThuThuongHieuChartInstance.destroy();
  const ctxPie = document.getElementById('doanhThuThuongHieuChart');
  
  const brandLabels = doanhThuThuongHieuData.value.map(item => item.tenThuongHieu || 'Không rõ');
  const metric = tieuChiThuongHieu.value; 
  const brandData = doanhThuThuongHieuData.value.map(item => item[metric] || 0);
  const brandBgColors = doanhThuThuongHieuData.value.map(item => item.color);

  doanhThuThuongHieuChartInstance = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
      labels: brandLabels.length > 0 ? brandLabels : ['Chưa có dữ liệu'],
      datasets: [{ data: brandData.length > 0 ? brandData : [1], backgroundColor: brandBgColors.length > 0 ? brandBgColors : ['#e0e0e0'], borderWidth: 2, borderColor: '#fff' }]
    },
    options: { 
      responsive: true, maintainAspectRatio: false, cutout: '65%', layout: { padding: 10 }, 
      plugins: { 
          tooltip: { 
            enabled: brandData.length > 0, 
            callbacks: { label: function(context) { return context.parsed.toLocaleString('vi-VN') + ' đ'; } } 
          }, 
          legend: { display: false } 
      } 
    }
  });
};

const loadDuLieuTheoKhoangThoiGian = async (startDate, endDate) => {
  try {
    const extraParams = getFilterParams();
    
    const resStats = await axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${startDate}&endDate=${endDate}${extraParams}`);
    const dataStats = resStats.data;
    
    tongQuanKpi.value.doanhThuGoc = dataStats.doanhThuGoc || 0;
    tongQuanKpi.value.doanhThuThucTe = dataStats.doanhThuThucTe || 0;
    tongQuanKpi.value.tongDonHang = dataStats.tongDonHang || 0;
    tongQuanKpi.value.donHoanThanh = dataStats.donHoanThanh || 0;
    tongQuanKpi.value.donHuy = dataStats.donHuy || 0;
    tongQuanKpi.value.donDangXuLy = dataStats.donDangXuLy || 0;
    tongQuanKpi.value.sanPhamDaBan = dataStats.sanPhamDaBan || 0;
    tongQuanKpi.value.aov = tongQuanKpi.value.tongDonHang > 0 ? Math.round(tongQuanKpi.value.doanhThuThucTe / tongQuanKpi.value.tongDonHang) : 0;

    const outerStatusLabelsPlugin = {
      id: 'outerStatusLabels',
      afterDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = '11px "Inter", sans-serif';
        ctx.textBaseline = 'middle';

        const meta = chart.getDatasetMeta(0);
        const data = chart.data.datasets[0].data;
        const total = data.reduce((a, b) => a + b, 0);

        if (total === 0) { ctx.restore(); return; }

        meta.data.forEach((arc, index) => {
          const value = data[index];
          if (value === 0) return;
          
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          const text1 = chart.data.labels[index];
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
          ctx.lineWidth = 1.5;
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

    if (trangThaiDonHangChartInstance) trangThaiDonHangChartInstance.destroy();
    const ctxTrangThai = document.getElementById('trangThaiDonHangChart');
    trangThaiDonHangChartInstance = new Chart(ctxTrangThai, {
      type: 'doughnut', 
      data: {
        labels: ['Đã hủy', 'Hoàn thành', 'Đang xử lý'],
        datasets: [{
          data: [tongQuanKpi.value.donHuy, tongQuanKpi.value.donHoanThanh, tongQuanKpi.value.donDangXuLy], 
          backgroundColor: ['#E26B6B', '#4EA87D', '#F0B247'], borderWidth: 2, borderColor: '#fff'
        }]
      },
      options: { 
        responsive: true, maintainAspectRatio: false, cutout: '55%', layout: { padding: 40 },
        plugins: { tooltip: { enabled: true }, legend: { display: false } } 
      },
      plugins: [outerStatusLabelsPlugin] 
    });

    try {
        const resBrand = await axios.get(`http://localhost:8080/api/thong-ke/doanh-thu-thuong-hieu?startDate=${startDate}&endDate=${endDate}${extraParams}`);
        const colors = generateBrandColors(resBrand.data.length);
        doanhThuThuongHieuData.value = resBrand.data.map((item, index) => ({
            ...item, color: colors[index]
        }));
    } catch(e) { console.warn("Chưa có dữ liệu API doanh thu thương hiệu"); doanhThuThuongHieuData.value = []; }
    veLaiBieuDoTronThuongHieu();

    const barDataLabelsPlugin = {
      id: 'barDataLabels',
      afterDatasetsDraw(chart) {
        const ctx = chart.ctx; ctx.save(); ctx.font = 'bold 11px "Inter", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        const dataset = chart.data.datasets[0]; const meta = chart.getDatasetMeta(0);
        meta.data.forEach((bar, index) => {
          const value = dataset.data[index];
          if (value > 0) { ctx.fillStyle = '#d9534f'; ctx.fillText(value.toLocaleString('vi-VN'), bar.x, bar.y - 5); }
        });
        ctx.restore();
      }
    };

    const resChart = await axios.get(`http://localhost:8080/api/thong-ke/bieu-do-custom?startDate=${startDate}&endDate=${endDate}${extraParams}`);
    const chartDataFromApi = resChart.data;

    const start = new Date(startDate); const end = new Date(endDate);
    let displayLabels = []; let quantityData = [];

    if (thongKeTheo.value === 'ngay') {
      const dateLabels = getDatesInRange(start, end);
      displayLabels = dateLabels.map(dateStr => parseInt(dateStr.split('-')[2])); 
      quantityData = dateLabels.map(dateLabel => {
        const found = chartDataFromApi.find(item => String(item.ngay) === dateLabel || String(item.ngay) === dateLabel.replace(/-0+/g, '-'));
        return found && found.soLuongBan ? found.soLuongBan : 0;
      });
    } else if (thongKeTheo.value === 'thang') {
      const monthlyData = {};
      let currentMonth = new Date(start.getFullYear(), start.getMonth(), 1); const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
      while (currentMonth <= endMonth) {
        const y = currentMonth.getFullYear(); const m = String(currentMonth.getMonth() + 1).padStart(2, '0');
        monthlyData[`${y}-${m}`] = 0; currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
      chartDataFromApi.forEach(item => {
        if (item.ngay && String(item.ngay).length >= 7) {
          const monthKey = String(item.ngay).substring(0, 7); 
          if (monthlyData[monthKey] !== undefined) monthlyData[monthKey] += (item.soLuongBan || 0);
        }
      });
      displayLabels = Object.keys(monthlyData).map(key => `Tháng ${parseInt(key.split('-')[1])}`);
      quantityData = Object.values(monthlyData);
    } else if (thongKeTheo.value === 'nam') {
      const yearlyData = {};
      chartDataFromApi.forEach(item => {
        if (item.ngay) {
          const yearKey = String(item.ngay).substring(0, 4); 
          if (yearKey.length === 4 && !isNaN(yearKey)) {
            if (yearlyData[yearKey] === undefined) yearlyData[yearKey] = 0;
            yearlyData[yearKey] += (item.soLuongBan || 0);
          }
        }
      });
      if (Object.keys(yearlyData).length === 0) yearlyData[start.getFullYear()] = 0;
      displayLabels = Object.keys(yearlyData).sort().map(year => `Năm ${year}`);
      quantityData = Object.keys(yearlyData).sort().map(year => yearlyData[year]);
    }

    if (sanPhamBanDuocChartInstance) sanPhamBanDuocChartInstance.destroy();
    const ctxLine = document.getElementById('sanPhamBanDuocChart').getContext('2d');
    const maxVal = quantityData.length > 0 ? Math.max(...quantityData) : 0;

    sanPhamBanDuocChartInstance = new Chart(ctxLine, {
      type: 'bar',
      data: {
        labels: displayLabels, 
        datasets: [{ label: 'Số lượng bán', data: quantityData, backgroundColor: '#d0bba6', hoverBackgroundColor: '#c2a88f', borderRadius: { topLeft: 4, topRight: 4 }, barPercentage: 0.5, maxBarThickness: 45 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false, drawBorder: true }, ticks: { font: {family: "'Inter', sans-serif", size: 11}, color: '#999', maxTicksLimit: 31, autoSkip: true } },
          y: { 
            beginAtZero: true, suggestedMax: maxVal * 1.2 || 10, border: { display: false }, grid: { color: '#f0f0f0', borderDash: [5, 5] },
            ticks: { font: {family: "'Inter', sans-serif", size: 11}, color: '#999', precision: 0 } 
          }
        }
      },
      plugins: [barDataLabelsPlugin]
    });
  } catch (error) { console.error("Lỗi cập nhật biểu đồ & KPI:", error); }
};

const onThongKeTheoChange = () => {
  const today = new Date(); const year = today.getFullYear(); const month = today.getMonth();
  if (thongKeTheo.value === 'thang') {
    customStartDate.value = formatDate(new Date(year, 0, 1)); customEndDate.value = formatDate(today); filterType.value = 'tuy_chinh';
  } else if (thongKeTheo.value === 'nam') {
    customStartDate.value = formatDate(new Date(year - 4, 0, 1)); customEndDate.value = formatDate(today); filterType.value = 'tuy_chinh';
  } else if (thongKeTheo.value === 'ngay') {
    customStartDate.value = formatDate(new Date(year, month, 1)); customEndDate.value = formatDate(today); filterType.value = 'thang_nay';
  }
  currentRangeText.value = `${formatDateDisplay(customStartDate.value)} đến ${formatDateDisplay(customEndDate.value)}`;
  loadDataAll();
};

const applyFilter = (type) => {
  filterType.value = type; const today = new Date(); let startDate = new Date(); let endDate = new Date();
  if (type === 'hom_nay') { currentRangeText.value = 'Hôm nay'; thongKeTheo.value = 'ngay'; } 
  else if (type === '7_ngay') { currentRangeText.value = '7 ngày qua'; startDate.setDate(today.getDate() - 6); thongKeTheo.value = 'ngay'; } 
  else if (type === 'thang_nay') { currentRangeText.value = 'Tháng này'; startDate = new Date(today.getFullYear(), today.getMonth(), 1); thongKeTheo.value = 'ngay'; } 
  else if (type === 'thang_truoc') { currentRangeText.value = 'Tháng trước'; startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); endDate = new Date(today.getFullYear(), today.getMonth(), 0); thongKeTheo.value = 'ngay'; } 
  else if (type === 'nam_nay') { currentRangeText.value = 'Năm nay'; startDate = new Date(today.getFullYear(), 0, 1); thongKeTheo.value = 'thang'; }
  customStartDate.value = formatDate(startDate); customEndDate.value = formatDate(endDate);
  loadDuLieuTheoKhoangThoiGian(customStartDate.value, customEndDate.value);
};

const onCustomDateChange = () => {
  filterType.value = 'tuy_chinh';
  if (customStartDate.value && customEndDate.value && customStartDate.value <= customEndDate.value) {
    currentRangeText.value = `${formatDateDisplay(customStartDate.value)} đến ${formatDateDisplay(customEndDate.value)}`;
    loadDuLieuTheoKhoangThoiGian(customStartDate.value, customEndDate.value);
  }
};

const resetFilters = () => { thuongHieuId.value = ''; searchSP.value = ''; thongKeTheo.value = 'ngay'; tieuChiThuongHieu.value = 'doanhThu'; applyFilter('thang_nay'); };

const loadTongQuanCards = async () => {
  try {
    const extraParams = getFilterParams();

    const today = new Date();
    const strToday = formatDate(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const strYesterday = formatDate(yesterday);

    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - distanceToMonday);
    const strThisMonday = formatDate(thisMonday);

    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    const strLastMonday = formatDate(lastMonday);
    const lastSunday = new Date(thisMonday);
    lastSunday.setDate(thisMonday.getDate() - 1);
    const strLastSunday = formatDate(lastSunday);

    const thisMonthFirst = new Date(today.getFullYear(), today.getMonth(), 1);
    const strThisMonthFirst = formatDate(thisMonthFirst);

    const lastMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const strLastMonthFirst = formatDate(lastMonthFirst);
    const lastMonthLast = new Date(today.getFullYear(), today.getMonth(), 0);
    const strLastMonthLast = formatDate(lastMonthLast);

    const thisYearFirst = new Date(today.getFullYear(), 0, 1);
    const strThisYearFirst = formatDate(thisYearFirst);

    const lastYearFirst = new Date(today.getFullYear() - 1, 0, 1);
    const strLastYearFirst = formatDate(lastYearFirst);
    const lastYearLast = new Date(today.getFullYear() - 1, 11, 31);
    const strLastYearLast = formatDate(lastYearLast);

    const [
      resHomNay, resHomQua, 
      resTuanNay, resTuanTruoc, 
      resThangNay, resThangTruoc, 
      resNamNay, resNamTruoc
    ] = await Promise.all([
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strToday}&endDate=${strToday}${extraParams}`),
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strYesterday}&endDate=${strYesterday}${extraParams}`),
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strThisMonday}&endDate=${strToday}${extraParams}`),
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strLastMonday}&endDate=${strLastSunday}${extraParams}`),
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strThisMonthFirst}&endDate=${strToday}${extraParams}`),
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strLastMonthFirst}&endDate=${strLastMonthLast}${extraParams}`),
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strThisYearFirst}&endDate=${strToday}${extraParams}`),
      axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${strLastYearFirst}&endDate=${strLastYearLast}${extraParams}`)
    ]);

    const calcGrowth = (currentRev, prevRev) => {
      const c = currentRev || 0;
      const p = prevRev || 0;
      if (p === 0) return c > 0 ? 100 : 0;
      return Math.round(((c - p) / p) * 100);
    };

    const assignCardData = (index, currentData, previousData) => {
      chuKyData.value[index].revenueGoc = currentData.doanhThuGoc || 0; 
      chuKyData.value[index].revenueThuc = currentData.doanhThuThucTe || 0; 
      chuKyData.value[index].orders = currentData.tongDonHang || 0;
      chuKyData.value[index].growth = calcGrowth(currentData.doanhThuThucTe, previousData.doanhThuThucTe);
      chuKyData.value[index].isUp = chuKyData.value[index].growth >= 0;
    };

    assignCardData(0, resHomNay.data, resHomQua.data);
    assignCardData(1, resTuanNay.data, resTuanTruoc.data);
    assignCardData(2, resThangNay.data, resThangTruoc.data);
    assignCardData(3, resNamNay.data, resNamTruoc.data);

  } catch (error) { console.error("Lỗi lấy dữ liệu bảng chu kỳ:", error); }
};

const loadTopVaGanDay = async () => {
  try {
    const resSP = await axios.get(`http://localhost:8080/api/thong-ke/san-pham`);
    danhSachThongKeSP.value = resSP.data;
  } catch (error) { console.error("Lỗi lấy dữ liệu API bảng:", error); }
};

const loadDataAll = () => { loadTongQuanCards(); if (customStartDate.value && customEndDate.value) { loadDuLieuTheoKhoangThoiGian(customStartDate.value, customEndDate.value); } loadTopVaGanDay(); };
const handleFocus = () => { loadDataAll(); };

onMounted(() => { loadThuongHieu(); if(!filterType.value) filterType.value = 'thang_nay'; applyFilter(filterType.value); loadDataAll(); window.addEventListener('focus', handleFocus); });
onUnmounted(() => { window.removeEventListener('focus', handleFocus); });
</script>

<style scoped>
/* =========================================
   STYLE ĐỒNG BỘ CHUẨN MỰC THEO DESIGN MỚI
========================================= */
.table { border-collapse: separate; border-spacing: 0; }
.table td { border-bottom: 1px solid #f0f0f0; padding: 1rem 0.5rem; }
.table tbody tr:hover { background-color: #fafafa; }
.btn-filter-quick { background-color: #fff; color: #6c757d; border: 1px solid #e0e0e0; border-radius: 50px !important; padding: 4px 16px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; }
.btn-filter-quick:hover { background-color: #f8f9fa; border-color: #d0bba6; }
.btn-filter-quick.active { background-color: #dfd3c3; border-color: #dfd3c3; color: #4a3b32; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
.filter-input-group { background-color: #f4f6f8; border-radius: 8px; border: 1px solid #eef0f2; transition: border-color 0.2s; }
.filter-input-group:focus-within { border-color: #d0bba6; background-color: #fff; }

/* CLASS CSS MỚI ÉP MÀU NỀN CHO HEADER BẢNG */
.thead-brand th {
  background-color: #dfd3c3 !important;
  color: #4a3b32 !important;
  font-weight: 700 !important;
  border-bottom: none !important;
}

/* Custom Pagination */
.custom-pagination .page-item .page-link {
  color: #6c757d; border: 1px solid #dee2e6; margin: 0 4px; border-radius: 4px; padding: 4px 12px; transition: all 0.2s;
}
.custom-pagination .page-item.active .page-link {
  background-color: #8b6b5d; border-color: #8b6b5d; color: #fff; font-weight: 500;
}
.custom-pagination .page-item:not(.active) .page-link:hover {
  background-color: #f4f6f8; color: #3e2723;
}
.custom-select-paginate {
  border-radius: 20px; padding-left: 15px; padding-right: 30px; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;
}

/* Dải Menu chỉ số tầng 1 */
.icon-box-small { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }

.brand-list-container { max-height: 250px; overflow-y: auto; padding-right: 5px; }
.brand-list-container::-webkit-scrollbar { width: 5px; }
.brand-list-container::-webkit-scrollbar-thumb { background: #d0bba6; border-radius: 5px; }
</style>
