<template>
  <div class="container-fluid p-4" style="background-color: #f4f6f8; min-height: 100vh;">
    <h4 class="fw-bold mb-4" style="color: #3e2723;"><i class="bi bi-bar-chart-fill me-2"></i> Thống kê doanh thu</h4>

    <div class="card border-0 shadow-sm mb-4" style="border-radius: 10px;">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-funnel fs-5" style="color: #212b36;"></i>
            <h6 class="fw-bold mb-0" style="color: #212b36;">Bộ lọc thống kê</h6>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'tat_ca' }" @click="applyQuickFilter('tat_ca')">Tất cả</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'hom_nay' }" @click="applyQuickFilter('hom_nay')">Hôm nay</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === '7_ngay' }" @click="applyQuickFilter('7_ngay')">7 ngày qua</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'thang_nay' }" @click="applyQuickFilter('thang_nay')">Tháng này</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'thang_truoc' }" @click="applyQuickFilter('thang_truoc')">Tháng trước</button>
            <button class="btn btn-sm btn-filter-quick" :class="{ 'active': filterType === 'nam_nay' }" @click="applyQuickFilter('nam_nay')">Năm nay</button>
          </div>
        </div>

        <div class="row g-3 align-items-end mb-3">
          <div class="col-md-2">
            <label class="form-label text-muted small fw-medium mb-1">Từ ngày</label>
            <div class="input-group input-group-sm filter-input-group">
              <span class="input-group-text bg-transparent border-0 text-muted"><i class="bi bi-calendar3"></i></span>
              <input type="date" class="form-control border-0 bg-transparent ps-0" v-model="customStartDate" @change="onCustomDateChange" :min="firstInvoiceDateDb" :max="todayString">
            </div>
          </div>
          <div class="col-md-2">
            <label class="form-label text-muted small fw-medium mb-1">Đến ngày</label>
            <div class="input-group input-group-sm filter-input-group">
              <span class="input-group-text bg-transparent border-0 text-muted"><i class="bi bi-calendar3"></i></span>
              <input type="date" class="form-control border-0 bg-transparent ps-0" v-model="customEndDate" @change="onCustomDateChange" :min="firstInvoiceDateDb" :max="todayString">
            </div>
          </div>
          <div class="col-md-2">
            <label class="form-label text-muted small fw-medium mb-1">Thống kê</label>
            <div class="filter-input-group px-2 py-1">
              <select class="form-select form-select-sm border-0 bg-transparent shadow-none" v-model="thongKeTheo" @change="onThongKeTheoDropdownChange">
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
              <select class="form-select form-select-sm border-0 bg-transparent shadow-none px-0" v-model="thuongHieuId" @change="executeLoadDataAll">
                <option value="">Tất cả</option>
                <option v-for="th in thuongHieuList" :key="th.id" :value="th.id">{{ th.tenThuongHieu }}</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Tìm sản phẩm</label>
            <div class="filter-input-group px-2 py-1 d-flex align-items-center">
              <i class="bi bi-search text-muted ms-1 me-2"></i>
              <input type="text" class="form-control form-control-sm border-0 bg-transparent shadow-none px-0" placeholder="Mã hoặc tên sản phẩm" v-model.trim="searchSP" @keyup.enter="executeLoadDataAll" maxlength="150">
            </div>
          </div>
          <div class="col-md-1">
            <button class="btn btn-sm btn-light w-100 rounded-pill border py-1 fw-medium text-muted" @click="resetFilters" style="height: 34px;">
              <i class="bi bi-arrow-counterclockwise"></i> Đặt lại
            </button>
          </div>
        </div>

        <div v-if="dateError" class="d-flex align-items-center mt-2 px-1 text-danger small fw-medium">
          <i class="bi bi-exclamation-circle me-2"></i> {{ dateError }}
        </div>
        <div v-else class="d-flex align-items-center mt-2 px-1">
          <div style="width: 6px; height: 6px; background-color: #0d6efd; border-radius: 50%; margin-right: 8px;"></div>
          <span class="text-dark small fw-medium">
            Đang hiển thị dữ liệu từ ngày <strong>{{ formatDateDisplay(customStartDate) }}</strong> đến ngày <strong>{{ formatDateDisplay(customEndDate) }}</strong>
          </span>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4 row-cols-2 row-cols-md-3 row-cols-xl-6">
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
            <div class="icon-box-small bg-primary-subtle text-primary mb-2" style="background-color: #eef2ff !important; color: #4361ee !important;"><i class="bi bi-cash-stack"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.doanhThuTienMat || 0).toLocaleString('vi-VN') }} đ</h5>
            <div class="text-muted small fw-medium">Tiền mặt</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small mb-2" style="background-color: #e6fcf5 !important; color: #0ca678 !important;"><i class="bi bi-bank"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.doanhThuChuyenKhoan || 0).toLocaleString('vi-VN') }} đ</h5>
            <div class="text-muted small fw-medium">Chuyển khoản</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small mb-2" style="background-color: #f3e8ff !important; color: #6f42c1 !important;"><i class="bi bi-cart3"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.tongDonHang || 0).toLocaleString('vi-VN') }}</h5>
            <div class="text-muted small fw-medium">Tổng đơn hàng</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
          <div class="card-body p-3">
            <div class="icon-box-small mb-2" style="background-color: #fff0f6 !important; color: #d6336c !important;"><i class="bi bi-receipt"></i></div>
            <h5 class="fw-bold mb-1" style="color: #212b36;">{{ (tongQuanKpi.aov || 0).toLocaleString('vi-VN') }} đ</h5>
            <div class="text-muted small fw-medium">Giá trị TB đơn (AOV)</div>
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

    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;">
              <i class="bi bi-bar-chart-line me-2" style="color: #8b6b5d;"></i> Sản phẩm bán được {{ getGroupLabel() }}
            </h6>
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

    <div class="row g-4 mb-4 align-items-stretch">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 10px;">
          <div class="card-header bg-white border-bottom-0 p-4 pb-0">
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-calendar-check me-2" style="color: #8b6b5d;"></i> Thống kê đối chiếu chu kỳ</h6>
          </div>
          <div class="card-body p-4 pt-3">
             <div class="table-responsive" style="border-radius: 8px; overflow: hidden; border: 1px solid #eef0f2;">
                <table class="table align-middle mb-0">
                  <thead class="thead-brand">
                    <tr style="font-size: 0.8rem; letter-spacing: 0.5px;" class="text-uppercase">
                      <th class="py-3 fw-bold border-0">Thời gian</th>
                      <th class="py-3 fw-bold text-center border-0">Tổng doanh thu</th>
                      <th class="py-3 fw-bold text-center border-0">Tiền mặt</th>
                      <th class="py-3 fw-bold text-center border-0">Chuyển khoản</th>
                      <th class="py-3 fw-bold text-center border-0">Số đơn</th>
                      <th class="py-3 fw-bold text-center border-0">AOV</th>
                      <th class="py-3 fw-bold text-end border-0 pe-3">Tăng trưởng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in chuKyData" :key="index">
                      <td class="fw-bold text-dark py-3 ps-3">{{ item.title }}</td>
                      <td class="text-center text-muted fw-bold">{{ (item.revenueGoc || 0).toLocaleString('vi-VN') }} đ</td>
                      <td class="text-center fw-medium" style="color: #5A9BD5;">{{ (item.revenueTienMat || 0).toLocaleString('vi-VN') }} đ</td>
                      <td class="text-center fw-medium" style="color: #4EA87D;">{{ (item.revenueChuyenKhoan || 0).toLocaleString('vi-VN') }} đ</td>
                      <td class="text-center fw-medium text-dark">{{ item.orders }}</td>
                      <td class="text-center text-muted">{{ item.orders > 0 ? Math.round(item.revenueGoc / item.orders).toLocaleString('vi-VN') : 0 }} đ</td>
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
            <h6 class="fw-bold mb-0" style="color: #3e2723;"><i class="bi bi-pie-chart me-2" style="color: #8b6b5d;"></i> Cơ cấu trạng thái đơn</h6>
          </div>
          <div class="card-body p-4 pt-2 d-flex flex-column align-items-center justify-content-center">
            <div style="position: relative; height: 220px; width: 100%; display: flex; justify-content: center; margin-bottom: 20px;">
              <canvas id="trangThaiDonHangChart"></canvas>
            </div>
             <div class="d-flex flex-wrap justify-content-center gap-3 mt-auto">
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

    <div class="card border-0 shadow-sm mb-4" style="border-radius: 10px; overflow: hidden;">
      <div class="card-header bg-white p-4 border-0 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="d-flex align-items-center">
          <h6 class="fw-bold mb-0 me-3" style="color: #4a3b32;"><i class="bi bi-box-seam me-2" style="color: #8b6b5d;"></i> Thống kê sản phẩm</h6>
        </div>
        
        <div class="d-flex flex-wrap align-items-center gap-2">
          <div class="input-group input-group-sm filter-input-group d-flex align-items-center py-1 px-2" style="width: 250px;">
            <i class="bi bi-search text-muted ms-1 me-2"></i>
            <input type="text" class="form-control border-0 bg-transparent ps-0 shadow-none" placeholder="Mã, tên, thương hiệu" v-model.trim="localTableSearch" maxlength="150">
          </div>
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
        <div class="table-responsive" style="border-radius: 8px; overflow: hidden; border: 1px solid #eef0f2;">
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
                      <img :src="getProductImage(sp.anh)" @error="handleImageError" alt="" class="rounded" style="width: 100%; height: 100%; object-fit: cover;">
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
// HÀM BẢO VỆ ẢNH (MỚI THÊM)
// ==========================================
const BASE_URL = 'http://localhost:8080/api';

