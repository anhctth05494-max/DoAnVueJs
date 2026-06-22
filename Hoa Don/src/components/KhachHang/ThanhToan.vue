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

    <div class="container py-5">
      <h2 class="fw-bold mb-4" style="color: #3d211a; font-size: 2rem;">Thanh toán</h2>

      <div v-if="checkoutItems.length === 0" class="text-center bg-white p-5 rounded-3 shadow-sm mx-auto" style="max-width: 600px;">
        <i class="bi bi-bag-x fs-1 text-muted mb-3"></i>
        <h5 class="fw-bold text-dark">Bạn chưa chọn sản phẩm nào để thanh toán</h5>
        <button class="btn btn-main-brown mt-3 px-4 py-2" @click="router.push('/gio-hang')">Quay lại Giỏ hàng</button>
      </div>

      <div v-else class="row g-4">
        
        <div class="col-lg-7 col-xl-8">
          
          <div class="card border-0 shadow-sm p-4 rounded-3 mb-4 bg-white" v-if="isLoggedIn">
            
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold m-0" style="color: #3d211a;">Chọn địa chỉ đã lưu</h6>
              <span class="small text-primary fw-medium" style="cursor: pointer;" @click="fetchAddresses(false)">
                <i class="bi bi-arrow-clockwise"></i> Cập nhật
              </span>
            </div>
            
            <div v-if="savedAddresses.length > 0" class="d-flex flex-column gap-3">
              <div v-for="addr in savedAddresses" :key="addr.id" 
                   class="address-card p-3 border rounded-2 position-relative"
                   :class="{'border-brown bg-light-brown': selectedAddressId === addr.id}"
                   @click="selectSavedAddress(addr)">
                <div class="form-check m-0 d-flex align-items-start gap-2">
                  <input class="form-check-input custom-radio mt-1" type="radio" :value="addr.id" v-model="selectedAddressId">
                  <label class="form-check-label w-100" style="cursor: pointer;">
                    
                    <div class="d-flex justify-content-start align-items-center gap-2 mb-1">
                      <span class="fw-bold text-dark small">
                        {{ addr.hoTen }} 
                        <span v-if="addr.soDienThoai"> • {{ addr.soDienThoai }}</span>
                      </span>
                      <span v-if="addr.macDinh" class="badge bg-success bg-opacity-10 text-success border border-success" style="font-size: 0.65rem;">Mặc định</span>
                    </div>

                    <div class="text-muted small">{{ addr.diaChiChiTiet }}, {{ addr.phuongXa }}, {{ addr.quanHuyen }}, {{ addr.tinhThanh }}</div>
                  </label>
                </div>
              </div>
              
              <div class="form-check mt-1 ms-1 d-flex align-items-center gap-2" @click="resetAddressForm">
                <input class="form-check-input custom-radio m-0" type="radio" value="NEW" v-model="selectedAddressId">
                <label class="form-check-label small text-muted fw-bold" style="cursor: pointer; color: #a82e3e !important;">+ Giao đến địa chỉ khác...</label>
              </div>
            </div>
            
            <div v-else class="alert alert-light border small text-muted mb-0">
              <i class="bi bi-info-circle me-1"></i> Tài khoản của bạn chưa lưu địa chỉ nào. Vui lòng nhập thông tin giao hàng bên dưới!
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 rounded-3 mb-4 bg-white">
            <h6 class="fw-bold mb-4" style="color: #3d211a;">Thông tin người nhận</h6>
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label small fw-medium">Họ và tên người nhận <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.hoTen" placeholder="Nhập họ tên">
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-medium">Số điện thoại <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.soDienThoai" placeholder="Nhập số điện thoại">
              </div>
              
              <div class="col-12">
                <label class="form-label small fw-medium">Email <span class="text-danger">*</span> <span class="text-muted fw-normal fst-italic">(Dùng để nhận hóa đơn và tra cứu đơn)</span></label>
                <input type="email" class="form-control shadow-none" v-model="form.email" placeholder="Nhập địa chỉ email của bạn">
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-medium">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                <select class="form-select shadow-none" v-model="selectedProvinceCode" @change="onProvinceChange">
                  <option value="" disabled>Chọn Tỉnh/Thành phố</option>
                  <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-medium">Quận/Huyện <span class="text-danger">*</span></label>
                <select class="form-select shadow-none" v-model="selectedDistrictCode" @change="onDistrictChange" :disabled="!selectedProvinceCode">
                  <option value="" disabled>Chọn Quận/Huyện</option>
                  <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-medium">Phường/Xã <span class="text-danger">*</span></label>
                <select class="form-select shadow-none" v-model="selectedWardCode" @change="onWardChange" :disabled="!selectedDistrictCode">
                  <option value="" disabled>Chọn Phường/Xã</option>
                  <option v-for="w in wards" :key="w.code" :value="w.code">{{ w.name }}</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label small fw-medium">Địa chỉ cụ thể <span class="text-danger">*</span></label>
                <input type="text" class="form-control shadow-none" v-model="form.diaChiChiTiet" placeholder="Số nhà, ngõ, ngách, đường...">
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-light rounded-2 small text-muted d-flex align-items-center gap-2">
              <span class="fw-medium text-dark">Giao đến:</span>
              <span v-if="fullAddressString">{{ fullAddressString }}</span>
              <span v-else class="fst-italic">Vui lòng điền đầy đủ địa chỉ...</span>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 rounded-3 bg-white mb-4">
            <h6 class="fw-bold mb-3" style="color: #3d211a;">Phương thức thanh toán <span class="text-danger">*</span></h6>
            <div class="d-flex flex-column gap-3">
              
              <label class="payment-method border p-3 rounded-2 d-flex align-items-center gap-3" :class="{'border-brown bg-light-brown': paymentMethod === 'COD'}">
                <input type="radio" class="form-check-input custom-radio m-0" value="COD" v-model="paymentMethod">
                <div>
                  <div class="fw-bold text-dark small">Thanh toán khi nhận hàng (COD)</div>
                  <div class="text-muted" style="font-size: 0.75rem;">Khách hàng thanh toán bằng tiền mặt khi shipper giao hàng tới.</div>
                </div>
              </label>
              
              <label class="payment-method border p-3 rounded-2 d-flex align-items-center gap-3" :class="{'border-brown bg-light-brown': paymentMethod === 'TRANSFER'}">
                <input type="radio" class="form-check-input custom-radio m-0" value="TRANSFER" v-model="paymentMethod">
                <div>
                  <div class="fw-bold text-dark small">Chuyển khoản thủ công</div>
                  <div class="text-muted" style="font-size: 0.75rem;">Khách tự chuyển khoản bằng App Ngân hàng. Kế toán sẽ xác nhận thủ công.</div>
                </div>
              </label>

              <label class="payment-method border p-3 rounded-2 d-flex align-items-center gap-3" :class="{'border-brown bg-light-brown': paymentMethod === 'VNPAY'}">
                <input type="radio" class="form-check-input custom-radio m-0" value="VNPAY" v-model="paymentMethod">
                <div>
                  <div class="fw-bold text-dark small">Thanh toán qua VNPAY</div>
                  <div class="text-muted" style="font-size: 0.75rem;">Hệ thống cổng thanh toán VNPAY quét mã tự động duyệt đơn (IPN).</div>
                </div>
              </label>

            </div>
          </div>

        </div>

        <div class="col-lg-5 col-xl-4">
          <div class="card border-0 shadow-sm p-4 rounded-3 bg-white sticky-top" style="top: 100px;">
            
            <h6 class="fw-bold mb-3 border-bottom pb-3" style="color: #3d211a;">Đơn hàng ({{ checkoutItems.length }} sản phẩm)</h6>
            
            <div class="d-flex flex-column gap-3 mb-4 max-height-cart overflow-auto pt-2 pe-3 custom-scrollbar">
              <div v-for="(item, index) in checkoutItems" :key="index" class="d-flex gap-3 align-items-center">
                <div class="position-relative ms-1" style="min-width: 55px;">
                  <img :src="item.image" class="rounded border object-fit-cover bg-light" style="width: 55px; height: 70px;">
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary border border-white" style="font-size: 0.65rem; z-index: 2;">
                    {{ item.quantity }}
                  </span>
                </div>
                <div class="flex-grow-1 ps-2">
                  <div class="fw-bold text-dark" style="font-size: 0.85rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    {{ item.name }}
                  </div>
                  <div class="text-muted mt-1" style="font-size: 0.7rem;">Size: {{ item.size }} <span v-if="item.color">| Màu: {{ item.color }}</span></div>
                </div>
                <div class="fw-bold text-dark text-end" style="font-size: 0.85rem; white-space: nowrap;">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div class="mb-4 position-relative" v-if="isLoggedIn">
              <div class="d-flex justify-content-between align-items-center mb-2">
                 <label class="fw-bold small text-dark text-uppercase m-0"><i class="bi bi-ticket-perforated me-1"></i> Mã giảm giá</label>
              </div>

              <div v-if="bestVoucher && !errorVoucher && (!appliedVoucher || extraSaving > 0)"
                   class="mb-3 p-3 rounded-3 d-flex justify-content-between align-items-center animate__animated animate__fadeIn"
                   style="background-color: #fffcf2; border: 1px dashed #ffc107;">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-stars fs-3" style="color: #ff9800;"></i>
                  <div>
                    <div class="fw-bold text-dark" style="font-size: 0.95rem;">
                      Có mã <span style="color: #d32f2f;">{{ bestVoucher.maVoucher }}</span> tốt {{ appliedVoucher ? 'hơn' : 'nhất' }}!
                    </div>
                    <div class="text-muted" style="font-size: 0.85rem;">
                      Tiết kiệm {{ appliedVoucher ? 'thêm' : 'được' }} <span style="color: #d32f2f; font-weight: bold;">{{ formatPrice(extraSaving > 0 ? extraSaving : previewDiscount(bestVoucher)) }}</span>
                    </div>
                  </div>
                </div>
                <button class="btn btn-sm fw-bold shadow-none" style="background-color: #ffc107; color: #212529; border-radius: 50px; padding: 6px 16px;" @click="autoSuggestBestVoucher">
                  Dùng ngay
                </button>
              </div>

              <div v-if="errorVoucher" class="mb-3 animate__animated animate__shakeX">
                <div class="rounded-top-3 p-3 position-relative" style="background-color: #ffe5e5; border: 1px solid #ffcccc; border-bottom: 1px dashed #ff9999;">
                  <i class="bi bi-x-circle-fill position-absolute text-danger" style="top: -10px; right: -10px; font-size: 1.5rem; cursor: pointer; background: white; border-radius: 50%;" @click="clearErrorVoucher"></i>
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-danger rounded-1 px-2 py-1">Mã</span>
                    <span class="fw-bold text-danger fs-6">[{{ errorVoucher.maVoucher }}]</span>
                  </div>
                  <div class="d-flex justify-content-between text-muted small">
                    <div><span class="text-danger fw-bold">Giảm: {{ errorVoucher.phanTramGiam ? errorVoucher.phanTramGiam + '%' : formatPrice(errorVoucher.giamToiDa) }}</span></div>
                    <div>Đơn tối thiểu: {{ formatPrice(errorVoucher.dieuKienToiThieu) }}</div>
                  </div>
                </div>
                <div class="rounded-bottom-3 p-2 d-flex justify-content-between align-items-center" style="background-color: #dc3545;">
                  <div class="text-white small fw-medium"><i class="bi bi-exclamation-triangle-fill me-1"></i> Voucher đã bị xóa hoặc hết lượt!</div>
                  <button class="btn btn-sm bg-white text-danger fw-bold px-3 py-1 shadow-none" style="border-radius: 4px;" @click="clearErrorVoucher">Xóa mã này</button>
                </div>
              </div>

              <div v-if="appliedVoucher && !errorVoucher" class="p-3 border rounded-3 position-relative mb-3 animate__animated animate__fadeIn" style="background-color: #f0fdf4; border-color: #c3e6cb !important;">
                 <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="badge bg-success me-2 rounded-1">Đã áp dụng</span>
                      <span class="fw-bold text-success fs-6">{{ appliedVoucher.maVoucher }}</span>
                      <div class="text-success small mt-1">Đã giảm {{ formatPrice(discountAmount) }} cho đơn hàng</div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger shadow-none px-3" @click="removeVoucher">Xóa</button>
                 </div>
              </div>

              <div v-if="!appliedVoucher && !errorVoucher" class="position-relative" v-click-outside="() => showVoucherList = false">
                <div class="input-group">
                  <input type="text" 
                         class="form-control shadow-none small" 
                         style="font-size: 0.85rem; border-color: #dee2e6;"
                         placeholder="Nhập hoặc chọn mã giảm giá..." 
                         v-model="voucherCodeInput"
                         @focus="showVoucherList = true" />
                  <button class="btn btn-dark fw-medium" style="font-size: 0.85rem;" @click="applyVoucherInput">Áp dụng</button>
                </div>
                  
                <div v-if="showVoucherList" class="voucher-dropdown bg-white border rounded-2 shadow position-absolute w-100 mt-2 p-2 custom-scrollbar animate__animated animate__fadeIn" style="z-index: 100; left: 0; top: 100%;">
                  <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2 px-2">
                    <span class="small text-muted fw-medium">Voucher có thể dùng</span>
                    <span class="small text-primary" style="cursor:pointer" @click="showVoucherList = false">Đóng</span>
                  </div>
                  
                  <div v-if="dbVouchers.length === 0" class="text-center p-3 small text-muted">Không có mã nào phù hợp</div>
                  
                  <div v-for="vc in dbVouchers" :key="vc.id" class="voucher-item p-2 rounded-2 mb-1" @click="selectVoucher(vc)">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <div class="fw-bold text-dark small" v-if="vc.phanTramGiam">Giảm {{ vc.phanTramGiam }}% (Tối đa {{ formatPrice(vc.giamToiDa) }})</div>
                        <div class="fw-bold text-dark small" v-else>Giảm {{ formatPrice(vc.giamToiDa) }}</div>
                        <div class="text-muted mt-1" style="font-size: 0.7rem;">Mã: {{ vc.maVoucher }}</div>
                        <div class="text-muted" style="font-size: 0.7rem;">Đơn tối thiểu {{ formatPrice(vc.dieuKienToiThieu || 0) }}</div>
                      </div>
                      <div class="fw-bold text-success small">-{{ formatPrice(previewDiscount(vc)) }}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="d-flex justify-content-between mb-2 small text-muted">
              <span>Tạm tính</span>
              <span class="text-dark fw-medium">{{ formatPrice(subTotal) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2 small text-muted align-items-center">
              <span class="d-flex align-items-center gap-2">
                Phí vận chuyển 
                <img src="/logo_ghn.png" alt="GHN" style="height: 25px; object-fit: contain; vertical-align: middle; margin-bottom: 2px;">
              </span>
              <span class="text-dark fw-medium">{{ formatPrice(shippingFee) }}</span>
            </div>
            <div v-if="appliedVoucher && !errorVoucher" class="d-flex justify-content-between mb-3 small text-success align-items-center">
              <span>Mã giảm giá ({{ appliedVoucher.maVoucher }})</span>
              <span class="fw-bold">-{{ formatPrice(discountAmount) }}</span>
            </div>

            <hr class="opacity-25">

            <div class="d-flex justify-content-between align-items-end mb-4">
              <span class="fw-bold text-dark">Tổng cộng</span>
              <div class="text-end">
                <h4 class="fw-bold m-0 text-dark">{{ formatPrice(finalTotal) }}</h4>
              </div>
            </div>

            <button class="btn btn-main-brown w-100 py-3 rounded-2 fw-bold fs-6 shadow-sm text-uppercase" @click="handlePlaceOrder">
              ĐẶT HÀNG
            </button>
            <div class="text-center mt-3">
              <span class="small text-muted" style="cursor:pointer; text-decoration: underline;" @click="router.push('/gio-hang')">Quay lại giỏ hàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmCODModal" class="modal-overlay d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100" style="background: rgba(0,0,0,0.6); z-index: 2500;">
      <div class="modal-content bg-white p-4 rounded-4 shadow-lg position-relative" style="max-width: 400px; width: 90%;">
        <button class="btn-close position-absolute top-0 end-0 m-3" @click="showConfirmCODModal = false"></button>
        <div class="text-center mb-3">
          <i class="bi bi-box-seam" style="font-size: 3rem; color: #8c5a35;"></i>
        </div>
        <h5 class="fw-bold text-center mb-3" style="color: #3d211a;">XÁC NHẬN ĐẶT HÀNG</h5>
        <p class="text-center text-muted small mb-4">
          Bạn có chắc chắn muốn đặt đơn hàng này với hình thức <br><strong>Thanh toán khi nhận hàng (COD)</strong>? <br><br>
          Tổng thanh toán: <strong class="text-danger fs-5">{{ formatPrice(finalTotal) }}</strong>
        </p>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary w-50 rounded-pill fw-medium shadow-none" @click="showConfirmCODModal = false">Hủy bỏ</button>
          <button class="btn btn-main-brown w-50 rounded-pill fw-bold shadow-none" @click="submitFinalOrder">Đồng ý đặt</button>
        </div>
      </div>
    </div>

    <div v-if="showManualTransferModal" class="modal-overlay d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100" style="background: rgba(0,0,0,0.6); z-index: 2500;">
      <div class="modal-content bg-white p-4 rounded-4 shadow-lg position-relative" style="max-width: 450px; width: 90%;">
        <button class="btn-close position-absolute top-0 end-0 m-3" @click="cancelPayment"></button>
        <h5 class="fw-bold text-center mb-4" style="color: #3d211a;">THÔNG TIN CHUYỂN KHOẢN</h5>
        <div class="bg-light p-3 rounded-3 border mb-4">
           <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
              <span class="text-muted small">Ngân hàng:</span><span class="fw-bold text-dark">MB Bank</span>
           </div>
           <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
              <span class="text-muted small">Chủ tài khoản:</span><span class="fw-bold text-dark">TRINH XUAN BACH</span>
           </div>
           <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
              <span class="text-muted small">Số tài khoản:</span><span class="fw-bold text-dark fs-6" style="color: #a82e3e !important;">00903082610</span>
           </div>
           <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
              <span class="text-muted small">Số tiền:</span><span class="fw-bold text-dark">{{ formatPrice(finalTotal) }}</span>
           </div>
           <div class="d-flex justify-content-between align-items-center pt-1">
              <span class="text-muted small">Nội dung CK:</span><span class="fw-bold text-primary px-2 py-1 bg-primary bg-opacity-10 rounded">{{ transferContent }}</span>
           </div>
        </div>
        <div class="alert alert-warning small py-2 mb-4 text-center">
           Vui lòng chuyển khoản chính xác <strong>Số tiền</strong> và <strong>Nội dung CK</strong>. Admin sẽ kiểm tra và xác nhận thủ công.
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary w-50 rounded-pill" @click="cancelPayment">Hủy bỏ</button>
          <button class="btn btn-main-brown w-50 rounded-pill fw-bold" @click="submitFinalOrder">Tôi đã chuyển khoản</button>
        </div>
      </div>
    </div>

    <div v-if="showVNPAYModal" class="modal-overlay d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100" style="background: rgba(0,0,0,0.6); z-index: 2500;">
      <div class="modal-content bg-white p-4 rounded-4 shadow-lg text-center position-relative" style="max-width: 400px; width: 90%;">
        <button class="btn-close position-absolute top-0 end-0 m-3" @click="cancelPayment"></button>
        <div class="d-flex align-items-center justify-content-center gap-2 mb-3 text-primary fw-bold fs-5"><i class="bi bi-qr-code-scan"></i> CỔNG THANH TOÁN VNPAY</div>
        <div class="qr-container border rounded-3 p-3 mb-3 bg-light">
          <img :src="qrCodeUrl" alt="QR Thanh Toán" class="img-fluid rounded" style="max-height: 250px;">
        </div>
        <div class="mb-3">
          <h3 class="text-danger fw-bold mb-1">{{ formatPrice(finalTotal) }}</h3>
          <p class="text-muted small mb-0">Nội dung CK: <span class="fw-bold text-dark">{{ transferContent }}</span></p>
        </div>
        <div class="small text-muted mb-3 fst-italic"><div class="spinner-border spinner-border-sm text-secondary me-1" role="status"></div> Hệ thống đang chờ quét mã...</div>
        <div class="d-flex gap-2 mt-2">
          <button class="btn btn-outline-secondary w-50 rounded-pill" @click="cancelPayment">Hủy bỏ</button>
          <button class="btn btn-success w-50 rounded-pill fw-bold" @click="submitFinalOrder">Giả lập Quét Xong</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { cartState, cartCount, removeFromCart } from '../../store/cartStore.js' 

const router = useRouter()

const currentUsername = ref(localStorage.getItem('username') || sessionStorage.getItem('username') || 'Guest')
const isLoggedIn = computed(() => currentUsername.value && currentUsername.value !== 'Guest')

const toast = ref({ show: false, message: '', type: 'success', title: '' });
let isCheckingOut = false; 

const showToast = (title, message, type = 'success') => {
  toast.value = { show: true, title, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const handleLogout = () => { 
  localStorage.removeItem('username')
  localStorage.removeItem('userRole')
  localStorage.removeItem('token')
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('token')
  currentUsername.value = 'Guest'
  cartCount.value = 0
  showToast('Đăng xuất', 'Đăng xuất thành công!', 'success')
  setTimeout(() => { window.location.href = '/' }, 500)
}

const provinces = ref([])
const districts = ref([])
const wards = ref([])

const selectedProvinceCode = ref('')
const selectedDistrictCode = ref('')
const selectedWardCode = ref('')

const fetchProvinces = async () => {
  try {
    const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
    if (response.data && response.data.error === 0) {
      provinces.value = response.data.data.map(p => ({ code: p.id, name: p.full_name }))
    }
  } catch (error) { console.error('Lỗi lấy danh sách tỉnh thành:', error) }
}

const onProvinceChange = async () => {
  districts.value = []; wards.value = []; selectedDistrictCode.value = ''; selectedWardCode.value = '';
  const p = provinces.value.find(x => x.code == selectedProvinceCode.value)
  form.value.tinhThanh = p ? p.name : ''; form.value.quanHuyen = ''; form.value.phuongXa = '';
  calculateShippingFee()
  if (!selectedProvinceCode.value) return
  try {
    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvinceCode.value}.htm`)
    if (response.data && response.data.error === 0) {
      districts.value = response.data.data.map(d => ({ code: d.id, name: d.full_name }))
    }
  } catch (error) { console.error('Lỗi lấy danh sách quận huyện:', error) }
}

const onDistrictChange = async () => {
  wards.value = []; selectedWardCode.value = '';
  const d = districts.value.find(x => x.code == selectedDistrictCode.value)
  form.value.quanHuyen = d ? d.name : ''; form.value.phuongXa = '';
  if (!selectedDistrictCode.value) return
  try {
    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrictCode.value}.htm`)
    if (response.data && response.data.error === 0) {
      wards.value = response.data.data.map(w => ({ code: w.id, name: w.full_name }))
    }
  } catch (error) { console.error('Lỗi lấy danh sách phường xã:', error) }
}

const onWardChange = () => {
  const w = wards.value.find(x => x.code == selectedWardCode.value)
  form.value.phuongXa = w ? w.name : ''
}

const checkoutItems = computed(() => cartState.items.filter(item => item.selected))

const savedAddresses = ref([])
const selectedAddressId = ref(null)

const form = ref({
  hoTen: '', soDienThoai: '', email: '', tinhThanh: '', quanHuyen: '', phuongXa: '', diaChiChiTiet: ''
})

const fullAddressString = computed(() => {
  const parts = [form.value.diaChiChiTiet, form.value.phuongXa, form.value.quanHuyen, form.value.tinhThanh].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '';
})

const mapStringToComboboxes = async (tinh, huyen, xa) => {
  if (!provinces.value.length) return;
  const p = provinces.value.find(x => x.name.includes(tinh) || tinh.includes(x.name));
  if (p) {
    selectedProvinceCode.value = p.code;
    try {
      const resD = await axios.get(`https://esgoo.net/api-tinhthanh/2/${p.code}.htm`);
      if (resD.data && resD.data.error === 0) {
        districts.value = resD.data.data.map(d => ({ code: d.id, name: d.full_name }));
        const d = districts.value.find(x => x.name.includes(huyen) || huyen.includes(x.name));
        if (d) {
          selectedDistrictCode.value = d.code;
          const resW = await axios.get(`https://esgoo.net/api-tinhthanh/3/${d.code}.htm`);
          if (resW.data && resW.data.error === 0) {
            wards.value = resW.data.data.map(w => ({ code: w.id, name: w.full_name }));
            const w = wards.value.find(x => x.name.includes(xa) || xa.includes(x.name));
            if (w) selectedWardCode.value = w.code;
          }
        }
      }
    } catch (e) { console.error("Lỗi khi map địa chỉ:", e); }
  }
}

const fetchAddresses = async (isBackgroundRefresh = false) => {
  try {
    if(isLoggedIn.value) {
      const res = await axios.get(`http://localhost:8080/api/hoadon/dia-chi-khach-hang/${currentUsername.value}`);
      if(res.data && res.data.length > 0) {
        
        let globalBackupName = '';
        let globalBackupPhone = '';
        
        res.data.forEach(item => {
          const nameVal = item.ten_nguoi_nhan || item.tenNguoiNhan || item.ho_ten || item.hoTen || item.nguoi_nhan || item.nguoiNhan || item.tenKhachHang || '';
          const phoneVal = item.sdt_nguoi_nhan || item.sdtNguoiNhan || item.so_dien_thoai || item.soDienThoai || item.sdt || item.dien_thoai || item.dienThoai || '';
          if (nameVal && !globalBackupName) globalBackupName = nameVal;
          if (phoneVal && !globalBackupPhone) globalBackupPhone = phoneVal;
        });

        savedAddresses.value = res.data.map(a => {
           const currentName = a.ten_nguoi_nhan || a.tenNguoiNhan || a.ho_ten || a.hoTen || a.nguoi_nhan || a.nguoiNhan || a.tenKhachHang || '';
           const currentPhone = a.sdt_nguoi_nhan || a.sdtNguoiNhan || a.so_dien_thoai || a.soDienThoai || a.sdt || a.dien_thoai || a.dienThoai || '';
           
           return {
              id: a.id,
              hoTen: currentName || globalBackupName || currentUsername.value,
              soDienThoai: currentPhone || globalBackupPhone || '',
              tinhThanh: a.tinh_thanh || a.tinhThanh || '',
              quanHuyen: a.quan_huyen || a.quanHuyen || '',
              phuongXa: a.phuong_xa || a.phuongXa || '',
              diaChiChiTiet: a.dia_chi_cu_the || a.diaChiChiTiet || '',
              macDinh: a.trang_thai === 1 || a.la_mac_dinh || a.macDinh === true
           };
        });
        
        if (isBackgroundRefresh === true && selectedAddressId.value === 'NEW') {
            return;
        }

        if (!selectedAddressId.value || isBackgroundRefresh !== true) {
          const defaultAddr = savedAddresses.value.find(a => a.macDinh) || savedAddresses.value[0];
          await selectSavedAddress(defaultAddr);
        }

      } else {
        if (isBackgroundRefresh !== true) selectedAddressId.value = 'NEW';
      }
    } else { 
        if (isBackgroundRefresh !== true) selectedAddressId.value = 'NEW'; 
    }
  } catch (error) { 
      savedAddresses.value = []; 
      if (isBackgroundRefresh !== true) selectedAddressId.value = 'NEW'; 
  }
}

const handleWindowFocus = () => {
  if (isLoggedIn.value) fetchAddresses(true);
};

const selectSavedAddress = async (addr) => {
  selectedAddressId.value = addr.id;
  form.value = {
    hoTen: addr.hoTen || currentUsername.value,
    soDienThoai: addr.soDienThoai, 
    email: form.value.email || '', 
    tinhThanh: addr.tinhThanh, quanHuyen: addr.quanHuyen, phuongXa: addr.phuongXa, diaChiChiTiet: addr.diaChiChiTiet
  };
  await mapStringToComboboxes(addr.tinhThanh, addr.quanHuyen, addr.phuongXa);
  calculateShippingFee();
}

const resetAddressForm = () => {
  selectedAddressId.value = 'NEW';
  form.value = { hoTen: '', soDienThoai: '', email: form.value.email, tinhThanh: '', quanHuyen: '', phuongXa: '', diaChiChiTiet: '' };
  selectedProvinceCode.value = ''; selectedDistrictCode.value = ''; selectedWardCode.value = '';
  districts.value = []; wards.value = [];
  calculateShippingFee();
}

// =========================================================================
// QUẢN LÝ VOUCHER (REAL-TIME POLLING)
// =========================================================================
const showVoucherList = ref(false)
const dbVouchers = ref([])
const voucherCodeInput = ref('')
const appliedVoucher = ref(null)
const errorVoucher = ref(null)
let pollingInterval = null

const fetchVouchers = async (isSilent = false) => {
  try {
    const timestamp = new Date().getTime();
    const res = await axios.get(`http://localhost:8080/api/phieu-giam-gia?size=1000&limit=1000&t=${timestamp}`); 
    const dataVoucher = res.data?.content || res.data || [];
    const now = new Date().getTime();

    const mappedVouchers = dataVoucher.map(v => {
      return {
        id: v.id,
        maVoucher: v.ma_voucher || v.maVoucher || v.tenPgg || v.ten_pgg || '',
        phanTramGiam: parseFloat(v.phan_tram_giam ?? v.phanTramGiam ?? v.muc_giam_phan_tram ?? v.mucGiamPhanTram ?? v.phan_tram ?? v.phanTram ?? 0) || 0,
        giamToiDa: parseFloat(v.giam_toi_da ?? v.giamToiDa ?? v.gia_tri_giam ?? v.giaTriGiam ?? v.tien_giam ?? v.tienGiam ?? v.muc_giam ?? v.mucGiam ?? 0) || 0,
        dieuKienToiThieu: parseFloat(v.dieu_kien_toi_thieu ?? v.dieuKienToiThieu ?? v.don_toi_thieu ?? v.donToiThieu ?? v.gia_tri_toi_thieu ?? v.giaTriToiThieu ?? 0) || 0,
        soLuong: parseInt(v.so_luong ?? v.soLuong ?? 0, 10) || 0,
        loaiPhieu: v.loai_phieu ?? v.loaiPhieu,
        trangThai: v.trang_thai ?? v.trangThai,
        ngayKetThuc: v.ngay_ket_thuc || v.ngayKetThuc
      };
    });

    dbVouchers.value = mappedVouchers.filter(v => {
      const loaiStr = String(v.loaiPhieu).toLowerCase();
      const isPersonal = loaiStr.includes('cá nhân') || loaiStr.includes('ca nhan');
      const isPublic = !isPersonal;

      const statusStr = String(v.trangThai).toLowerCase();
      const isInactive = statusStr.includes('ngừng') || statusStr.includes('ngung') || statusStr === '0' || statusStr === 'false';
      const isActive = !isInactive;

      const hasStock = v.soLuong > 0;

      let isUnexpired = true;
      if (v.ngayKetThuc) {
        const strDate = String(v.ngayKetThuc);
        let endTime = null;
        if (strDate.includes('/')) {
           const p = strDate.split(/[\s/:-]+/);
           if(p.length >= 3) {
              endTime = new Date(`${p[2]}-${p[1]}-${p[0]}T23:59:59`).getTime();
           }
        } else {
           endTime = new Date(v.ngayKetThuc).getTime();
        }
        if (endTime && !isNaN(endTime) && now > endTime) {
           isUnexpired = false;
        }
      }

      return isPublic && isActive && hasStock && isUnexpired;
    });

    if (appliedVoucher.value) {
      const stillValid = dbVouchers.value.find(v => v.maVoucher === appliedVoucher.value.maVoucher);
      if (!stillValid && !isCheckingOut) {
        errorVoucher.value = appliedVoucher.value;
        appliedVoucher.value = null; 
        voucherCodeInput.value = '';
        if (!isSilent) showToast('Cảnh báo', 'Mã giảm giá đang áp dụng vừa bị hết lượt hoặc bảo trì!', 'error');
      }
    }

  } catch (error) { 
    dbVouchers.value = []; 
  }
}

const previewDiscount = (vc) => {
  if (!vc) return 0;
  if (subTotal.value < vc.dieuKienToiThieu) return 0;
  if (vc.phanTramGiam > 0) {
    let rawDiscount = (subTotal.value * vc.phanTramGiam) / 100;
    return (vc.giamToiDa > 0 && rawDiscount > vc.giamToiDa) ? vc.giamToiDa : rawDiscount;
  }
  return vc.giamToiDa; 
}

const subTotal = computed(() => checkoutItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

const discountAmount = computed(() => {
  if (errorVoucher.value) return 0;
  return appliedVoucher.value ? previewDiscount(appliedVoucher.value) : 0;
})

const bestVoucher = computed(() => {
  if (dbVouchers.value.length === 0) return null;
  let best = null;
  let maxDiscount = 0;
  dbVouchers.value.forEach(v => {
    const discount = previewDiscount(v);
    if (discount > maxDiscount) {
      maxDiscount = discount;
      best = v;
    }
  });
  return maxDiscount > 0 ? best : null;
});

const extraSaving = computed(() => {
  if (!bestVoucher.value) return 0;
  const currentDiscount = appliedVoucher.value ? previewDiscount(appliedVoucher.value) : 0;
  return previewDiscount(bestVoucher.value) - currentDiscount;
});

const autoSuggestBestVoucher = () => {
  if (bestVoucher.value) {
    selectVoucher(bestVoucher.value);
    showToast('Thành công', `Đã tự động áp mã giảm giá tiết kiệm nhất cho bạn!`, 'success');
  }
}

const selectVoucher = (vc) => {
  if (subTotal.value < vc.dieuKienToiThieu) {
    showToast('Từ chối', `Đơn hàng chưa đạt mức tối thiểu ${formatPrice(vc.dieuKienToiThieu)} để dùng mã này!`, 'error');
    return false;
  }
  appliedVoucher.value = vc;
  voucherCodeInput.value = '';
  errorVoucher.value = null;
  showVoucherList.value = false;
  return true;
}

const applyVoucherInput = () => {
  if (!voucherCodeInput.value || voucherCodeInput.value.trim() === '') {
    if (bestVoucher.value) {
      selectVoucher(bestVoucher.value);
      showToast('Thành công', 'Đã tự động áp mã tốt nhất!', 'success');
    } else {
      showToast('Lỗi', 'Vui lòng nhập mã giảm giá hoặc chọn từ danh sách!', 'error');
    }
    return;
  }

  const inputCode = voucherCodeInput.value.trim().toUpperCase();
  const vc = dbVouchers.value.find(v => v.maVoucher.toUpperCase() === inputCode);
  
  if (vc) {
    selectVoucher(vc);
  } else {
    appliedVoucher.value = null;
    errorVoucher.value = null;
    voucherCodeInput.value = '';
    
    if (bestVoucher.value) {
      selectVoucher(bestVoucher.value);
      showToast('Cảnh báo', 'Mã không tồn tại hoặc đã hết lượt sử dụng. Đã tự động thay bằng mã tốt nhất!', 'error');
    } else {
      showToast('Lỗi', 'Mã giảm giá không tồn tại hoặc đã hết lượt sử dụng!', 'error');
    }
  }
}

const removeVoucher = () => { 
  appliedVoucher.value = null; 
  voucherCodeInput.value = ''; 
  errorVoucher.value = null; 
}

const clearErrorVoucher = async () => {
  errorVoucher.value = null;
  await fetchVouchers(true); 
}

watch(subTotal, (newVal) => {
  if (!isCheckingOut && appliedVoucher.value && newVal < appliedVoucher.value.dieuKienToiThieu) {
    if (newVal > 0) {
      removeVoucher();
      showToast('Hủy áp dụng', 'Tổng tiền không đủ điều kiện dùng mã giảm giá này!', 'error');
    }
  }
});
// =========================================================================

const paymentMethod = ref('') 
const shippingFee = ref(30000) 

const calculateShippingFee = () => {
  const tinh = (form.value.tinhThanh || '').toLowerCase();
  if (!tinh) shippingFee.value = 0; 
  else if (tinh.includes('hà nội')) shippingFee.value = 16500; 
  else shippingFee.value = 30000; 
}

const finalTotal = computed(() => { const total = subTotal.value + shippingFee.value - discountAmount.value; return total > 0 ? total : 0; })
const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')

const showManualTransferModal = ref(false)
const showVNPAYModal = ref(false)
const showConfirmCODModal = ref(false)
const qrCodeUrl = ref('')
const transferContent = ref('')

const validateStockBeforeOrder = async () => {
  if (!checkoutItems.value || checkoutItems.value.length === 0) {
    showToast('Lỗi', 'Không có sản phẩm nào để thanh toán!', 'error'); return false;
  }
  for (let item of checkoutItems.value) {
    try {
      const spctId = item.idSpct || item.idSanPhamChiTiet || item.id;
      const res = await axios.get(`http://localhost:8080/api/san-pham-chi-tiet/${spctId}`);
      const currentStock = res.data?.soLuong || res.data?.tonKho || res.data?.soLuongTon || res.data?.stock || 0;
      if (item.quantity > currentStock) {
        showToast('Hết hàng', `Sản phẩm "${item.name}" (Size: ${item.size || ''}) chỉ còn ${currentStock} sản phẩm trong kho!`, 'error');
        return false;
      }
    } catch (error) { console.error('Lỗi kiểm tra tồn kho:', error); }
  }
  return true;
}

const buildOrderPayload = () => {
  return {
    username: isLoggedIn.value ? currentUsername.value : null, 
    hoTenNguoiNhan: form.value.hoTen,
    soDienThoai: form.value.soDienThoai,
    email: form.value.email,
    diaChiGiaoHang: fullAddressString.value,
    phuongThucThanhToan: paymentMethod.value,
    tongTienHang: subTotal.value,
    phiVanChuyen: shippingFee.value,
    tienGiamGia: discountAmount.value,
    tongThanhToan: finalTotal.value,
    idVoucher: appliedVoucher.value && !errorVoucher.value ? appliedVoucher.value.id : null,
    maVoucherApDung: appliedVoucher.value && !errorVoucher.value ? appliedVoucher.value.maVoucher : null,
    chiTietDonHang: checkoutItems.value.map(item => ({
      sanPhamChiTietId: item.idSpct || item.idSanPhamChiTiet || item.id,
      maSku: item.maSku || item.sku || item.ma_sku || '',
      soLuong: item.quantity, donGia: item.price
    }))
  }
}

const handlePlaceOrder = async () => {
  if (!form.value.hoTen || !form.value.soDienThoai || !form.value.email || !form.value.tinhThanh || !form.value.quanHuyen || !form.value.phuongXa || !form.value.diaChiChiTiet) {
    showToast('Lỗi', 'Vui lòng điền đầy đủ các ô có dấu * đỏ (Bao gồm Tỉnh, Huyện, Xã, Email)!', 'error'); return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    showToast('Lỗi', 'Email không đúng định dạng!', 'error'); return;
  }

  if (!paymentMethod.value) { showToast('Lỗi', 'Vui lòng chọn Phương thức thanh toán!', 'error'); return; }

  if (errorVoucher.value) {
    showToast('Lỗi', 'Vui lòng nhấn "Xóa mã này" trên thẻ Voucher bị lỗi trước khi Đặt hàng!', 'error'); return;
  }

  const isStockValid = await validateStockBeforeOrder();
  if (!isStockValid) return;

  if (paymentMethod.value === 'TRANSFER') {
    transferContent.value = 'GD' + Date.now().toString().slice(-8);
    showManualTransferModal.value = true;
  } else if (paymentMethod.value === 'VNPAY') {
    transferContent.value = 'VNPAY' + Date.now().toString().slice(-8);
    const bankId = 'MB'; const accountNo = '00903082610'; const accountName = 'TRINH XUAN BACH'; 
    qrCodeUrl.value = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${finalTotal.value}&addInfo=${transferContent.value}&accountName=${accountName}`;
    showVNPAYModal.value = true;
  } else {
    showConfirmCODModal.value = true;
  }
}

const submitFinalOrder = async () => {
  const orderPayload = buildOrderPayload();
  if(paymentMethod.value === 'TRANSFER' || paymentMethod.value === 'VNPAY') {
    orderPayload.maGiaoDich = transferContent.value;
  }

  try {
    isCheckingOut = true;
    const res = await axios.post('http://localhost:8080/api/hoadon/tao-don-truc-tuyen', orderPayload);
    
    if(res.data && res.data.success) {
      
      appliedVoucher.value = null;
      
      for (let i = cartState.items.length - 1; i >= 0; i--) {
        if (cartState.items[i].selected) removeFromCart(i);
      }
      
      showToast('Thành công', 'ĐẶT HÀNG THÀNH CÔNG! Mã: ' + res.data.ma_hoa_don, 'success');
      showConfirmCODModal.value = false;
      showManualTransferModal.value = false;
      showVNPAYModal.value = false;
      
      setTimeout(() => { 
        if (!isLoggedIn.value) {
            router.push('/'); 
        } else {
            router.push('/don-hang'); 
        }
      }, 1500);

    } else { 
      isCheckingOut = false;
      showToast('Lỗi', res.data.message || 'Lỗi đặt hàng', 'error'); 
      showConfirmCODModal.value = false;
    }
  } catch (error) {
    isCheckingOut = false;
    const msg = error.response?.data?.message || 'Lỗi kết nối Máy chủ / Lỗi SQL!';
    
    if (msg.includes('Mã giảm giá') || msg.includes('VOUCHER_HET_LUOT') || msg.includes('hết lượt')) {
      if (appliedVoucher.value) {
         errorVoucher.value = appliedVoucher.value; 
         appliedVoucher.value = null; 
      }
      showConfirmCODModal.value = false;
      showManualTransferModal.value = false;
      showVNPAYModal.value = false;
      showToast('Cảnh báo', 'Voucher này vừa hết lượt sử dụng. Vui lòng xóa và chọn mã khác!', 'error');
      
      await fetchVouchers(true);
    } else {
      showToast('Thất bại', msg, 'error');
      showConfirmCODModal.value = false;
    }
  }
}

const cancelPayment = () => { 
  showConfirmCODModal.value = false; 
  showManualTransferModal.value = false; 
  showVNPAYModal.value = false; 
}

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};

onMounted(async () => {
  if (checkoutItems.value.length > 0) {
    await fetchProvinces(); 
    await fetchAddresses();          
    await fetchVouchers();
    calculateShippingFee(); 
    
    pollingInterval = setInterval(() => {
        fetchVouchers(true);
    }, 2000);
  }
  window.addEventListener('focus', handleWindowFocus);
})

onUnmounted(() => {
  window.removeEventListener('focus', handleWindowFocus);
  if (pollingInterval) clearInterval(pollingInterval);
})
</script>

<style scoped>
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
.border-brown { border-color: #3d211a !important; }
.bg-light-brown { background-color: #faf8f5 !important; }
.custom-radio { width: 1.1rem; height: 1.1rem; }
.custom-radio:checked { background-color: #3d211a; border-color: #3d211a; }
.address-card { transition: all 0.2s ease; cursor: pointer; }
.address-card:hover { border-color: #cbb799 !important; }
.payment-method { cursor: pointer; transition: all 0.2s ease; }
.payment-method:hover { border-color: #cbb799 !important; }
.max-height-cart { max-height: 280px; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbb8ac; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a67c52; }
.voucher-dropdown { max-height: 250px; overflow-y: auto; }
.voucher-item { border: 1px solid transparent; cursor: pointer; background-color: #f8f9fa; transition: 0.2s; }
.voucher-item:hover { border-color: #cbb799; background-color: #faf8f5; }
.form-control:focus, .form-select:focus { border-color: #cbb799; box-shadow: 0 0 0 0.2rem rgba(203, 183, 153, 0.25); }
.modal-overlay { backdrop-filter: blur(3px); transition: all 0.3s ease; }
.qr-container img { border: 1px solid #e0e0e0; }
.custom-toast { animation: slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>