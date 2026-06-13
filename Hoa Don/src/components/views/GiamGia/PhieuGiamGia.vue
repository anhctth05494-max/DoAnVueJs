<template>
  <div class="container-fluid p-0">
    
    <div v-if="!isModalOpen">
      <div class="card border-0 shadow-sm mb-4 rounded-3">
        <div class="card-body p-4">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-funnel text-dark me-2 fs-5"></i>
            <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm</h6>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label class="form-label text-muted small mb-1">Tìm kiếm</label>
              <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  v-model="filters.keyword" 
                  type="text" 
                  class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle" 
                  placeholder="Nhập mã / tên phiếu giảm giá..." 
                  @keyup.enter="applyFilter"
                >
              </div>
            </div>
            
            <div class="col-md-4">
              <label class="form-label text-muted small mb-1">Loại giảm</label>
              <select v-model="filters.loaiGiamGia" @change="applyFilter" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted">
                <option :value="null">Tất cả</option>
                <option :value="1">Giảm theo %</option>
                <option :value="2">Giảm tiền (VNĐ)</option>
              </select>
            </div>
            
            <div class="col-md-4">
              <label class="form-label text-muted small mb-1">Trạng thái</label>
              <select v-model="filters.trangThai" @change="applyFilter" class="form-select rounded-pill shadow-none border-secondary-subtle text-muted">
                <option :value="null">Tất cả</option>
                <option :value="1">Đang hoạt động</option>
                <option :value="2">Sắp diễn ra</option>
                <option :value="0">Ngừng hoạt động / Kết thúc</option>
              </select>
            </div>
          </div>

          <div class="row g-3 align-items-end border-top pt-3 mt-2">
            <div class="col-md-6">
              <label class="form-label text-muted small mb-2 d-block">Loại phiếu</label>
              <div class="d-flex gap-3 px-3 py-2 border border-secondary-subtle rounded-pill" style="width: fit-content;">
                <div class="form-check mb-0">
                  <input class="form-check-input shadow-none" type="radio" id="loaiTatCa" :value="null" v-model="filters.loaiPhieu" @change="applyFilter">
                  <label class="form-check-label small text-dark fw-medium cursor-pointer" for="loaiTatCa">Tất cả</label>
                </div>
                <div class="form-check mb-0">
                  <input class="form-check-input shadow-none" type="radio" id="loaiCongKhai" :value="1" v-model="filters.loaiPhieu" @change="applyFilter">
                  <label class="form-check-label small text-dark fw-medium cursor-pointer" for="loaiCongKhai">Công khai</label>
                </div>
                <div class="form-check mb-0">
                  <input class="form-check-input shadow-none" type="radio" id="loaiCaNhan" :value="2" v-model="filters.loaiPhieu" @change="applyFilter">
                  <label class="form-check-label small text-dark fw-medium cursor-pointer" for="loaiCaNhan">Cá nhân</label>
                </div>
              </div>
            </div>
            
            <div class="col-md-3">
              <label class="form-label text-muted small mb-1">Từ ngày</label>
              <input type="date" class="form-control rounded-pill shadow-none border-secondary-subtle text-muted" v-model="filters.tuNgay" @change="applyFilter">
            </div>
            
            <div class="col-md-3">
              <label class="form-label text-muted small mb-1">Đến ngày</label>
              <input type="date" class="form-control rounded-pill shadow-none border-secondary-subtle text-muted" v-model="filters.denNgay" @change="applyFilter">
            </div>
          </div>

          <div class="d-flex flex-wrap justify-content-end align-items-end mt-4 gap-2 border-top pt-3">
            <button @click="openModal(null)" class="btn rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2" style="background-color: #dccbc0; color: #5a4031">
              <i class="bi bi-plus-lg"></i> Thêm phiếu giảm giá
            </button>
            <button @click="resetFilter" class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2">
              <i class="bi bi-arrow-clockwise"></i> Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <div class="table-responsive">
            <table class="table table-hover align-middle text-nowrap text-center" style="font-size: 0.9rem">
              <thead>
                <tr>
                  <th class="py-3 px-3 border-0 rounded-start fw-semibold" style="background-color: #dccbc0; color: #5a4031; width: 5%;">STT</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">MÃ VC</th>
                  <th class="py-3 px-3 border-0 fw-semibold text-start" style="background-color: #dccbc0; color: #5a4031">TÊN PGG</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">LOẠI PHIẾU</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">SỐ LƯỢNG</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">GIÁ TRỊ GIẢM</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">THỜI GIAN ÁP DỤNG</th>
                  <th class="py-3 px-3 border-0 fw-semibold" style="background-color: #dccbc0; color: #5a4031">TRẠNG THÁI</th>
                  <th class="py-3 px-3 border-0 rounded-end fw-semibold" style="background-color: #dccbc0; color: #5a4031">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody class="border-top-0 text-secondary">
                <tr v-for="(item, index) in vouchers" :key="item.id">
                  <td class="py-3 px-3">{{ pagination.page * pagination.size + index + 1 }}</td>
                  <td class="py-3 px-3 text-dark fw-medium">{{ item.maVoucher }}</td>
                  <td class="py-3 px-3 text-dark fw-medium text-start">{{ item.tenVoucher }}</td>
                  <td class="py-3 px-3">{{ item.loaiPhieu === 1 ? 'Công khai' : 'Cá nhân' }}</td>
                  <td class="py-3 px-3 text-dark fw-bold">{{ item.soLuong }}</td>
                  <td class="py-3 px-3 text-danger fw-bold">
                    {{ item.loaiGiamGia === 1 ? item.giaTriGiam + ' %' : formatCurrency(item.giaTriGiam) }}
                  </td>
                  <td class="py-3 px-3 text-muted small">
                    {{ formatDate(item.ngayBatDau) }} - {{ formatDate(item.ngayKetThuc) }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span :class="['custom-badge', getStatusData(item).class]">
                        {{ getStatusData(item).text }}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="d-flex justify-content-center gap-3 align-items-center">
                      <div class="form-check form-switch mb-0">
                         <input 
                          type="checkbox" 
                          class="form-check-input"
                          :checked="item.trangThai === 1 && !isPastEndDate(item.ngayKetThuc)" 
                          :disabled="isPastEndDate(item.ngayKetThuc)"
                          @change="triggerToggleConfirm($event, item)" 
                          :title="isPastEndDate(item.ngayKetThuc) ? 'Phiếu đã hết hạn, không thể thao tác' : ''"
                          :style="isPastEndDate(item.ngayKetThuc) ? 'cursor: not-allowed; opacity: 0.5;' : 'cursor: pointer;'"
                        >
                      </div>
                      <i class="bi bi-eye fs-5 text-primary cursor-pointer" @click="openModal(item)"></i>
                    </div>
                  </td>
                </tr>

                <tr v-if="vouchers.length === 0">
                  <td colspan="9" class="text-center py-5 text-danger fw-medium">
                    <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không tìm thấy phiếu giảm giá nào phù hợp với bộ lọc.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="vouchers.length > 0" class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small flex-wrap gap-3">
            <div>
              Hiển thị <span class="fw-bold text-dark">{{ vouchers.length }}</span> /
              <span class="fw-bold text-dark">{{ pagination.totalElements }}</span> bản ghi
            </div>

            <div class="d-flex gap-1 align-items-center">
              <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 0" class="btn btn-sm btn-light border shadow-none px-2 rounded">
                <i class="bi bi-chevron-left"></i>
              </button>

              <button v-for="p in pagination.totalPages" :key="p" @click="changePage(p - 1)" 
                class="btn btn-sm shadow-none px-3 rounded fw-medium"
                :class="pagination.page === p - 1 ? 'btn-secondary text-white' : 'btn-light border text-muted'"
                :style="pagination.page === p - 1 ? 'background-color: #8c6b5d; border-color: #8c6b5d;' : ''"
              >
                {{ p }}
              </button>

              <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages - 1" class="btn btn-sm btn-light border shadow-none px-2 rounded">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <div class="d-flex align-items-center gap-2">
              <select v-model="pagination.size" @change="changePage(0)" class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted pe-4" style="width: auto">
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

    <div v-else class="animation-fade-in">
      <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <h5 class="fw-bold m-0 text-dark">
            <i class="bi bi-ticket-perforated me-2"></i>{{ isEditMode ? 'Chi tiết phiếu giảm giá' : 'Thêm mới phiếu giảm giá' }}
          </h5>
          <button class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium" @click="isModalOpen = false">
            <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
          </button>
      </div>
        
      <form @submit.prevent="triggerSaveConfirm" novalidate>
        <div class="row g-4 mb-4">
          
          <div class="col-12">
            <div class="card border-0 shadow-sm rounded-3 h-100">
              <div class="card-body p-4">
                <h6 class="fw-bold mb-4 text-dark border-bottom pb-2"><i class="bi bi-card-heading me-2"></i>Thông tin chung</h6>
                
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Tên phiếu giảm giá <span class="text-danger">*</span></label>
                  <input type="text" 
                         class="form-control rounded-3 shadow-none border-secondary-subtle" 
                         :class="{ 'is-invalid': errors.tenVoucher }"
                         v-model="form.tenVoucher" 
                         placeholder="Ví dụ: Tri ân khách hàng tháng 6">
                  <div v-if="errors.tenVoucher" class="invalid-feedback d-block small mt-1">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.tenVoucher }}
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Số lượng <span class="text-danger">*</span></label>
                    <input type="number" 
                           class="form-control rounded-3 shadow-none border-secondary-subtle" 
                           :class="{ 'is-invalid': errors.soLuong }"
                           v-model="form.soLuong" 
                           placeholder="Số lượng..."
                           :disabled="form.loaiPhieu === 2"
                           :title="form.loaiPhieu === 2 ? 'Số lượng được tính tự động theo khách hàng đã chọn' : ''">
                    <div v-if="errors.soLuong" class="invalid-feedback d-block small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.soLuong }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Đơn hàng tối thiểu <span class="text-danger">*</span></label>
                    <input type="text" 
                           class="form-control rounded-3 shadow-none border-secondary-subtle" 
                           :class="{ 'is-invalid': errors.donToiThieu }"
                           v-model="donToiThieuDisplay"
                           placeholder="Ví dụ: 200.000">
                    <div v-if="errors.donToiThieu" class="invalid-feedback d-block small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.donToiThieu }}
                    </div>
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Loại giảm <span class="text-danger">*</span></label>
                    <select class="form-select rounded-3 shadow-none border-secondary-subtle" v-model="form.loaiGiamGia" @change="errors.giaTriGiam = ''">
                      <option :value="1">Giảm theo %</option>
                      <option :value="2">Giảm tiền (VNĐ)</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Giá trị giảm <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <input v-if="form.loaiGiamGia === 1" 
                             key="percent-input" 
                             type="number" 
                             class="form-control shadow-none border-secondary-subtle border-end-0" 
                             :class="{ 'is-invalid': errors.giaTriGiam }"
                             v-model="form.giaTriGiam" 
                             placeholder="Nhập %">
                      
                      <input v-else 
                             key="vnd-input" 
                             type="text" 
                             class="form-control shadow-none border-secondary-subtle border-end-0" 
                             :class="{ 'is-invalid': errors.giaTriGiam }"
                             v-model="giaTriGiamDisplay"
                             placeholder="Nhập số tiền">
                             
                      <span class="input-group-text bg-light text-muted border-secondary-subtle fw-medium"
                            :class="{ 'border-danger': errors.giaTriGiam }">
                        {{ form.loaiGiamGia === 1 ? '%' : 'VNĐ' }}
                      </span>
                    </div>
                    <div v-if="errors.giaTriGiam" class="invalid-feedback d-block small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.giaTriGiam }}
                    </div>
                  </div>
                </div>

                <div class="mb-3" v-if="form.loaiGiamGia === 1">
                  <label class="form-label small fw-semibold">Giảm tối đa (VNĐ)</label>
                  <input type="text" 
                         class="form-control rounded-3 shadow-none border-secondary-subtle" 
                         :class="{ 'is-invalid': errors.giamToiDa }"
                         v-model="giamToiDaDisplay"
                         placeholder="Nhập giảm tối đa...">        
                  <div v-if="errors.giamToiDa" class="invalid-feedback d-block small mt-1">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.giamToiDa }}
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Ngày bắt đầu <span class="text-danger">*</span></label>
                    <input type="datetime-local" 
                           class="form-control rounded-3 shadow-none border-secondary-subtle" 
                           :class="{ 'is-invalid': errors.ngayBatDau }"
                           v-model="form.ngayBatDau">
                    <div v-if="errors.ngayBatDau" class="invalid-feedback d-block small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.ngayBatDau }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Ngày kết thúc <span class="text-danger">*</span></label>
                    <input type="datetime-local" 
                           class="form-control rounded-3 shadow-none border-secondary-subtle" 
                           :class="{ 'is-invalid': errors.ngayKetThuc }"
                           v-model="form.ngayKetThuc">
                    <div v-if="errors.ngayKetThuc" class="invalid-feedback d-block small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.ngayKetThuc }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-semibold">Mô tả phiếu giảm giá <span class="text-muted fw-normal">(Không bắt buộc)</span></label>
                  <textarea class="form-control rounded-3 shadow-none border-secondary-subtle" v-model="form.moTa" rows="2" placeholder="Nhập ghi chú hoặc mô tả "></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="card border-0 shadow-sm rounded-3 h-100">
              <div class="card-body p-4 d-flex flex-column" :class="{ 'border border-danger': errors.khachHang }">
                <h6 class="fw-bold mb-4 text-dark border-bottom pb-2"><i class="bi bi-people-fill me-2"></i>Đối tượng áp dụng</h6>
                
                <div class="d-flex gap-5 mb-4">
                  <div class="form-check">
                    <input class="form-check-input shadow-none cursor-pointer" type="radio" :value="1" v-model="form.loaiPhieu" id="radioCongKhai" style="transform: scale(1.1);">
                    <label class="form-check-label ms-1 cursor-pointer fw-medium" for="radioCongKhai"> Tất cả (Công khai) </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input shadow-none cursor-pointer" type="radio" :value="2" v-model="form.loaiPhieu" id="radioCaNhan" style="transform: scale(1.1);">
                    <label class="form-check-label ms-1 cursor-pointer fw-medium" for="radioCaNhan"> Nhóm chỉ định (Cá nhân) </label>
                  </div>
                </div>

                <div v-if="errors.khachHang" class="text-danger small fw-medium mb-3">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.khachHang }}
                </div>

                <div v-if="form.loaiPhieu === 2" class="p-4 border border-secondary-subtle rounded-3 flex-grow-1 d-flex flex-column" style="background-color: #f8f9fa; height: 480px;">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-semibold m-0 text-dark">Danh sách khách hàng nhận phiếu</h6>
                    <span class="badge bg-secondary px-3 py-2 rounded-pill fw-medium">Đã chọn: {{ selectedCustomers.length }}</span>
                  </div>
                  
                  <div class="input-group mb-3 w-50">
                    <span class="input-group-text bg-white border-end-0 border-secondary-subtle rounded-start-pill text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle" placeholder="Tìm kiếm theo mã, tên, SĐT..." v-model="searchCustomer">
                  </div>

                  <div class="table-responsive bg-white border border-secondary-subtle rounded-3 flex-grow-1" style="overflow-y: auto;">
                    <table class="table table-hover align-middle text-nowrap m-0">
                     <thead class="table-light sticky-top shadow-sm">
                      <tr>
                        <th class="text-center" style="width: 50px; padding: 15px 0;">
                          <input class="form-check-input shadow-none cursor-pointer" type="checkbox" @change="selectAllCustomers($event)" style="transform: scale(1.1);">
                        </th>
                        <th class="text-start fw-semibold text-secondary">Mã KH</th>
                        <th class="text-start fw-semibold text-secondary">Tên Khách Hàng</th>
                        <th class="text-center fw-semibold text-secondary">Ngày sinh</th>
                        <th class="text-start fw-semibold text-secondary">Số điện thoại</th>
                        <th class="text-start fw-semibold text-secondary">Email</th> 
                        <th class="text-center fw-semibold text-secondary">Đã mua</th>
                        <th class="text-center fw-semibold text-secondary">Gần nhất</th>
                      </tr>
                     </thead>
                     <tbody>
                        <tr v-for="kh in filteredCustomers" :key="kh.id">
                          <td class="text-center" style="padding: 12px 0;">
                            <input class="form-check-input shadow-none cursor-pointer" type="checkbox" :value="kh.id" v-model="selectedCustomers" style="transform: scale(1.1);">
                          </td>
                          <td class="text-start fw-medium text-dark">{{ kh.maKhachHang }}</td>
                          <td class="text-start fw-medium text-dark">{{ kh.hoTen }}</td>
                          <td class="text-center text-muted">{{ formatDate(kh.ngaySinh) || '---' }}</td>
                          <td class="text-start">{{ kh.soDienThoai }}</td>
                          <td class="text-start text-muted">{{ kh.email ? kh.email : 'Chưa cập nhật' }}</td>
                          <td class="text-center text-muted fw-medium">{{ kh.soDonDaMua || 0 }} đơn</td>
                          <td class="text-center text-muted">{{ formatDateTime(kh.lanMuaGanNhat) || '---' }}</td>
                        </tr>
                        <tr v-if="filteredCustomers.length === 0">
                          <td colspan="8" class="text-muted py-4 text-center">Không tìm thấy khách hàng nào phù hợp.</td>
                        </tr>
                     </tbody>
                    </table>
                  </div>
                </div>
                
                <div v-else class="d-flex justify-content-center align-items-center flex-grow-1 border border-dashed border-secondary-subtle rounded-3 p-4" style="background-color: #f8f9fa; height: 480px;">
                    <div class="text-center text-muted">
                        <i class="bi bi-globe fs-1 d-block mb-3 text-secondary"></i>
                        <span>Phiếu giảm giá công khai sẽ được phát hành chung cho tất cả khách hàng.</span>
                    </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-3 mt-2 pt-3 border-top">
          <button type="button" class="btn btn-outline-secondary rounded-pill px-4 fw-medium shadow-none" @click="isModalOpen = false">Hủy bỏ</button>
          <button type="submit" class="btn rounded-pill px-4 shadow-none fw-medium d-flex align-items-center gap-2" :disabled="isProcessing" style="background-color: #dccbc0; color: #5a4031">
            <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <i v-else class="bi bi-floppy"></i>
            {{ isEditMode ? 'Cập nhật phiếu giảm giá' : 'Lưu phiếu giảm giá' }}
          </button>
        </div>
      </form>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-4" style="z-index: 1060;">
      <transition name="toast-slide">
        <div v-if="toast.show" class="d-flex align-items-center bg-white shadow rounded-3 px-3 py-3 border-start border-4 border-success" style="min-width: 300px;">
          <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
          <span class="fw-medium text-dark">{{ toast.message }}</span>
        </div>
      </transition>
    </div>

    <Teleport to="body" v-if="isShowConfirmModal">
      <div class="confirm-overlay">
        <div class="confirm-modal-card">
          <div class="confirm-icon-area">
            <i v-if="confirmActionType === 'toggle'" class="bi bi-box-seam-fill"></i>
            <i v-else class="bi bi-floppy-fill"></i>
          </div>
          <h5 class="confirm-title">{{ confirmTitle }}</h5>
          <p class="confirm-message" v-html="confirmMessage"></p>
          <div class="confirm-actions">
            <button @click="closeConfirmModal" class="btn-cancel-custom">
              Hủy bỏ
            </button>
            <button @click="executeConfirmAction" class="btn-confirm-custom" :disabled="isProcessing">
              <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';