const handleImageError = (e) => {
  e.target.src = '/Logo.png';
  e.target.style.objectFit = 'contain';
  e.target.classList.add('p-1');
}

const getProductImage = (imgName) => {
  if (!imgName || imgName === 'null' || imgName === 'undefined' || imgName === '') {
    return '/Logo.png';
  }
  if (imgName.startsWith('http') || imgName.startsWith('data:')) {
    return imgName;
  }
  return `${BASE_URL}/sanpham-chitiet/images/${imgName}`;
}

// ==========================================
// STATE CHUNG
// ==========================================
const filterType = ref('thang_nay');

// Sử dụng chung biến để lưu ngày cho cả logic gọi API và hiển thị ở ô Input
const customStartDate = ref('');
const customEndDate = ref('');

// Phục vụ logic "Tất cả" và rào ngày tương lai
const firstInvoiceDateDb = ref('');
const todayString = ref(new Date().toISOString().split('T')[0]);

const thongKeTheo = ref('ngay');
const thuongHieuId = ref('');
const searchSP = ref('');
const thuongHieuList = ref([]);

const dateError = ref('');

const tongQuanKpi = ref({
  doanhThuGoc: 0, doanhThuThucTe: 0, tongDonHang: 0, donHoanThanh: 0, donHuy: 0, donDangXuLy: 0, sanPhamDaBan: 0, aov: 0,
  doanhThuTienMat: 0, doanhThuChuyenKhoan: 0
});

