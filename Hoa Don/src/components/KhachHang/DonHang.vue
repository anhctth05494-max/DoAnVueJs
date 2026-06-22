<template>
  <div class="client-home" style="background-color: #f5f5f5 !important; min-height: 100vh; padding-bottom: 50px;">
    
    <div v-if="toast.show" class="position-fixed top-0 end-0 p-3" style="z-index: 2100; margin: 20px;">
      <div class="toast show align-items-center text-dark border-0 shadow-lg p-2 rounded-3 bg-white" role="alert">
        <div class="d-flex align-items-center gap-2">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-triangle-fill text-danger'" class="fs-5"></i>
          <div class="toast-body">
            <strong>{{ toast.title }}</strong>
            <div>{{ toast.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- HEADER ĐỒNG BỘ ACTIVE LINK -->
    <nav class="navbar navbar-expand-lg sticky-top py-3 bg-white shadow-sm" style="z-index: 1050;">
      <div class="container-fluid px-4 px-lg-5">
        <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
          <img src="/Logo.png" alt="Logo" style="height: 50px; object-fit: contain" />
        </router-link>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-5 text-center align-items-center justify-content-center">
            <li class="nav-item"><router-link to="/" class="nav-link fw-medium nav-text" exact-active-class="active-link">TRANG CHỦ</router-link></li>
            <li class="nav-item"><router-link to="/gioi-thieu" class="nav-link fw-medium nav-text" exact-active-class="active-link">GIỚI THIỆU</router-link></li>
            <li class="nav-item"><router-link to="/cua-hang" class="nav-link fw-medium nav-text" active-class="active-link">SẢN PHẨM</router-link></li>
            <li class="nav-item"><router-link to="/don-hang" class="nav-link fw-medium nav-text" active-class="active-link">ĐƠN HÀNG</router-link></li>
            <li class="nav-item"><router-link to="/tra-cuu" class="nav-link fw-medium nav-text" active-class="active-link">TRA CỨU</router-link></li>
            <li class="nav-item"><router-link to="/lien-he" class="nav-link fw-medium nav-text" exact-active-class="active-link">LIÊN HỆ</router-link></li>
          </ul>
          
          <div class="d-flex align-items-center justify-content-center gap-4 fs-5 nav-text mt-3 mt-lg-0">
            <div class="dropdown">
              <i class="bi bi-bell icon-btn position-relative" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer"></i>
              <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3 rounded-3 text-center custom-dropdown" style="background-color: #ffffff !important">
                <i class="bi bi-bell-slash fs-3 mb-2 d-block" style="color: #a07856"></i>
                <span class="small" style="color: #6f4d38">Không có thông báo mới</span>
              </div>
            </div>
            
            <div class="d-flex align-items-center">
              <i class="bi bi-bag position-relative" @click="router.push('/gio-hang')" style="cursor: pointer; font-size: 1.3rem; color: #6f4d38">
                <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background-color: #a82e3e; font-size: 0.65rem">
                  {{ cartCount }}
                </span>
              </i>
            </div>
            
            <div class="dropdown">
              <i class="bi bi-person-circle icon-btn" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer"></i>
              <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-4 rounded-3 text-center custom-dropdown" style="min-width: 220px; background-color: #ffffff !important">
                <div class="d-flex flex-column align-items-center mb-3">
                  <div class="rounded-circle d-flex align-items-center justify-content-center mb-2 bg-white" style="width: 55px; height: 55px; border: 1px solid #cbb799;">
                    <i class="bi bi-person fs-2" style="color: #6f4d38"></i>
                  </div>
                  <span class="fw-bold" style="color: #3d211a; font-size: 1.1rem">{{ currentUsername }}</span>
                </div>
                <button v-if="currentUsername === 'Guest'" class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-login" @click="router.push('/dang-nhap')">Đăng nhập</button>
                <button v-if="currentUsername === 'Guest'" class="btn w-100 btn-sm text-white rounded-1" style="background-color: #6f4d38" @click="router.push('/dang-ky')">Đăng ký</button>
                <button v-if="currentUsername !== 'Guest'" class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-logout" @click="handleLogout">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- CONTENT ĐƠN HÀNG -->
    <div class="container py-4" style="max-width: 1100px;">
      <div class="row g-4">
        
        <!-- SIDEBAR TRÁI -->
        <div class="col-lg-3">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-4 sticky-top" style="top: 100px;">
            <div class="d-flex flex-column align-items-center gap-2 pb-3 mb-3 border-bottom">
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-white border shadow-sm" style="width: 70px; height: 70px;">
                <i class="bi bi-person fs-1 text-secondary"></i>
              </div>
              <div class="fw-bold fs-5 text-dark text-truncate w-100 text-center">{{ currentUsername }}</div>
            </div>
            <ul class="list-unstyled mb-0 sidebar-menu">
              <li class="p-3 rounded-2 fw-bold cursor-pointer d-flex align-items-center gap-3 active-menu-item" @click="closeDetail">
                <i class="bi bi-file-earmark-text fs-5"></i> Đơn mua
              </li>
            </ul>
          </div>
        </div>

        <div class="col-lg-9">
          
          <!-- DANH SÁCH ĐƠN HÀNG -->
          <div v-if="!selectedOrderMaHD" class="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
            
            <!-- TABS TRẠNG THÁI -->
            <div class="d-flex align-items-center border-bottom text-nowrap overflow-x-auto bg-white sticky-tabs custom-scrollbar pb-1 pt-1">
              <button v-for="tab in statusTabs" :key="tab.id" @click="activeTab = tab.id"
                class="btn px-4 py-3 position-relative fw-medium rounded-0 tab-btn flex-shrink-0 border-0 shadow-none"
                :class="activeTab === tab.id ? 'active-tab' : 'text-secondary'">
                {{ tab.name }}
              </button>
            </div>

            <!-- RỖNG -->
            <div v-if="!filteredOrders || filteredOrders.length === 0" class="card-body p-5 text-center my-5 bg-white">
              <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712b96488590b8f781f.png" alt="Empty" style="width: 100px; opacity: 0.8;" class="mb-3">
              <div class="text-muted">Chưa có đơn hàng</div>
            </div>

            <!-- CÓ ĐƠN HÀNG -->
            <div v-else class="p-3 bg-transparent">
              <div v-for="order in filteredOrders" :key="order.id" class="card border-0 shadow-sm mb-3 rounded-3 overflow-hidden order-card">
                <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                  <div class="fw-bold text-dark">MÃ ĐƠN HÀNG: #{{ order.ma_hoa_don }}</div>
                  <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small border-end pe-2">{{ formatDate(order.ngay_tao) }}</span>
                    <span class="fw-bold text-uppercase" style="font-size: 0.85rem;" :class="order.trang_thai === 7 || order.trang_thai === 0 || order.trang_thai === 8 ? 'text-danger' : 'text-brown'">
                      {{ getStatusText(order.trang_thai) }}
                    </span>
                  </div>
                </div>

                <div class="card-body px-4 py-3 cursor-pointer" @click="openDetail(order.ma_hoa_don)">
                  <div class="d-flex gap-3 align-items-start">
                    <img :src="getProductImage(order.hinh_anh_dau)" 
                         @error="handleImageError"
                         class="border rounded object-fit-cover bg-light" style="width: 80px; height: 80px;">
                    <div class="flex-grow-1">
                      <div class="fw-medium text-dark fs-6">{{ order.ten_sp_dau || 'Sản phẩm áo dài' }}</div>
                      <div class="text-muted small mt-1" v-if="order.tong_so_luong > 1">
                        ...và {{ order.tong_so_luong - 1 }} sản phẩm khác
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card-footer bg-light bg-opacity-50 border-top py-3 px-4 d-flex justify-content-end align-items-center gap-4">
                  <div class="d-flex align-items-center gap-2">
                    <span class="text-dark">Thành tiền:</span>
                    <span class="fw-bold fs-5" style="color: #8c5a35;">{{ formatPrice(order.tong_tien_thanh_toan) }}</span>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-shopee px-4 py-2 rounded-2 shadow-none" @click="openDetail(order.ma_hoa_don)">Xem chi tiết</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CHI TIẾT ĐƠN HÀNG (BÊN TRONG) -->
          <div v-else class="card border-0 shadow-sm rounded-3 bg-white pb-4">
            
            <!-- HEADER CHI TIẾT -->
            <div class="p-3 border-bottom d-flex align-items-center justify-content-between bg-white sticky-top rounded-top-3" style="top: 80px; z-index: 1040; border-bottom: 2px solid #eaeaea !important;">
              <div class="d-flex align-items-center gap-2 cursor-pointer text-muted custom-back" @click="closeDetail">
                <i class="bi bi-chevron-left"></i> <span class="fw-medium">TRỞ LẠI</span>
              </div>
              <div class="d-flex align-items-center gap-3">
                <span class="text-dark">MÃ ĐƠN HÀNG: <strong>#{{ selectedOrderMaHD }}</strong></span>
                <span class="text-muted">|</span>
                <span class="text-uppercase fw-bold" :class="currentDetailStatus === 7 || currentDetailStatus === 0 || currentDetailStatus === 8 ? 'text-danger' : 'text-brown'">
                  {{ getStatusText(orderDetail.invoice?.trang_thai) }}
                </span>
              </div>
            </div>

            <!-- TIẾN TRÌNH TRẠNG THÁI -->
            <div class="p-4 border-bottom bg-white">
              <div class="timeline-wrapper position-relative mx-auto" style="max-width: 800px; padding: 20px 0;">
                
                <div v-if="currentDetailStatus !== 7 && currentDetailStatus !== 0 && currentDetailStatus !== 8" class="timeline-line"></div>
                
                <div class="d-flex position-relative z-1" :class="currentDetailStatus === 7 || currentDetailStatus === 0 || currentDetailStatus === 8 ? 'justify-content-center' : 'justify-content-between'">
                  
                  <div v-for="step in activeTimelineSteps" :key="step.step" class="timeline-step text-center">
                    <div class="step-icon mx-auto mb-2 d-flex align-items-center justify-content-center"
                         :class="{
                           'current-step': currentDetailStatus >= step.step && currentDetailStatus < 7,
                           'cancelled-step': step.step === 7 || step.step === 8,
                           'past-step': currentDetailStatus > step.step && currentDetailStatus < 7
                         }">
                      <div v-html="step.svg" class="d-flex align-items-center justify-content-center w-100 h-100" :style="(step.step === 7 || step.step === 8) ? 'color: #ffffff !important;' : ''"></div>
                    </div>
                    
                    <div class="step-label"
                         :class="{
                           'active-label': currentDetailStatus === step.step && currentDetailStatus < 7,
                           'past-label': currentDetailStatus > step.step && currentDetailStatus < 7,
                           'cancelled-label': step.step === 7 || step.step === 8,
                           'future-label': currentDetailStatus < step.step && currentDetailStatus < 7
                         }">
                      {{ step.label }}
                    </div>
                    
                    <div class="step-date mt-1" v-if="currentDetailStatus >= step.step && currentDetailStatus < 7" v-html="getHistoryDate(step.step)"></div>
                    <div class="step-date mt-1 text-danger fw-bold" v-if="step.step === 7 || step.step === 8" v-html="getHistoryDate(currentDetailStatus)"></div>
                  </div>

                </div>
              </div>
            </div>
            
            <!-- NÚT HỦY ĐƠN HÀNG -->
            <div class="px-4 py-3 d-flex justify-content-end bg-light bg-opacity-50 border-bottom" v-if="currentDetailStatus === 1">
              <button class="btn btn-outline-danger px-4 py-2 fw-medium rounded-2 shadow-none" @click="confirmCancelModal = true">
                <i class="bi bi-x-circle me-1"></i> Hủy Đơn Hàng
              </button>
            </div>

            <!-- NÚT HOÀN THÀNH / ĐÁNH GIÁ -->
            <div class="px-4 py-3 d-flex justify-content-start gap-3 bg-light bg-opacity-50 border-bottom" v-if="currentDetailStatus === 6">
              <button v-if="!isOrderReceived" class="btn btn-shopee px-4 py-2 fw-medium rounded-2 shadow-none" @click="confirmReceived" :disabled="isSavingRating">
                <span v-if="isSavingRating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đã nhận hàng
              </button>
              <button v-else class="btn btn-shopee px-4 py-2 fw-medium rounded-2 shadow-none" @click="openRatingModalFunc">
                {{ isOrderRated ? 'Xem đánh giá' : 'Đánh giá' }}
              </button>
              <button class="btn btn-outline-danger px-4 py-2 fw-medium rounded-2 shadow-none bg-white" @click="requestReturn">
                <i class="bi bi-arrow-return-left me-1"></i> Yêu cầu trả hàng
              </button>
            </div>

            <!-- THÔNG TIN NHẬN HÀNG (ĐƯỢC PHÉP SỬA KHI CHỜ XÁC NHẬN) -->
            <div class="p-4 border-bottom bg-white">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-dark m-0 text-uppercase">Địa Chỉ Nhận Hàng</h6>
                <button v-if="currentDetailStatus === 1 && !isEditingInfo" class="btn btn-sm text-primary fw-medium shadow-none" @click="startEditInfo">
                  <i class="bi bi-pencil me-1"></i> Sửa
                </button>
              </div>

              <div v-if="!isEditingInfo" class="d-flex flex-column gap-1 text-dark" style="font-size: 0.95rem;">
                <div class="fw-bold">{{ orderDetail.invoice?.ten_nguoi_nhan }} <span class="fw-normal text-muted ms-2">{{ orderDetail.invoice?.sdt_nguoi_nhan }}</span></div>
                <div class="text-muted">{{ orderDetail.invoice?.dia_chi_giao_hang }}</div>
              </div>

              <div v-else class="p-0 border-0 bg-white">
                <div class="text-danger small mb-3 fw-medium" v-if="!canEditAddress">
                  <i class="bi bi-info-circle me-1"></i> Đơn đã thanh toán trực tuyến. Bạn chỉ có thể cập nhật Tên và SĐT.
                </div>
                
                <div class="text-primary small mb-3 fw-medium" v-if="canEditAddress && selectedAddressId === null">
                  <i class="bi bi-info-circle me-1"></i> Đang hiển thị địa chỉ hiện tại của đơn hàng. Bạn có thể sửa trực tiếp bên dưới.
                </div>

                <div v-if="canEditAddress" class="mb-4 bg-light border border-secondary-subtle rounded-3 p-4">
                  <h6 class="fw-bold text-dark mb-3" style="font-size: 0.95rem;">Chọn địa chỉ đã lưu</h6>
                  <div class="d-flex flex-column gap-2">
                    
                    <div v-for="addr in userAddresses" :key="addr.id" 
                         class="address-card p-3 rounded-3 cursor-pointer bg-white"
                         :class="selectedAddressId === addr.id ? 'border-brown bg-brown-light' : 'border border-secondary-subtle'"
                         @click="handleAddressSelect(addr.id)">
                      <div class="d-flex align-items-start gap-3">
                        <input class="form-check-input mt-1 shadow-none cursor-pointer custom-radio" type="radio" :checked="selectedAddressId === addr.id">
                        <div>
                          <div class="fw-bold text-dark mb-1 d-flex align-items-center flex-wrap gap-2">
                            <span>{{ addr.ten_nguoi_nhan || addr.ho_ten || addr.hoTen || currentUsername }}</span>
                            <span v-if="addr.sdt_nguoi_nhan || addr.sdt || addr.soDienThoai" class="text-muted fw-normal mx-1">•</span>
                            <span>{{ addr.sdt_nguoi_nhan || addr.sdt || addr.soDienThoai }}</span>
                            <span v-if="addr.trang_thai === 1 || addr.laMacDinh || addr.macDinh" class="badge badge-default rounded-pill fw-normal px-2 ms-2">Mặc định</span>
                          </div>
                          <div class="text-muted small">{{ formatFullAddress(addr) }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="address-card p-3 rounded-3 cursor-pointer bg-white d-flex align-items-center gap-3"
                         :class="selectedAddressId === 'custom' ? 'border-brown bg-brown-light' : 'border border-secondary-subtle'"
                         @click="handleAddressSelect('custom')">
                      <input class="form-check-input shadow-none cursor-pointer m-0 custom-radio" type="radio" :checked="selectedAddressId === 'custom'">
                      <span class="text-dark fw-medium small">Nhập địa chỉ mới (Xóa trắng form)...</span>
                    </div>

                  </div>
                </div>

                <div class="row g-3 px-1 mt-2">
                  <div class="col-md-6">
                    <label class="form-label small text-muted fw-medium mb-1">Họ và tên người nhận <span class="text-danger">*</span></label>
                    <input type="text" class="form-control border-secondary-subtle shadow-none py-2" v-model="editForm.hoTen" placeholder="Nhập họ tên...">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small text-muted fw-medium mb-1">Số điện thoại <span class="text-danger">*</span></label>
                    <input type="text" class="form-control border-secondary-subtle shadow-none py-2" v-model="editForm.soDienThoai" placeholder="Nhập SĐT...">
                  </div>
                  
                  <template v-if="canEditAddress">
                    <div class="col-md-4">
                      <label class="form-label small text-muted fw-medium mb-1">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                      <select class="form-select border-secondary-subtle shadow-none py-2" v-model="selectedProvCode" @change="onProvinceChange">
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        <option v-for="p in provincesList" :key="p.code" :value="p.code">{{ p.name }}</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label small text-muted fw-medium mb-1">Quận/Huyện <span class="text-danger">*</span></label>
                      <select class="form-select border-secondary-subtle shadow-none py-2" v-model="selectedDistCode" @change="onDistrictChange" :disabled="!selectedProvCode">
                        <option value="">Chọn Quận/Huyện</option>
                        <option v-for="d in districtsList" :key="d.code" :value="d.code">{{ d.name }}</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label small text-muted fw-medium mb-1">Phường/Xã <span class="text-danger">*</span></label>
                      <select class="form-select border-secondary-subtle shadow-none py-2" v-model="selectedWardCode" @change="onWardChange" :disabled="!selectedDistCode">
                        <option value="">Chọn Phường/Xã</option>
                        <option v-for="w in wardsList" :key="w.code" :value="w.code">{{ w.name }}</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label small text-muted fw-medium mb-1">Địa chỉ cụ thể <span class="text-danger">*</span></label>
                      <input type="text" class="form-control border-secondary-subtle shadow-none py-2" v-model="editForm.diaChiChiTiet" placeholder="Số nhà, ngõ, đường...">
                    </div>
                  </template>
                </div>

                <div class="d-flex gap-2 justify-content-end mt-4 px-1">
                  <button class="btn btn-light px-4 border border-secondary-subtle rounded-2 shadow-none" @click="isEditingInfo = false">Hủy</button>
                  <button class="btn btn-shopee px-4 rounded-2 shadow-none" @click="saveEditedInfo" :disabled="isSaving">Lưu thay đổi</button>
                </div>
              </div>
            </div>

            <!-- DANH SÁCH SẢN PHẨM (ĐƯỢC PHÉP SỬA SỐ LƯỢNG) -->
            <div class="p-4 border-bottom bg-white">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-dark m-0 text-uppercase">Sản Phẩm</h6>
                <button v-if="currentDetailStatus === 1 && canEditAddress && !isEditingQty" class="btn btn-sm text-primary fw-medium shadow-none" @click="startEditQty">
                  <i class="bi bi-pencil me-1"></i> Sửa số lượng
                </button>
                <div v-if="isEditingQty" class="d-flex gap-2">
                  <button class="btn btn-sm btn-light border rounded-2 shadow-none" @click="cancelEditQty">Trở lại</button>
                  <button class="btn btn-sm btn-shopee px-3 rounded-2 shadow-none" @click="saveEditedQty" :disabled="isSaving">Lưu</button>
                </div>
              </div>

              <div class="text-danger small mb-3 bg-danger bg-opacity-10 p-2 rounded" v-if="isEditingQty">
                <i class="bi bi-exclamation-triangle me-1"></i> Giảm số lượng về 0 để bỏ sản phẩm. <strong>Đơn hàng bắt buộc phải giữ lại ít nhất 1 sản phẩm.</strong>
              </div>

              <div class="d-flex flex-column gap-3">
                <div v-for="(item, index) in draftDetails" :key="index" class="d-flex align-items-center justify-content-between pb-3 border-bottom border-light last-border-none">
                  <div class="d-flex gap-3 align-items-center">
                    <div class="border rounded bg-light overflow-hidden" style="width: 80px; height: 80px;">
                      <img :src="getProductImage(item.hinh_anh)" 
                           @error="handleImageError"
                           class="w-100 h-100 object-fit-cover">
                    </div>
                    <div>
                      <div class="fw-medium text-dark fs-6 mb-1 d-flex align-items-center flex-wrap gap-2">
                        {{ item.ten_san_pham }}
                        
                        <span class="d-flex align-items-center gap-1">
                          <template v-if="item.diem_danh_gia > 0">
                            <i v-for="s in 5" :key="'rated-'+s" class="bi" 
                               :class="s <= item.diem_danh_gia ? 'bi-star-fill text-warning' : 'bi-star text-muted opacity-50'" 
                               style="font-size: 0.8rem;"></i>
                          </template>
                          <template v-else>
                            <i v-for="s in 5" :key="'unrated-'+s" class="bi bi-star text-dark opacity-25" style="font-size: 0.8rem;"></i>
                          </template>
                        </span>
                        
                      </div>
                      <div class="text-muted small">Phân loại: {{ item.ten_mau }} - {{ item.ten_kich_co }}</div>
                      
                      <div v-if="!isEditingQty" class="text-dark mt-1 fw-medium">x{{ item.so_luong }}</div>
                      <div v-else class="d-flex align-items-center border rounded mt-2 bg-white" style="width: 100px; height: 32px;">
                        <button class="btn btn-sm text-dark px-2 py-0 border-0 shadow-none h-100" @click="decreaseQty(index)"><i class="bi bi-dash"></i></button>
                        <span class="flex-grow-1 text-center fw-medium small border-start border-end h-100 d-flex align-items-center justify-content-center">{{ item.so_luong }}</span>
                        <button class="btn btn-sm text-dark px-2 py-0 border-0 shadow-none h-100" @click="increaseQty(index)"><i class="bi bi-plus"></i></button>
                      </div>

                    </div>
                  </div>
                  <div class="text-end">
                    <div class="text-dark mb-1" v-if="!isEditingQty">{{ formatPrice(item.don_gia) }}</div>
                    <div class="fw-bold" style="color: #8c5a35;" v-if="!isEditingQty">{{ formatPrice(item.don_gia * item.so_luong) }}</div>
                    <div v-else class="fw-medium text-dark">{{ formatPrice(item.don_gia) }}</div>
                    <div v-if="item.so_luong === 0" class="badge bg-danger mt-1">Sẽ xóa</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TỔNG TIỀN VÀ THANH TOÁN (CẬP NHẬT FIX GIẢM GIÁ 0Đ) -->
            <div class="p-4 bg-light bg-opacity-50">
              <div class="row">
                <div class="col-md-7">
                  <div class="text-muted small mb-1">Phương thức thanh toán</div>
                  <div class="fw-medium text-dark">{{ orderDetail.invoice?.ten_pttt || 'Thanh toán khi nhận hàng (COD)' }}</div>
                </div>
                <div class="col-md-5">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Tổng tiền hàng</span>
                    <span class="text-dark small">{{ formatPrice(calculateTotalGoods()) }}</span>
                  </div>
                  
                  <!-- NẾU CÓ VOUCHER THÌ BẮT BUỘC PHẢI HIỆN -->
                  <div v-if="getExactDiscount() > 0" class="d-flex justify-content-between mb-2">
                    <span class="text-success small">Giảm giá (Voucher) <span class="fw-medium" v-if="orderDetail.invoice?.ma_voucher">[{{ orderDetail.invoice?.ma_voucher }}]</span></span>
                    <span class="text-success fw-bold small">- {{ formatPrice(getExactDiscount()) }}</span>
                  </div>
                  
                  <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                    <span class="text-muted small d-flex align-items-center gap-1">
                      Phí vận chuyển <img src="/logo_ghn.png" alt="GHN" style="height: 14px; margin-bottom: 2px;" />
                    </span>
                    <span class="text-dark small">+ {{ formatPrice(orderDetail.invoice?.phi_ship || orderDetail.invoice?.tien_ship) }}</span>
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted fw-medium">Thành tiền</span>
                    <span class="fw-bold fs-4" style="color: #8c5a35;">{{ formatPrice(orderDetail.invoice?.tong_tien_thanh_toan) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- LỊCH SỬ TÁC ĐỘNG -->
            <div class="p-4 border-bottom bg-white" v-if="orderHistory.length > 0">
              <h6 class="fw-bold text-dark mb-3 text-uppercase" style="font-size: 0.9rem;">
                <i class="bi bi-clock-history me-1"></i> Lịch sử tác động đơn hàng
              </h6>
              <div class="d-flex flex-column gap-2">
                <div v-for="log in orderHistory" :key="log.id" class="d-flex align-items-start gap-2" style="font-size: 0.85rem;">
                  <div style="width: 130px;" class="text-muted flex-shrink-0">
                    {{ formatDate(log.ngay_tao) }}
                  </div>
                  <div>
                    <span class="fw-medium" :class="log.nguoi_tao === 'Khách hàng' ? 'text-primary' : 'text-danger'">[{{ log.nguoi_tao }}]</span>
                    <span class="ms-1 fw-medium text-dark">
                      {{ log.ghi_chu }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- CÁC MODAL HỦY / ĐÁNH GIÁ -->
    <div v-if="confirmCancelModal" class="custom-modal-overlay" style="z-index: 1060;" @click.self="confirmCancelModal = false">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white p-4 text-center" style="max-width: 400px;">
        <div class="mx-auto mb-3" style="width: 64px; height: 64px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h5 class="fw-bold mb-3 text-danger" style="font-size: 1.1rem;">Xác Nhận Hủy Đơn Hàng</h5>
        <p class="text-muted mb-4" style="font-size: 0.9rem; line-height: 1.5;">Bạn có chắc chắn muốn hủy bỏ đơn hàng:<br><strong class="text-dark">[{{ selectedOrderMaHD }}]</strong> không?</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn rounded-pill fw-medium shadow-none" style="background-color: #e4e8ec; color: #6c757d; border: none; min-width: 110px; font-size: 0.9rem;" @click="confirmCancelModal = false">Đóng lại</button>
          <button class="btn btn-danger rounded-pill fw-medium shadow-none" style="min-width: 110px; font-size: 0.9rem;" @click="executeCancelOrder">Hủy đơn ngay</button>
        </div>
      </div>
    </div>

    <div v-if="showRatingModal" class="custom-modal-overlay" style="z-index: 1060;" @click.self="showRatingModal = false">
      <div class="custom-modal-content rounded-4 shadow-lg bg-white p-0 overflow-hidden d-flex flex-column" style="max-width: 650px; width: 95%; max-height: 85vh;">
        <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
          <h5 class="fw-bold m-0 text-dark">Đánh giá đơn hàng #{{ selectedOrderMaHD }}</h5>
          <button class="btn-close shadow-none" @click="showRatingModal = false"></button>
        </div>
        
        <div class="p-4 overflow-y-auto custom-scrollbar flex-grow-1 bg-light bg-opacity-50">
          <div v-for="(item, index) in draftDetails" :key="index" class="mb-4 pb-4 border-bottom border-light last-border-none bg-white p-3 rounded-3 shadow-sm">
            <div class="d-flex gap-3 align-items-center mb-3 pb-3 border-bottom border-light">
              <img :src="getProductImage(item.hinh_anh)" @error="handleImageError" class="border rounded object-fit-cover bg-light" style="width: 70px; height: 70px;">
              <div>
                <div class="fw-medium text-dark fs-6">{{ item.ten_san_pham }}</div>
                <div class="text-muted small mt-1">Phân loại: {{ item.ten_mau }} - {{ item.ten_kich_co }}</div>
              </div>
            </div>
            
            <div class="mb-3 d-flex align-items-center gap-3">
              <span class="fw-medium text-dark">Chất lượng sản phẩm:</span>
              <div class="d-flex gap-1 rating-stars">
                <i v-for="star in 5" :key="star" 
                   class="bi fs-3 transition-all" 
                   :class="[
                     star <= (ratingData[item.ma_sp]?.stars || 5) ? 'bi-star-fill text-warning' : 'bi-star text-muted opacity-50',
                     ratingData[item.ma_sp]?.isSubmitted ? '' : 'cursor-pointer'
                   ]"
                   @click="!ratingData[item.ma_sp]?.isSubmitted && setRating(item.ma_sp, star)"></i>
              </div>
            </div>
            
            <textarea class="form-control shadow-none border-secondary-subtle" 
                      :class="ratingData[item.ma_sp]?.isSubmitted ? 'bg-white text-muted' : 'bg-light'"
                      rows="3" 
                      placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé..." 
                      v-model="ratingData[item.ma_sp].comment"
                      :disabled="ratingData[item.ma_sp]?.isSubmitted"></textarea>
          </div>
        </div>
        
        <div class="p-3 border-top d-flex justify-content-end gap-2 bg-white mt-auto">
          <button class="btn btn-light px-4 rounded-2 shadow-none border" @click="showRatingModal = false">Trở lại</button>
          <button v-if="!isOrderRated" class="btn btn-shopee px-5 rounded-2 shadow-none" @click="submitRating" :disabled="isSavingRating">
            <span v-if="isSavingRating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Hoàn thành đánh giá
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartCount } from '../../store/cartStore.js' 
import axios from 'axios'

const router = useRouter()
const currentUsername = ref(localStorage.getItem('username') || sessionStorage.getItem('username') || 'Guest')
const isLoggedIn = computed(() => currentUsername.value && currentUsername.value !== 'Guest')
const BASE_URL = 'http://localhost:8080/api'

const confirmCancelModal = ref(false) 

const isSavingRating = ref(false)
const showRatingModal = ref(false)
const ratingData = ref({})

const isOrderReceived = computed(() => {
  return orderDetail.value.invoice?.da_nhan_hang === 1 || isOrderRated.value;
})

const isOrderRated = computed(() => {
  return Array.isArray(draftDetails.value) && draftDetails.value.some(item => item.diem_danh_gia && item.diem_danh_gia > 0);
})

const confirmReceived = async () => {
  isSavingRating.value = true;
  try {
    await axios.put(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/xac-nhan-nhan-hang`);
    showToast('Thành công', 'Cảm ơn bạn đã xác nhận nhận hàng!', 'success');
    await fetchOrderDetail(false);
  } catch (error) {
    showToast('Lỗi', 'Không thể xác nhận nhận hàng. Vui lòng thử lại!', 'danger');
  }
  isSavingRating.value = false;
}

const requestReturn = () => {
  showToast('Thông báo', 'Chức năng yêu cầu trả hàng đang được phát triển', 'info')
}

const openRatingModalFunc = () => {
  ratingData.value = {};
  draftDetails.value.forEach(item => {
    ratingData.value[item.ma_sp] = { 
      stars: item.diem_danh_gia || 5, 
      comment: item.nhan_xet || '', 
      isSubmitted: !!item.diem_danh_gia 
    };
  });
  showRatingModal.value = true;
}

const setRating = (ma_sp, star) => {
  if(ratingData.value[ma_sp]) {
    ratingData.value[ma_sp].stars = star;
  }
}

const submitRating = async () => {
  const payload = draftDetails.value.map(item => ({
    ma_sp: item.ma_sp,
    stars: ratingData.value[item.ma_sp]?.stars || 5,
    comment: ratingData.value[item.ma_sp]?.comment || ''
  }));

  isSavingRating.value = true;
  try {
    await axios.post(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/danh-gia`, payload);
    showToast('Thành công', 'Cảm ơn bạn đã gửi đánh giá!', 'success');
    showRatingModal.value = false;
    await fetchOrderDetail(false); 
  } catch (error) {
    showToast('Lỗi', 'Lưu đánh giá thất bại', 'danger');
  }
  isSavingRating.value = false;
}

const handleLogout = () => { 
  localStorage.removeItem('username')
  localStorage.removeItem('userRole')
  localStorage.removeItem('token')
  
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('token')
  
  currentUsername.value = 'Guest'
  cartCount.value = 0
  
  showToast('Đăng xuất thành công!', 'success')
  
  setTimeout(() => { 
    window.location.href = '/'
  }, 500)
}

const handleImageError = (e) => {
  e.target.src = '/Logo.png';
  e.target.style.objectFit = 'contain';
  e.target.classList.add('p-2');
}

const getProductImage = (imgName) => {
  if (!imgName || imgName === 'null' || imgName === 'undefined') return '/Logo.png';
  if (imgName.startsWith('http') || imgName.startsWith('data:')) return imgName;
  return `${BASE_URL}/sanpham-chitiet/images/${imgName}`;
}

const toast = ref({ show: false, message: '', type: 'success', title: '' })
let toastTimer = null; 

const showToast = (title, message, type = 'success') => {
  toast.value = { show: true, title, message, type }
  if (toastTimer) clearTimeout(toastTimer); 
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

const activeTab = ref('all')
const orders = ref([])

const statusTabs = [
  { id: 'all', name: 'Tất cả' }, 
  { id: 'pending', name: 'Chờ xác nhận' }, 
  { id: 'confirmed', name: 'Đã xác nhận' }, 
  { id: 'waiting_ship', name: 'Chờ giao hàng' },
  { id: 'shipping', name: 'Đang giao hàng' },
  { id: 'delivered', name: 'Đã giao hàng' },
  { id: 'completed', name: 'Hoàn thành' }, 
  { id: 'cancelled', name: 'Đã hủy' },
  { id: 'returned', name: 'Hoàn trả' }
]

const statusMap = { 
  1: 'pending', 2: 'confirmed', 3: 'waiting_ship', 4: 'shipping', 
  5: 'delivered', 6: 'completed', 7: 'cancelled', 0: 'cancelled', 8: 'returned' 
}

const fetchOrders = async (isSilent = false) => {
  if (currentUsername.value === 'Guest') {
    orders.value = [];
    return;
  }
  try {
    const timestamp = new Date().getTime();
    const res = await axios.get(`${BASE_URL}/hoadon/khach-hang/${currentUsername.value}?t=${timestamp}`)
    orders.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) { 
    console.error(e)
    if(!isSilent) orders.value = [] 
  }
}

const filteredOrders = computed(() => {
  const list = Array.isArray(orders.value) ? orders.value : [];
  if (activeTab.value === 'all') return list;
  return list.filter(o => (statusMap[o.trang_thai] || 'pending') === activeTab.value)
})

const getStatusText = (status) => {
  const m = { 1: 'Chờ xác nhận', 2: 'Đã xác nhận', 3: 'Chờ giao hàng', 4: 'Đang giao hàng', 5: 'Đã giao hàng', 6: 'Hoàn thành', 7: 'Đã hủy', 0: 'Đã hủy', 8: 'Hoàn trả' }
  return m[status] || 'Đang xử lý'
}

const selectedOrderMaHD = ref('')
const orderDetail = ref({ invoice: {}, details: [] })
const draftDetails = ref([])
const orderHistory = ref([])
let pollingInterval = null;

const openDetail = async (maHD) => {
  selectedOrderMaHD.value = maHD
  isEditingInfo.value = false
  isEditingQty.value = false
  await fetchOrderDetail(false) 
}

const closeDetail = () => {
  selectedOrderMaHD.value = ''
}

const fetchOrderDetail = async (isSilent = true) => {
  try {
    const timestamp = new Date().getTime();
    const res = await axios.get(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}?t=${timestamp}`)
    orderDetail.value = res.data || { invoice: {}, details: [] };
    
    orderHistory.value = res.data.history || [];
    
    let detailData = [];
    if (res.data && Array.isArray(res.data.details)) {
        detailData = res.data.details;
    }

    // NẾU ĐANG CHỈNH SỬA SỐ LƯỢNG THÌ KHÔNG GHI ĐÈ ĐỂ BẢO VỆ DỮ LIỆU ĐANG NHẬP
    if (!isEditingQty.value) {
        draftDetails.value = JSON.parse(JSON.stringify(detailData));
    }
  } catch (e) { 
    if (!isSilent) {
        showToast('Lỗi', 'Không tải được chi tiết đơn hàng', 'danger');
    }
  }
}

const currentDetailStatus = computed(() => Number(orderDetail.value.invoice?.trang_thai) || 1)
const isOnlineOrder = computed(() => {
  const diaChi = orderDetail.value.invoice?.dia_chi_giao_hang || '';
  return diaChi.trim() !== '';
})

const activeTimelineSteps = computed(() => {
  const status = currentDetailStatus.value;
  if (status === 7 || status === 0) {
    return [{ step: 7, label: 'Đã Hủy', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>` }];
  }
  if (status === 8) {
    return [{ step: 8, label: 'Đã Hoàn Trả', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>` }];
  }
  if (isOnlineOrder.value) {
    return [
      { step: 1, label: 'Chờ xác nhận', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h14M5 22h14M19 2v4c0 3.3-2.7 6-6 6M5 2v4c0 3.3 2.7 6 6 6M13 12c3.3 0 6 2.7 6 6v4M11 12c-3.3 0-6 2.7-6 6v4"/></svg>` },
      { step: 2, label: 'Đã xác nhận', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` },
      { step: 3, label: 'Chờ giao hàng', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>` },
      { step: 4, label: 'Đang giao hàng', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
      { step: 5, label: 'Đã giao hàng', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"></path><polyline points="1 3 23 3 23 8 1 8 1 3"></polyline><path d="M10 12l2 2 4-4"></path></svg>` },
      { step: 6, label: 'Hoàn thành', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>` }
    ];
  } else {
    return [
      { step: 1, label: 'Chờ xác nhận', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h14M5 22h14M19 2v4c0 3.3-2.7 6-6 6M5 2v4c0 3.3 2.7 6 6 6M13 12c3.3 0 6 2.7 6 6v4M11 12c-3.3 0-6 2.7-6 6v4"/></svg>` },
      { step: 6, label: 'Hoàn thành', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>` }
    ];
  }
})

// BÓC TÁCH THỜI GIAN THEO LỊCH SỬ THAO TÁC CỦA ADMIN
const getHistoryDate = (status) => {
  if (!orderDetail.value || !orderDetail.value.history) return '';
  const log = orderDetail.value.history.find(h => h.trang_thai === status);
  if (!log || !log.ngay_tao) return '';
  
  const d = new Date(log.ngay_tao);
  if (isNaN(d.getTime())) return '';
  
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  
  return `<span style="font-weight: 500; color: #4b5563;">${hh}:${mm}:${ss}</span><br><span style="font-size: 0.7rem; color: #9ca3af;">${dd}/${mo}/${yyyy}</span>`;
}

// LOGIC CẬP NHẬT THÔNG TIN VÀ SỐ LƯỢNG KHI CHỜ XÁC NHẬN
const isEditingInfo = ref(false)
const isSaving = ref(false)
const editForm = ref({ hoTen: '', soDienThoai: '', tinhThanh: '', quanHuyen: '', phuongXa: '', diaChiChiTiet: '' })
const userAddresses = ref([])
const selectedAddressId = ref('custom')

const provincesList = ref([])
const districtsList = ref([])
const wardsList = ref([])
const selectedProvCode = ref('')
const selectedDistCode = ref('')
const selectedWardCode = ref('')

const fetchProvinces = async () => {
  try {
    const res = await axios.get('https://provinces.open-api.vn/api/p/');
    provincesList.value = res.data;
  } catch (e) { console.error("Lỗi lấy danh sách tỉnh:", e); }
}

const onProvinceChange = async () => {
  selectedDistCode.value = '';
  selectedWardCode.value = '';
  districtsList.value = [];
  wardsList.value = [];
  editForm.value.tinhThanh = '';
  editForm.value.quanHuyen = '';
  editForm.value.phuongXa = '';

  if (!selectedProvCode.value) return;
  const p = provincesList.value.find(x => x.code === selectedProvCode.value);
  if (p) editForm.value.tinhThanh = p.name;
  try {
    const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvCode.value}?depth=2`);
    districtsList.value = res.data.districts;
  } catch (e) { console.error(e); }
}

const onDistrictChange = async () => {
  selectedWardCode.value = '';
  wardsList.value = [];
  editForm.value.quanHuyen = '';
  editForm.value.phuongXa = '';

  if (!selectedDistCode.value) return;
  const d = districtsList.value.find(x => x.code === selectedDistCode.value);
  if (d) editForm.value.quanHuyen = d.name;
  try {
    const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistCode.value}?depth=2`);
    wardsList.value = res.data.wards;
  } catch (e) { console.error(e); }
}

const onWardChange = () => {
  editForm.value.phuongXa = '';
  if (!selectedWardCode.value) return;
  const w = wardsList.value.find(x => x.code === selectedWardCode.value);
  if (w) editForm.value.phuongXa = w.name;
}

const autoFillCombos = async (tinhStr, quanStr, phuongStr) => {
  if (!tinhStr) return;
  const cleanText = (txt) => (txt||'').toLowerCase().replace(/(tỉnh|thành phố|quận|huyện|thị xã|phường|xã|thị trấn)/g, '').trim();
  const tClean = cleanText(tinhStr);
  
  const p = provincesList.value.find(x => cleanText(x.name) === tClean || cleanText(x.name).includes(tClean));
  if (p) {
    selectedProvCode.value = p.code;
    editForm.value.tinhThanh = p.name;
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`);
      districtsList.value = res.data.districts;
      if (quanStr) {
        const qClean = cleanText(quanStr);
        const d = districtsList.value.find(x => cleanText(x.name) === qClean || cleanText(x.name).includes(qClean));
        if (d) {
          selectedDistCode.value = d.code;
          editForm.value.quanHuyen = d.name;
          const resW = await axios.get(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`);
          wardsList.value = resW.data.wards;
          if (phuongStr) {
            const pClean = cleanText(phuongStr);
            const w = wardsList.value.find(x => cleanText(x.name) === pClean || cleanText(x.name).includes(pClean));
            if (w) {
              selectedWardCode.value = w.code;
              editForm.value.phuongXa = w.name;
            }
          }
        }
      }
    } catch (e) {}
  }
}

const canEditAddress = computed(() => {
  const isPaid = orderDetail.value.invoice?.trang_thai_thanh_toan === 1;
  const pttt = (orderDetail.value.invoice?.ten_pttt || '').toLowerCase();
  return !isPaid && !pttt.includes('chuyển khoản');
})

const formatFullAddress = (addr) => {
  const dc = addr.dia_chi_cu_the || addr.diaChiChiTiet || '';
  const px = addr.phuong_xa || addr.phuongXa || '';
  const qh = addr.quan_huyen || addr.quanHuyen || '';
  const tt = addr.tinh_thanh || addr.tinhThanh || '';
  const parts = [dc, px, qh, tt].filter(Boolean);
  return parts.join(', ');
}

const normalizeAddress = (str) => {
  if (!str) return '';
  return String(str).toLowerCase().replace(/[\s,.-]/g, '');
}

const fetchUserAddresses = async () => {
  try {
    if(currentUsername.value && currentUsername.value !== 'Guest') {
      const res = await axios.get(`${BASE_URL}/hoadon/dia-chi-khach-hang/${currentUsername.value}`);
      if(res.data && res.data.length > 0) {
        userAddresses.value = res.data;
      } else {
        throw new Error("Không có địa chỉ");
      }
    } else {
      throw new Error("Khách vãng lai");
    }
  } catch(e) {
    userAddresses.value = [];
  }
}

const startEditInfo = async () => {
  isEditingInfo.value = true;
  await fetchProvinces(); 
  await fetchUserAddresses();

  selectedProvCode.value = '';
  selectedDistCode.value = '';
  selectedWardCode.value = '';
  districtsList.value = [];
  wardsList.value = [];

  const currentTen = orderDetail.value.invoice.ten_nguoi_nhan || '';
  const currentSdt = orderDetail.value.invoice.sdt_nguoi_nhan || '';
  const currentDiaChi = orderDetail.value.invoice.dia_chi_giao_hang || '';

  const currentAddrNorm = normalizeAddress(currentDiaChi);
  const currentSdtNorm = normalizeAddress(currentSdt);

  const matchedAddr = userAddresses.value.find(a => {
     const aAddrNorm = normalizeAddress(formatFullAddress(a));
     const aSdtNorm = normalizeAddress(a.soDienThoai || a.sdt || a.sdt_nguoi_nhan);
     return aSdtNorm === currentSdtNorm && aAddrNorm === currentAddrNorm;
  });

  if (matchedAddr) {
    selectedAddressId.value = matchedAddr.id;
    editForm.value = {
       hoTen: matchedAddr.hoTen || matchedAddr.ten_nguoi_nhan || matchedAddr.ho_ten,
       soDienThoai: matchedAddr.soDienThoai || matchedAddr.sdt || matchedAddr.sdt_nguoi_nhan,
       tinhThanh: matchedAddr.tinhThanh || matchedAddr.tinh_thanh,
       quanHuyen: matchedAddr.quanHuyen || matchedAddr.quan_huyen,
       phuongXa: matchedAddr.phuongXa || matchedAddr.phuong_xa,
       diaChiChiTiet: matchedAddr.diaChiChiTiet || matchedAddr.dia_chi_cu_the
    };
    autoFillCombos(editForm.value.tinhThanh, editForm.value.quanHuyen, editForm.value.phuongXa);
  } else {
    selectedAddressId.value = null;
    const parts = currentDiaChi.split(',').map(p => p.trim());
    if (parts.length >= 4) {
       editForm.value = {
         hoTen: currentTen, soDienThoai: currentSdt,
         tinhThanh: parts[parts.length - 1] || '',
         quanHuyen: parts[parts.length - 2] || '',
         phuongXa: parts[parts.length - 3] || '',
         diaChiChiTiet: parts.slice(0, parts.length - 3).join(', ') || ''
       }
       autoFillCombos(editForm.value.tinhThanh, editForm.value.quanHuyen, editForm.value.phuongXa);
    } else {
       editForm.value = { hoTen: currentTen, soDienThoai: currentSdt, tinhThanh: '', quanHuyen: '', phuongXa: '', diaChiChiTiet: currentDiaChi }
    }
  }
}

const handleAddressSelect = (id) => {
  selectedAddressId.value = id;
  selectedProvCode.value = '';
  selectedDistCode.value = '';
  selectedWardCode.value = '';
  districtsList.value = [];
  wardsList.value = [];

  if (id !== 'custom') {
    const addr = userAddresses.value.find(a => a.id === id);
    if (addr) {
      editForm.value = {
        hoTen: addr.hoTen || addr.ho_ten || addr.ten_nguoi_nhan,
        soDienThoai: addr.soDienThoai || addr.sdt || addr.sdt_nguoi_nhan,
        tinhThanh: addr.tinhThanh || addr.tinh_thanh || '',
        quanHuyen: addr.quanHuyen || addr.quan_huyen || '',
        phuongXa: addr.phuongXa || addr.phuong_xa || '',
        diaChiChiTiet: addr.diaChiChiTiet || addr.dia_chi_cu_the || ''
      };
      autoFillCombos(editForm.value.tinhThanh, editForm.value.quanHuyen, editForm.value.phuongXa);
    }
  } else {
    editForm.value = { hoTen: '', soDienThoai: '', tinhThanh: '', quanHuyen: '', phuongXa: '', diaChiChiTiet: '' };
  }
}

const saveEditedInfo = async () => {
  const combinedAddress = [editForm.value.diaChiChiTiet, editForm.value.phuongXa, editForm.value.quanHuyen, editForm.value.tinhThanh].filter(Boolean).join(', ');

  if(!editForm.value.hoTen || !editForm.value.soDienThoai || (canEditAddress.value && (!combinedAddress || !selectedWardCode.value))) {
    showToast('Cảnh báo', 'Vui lòng điền đầy đủ Tên, SĐT và chọn Tỉnh/Quận/Phường!', 'danger'); return;
  }
  isSaving.value = true;
  try {
    await axios.put(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/thong-tin`, {
      ten_nguoi_nhan: editForm.value.hoTen,
      sdt_nguoi_nhan: editForm.value.soDienThoai,
      dia_chi_giao_hang: canEditAddress.value ? combinedAddress : undefined,
      
      luu_so_dia_chi: selectedAddressId.value === 'custom' || selectedAddressId.value === null,
      tinh_thanh: editForm.value.tinhThanh,
      quan_huyen: editForm.value.quanHuyen,
      phuong_xa: editForm.value.phuongXa,
      dia_chi_cu_the: editForm.value.diaChiChiTiet
    });
    
    showToast('Thành công', 'Cập nhật thông tin giao hàng thành công', 'success');
    isEditingInfo.value = false;
    
    await fetchOrderDetail(false);
    if (selectedAddressId.value === 'custom' || selectedAddressId.value === null) {
       await fetchUserAddresses(); 
    }
  } catch(e) {
    showToast('Lỗi', 'Không thể lưu thông tin', 'danger');
  }
  isSaving.value = false;
}

const isEditingQty = ref(false)

const startEditQty = () => {
  draftDetails.value = JSON.parse(JSON.stringify(orderDetail.value.details));
  isEditingQty.value = true;
}

const cancelEditQty = () => {
  isEditingQty.value = false;
  fetchOrderDetail(false);
}

const increaseQty = (idx) => { draftDetails.value[idx].so_luong++; }
const decreaseQty = (idx) => { 
  if(draftDetails.value[idx].so_luong > 0) {
     const currentTotal = draftDetails.value.reduce((sum, item) => sum + item.so_luong, 0);
     if (currentTotal <= 1) {
         showToast('Cảnh báo', 'Đơn hàng bắt buộc phải có ít nhất 1 sản phẩm. Để hủy toàn bộ, vui lòng dùng nút Hủy Đơn Hàng.', 'danger');
         return;
     }
     draftDetails.value[idx].so_luong--; 
  }
}

const saveEditedQty = async () => {
  const totalItemsLeft = draftDetails.value.reduce((sum, item) => sum + item.so_luong, 0);
  if(totalItemsLeft === 0) {
    showToast('Cảnh báo', 'Đơn rỗng. Hãy dùng nút Hủy Đơn Hàng!', 'danger'); return;
  }

  isSaving.value = true;
  try {
    for (let i = 0; i < draftDetails.value.length; i++) {
      const draft = draftDetails.value[i];
      const original = orderDetail.value.details[i];

      if (draft.so_luong === 0) {
        await axios.delete(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/sanpham/${draft.ma_sp}`);
      } else if (draft.so_luong !== original.so_luong) {
        await axios.post(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/sanpham`, {
          ma_sp: draft.ma_sp,
          so_luong: draft.so_luong,
          don_gia: draft.don_gia
        });
      }
    }
    showToast('Thành công', 'Cập nhật số lượng sản phẩm thành công', 'success');
    isEditingQty.value = false;
    await fetchOrderDetail(false);
    await fetchOrders(); 
  } catch(e) {
    showToast('Lỗi', e.response?.data?.message || 'Cập nhật thất bại do kho không đủ', 'danger')
  }
  isSaving.value = false;
}

const executeCancelOrder = async () => {
  try {
    await axios.put(`${BASE_URL}/hoadon/${selectedOrderMaHD.value}/status`, { trang_thai: 7, ly_do_huy: "Khách hàng yêu cầu hủy" })
    showToast('Thành công', 'Hủy đơn hàng thành công', 'success')
    confirmCancelModal.value = false;
    fetchOrderDetail(false);
    fetchOrders(true);
  } catch(e) { 
    showToast('Lỗi', 'Không thể hủy đơn', 'danger');
    confirmCancelModal.value = false;
  }
}

const calculateTotalGoods = () => {
  if (!orderDetail.value.details) return 0;
  return orderDetail.value.details.reduce((sum, item) => sum + (item.so_luong * item.don_gia), 0)
}

// FIX: LẤY TIỀN GIẢM GIÁ 100% CHUẨN XÁC BẰNG CÁCH DỊCH NGƯỢC
const getExactDiscount = () => {
  if (!orderDetail.value.invoice) return 0;
  
  const detailsTotal = calculateTotalGoods();
  const ship = orderDetail.value.invoice.phi_ship || orderDetail.value.invoice.tien_ship || 0;
  const finalTotal = orderDetail.value.invoice.tong_tien_thanh_toan || 0;
  
  let calcDiscount = (detailsTotal + ship) - finalTotal;
  
  // Back up db
  if (calcDiscount < 0) calcDiscount = 0;
  const dbDiscount = orderDetail.value.invoice.tien_giam_gia || orderDetail.value.invoice.giam_gia || 0;
  
  return calcDiscount > 0 ? calcDiscount : dbDiscount;
}

const formatPrice = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0).replace('₫', 'đ')

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')} ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

onMounted(() => { 
  fetchOrders() 
  // RADAR QUÉT REAL-TIME
  pollingInterval = setInterval(() => {
    if (selectedOrderMaHD.value) {
      fetchOrderDetail(true); 
    } else {
      fetchOrders(true);
    }
  }, 3000);
})

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer);
  if (pollingInterval) clearInterval(pollingInterval);
})
</script>