// ==========================================
// TOAST VÀ LOGIC XỬ LÝ MODAL CONFIRM
// ==========================================
const toast = reactive({ show: false, message: '' });
const isProcessing = ref(false);

const showToast = (msg) => {
  toast.message = msg;
  toast.show = true;
  setTimeout(() => { toast.show = false; }, 3000);
};

// State quản lý Custom Modal Confirm
const isShowConfirmModal = ref(false);
const confirmActionType = ref('');
const confirmTitle = ref('');
const confirmMessage = ref('');
const pendingItem = ref(null);
const pendingEventTarget = ref(null);

const triggerToggleConfirm = (event, item) => {
  confirmActionType.value = 'toggle';
  pendingItem.value = item;
  pendingEventTarget.value = event.target;
  confirmTitle.value = 'Xác Nhận Thay Đổi';
  confirmMessage.value = `Cậu có chắc chắn muốn thay đổi trạng thái hoạt động của phiếu giảm giá:<br><strong class="text-dark">[${item.maVoucher}] - ${item.tenVoucher}</strong> không?`;
  isShowConfirmModal.value = true;
};

const triggerSaveConfirm = () => {
  if (!validateForm()) return;
  
  form.tenVoucher = form.tenVoucher.trim(); 

  confirmActionType.value = 'save';
  confirmTitle.value = isEditMode.value ? 'Xác Nhận Cập Nhật' : 'Xác Nhận Thêm Mới';
  confirmMessage.value = `Cậu có chắc chắn muốn ${isEditMode.value ? 'cập nhật' : 'lưu mới'} phiếu giảm giá <br><strong class="text-dark">${form.tenVoucher}</strong> không?`;
  isShowConfirmModal.value = true;
};