const chuKyData = ref([
  { title: 'Hôm nay', revenueGoc: 0, revenueTienMat: 0, revenueChuyenKhoan: 0, orders: 0, growth: 0, isUp: true },
  { title: 'Tuần này', revenueGoc: 0, revenueTienMat: 0, revenueChuyenKhoan: 0, orders: 0, growth: 0, isUp: true },
  { title: 'Tháng này', revenueGoc: 0, revenueTienMat: 0, revenueChuyenKhoan: 0, orders: 0, growth: 0, isUp: true },
  { title: 'Năm nay', revenueGoc: 0, revenueTienMat: 0, revenueChuyenKhoan: 0, orders: 0, growth: 0, isUp: true },
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
  const searchStr = localTableSearch.value ? localTableSearch.value.trim().toLowerCase() : '';
 
  if (searchStr) {
    result = result.filter(sp =>
      (sp.maSanPham && sp.maSanPham.toLowerCase().includes(searchStr)) ||
      (sp.tenSanPham && sp.tenSanPham.toLowerCase().includes(searchStr)) ||
      (sp.thuongHieu && sp.thuongHieu.toLowerCase().includes(searchStr))
    );
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
  if(!startDate || !endDate) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const date = new Date(start.getTime()); const dates = [];
  while (date <= end) { dates.push(formatDate(new Date(date))); date.setDate(date.getDate() + 1); }
  return dates;
};

// CẬP NHẬT: Text hiển thị mượt mà hơn
const getGroupLabel = () => {
  if (thongKeTheo.value === 'ngay') return 'theo Ngày';
  if (thongKeTheo.value === 'thang') return 'theo Tháng';
  if (thongKeTheo.value === 'nam') return 'theo Năm';
  return '';
};

// ==========================================
// CÁC HÀM GỌI API NỀN TẢNG
// ==========================================
const loadThuongHieu = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/thuong-hieu/list-active');
    thuongHieuList.value = res.data;
  } catch (error) { thuongHieuList.value = []; }
};