<style scoped>
.client-home { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.cursor-pointer { cursor: pointer; }

/* CSS Menu Active Link Thông Minh */
.nav-text { 
  color: #6f4d38 !important; 
  font-size: 1rem; 
  text-transform: uppercase; 
  transition: all 0.3s ease; 
  padding: 10px 0 !important; 
  position: relative; 
  display: inline-block; 
  border-bottom: 2px solid transparent; 
}
.nav-text:hover, .active-link { 
  color: #3d211a !important; 
  font-weight: 700 !important; 
  border-bottom: 2px solid #3d211a !important; 
}
.custom-dropdown { border-top: 3px solid #6f4d38 !important; }
.btn-main-brown { background-color: #3d211a; border: 1px solid #3d211a; color: white; transition: all 0.3s; }
.btn-main-brown:hover { background-color: #523b2e; border-color: #523b2e; color: white; }

.sidebar-menu li:hover { background-color: #ebebeb; }
.active-menu-item { background-color: #f9f5f2; color: #8c5a35; border: 1px solid #ebdcd0; }

.sticky-tabs { position: sticky; top: 0; z-index: 10; overflow-y: hidden; }
.tab-btn { 
  color: #6c757d; 
  background: transparent;
  border: none !important; 
  border-bottom: 2px solid transparent !important; 
  transition: all 0.2s; 
  white-space: nowrap; 
}
.tab-btn:focus, .tab-btn:active {
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
}
.tab-btn:hover { color: #8c5a35; }
.active-tab { 
  color: #8c5a35 !important; 
  border-bottom: 2px solid #8c5a35 !important; 
  font-weight: 700 !important;
}

.custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbb8ac; border-radius: 4px; border: 1px solid #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a67c52; }

.btn-shopee { background-color: #8c5a35; color: white; border: none; transition: 0.2s; }
.btn-shopee:hover { background-color: #6a4428; color: white; }
.btn-outline-shopee { background-color: transparent; border: 1px solid #8c5a35; color: #8c5a35; transition: 0.2s; }
.btn-outline-shopee:hover { background-color: #f9f5f2; color: #8c5a35; }

/* Timeline CSS Mới Đồng Bộ Từ Tra Cứu */
.timeline-wrapper { position: relative; }
.timeline-line { position: absolute; top: 38px; left: 8%; right: 8%; height: 3px; background-color: #e5e7eb; z-index: 0; }
.timeline-step { position: relative; flex: 1; max-width: 95px; }

.step-icon { 
  width: 48px; 
  height: 48px; 
  border-radius: 50%; 
  background-color: #e9ecef; 
  color: #adb5bd; 
  position: relative; 
  z-index: 2; 
  transition: all 0.3s ease; 
}

.step-icon.current-step { background-color: #198754; color: #fff; box-shadow: 0 0 0 4px rgba(25, 135, 84, 0.2); }
.step-icon.cancelled-step { background-color: #dc3545; color: #ffffff !important; transform: scale(1.15); box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.2); }
.step-label.cancelled-label { color: #dc3545; font-weight: bold; }
.step-icon.past-step { background-color: #198754; color: #fff; }

.step-label { font-size: 0.85rem; margin-top: 8px; transition: color 0.3s ease; }
.step-label.active-label { color: #198754; font-weight: 600; }
.step-label.past-label { color: #198754; font-weight: 500; }
.step-label.future-label { color: #9ca3af; }

.step-date { font-size: 0.75rem; color: #9ca3af; white-space: pre-line; line-height: 1.2; }
.text-brown { color: #8c5a35 !important; }

.custom-back:hover { color: #8c5a35 !important; }
.last-border-none:last-child { border-bottom: none !important; padding-bottom: 0 !important; margin-bottom: 0 !important; }

.custom-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center;
}
.custom-modal-content {
  width: 100%; animation: modalFadeIn 0.25s ease-out;
}
@keyframes modalFadeIn {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.rating-stars i:not(.opacity-50):hover { transform: scale(1.15); }
.transition-all { transition: all 0.2s ease; }
</style>