const closeConfirmModal = () => {
  isShowConfirmModal.value = false;
  if (confirmActionType.value === 'toggle' && pendingEventTarget.value) {
    pendingEventTarget.value.checked = !pendingEventTarget.value.checked;
  }
};

const executeConfirmAction = async () => {
  if (confirmActionType.value === 'toggle') {
    await performToggleStatus();
  } else if (confirmActionType.value === 'save') {
    await performSaveVoucher();
  }
};

const performToggleStatus = async () => {
  isProcessing.value = true;
  const item = pendingItem.value;
  const newStatus = (item.trangThai === 1) ? 0 : 1;
  
  try {
    await axios.patch(`${apiBaseUrl}/${item.id}/toggle-status?newStatus=${newStatus}`);
    item.trangThai = newStatus;
    isShowConfirmModal.value = false;
    showToast(`Cập nhật trạng thái phiếu giảm giá thành công!`);
  } catch (error) {
    console.error("Lỗi:", error);
    if (pendingEventTarget.value) {
      pendingEventTarget.value.checked = !pendingEventTarget.value.checked;
    }
    alert("Có lỗi xảy ra khi cập nhật trạng thái trên máy chủ!");
    isShowConfirmModal.value = false;
  } finally {
    isProcessing.value = false;
  }
};