const loadFirstInvoiceDate = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/thong-ke/ngay-hoa-don-dau-tien');
    firstInvoiceDateDb.value = res.data;
  } catch (error) {
    const backUpDate = new Date(); backUpDate.setFullYear(backUpDate.getFullYear() - 1);
    firstInvoiceDateDb.value = formatDate(backUpDate);
  }
};

const getFilterParams = () => {
  let params = '';
  if (thuongHieuId.value) params += `&thuongHieuId=${thuongHieuId.value}`;
  const trimmedSearchSP = searchSP.value ? searchSP.value.trim() : '';
  if (trimmedSearchSP) params += `&searchSP=${encodeURIComponent(trimmedSearchSP)}`;
  return params;
};

const generateBrandColors = (count) => {
  const baseColors = ['#E26B6B', '#F0B247', '#4EA87D', '#5A9BD5', '#8E44AD', '#FF8C00', '#16A085', '#D35400', '#2C3E50', '#C0392B'];
  let colors = []; for(let i = 0; i < count; i++) { colors.push(baseColors[i % baseColors.length]); } return colors;
}

const veLaiBieuDoTronThuongHieu = () => {
  if (doanhThuThuongHieuChartInstance) doanhThuThuongHieuChartInstance.destroy();
  const ctxPie = document.getElementById('doanhThuThuongHieuChart');
  if(!ctxPie) return;
 
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
      plugins: { tooltip: { enabled: brandData.length > 0, callbacks: { label: function(context) { return context.parsed.toLocaleString('vi-VN') + ' đ'; } } }, legend: { display: false } }
    }
  });
};

// ==========================================
// LUỒNG XỬ LÝ CHÍNH: EXECUTE LOAD DATA
// ==========================================
const executeLoadDataAll = () => {
  if (!customStartDate.value || !customEndDate.value) return;
  const start = customStartDate.value;
  const end = customEndDate.value;
  const extraParams = getFilterParams();

  // 1. Load KPI & Biểu đồ Trạng thái đơn (Đã xóa Phương thức thanh toán)
  ;(async () => {
    try {
      const resStats = await axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${start}&endDate=${end}${extraParams}`);
      const dataStats = resStats.data;
      tongQuanKpi.value.doanhThuGoc = dataStats.doanhThuGoc || 0;
      tongQuanKpi.value.tongDonHang = dataStats.tongDonHang || 0;
      tongQuanKpi.value.donHoanThanh = dataStats.donHoanThanh || 0;
      tongQuanKpi.value.donHuy = dataStats.donHuy || 0;
      tongQuanKpi.value.donDangXuLy = dataStats.donDangXuLy || 0;
      tongQuanKpi.value.sanPhamDaBan = dataStats.sanPhamDaBan || 0;
      tongQuanKpi.value.aov = tongQuanKpi.value.tongDonHang > 0 ? Math.round(tongQuanKpi.value.doanhThuGoc / tongQuanKpi.value.tongDonHang) : 0;
      tongQuanKpi.value.doanhThuTienMat = dataStats.doanhThuTienMat || 0;
      tongQuanKpi.value.doanhThuChuyenKhoan = dataStats.doanhThuChuyenKhoan || 0;

      const drawDonut = (chartInstance, ctxId, labels, data, bgColors) => {
        if (chartInstance) chartInstance.destroy();
        const ctx = document.getElementById(ctxId);
        if(!ctx) return null;
        return new Chart(ctx, {
          type: 'doughnut', data: { labels, datasets: [{ data, backgroundColor: bgColors, borderWidth: 2, borderColor: '#fff' }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '55%', layout: { padding: 35 }, plugins: { tooltip: { enabled: true }, legend: { display: false } } },
          plugins: [{ id: 'outerLabels', afterDraw(chart) {
            const ctx = chart.ctx; ctx.save(); ctx.font = '11px "Inter", sans-serif'; ctx.textBaseline = 'middle';
            const data = chart.data.datasets[0].data; const total = data.reduce((a, b) => a + b, 0);
            if (total === 0) { ctx.restore(); return; } chart.getDatasetMeta(0).data.forEach((arc, index) => { const value = data[index]; if (value === 0) return; const percentage = ((value / total) * 100).toFixed(1) + '%'; const text1 = chart.data.labels[index]; const text2 = `${value} (${percentage})`; const centerX = arc.x; const centerY = arc.y; const angle = (arc.startAngle + arc.endAngle) / 2; const outerRadius = arc.outerRadius; const xLine1 = centerX + Math.cos(angle) * outerRadius; const yLine1 = centerY + Math.sin(angle) * outerRadius; const xLine2 = centerX + Math.cos(angle) * (outerRadius + 15); const yLine2 = centerY + Math.sin(angle) * (outerRadius + 15); const isRight = xLine2 > centerX; const xLine3 = xLine2 + (isRight ? 25 : -25); ctx.beginPath(); ctx.moveTo(xLine1, yLine1); ctx.lineTo(xLine2, yLine2); ctx.lineTo(xLine3, yLine2); ctx.strokeStyle = chart.data.datasets[0].backgroundColor[index]; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = '#5b4a42'; ctx.textAlign = isRight ? 'left' : 'right'; const textX = isRight ? xLine3 + 5 : xLine3 - 5; ctx.fillText(text1, textX, yLine2 - 7); ctx.font = 'bold 11px "Inter", sans-serif'; ctx.fillText(text2, textX, yLine2 + 7); ctx.font = '11px "Inter", sans-serif'; }); ctx.restore();
          }}]
        });
      };

      trangThaiDonHangChartInstance = drawDonut(trangThaiDonHangChartInstance, 'trangThaiDonHangChart', ['Đã hủy', 'Hoàn thành', 'Đang xử lý'], [tongQuanKpi.value.donHuy, tongQuanKpi.value.donHoanThanh, tongQuanKpi.value.donDangXuLy], ['#E26B6B', '#4EA87D', '#F0B247']);
    } catch(e) {}
  })();

  // 2. Load Biểu đồ Tròn Thương hiệu
  ;(async () => {
    try {
        const resBrand = await axios.get(`http://localhost:8080/api/thong-ke/doanh-thu-thuong-hieu?startDate=${start}&endDate=${end}${extraParams}`);
        const colors = generateBrandColors(resBrand.data.length);
        doanhThuThuongHieuData.value = resBrand.data.map((item, index) => ({ ...item, color: colors[index] }));
       
        if (doanhThuThuongHieuChartInstance) doanhThuThuongHieuChartInstance.destroy();
        const ctxPie = document.getElementById('doanhThuThuongHieuChart');
        if(ctxPie) {
          doanhThuThuongHieuChartInstance = new Chart(ctxPie, {
            type: 'doughnut', data: { labels: doanhThuThuongHieuData.value.map(i => i.tenThuongHieu), datasets: [{ data: doanhThuThuongHieuData.value.map(i => i.doanhThu), backgroundColor: doanhThuThuongHieuData.value.map(i => i.color), borderWidth: 2, borderColor: '#fff' }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '65%', layout: { padding: 10 }, plugins: { tooltip: { enabled: true, callbacks: { label: function(context) { return context.parsed.toLocaleString('vi-VN') + ' đ'; } } }, legend: { display: false } } }
          });
        }
    } catch(e) { doanhThuThuongHieuData.value = []; }
  })();

  // 3. Load Biểu đồ Cột (SMART GROUPING)
  ;(async () => {
    try {
      const resChart = await axios.get(`http://localhost:8080/api/thong-ke/bieu-do-custom?startDate=${start}&endDate=${end}${extraParams}`);
      const chartDataFromApi = resChart.data;
      const startDateObj = new Date(start); const endDateObj = new Date(end);
      let displayLabels = []; let quantityData = [];

      if (thongKeTheo.value === 'ngay') {
        const dateLabels = getDatesInRange(startDateObj, endDateObj);
        displayLabels = dateLabels.map(dateStr => `${parseInt(dateStr.split('-')[2])}/${parseInt(dateStr.split('-')[1])}`); // Hiện dạng 19/06
        quantityData = dateLabels.map(dateLabel => { const found = chartDataFromApi.find(item => String(item.ngay) === dateLabel || String(item.ngay) === dateLabel.replace(/-0+/g, '-')); return found && found.soLuongBan ? found.soLuongBan : 0; });
      }
      else if (thongKeTheo.value === 'thang') {
        const monthlyData = {}; let currentMonth = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1); const endMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1);
        while (currentMonth <= endMonth) { const y = currentMonth.getFullYear(); const m = String(currentMonth.getMonth() + 1).padStart(2, '0'); monthlyData[`${y}-${m}`] = 0; currentMonth.setMonth(currentMonth.getMonth() + 1); }
        chartDataFromApi.forEach(item => { if (item.ngay && String(item.ngay).length >= 7) { const monthKey = String(item.ngay).substring(0, 7); if (monthlyData[monthKey] !== undefined) monthlyData[monthKey] += (item.soLuongBan || 0); } });
        displayLabels = Object.keys(monthlyData).map(key => `Tháng ${parseInt(key.split('-')[1])}/${key.split('-')[0].substring(2)}`); quantityData = Object.values(monthlyData);
      }
      else if (thongKeTheo.value === 'nam') {
        const yearlyData = {};
        const startYear = startDateObj.getFullYear(); const endYear = endDateObj.getFullYear();
        for (let y = startYear; y <= endYear; y++) { yearlyData[y] = 0; }
        chartDataFromApi.forEach(item => { if (item.ngay) { const yearKey = String(item.ngay).substring(0, 4); if (yearlyData[yearKey] !== undefined) yearlyData[yearKey] += (item.soLuongBan || 0); } });
        displayLabels = Object.keys(yearlyData).sort().map(year => `Năm ${year}`); quantityData = Object.keys(yearlyData).sort().map(year => yearlyData[year]);
      }

      if (sanPhamBanDuocChartInstance) sanPhamBanDuocChartInstance.destroy();
      const ctxLine = document.getElementById('sanPhamBanDuocChart');
      if(ctxLine) {
          const maxVal = quantityData.length > 0 ? Math.max(...quantityData) : 0;
         
          const barDataLabelsPlugin = {
            id: 'barDataLabels',
            afterDatasetsDraw(chart) {
              const ctx = chart.ctx; ctx.save(); ctx.font = 'bold 11px "Inter", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
              const dataset = chart.data.datasets[0]; const meta = chart.getDatasetMeta(0);
              meta.data.forEach((bar, index) => { const value = dataset.data[index]; if (value > 0) { ctx.fillStyle = '#d9534f'; ctx.fillText(value.toLocaleString('vi-VN'), bar.x, bar.y - 5); } }); ctx.restore();
            }
          };

          sanPhamBanDuocChartInstance = new Chart(ctxLine.getContext('2d'), {
            type: 'bar', data: { labels: displayLabels, datasets: [{ label: 'Số lượng bán', data: quantityData, backgroundColor: '#d0bba6', hoverBackgroundColor: '#c2a88f', borderRadius: { topLeft: 4, topRight: 4 }, barPercentage: 0.5, maxBarThickness: 45 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false, drawBorder: true }, ticks: { font: {family: "'Inter', sans-serif", size: 10}, color: '#999', autoSkip: true, maxRotation: 0 } }, y: { beginAtZero: true, suggestedMax: maxVal * 1.2 || 10, border: { display: false }, grid: { color: '#f0f0f0', borderDash: [5, 5] }, ticks: { font: {family: "'Inter', sans-serif", size: 11}, color: '#999', precision: 0 } } } },
            plugins: [barDataLabelsPlugin]
          });
      }
    } catch(e) {}
  })();

  // 4. Load Bảng Sản Phẩm Phía Dưới
  axios.get(`http://localhost:8080/api/thong-ke/san-pham?startDate=${start}&endDate=${end}${extraParams}`)
       .then(res => { danhSachThongKeSP.value = res.data; })
       .catch(e => console.error("Lỗi lấy sản phẩm"));
};