const performSaveVoucher = async () => {
  isProcessing.value = true;
  try {
    const payload = {
      phieuGiamGia: { ...form }, 
      customerIds: form.loaiPhieu === 2 ? selectedCustomers.value : [] 
    };

    if (isEditMode.value) {
      await axios.put(`${apiBaseUrl}/${form.id}`, payload); 
    } else {
      await axios.post(apiBaseUrl, payload);
    }
    
    isModalOpen.value = false;
    fetchVouchers();
    isShowConfirmModal.value = false;
    showToast(`${isEditMode.value ? 'Cập nhật' : 'Thêm mới'} phiếu giảm giá thành công!`);
    
  } catch (err) { 
    if (err.response && err.response.data && typeof err.response.data === 'string') {
        alert(err.response.data);
    } else {
        alert('Có lỗi xảy ra khi lưu trên Server!');
    }
    console.error(err);
    isShowConfirmModal.value = false;
  } finally {
    isProcessing.value = false;
  }
};

// ==========================================
// HỆ THỐNG VALIDATE CHẶT CHẼ
// ==========================================
const errors = reactive({
  tenVoucher: '',
  soLuong: '',
  donToiThieu: '',
  giaTriGiam: '',
  giamToiDa: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  khachHang: ''
});

const clearErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '');
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  // 1. Tên phiếu
  if (!form.tenVoucher || !form.tenVoucher.toString().trim()) {
    errors.tenVoucher = 'Vui lòng nhập tên phiếu giảm giá.';
    isValid = false;
  }

  // 2. Số lượng (Chỉ bắt với phiếu công khai)
  if (form.loaiPhieu === 1) {
    if (form.soLuong === null || form.soLuong === '' || isNaN(form.soLuong) || form.soLuong <= 0) {
      errors.soLuong = 'Số lượng phiếu phải là số nguyên lớn hơn 0.';
      isValid = false;
    }
  }

  // 3. Ngày tháng
  if (!form.ngayBatDau) {
    errors.ngayBatDau = 'Vui lòng chọn ngày bắt đầu.';
    isValid = false;
  }
  if (!form.ngayKetThuc) {
    errors.ngayKetThuc = 'Vui lòng chọn ngày kết thúc.';
    isValid = false;
  }

  if (form.ngayBatDau && form.ngayKetThuc) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 1); 
    const startDate = new Date(form.ngayBatDau);
    const endDate = new Date(form.ngayKetThuc);

    // Ngày bắt đầu phải ở tương lai (Chỉ bắt cứng khi Thêm Mới để tránh lỗi khi Sửa phiếu cũ đang chạy)
    if (!isEditMode.value && startDate < now) {
      errors.ngayBatDau = 'Ngày bắt đầu không được nằm trong quá khứ.';
      isValid = false;
    }
    if (endDate <= now) {
      errors.ngayKetThuc = 'Ngày kết thúc phải nằm ở tương lai.';
      isValid = false;
    }
    if (startDate >= endDate) {
      errors.ngayKetThuc = 'Ngày kết thúc phải diễn ra SAU ngày bắt đầu.';
      isValid = false;
    }
  }

  // 4. Validate Mức Tiền (Tối thiểu 1000đ, không chữ, ràng buộc chéo)
  const donToiThieuVal = form.donToiThieu;
  const giaTriGiamVal = form.giaTriGiam;

  // A. Đơn tối thiểu
  if (donToiThieuVal === 'INVALID') {
    errors.donToiThieu = 'Vui lòng chỉ nhập số hợp lệ.';
    isValid = false;
  } else if (donToiThieuVal === null || donToiThieuVal === '' || isNaN(donToiThieuVal)) {
    errors.donToiThieu = 'Vui lòng nhập đơn hàng tối thiểu.';
    isValid = false;
  } else if (donToiThieuVal < 1000) {
    errors.donToiThieu = 'Đơn hàng tối thiểu phải từ 1.000 đ trở lên.';
    isValid = false;
  }

  // B. Giá trị giảm
  if (form.loaiGiamGia === 1) { 
    // Giảm theo %
    if (giaTriGiamVal === null || giaTriGiamVal === '' || isNaN(giaTriGiamVal)) {
      errors.giaTriGiam = 'Vui lòng nhập giá trị giảm.';
      isValid = false;
    } else if (giaTriGiamVal <= 0 || giaTriGiamVal > 100) {
      errors.giaTriGiam = 'Mức giảm (%) phải nằm trong khoảng từ 1% đến 100%.';
      isValid = false;
    }
    
    // Giảm tối đa
    if (form.giamToiDa === 'INVALID') {
      errors.giamToiDa = 'Vui lòng chỉ nhập số hợp lệ.';
      isValid = false;
    } else if (form.giamToiDa !== null && form.giamToiDa !== '' && !isNaN(form.giamToiDa)) {
       if (form.giamToiDa < 1000) {
          errors.giamToiDa = 'Giảm tối đa phải từ 1.000 đ trở lên.';
          isValid = false;
       } else if (!errors.donToiThieu && form.giamToiDa > donToiThieuVal) {
          errors.giamToiDa = 'Giảm tối đa không được vượt quá đơn hàng tối thiểu.';
          isValid = false;
       }
    }
  } else { 
    // Giảm theo VNĐ
    if (giaTriGiamVal === 'INVALID') {
      errors.giaTriGiam = 'Vui lòng chỉ nhập số hợp lệ.';
      isValid = false;
    } else if (giaTriGiamVal === null || giaTriGiamVal === '' || isNaN(giaTriGiamVal)) {
      errors.giaTriGiam = 'Vui lòng nhập giá trị giảm.';
      isValid = false;
    } else if (giaTriGiamVal < 1000) {
      errors.giaTriGiam = 'Số tiền giảm phải từ 1.000 đ trở lên.';
      isValid = false;
    }
    
    // Ràng buộc chéo (Đơn tối thiểu phải lớn hơn Giá trị giảm)
    if (!errors.donToiThieu && !errors.giaTriGiam) {
      if (donToiThieuVal <= giaTriGiamVal) {
        errors.donToiThieu = 'Đơn tối thiểu phải lớn hơn giá trị giảm.';
        errors.giaTriGiam = 'Giá trị giảm phải nhỏ hơn đơn tối thiểu.';
        isValid = false;
      }
    }
  }

  // 5. Khách hàng
  if (form.loaiPhieu === 2 && selectedCustomers.value.length === 0) {
    errors.khachHang = 'Bạn đã chọn loại phiếu "Cá nhân", vui lòng tick chọn ít nhất 1 khách hàng bên dưới.';
    isValid = false;
  }

  return isValid;
};