// ==========================================
// THUẬT TOÁN UX THÔNG MINH
// ==========================================

const onThongKeTheoDropdownChange = () => {
  dateError.value = '';
  const currentVal = thongKeTheo.value;
 
  if (currentVal === 'thang') {
     applyQuickFilter('nam_nay');
  }
  else if (currentVal === 'nam') {
     applyQuickFilter('tat_ca');
  }
  else if (currentVal === 'ngay') {
     applyQuickFilter('thang_nay');
  }
};

const applyQuickFilter = (type) => {
  filterType.value = type;
  dateError.value = '';

  const today = new Date();
  let apiStartDate = new Date();
  let apiEndDate = new Date();
 
  if (type === 'hom_nay') {
    thongKeTheo.value = 'ngay';
  }
  else if (type === '7_ngay') {
    apiStartDate.setDate(today.getDate() - 6);
    thongKeTheo.value = 'ngay';
  }
  else if (type === 'thang_nay') {
    apiStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
    thongKeTheo.value = 'ngay';
  }
  else if (type === 'thang_truoc') {
    apiStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    apiEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
    thongKeTheo.value = 'ngay';
  }
  else if (type === 'nam_nay') {
    apiStartDate = new Date(today.getFullYear(), 0, 1);
    thongKeTheo.value = 'thang';
  }
  else if (type === 'tat_ca') {
    apiStartDate = new Date(firstInvoiceDateDb.value || '2020-01-01');
    thongKeTheo.value = 'nam';
  }
 
  customStartDate.value = formatDate(apiStartDate);
  customEndDate.value = formatDate(apiEndDate);

  executeLoadDataAll();
};

const onCustomDateChange = () => {
  filterType.value = 'tuy_chinh';
  dateError.value = '';
 
  if (!customStartDate.value || !customEndDate.value) return;

  if (customStartDate.value > customEndDate.value) {
    dateError.value = 'Ngày kết thúc phải diễn ra SAU ngày bắt đầu.';
    return;
  }

  const start = new Date(customStartDate.value);
  const end = new Date(customEndDate.value);
  const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
 
  if (diffDays <= 35) {
     thongKeTheo.value = 'ngay';
  } else if (diffDays <= 400) {
     thongKeTheo.value = 'thang';
  } else {
     thongKeTheo.value = 'nam';
  }

  executeLoadDataAll();
};

// ==========================================
// CÁC HÀM PHỤ & INIT
// ==========================================
const resetFilters = () => {
  thuongHieuId.value = ''; searchSP.value = ''; tieuChiThuongHieu.value = 'doanhThu';
  applyQuickFilter('thang_nay');
};

const loadTongQuanCards = () => {
  const extraParams = getFilterParams();
  const today = new Date(); const strToday = formatDate(today);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1); const strYesterday = formatDate(yesterday);
  const distanceToMonday = today.getDay() === 0 ? 6 : today.getDay() - 1; const thisMonday = new Date(today); thisMonday.setDate(today.getDate() - distanceToMonday); const strThisMonday = formatDate(thisMonday);
  const lastMonday = new Date(thisMonday); lastMonday.setDate(thisMonday.getDate() - 7); const strLastMonday = formatDate(lastMonday); const lastSunday = new Date(thisMonday); lastSunday.setDate(thisMonday.getDate() - 1); const strLastSunday = formatDate(lastSunday);
  const thisMonthFirst = new Date(today.getFullYear(), today.getMonth(), 1); const strThisMonthFirst = formatDate(thisMonthFirst);
  const lastMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1); const strLastMonthFirst = formatDate(lastMonthFirst); const lastMonthLast = new Date(today.getFullYear(), today.getMonth(), 0); const strLastMonthLast = formatDate(lastMonthLast);
  const thisYearFirst = new Date(today.getFullYear(), 0, 1); const strThisYearFirst = formatDate(thisYearFirst);
  const lastYearFirst = new Date(today.getFullYear() - 1, 0, 1); const strLastYearFirst = formatDate(lastYearFirst); const lastYearLast = new Date(today.getFullYear() - 1, 11, 31); const strLastYearLast = formatDate(lastYearLast);

  const calcGrowth = (curr, prev) => { const c = curr || 0; const p = prev || 0; if (p === 0) return c > 0 ? 100 : 0; return Math.round(((c - p) / p) * 100); };

  const fetchCycleRow = async (index, currStart, currEnd, prevStart, prevEnd) => {
    try {
      const [resCurr, resPrev] = await Promise.all([ axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${currStart}&endDate=${currEnd}${extraParams}`), axios.get(`http://localhost:8080/api/thong-ke/tong-quan-custom?startDate=${prevStart}&endDate=${prevEnd}${extraParams}`) ]);
      const curr = resCurr.data; const prev = resPrev.data;
      chuKyData.value[index].revenueGoc = curr.doanhThuGoc || 0; chuKyData.value[index].revenueTienMat = curr.doanhThuTienMat || 0; chuKyData.value[index].revenueChuyenKhoan = curr.doanhThuChuyenKhoan || 0; chuKyData.value[index].orders = curr.tongDonHang || 0; chuKyData.value[index].growth = calcGrowth(curr.doanhThuGoc, prev.doanhThuGoc); chuKyData.value[index].isUp = chuKyData.value[index].growth >= 0;
    } catch (error) {}
  };

  fetchCycleRow(0, strToday, strToday, strYesterday, strYesterday);
  fetchCycleRow(1, strThisMonday, strToday, strLastMonday, strLastSunday);
  fetchCycleRow(2, strThisMonthFirst, strToday, strLastMonthFirst, strLastMonthLast);
  fetchCycleRow(3, strThisYearFirst, strToday, strLastYearFirst, strLastYearLast);
};

onMounted(async () => {
    await loadFirstInvoiceDate();
    loadThuongHieu();
    applyQuickFilter('thang_nay');
    loadTongQuanCards();
});
</script>

<style scoped>
.table { border-collapse: collapse !important; width: 100%; margin-bottom: 0; }
.table td, .table th { border-bottom: 1px solid #f0f0f0; padding: 1rem 0.5rem; vertical-align: middle; }
.table tbody tr:hover { background-color: #fafafa; }
.btn-filter-quick { background-color: #fff; color: #6c757d; border: 1px solid #e0e0e0; border-radius: 50px !important; padding: 4px 16px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; white-space: nowrap; }
.btn-filter-quick:hover { background-color: #f8f9fa; border-color: #d0bba6; }
.btn-filter-quick.active { background-color: #dfd3c3; border-color: #dfd3c3; color: #4a3b32; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
.filter-input-group { background-color: #f4f6f8; border-radius: 8px; border: 1px solid #eef0f2; transition: border-color 0.2s; }
.filter-input-group:focus-within { border-color: #d0bba6; background-color: #fff; }
.thead-brand { background-color: #dfd3c3 !important; }
.thead-brand th { background-color: transparent !important; color: #4a3b32 !important; font-weight: 700 !important; border-bottom: none !important; white-space: nowrap; }
.custom-pagination .page-item .page-link { color: #6c757d; border: 1px solid #dee2e6; margin: 0 4px; border-radius: 4px; padding: 4px 12px; transition: all 0.2s; }
.custom-pagination .page-item.active .page-link { background-color: #8b6b5d; border-color: #8b6b5d; color: #fff; font-weight: 500; }
.custom-pagination .page-item:not(.active) .page-link:hover { background-color: #f4f6f8; color: #3e2723; }
.custom-select-paginate { border-radius: 20px; padding-left: 15px; padding-right: 30px; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; }
.icon-box-small { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.brand-list-container { max-height: 250px; overflow-y: auto; padding-right: 5px; }
.brand-list-container::-webkit-scrollbar { width: 5px; }
.brand-list-container::-webkit-scrollbar-thumb { background: #d0bba6; border-radius: 5px; }
</style>