// --- HÀM BẮT LỖI CHỮ CÁI VÀ ĐỊNH DẠNG TIỀN ---
const formatCurrencyDisplay = (val) => {
  if (val === null || val === undefined || val === '' || val === 'INVALID') return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrencyInput = (val) => {
  if (val === null || val === undefined) return '';
  const rawValue = typeof val === 'string' ? val : (val.target ? val.target.value : '');
  
  // Dọn dẹp chỉ lấy số
  const cleanValue = rawValue.toString().replace(/\./g, '').replace(/[^0-9]/g, '');
  
  // Nếu người dùng xóa sạch số đi, nhưng ban đầu họ có gõ chữ/ký tự đặc biệt -> Đánh dấu INVALID
  if (cleanValue === '') {
     if (rawValue.trim() !== '') return 'INVALID';
     return ''; 
  }
  return parseInt(cleanValue, 10);
};

const formatCurrency = (val) => val ? new Intl.NumberFormat('vi-VN').format(val) + ' đ' : '0 đ';

const parseDateBackend = (val) => {
  if (!val) return null;
  if (Array.isArray(val)) {
    return new Date(val[0], val[1] - 1, val[2], val[3] || 0, val[4] || 0, val[5] || 0);
  }
  return new Date(val);
};

const formatDate = (dateStr) => {
  const d = parseDateBackend(dateStr);
  if (!d || isNaN(d.getTime())) return '---';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

const formatDateTime = (dateStr) => {
  const d = parseDateBackend(dateStr);
  if (!d || isNaN(d.getTime())) return '---';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

// --- COMPUTED PROPERTIES: KIỂM TRA NGAY KHI NGƯỜI DÙNG GÕ ---
const donToiThieuDisplay = computed({
  get: () => formatCurrencyDisplay(form.donToiThieu),
  set: (val) => {
    form.donToiThieu = parseCurrencyInput(val);
    if (form.donToiThieu === 'INVALID') {
        errors.donToiThieu = 'Vui lòng chỉ nhập số hợp lệ.';
    } else {
        errors.donToiThieu = ''; 
    }
  }
});

const giaTriGiamDisplay = computed({
  get: () => formatCurrencyDisplay(form.giaTriGiam),
  set: (val) => {
    form.giaTriGiam = parseCurrencyInput(val);
    if (form.giaTriGiam === 'INVALID') {
        errors.giaTriGiam = 'Vui lòng chỉ nhập số hợp lệ.';
    } else {
        errors.giaTriGiam = ''; 
    }
  }
});

const giamToiDaDisplay = computed({
  get: () => formatCurrencyDisplay(form.giamToiDa),
  set: (val) => {
    form.giamToiDa = parseCurrencyInput(val);
    if (form.giamToiDa === 'INVALID') {
        errors.giamToiDa = 'Vui lòng chỉ nhập số hợp lệ.';
    } else {
        errors.giamToiDa = ''; 
    }
  }
});

// --- BIẾN TRẠNG THÁI ---
const isModalOpen = ref(false); 
const isEditMode = ref(false);
const apiBaseUrl = 'http://localhost:8080/api/phieu-giam-gia';
const vouchers = ref([]);
const filters = ref({ 
  keyword: '', loaiPhieu: null, trangThai: null, 
  tuNgay: '', denNgay: '', loaiGiamGia: null 
});
const pagination = ref({ page: 0, size: 10, totalElements: 0, totalPages: 0 });

const initialForm = {
  id: null, tenVoucher: '', soLuong: 0, ngayBatDau: '', ngayKetThuc: '', 
  loaiGiamGia: 1, giaTriGiam: 0, giamToiDa: 0, donToiThieu: 0, moTa: '', loaiPhieu: 1
};
const form = reactive({ ...initialForm });

// --- ĐỒNG BỘ SỐ LƯỢNG VÀ KHÁCH HÀNG CHỌN ---
const customers = ref([]);
const selectedCustomers = ref([]);
const searchCustomer = ref('');

watch(() => selectedCustomers.value, (newVal) => {
  if (form.loaiPhieu === 2) {
    form.soLuong = newVal.length;
    if (newVal.length > 0) errors.khachHang = ''; 
  }
}, { deep: true });

watch(() => form.loaiPhieu, (newVal) => {
  if (newVal === 2) {
    form.soLuong = selectedCustomers.value.length;
  } else {
    form.soLuong = 0; 
  }
});

watch(() => form.loaiGiamGia, (newVal) => {
  form.giaTriGiam = 0;
  errors.giaTriGiam = '';
  if (newVal === 2) { 
    form.giamToiDa = null; 
    errors.giamToiDa = '';
  }
});

watch(() => form.tenVoucher, () => errors.tenVoucher = '');
watch(() => form.soLuong, () => errors.soLuong = '');
watch(() => form.ngayBatDau, () => errors.ngayBatDau = '');
watch(() => form.ngayKetThuc, () => errors.ngayKetThuc = '');

const getStatusData = (item) => {
    if (item.trangThai === 0) {
        return { text: 'Ngừng hoạt động', class: 'badge-inactive' };
    }
    
    const now = new Date();
    const start = parseDateBackend(item.ngayBatDau);
    const end = parseDateBackend(item.ngayKetThuc);
    
    if (now > end) {
        return { text: 'Ngừng hoạt động', class: 'badge-inactive' };
    }
    if (now < start) {
        return { text: 'Sắp diễn ra', class: 'badge-upcoming' };
    }
    return { text: 'Đang hoạt động', class: 'badge-active' };
};
  
const fetchCustomers = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/dot-giam-gia/khach-hang');
    customers.value = res.data.content || res.data.data || res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách khách hàng:", error);
  }
};

const filteredCustomers = computed(() => {
  if (!searchCustomer.value) return customers.value;
  const keyword = searchCustomer.value.toLowerCase();
  return customers.value.filter(kh => 
    kh.maKhachHang.toLowerCase().includes(keyword) || 
    kh.hoTen.toLowerCase().includes(keyword) || 
    kh.soDienThoai.includes(keyword)
  );
});

const selectAllCustomers = (event) => {
  if (event.target.checked) {
    selectedCustomers.value = filteredCustomers.value.map(kh => kh.id);
  } else {
    selectedCustomers.value = [];
  }
};

const fetchVouchers = async () => {
  try {
    const params = { page: pagination.value.page, size: pagination.value.size };

    if (filters.value.keyword) params.keyword = filters.value.keyword;
    if (filters.value.loaiPhieu !== null && filters.value.loaiPhieu !== '') params.loaiPhieu = filters.value.loaiPhieu;
    if (filters.value.trangThai !== null && filters.value.trangThai !== '') params.trangThai = filters.value.trangThai;
    if (filters.value.loaiGiamGia !== null && filters.value.loaiGiamGia !== '') params.loaiGiamGia = filters.value.loaiGiamGia;
    
    if (filters.value.tuNgay) params.tuNgay = `${filters.value.tuNgay}T00:00:00`;
    if (filters.value.denNgay) params.denNgay = `${filters.value.denNgay}T23:59:59`;

    const res = await axios.get(apiBaseUrl, { params });
    vouchers.value = res.data.content;
    pagination.value.totalElements = res.data.totalElements;
    pagination.value.totalPages = res.data.totalPages;
    
  } catch (err) { 
    console.error("Lỗi lấy danh sách PGG:", err); 
  }
};

const resetFilter = () => {
  filters.value = { keyword: '', loaiPhieu: null, trangThai: null, tuNgay: '', denNgay: '', loaiGiamGia: null };
  applyFilter();
};

const isPastEndDate = (dateStr) => {
  const endDate = parseDateBackend(dateStr);
  if (!endDate) return false;
  const now = new Date();
  return now > endDate; 
};

const openModal = async (item) => {
  clearErrors(); 
  
  if (item) {
    isEditMode.value = true;
    Object.assign(form, item);
    if (form.ngayBatDau) form.ngayBatDau = form.ngayBatDau.substring(0, 16);
    if (form.ngayKetThuc) form.ngayKetThuc = form.ngayKetThuc.substring(0, 16);

    if (form.loaiPhieu === 2) {
      if (item.khachHangs && Array.isArray(item.khachHangs)) {
        selectedCustomers.value = item.khachHangs.map(kh => kh.id);
      } 
      else if (item.dggKhachHangs && Array.isArray(item.dggKhachHangs)) {
        selectedCustomers.value = item.dggKhachHangs.map(kh => kh.idKhachHang || kh.id);
      }
      else if (item.customerIds && Array.isArray(item.customerIds)) {
        selectedCustomers.value = [...item.customerIds];
      }
      else {
        selectedCustomers.value = [];
        console.warn("Backend chưa trả về danh sách khách hàng của phiếu này!");
      }
    } else {
      selectedCustomers.value = []; 
    }

  } else {
    isEditMode.value = false;
    Object.assign(form, initialForm);
    selectedCustomers.value = []; 
  }
  isModalOpen.value = true;
};

const applyFilter = () => { pagination.value.page = 0; fetchVouchers(); };
const changePage = (p) => { if (p >= 0 && p < pagination.value.totalPages) { pagination.value.page = p; fetchVouchers(); } };

onMounted(() => {
  fetchVouchers();
  fetchCustomers(); 
});
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #fcfaf8;
}
.form-control:focus,
.form-select:focus {
  border-color: #cbb3a1;
  box-shadow: 0 0 0 0.25rem rgba(203, 179, 161, 0.25);
}
.form-check-input:checked {
  background-color: #8c6b5d;
  border-color: #8c6b5d;
}
.cursor-pointer { 
  cursor: pointer; 
}
.border-dashed {
  border-style: dashed !important;
  border-width: 2px !important;
}
.animation-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  min-width: 140px; 
}

.badge-active {
  background-color: #ebf1fa; 
  color: #3b82f6; 
}

.badge-inactive {
  background-color: #fcebeb; 
  color: #d23f3f; 
}

.badge-upcoming {
  background-color: #fef3c7; 
  color: #b45309; 
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s ease;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(3px);
}

.confirm-modal-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.25s ease-out;
}

.confirm-icon-area {
  font-size: 45px;
  color: #8a6d5b;
  margin-bottom: 15px;
}

.confirm-title {
  font-weight: 700;
  color: #5a4031;
  margin-bottom: 10px;
}

.confirm-message {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 25px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel-custom {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel-custom:hover {
  background: #e2e8f0;
}

.btn-confirm-custom {
  background-color: #ebdcd0;
  color: #5a4031;
  border: 1px solid #cbb3a1;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-custom:hover {
  background-color: #dccbc0;
  transform: translateY(-1px);
}
</style>
