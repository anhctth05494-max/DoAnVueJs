<template>
  <div class="container-fluid p-0">
    <div
      v-if="showToast"
      class="position-fixed top-0 end-0 p-3"
      style="z-index: 1055; margin-top: 60px"
    >
      <div
        class="toast show align-items-center text-white border-0 shadow-lg"
        :class="toastType === 'success' ? 'bg-success' : 'bg-danger'"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body fw-medium px-3 py-2">
            <i
              :class="
                toastType === 'success'
                  ? 'bi bi-check-circle-fill'
                  : 'bi bi-exclamation-triangle-fill'
              "
              class="me-2 fs-5 align-middle"
            ></i>
            {{ toastMessage }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-3 m-auto"
            @click="showToast = false"
          ></button>
        </div>
      </div>
    </div>

    <template v-if="viewState === 'LIST'">
      <div class="card border-0 shadow-sm mb-4 rounded-3">
        <div class="card-body p-4">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-funnel text-dark me-2 fs-5"></i>
            <h6 class="card-title fw-semibold mb-0 text-dark">Bộ lọc tìm kiếm</h6>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label class="form-label text-muted small mb-1">Tìm kiếm khách hàng</label>
              <div class="input-group">
                <span
                  class="input-group-text bg-transparent border-end-0 border-secondary-subtle rounded-start-pill text-muted"
                >
                  <i class="bi bi-search"></i>
                </span>
                <input
                  v-model="filterKeyword"
                  type="text"
                  class="form-control rounded-end-pill border-start-0 shadow-none border-secondary-subtle"
                  placeholder="Tìm theo mã, tên, SĐT, Email..."
                />
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label text-muted small mb-1">Giới tính</label>
              <select
                v-model="filterGioiTinh"
                class="form-select rounded-pill shadow-none border-secondary-subtle text-muted"
              >
                <option value="">Tất cả giới tính</option>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label text-muted small mb-1">Trạng thái</label>
              <select
                v-model="filterStatus"
                class="form-select rounded-pill shadow-none border-secondary-subtle text-muted"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="0">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-3 mt-md-0">
            <button
              @click="clearFilter"
              class="btn btn-outline-secondary rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
            >
              <i class="bi bi-arrow-clockwise"></i> Đặt lại bộ lọc
            </button>
            <button
              @click="goToAdd"
              class="btn rounded-pill px-3 shadow-none small fw-medium d-flex align-items-center gap-2"
              style="background-color: #dccbc0; color: #5a4031"
            >
              <i class="bi bi-plus-lg"></i> Thêm khách hàng mới
            </button>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <div class="table-responsive">
            <table class="table table-hover align-middle text-nowrap" style="font-size: 0.9rem">
              <thead>
                <tr>
                  <th
                    class="py-3 px-3 border-0 rounded-start fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    STT
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    MÃ KH
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    HỌ TÊN
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    TÀI KHOẢN
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    SĐT
                  </th>
                  <th
                    class="py-3 px-3 border-0 fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031; width: 180px"
                  >
                    ĐỊA CHỈ
                  </th>
                  <th
                    class="py-3 px-3 border-0 text-center fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    GIỚI TÍNH
                  </th>
                  <th
                    class="py-3 px-3 border-0 text-center fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    TRẠNG THÁI
                  </th>
                  <th
                    class="py-3 px-3 border-0 rounded-end text-center fw-semibold"
                    style="background-color: #dccbc0; color: #5a4031"
                  >
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody class="border-top-0 text-secondary">
                <tr v-for="(customer, index) in customers" :key="customer.id">
                  <td class="py-3 px-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td class="py-3 px-3 text-dark fw-bold">{{ customer.maKhachHang }}</td>
                  <td class="py-3 px-3 text-dark fw-medium">{{ customer.hoTen }}</td>
                  <td class="py-3 px-3 text-dark">{{ customer.taiKhoan }}</td>
                  <td class="py-3 px-3">{{ customer.soDienThoai }}</td>
                  <td class="py-3 px-3">
                    <div
                      class="text-truncate"
                      style="max-width: 180px"
                      :title="customer.diaChiCuThe"
                    >
                      {{ customer.diaChiCuThe || 'Chưa cập nhật' }}
                    </div>
                  </td>
                  <td class="py-3 px-3 text-center text-dark">
                    {{ customer.gioiTinh === 1 ? 'Nam' : 'Nữ' }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span
                      v-if="customer.trangThai === 1 || customer.trangThai === true"
                      class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-normal"
                    >
                      Đang hoạt động
                    </span>
                    <span
                      v-else
                      class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-normal"
                    >
                      Ngừng hoạt động
                    </span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="d-flex justify-content-center gap-3 align-items-center">
                      <div class="form-check form-switch mb-0" title="Bật/Tắt trạng thái">
                        <input
                          class="form-check-input shadow-none"
                          type="checkbox"
                          role="switch"
                          :checked="customer.trangThai === 1 || customer.trangThai === true"
                          @change="toggleCustomerStatus(customer)"
                          style="cursor: pointer"
                        />
                      </div>
                      <i
                        class="bi bi-geo-alt-fill text-danger fs-5"
                        style="cursor: pointer"
                        title="Sổ địa chỉ"
                        @click="openAddressBook(customer)"
                      ></i>
                      <i
                        class="bi bi-eye fs-5 text-primary"
                        style="cursor: pointer"
                        title="Xem chi tiết"
                        @click="goToEdit(customer)"
                      ></i>
                    </div>
                  </td>
                </tr>
                <tr v-if="customers.length === 0">
                  <td colspan="9" class="text-center py-5 text-danger fw-medium">
                    <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="totalElements > 0"
            class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small flex-wrap gap-3"
          >
            <div>
              Hiển thị <span class="fw-bold text-dark">{{ customers.length }}</span> /
              <span class="fw-bold text-dark">{{ totalElements }}</span> bản ghi
            </div>

            <div class="d-flex gap-1 align-items-center">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="btn btn-sm btn-light border shadow-none px-2 rounded"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="changePage(page)"
                class="btn btn-sm shadow-none px-3 rounded fw-medium"
                :class="
                  currentPage === page ? 'btn-secondary text-white' : 'btn-light border text-muted'
                "
                :style="
                  currentPage === page ? 'background-color: #8c6b5d; border-color: #8c6b5d;' : ''
                "
              >
                {{ page }}
              </button>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="btn btn-sm btn-light border shadow-none px-2 rounded"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <div class="d-flex align-items-center gap-2">
              <select
                v-model="itemsPerPage"
                class="form-select form-select-sm rounded-pill shadow-none border-secondary-subtle text-muted pe-4"
                style="width: auto"
              >
                <option :value="5">Hiển thị 5 bản ghi / trang</option>
                <option :value="10">Hiển thị 10 bản ghi / trang</option>
                <option :value="20">Hiển thị 20 bản ghi / trang</option>
                <option :value="30">Hiển thị 30 bản ghi / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="mb-4">
        <a
          href="#"
          @click.prevent="goBack"
          class="text-decoration-none text-secondary small fw-bold d-flex align-items-center gap-2"
        >
          <i class="bi bi-chevron-left"></i> Danh sách khách hàng
        </a>
      </div>

      <div class="card border-0 shadow-sm rounded-3 mb-4">
        <div class="card-body p-4">
          <h6 class="fw-bold mb-4" style="color: #5a4031">+ THÔNG TIN CHUNG KHÁCH HÀNG</h6>

          <div class="d-flex justify-content-center mb-5 mt-3">
            <div
              class="rounded-circle d-flex flex-column justify-content-center align-items-center bg-white"
              style="width: 130px; height: 130px; border: 2px dashed #ccc; cursor: pointer"
            >
              <i class="bi bi-camera fs-3 text-secondary"></i>
              <span class="text-secondary small mt-1">Chọn ảnh</span>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-md-4" v-if="isEditMode">
              <label class="form-label small fw-bold mb-1">Mã khách hàng</label>
              <input
                type="text"
                class="form-control rounded-2 shadow-none bg-light fw-bold text-muted"
                v-model="customerForm.maKhachHang"
                disabled
              />
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Họ và tên *</label>
              <input
                type="text"
                class="form-control rounded-2 shadow-none"
                placeholder="Nhập họ tên..."
                :class="{ 'is-invalid': errors.hoTen }"
                v-model="customerForm.hoTen"
                @input="clearError('hoTen')"
              />
              <div class="invalid-feedback">{{ errors.hoTen }}</div>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Tên tài khoản *</label>
              <input
                type="text"
                class="form-control rounded-2 shadow-none"
                placeholder="Nhập tên tài khoản..."
                :class="{ 'is-invalid': errors.taiKhoan }"
                v-model="customerForm.taiKhoan"
                @input="clearError('taiKhoan')"
              />
              <div class="invalid-feedback">{{ errors.taiKhoan }}</div>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1"
                >Mật khẩu <span class="text-danger" v-if="!isEditMode">*</span></label
              >
              <div class="position-relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control rounded-2 shadow-none pe-5"
                  placeholder="Mật khẩu..."
                  :class="{ 'is-invalid': errors.matKhau, 'bg-light': isEditMode }"
                  v-model="customerForm.matKhau"
                  @input="clearError('matKhau')"
                  :readonly="isEditMode"
                />
                <i
                  class="bi position-absolute top-50 end-0 translate-middle-y me-3 fs-5"
                  :class="showPassword ? 'bi-eye-slash text-primary' : 'bi-eye text-muted'"
                  style="cursor: pointer; z-index: 5"
                  @click="showPassword = !showPassword"
                  title="Hiện/Ẩn mật khẩu"
                ></i>
              </div>
              <div v-if="errors.matKhau" class="text-danger small mt-1 d-block">
                {{ errors.matKhau }}
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Email *</label>
              <input
                type="email"
                class="form-control rounded-2 shadow-none"
                placeholder="example@gmail.com"
                :class="{ 'is-invalid': errors.email }"
                v-model="customerForm.email"
                @input="clearError('email')"
              />
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Số điện thoại *</label>
              <input
                type="tel"
                class="form-control rounded-2 shadow-none"
                placeholder="Nhập SĐT..."
                :class="{ 'is-invalid': errors.soDienThoai }"
                v-model="customerForm.soDienThoai"
                @input="clearError('soDienThoai')"
              />
              <div class="invalid-feedback">{{ errors.soDienThoai }}</div>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Ngày sinh</label>
              <input
                type="date"
                class="form-control rounded-2 shadow-none text-muted"
                v-model="customerForm.ngaySinh"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-2">Giới tính *</label>
              <div class="d-flex gap-4 mt-1">
                <div class="form-check">
                  <input
                    class="form-check-input shadow-none"
                    type="radio"
                    :value="1"
                    v-model="customerForm.gioiTinh"
                    id="genderMale"
                  />
                  <label class="form-check-label small" for="genderMale">Nam</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input shadow-none"
                    type="radio"
                    :value="0"
                    v-model="customerForm.gioiTinh"
                    id="genderFemale"
                  />
                  <label class="form-check-label small" for="genderFemale">Nữ</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3 mb-4">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="fw-bold m-0" style="color: #5a4031">
              {{ isEditMode ? '+ DANH SÁCH ĐỊA CHỈ' : '+ ĐỊA CHỈ NHẬN HÀNG MẶC ĐỊNH' }}
            </h6>
            <button
              v-if="isEditMode && !showAddressForm"
              type="button"
              class="btn btn-sm btn-outline-secondary rounded-2 px-3 shadow-none"
              @click="openAddAddressForm"
            >
              <i class="bi bi-plus-lg me-1"></i> Thêm địa chỉ
            </button>
          </div>

          <div v-if="!isEditMode">
            <div class="card border border-light-subtle bg-light p-4 rounded-3 shadow-none mb-3">
              <div class="d-flex align-items-center gap-2 mb-4 text-primary fw-bold small">
                <i class="bi bi-check-circle-fill"></i> Tự động thiết lập làm địa chỉ mặc định
              </div>
              <div class="row g-4">
                <div class="col-12">
                  <label class="form-label small text-muted mb-1 fw-bold">Số nhà / Đường *</label>
                  <input
                    type="text"
                    class="form-control rounded-2 shadow-none bg-white"
                    placeholder="VD: 12A Nguyễn Trãi..."
                    :class="{ 'is-invalid': errors.diaChiCuThe }"
                    v-model="customerForm.diaChiCuThe"
                    @input="clearError('diaChiCuThe')"
                  />
                  <div class="invalid-feedback">{{ errors.diaChiCuThe }}</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small text-muted mb-1 fw-bold">Tỉnh/Thành *</label>
                  <select
                    class="form-select rounded-2 shadow-none bg-white text-muted"
                    :class="{ 'is-invalid': errors.tinhThanh }"
                    v-model="customerForm.tinhThanh"
                    @change="handleProvinceChange"
                  >
                    <option value="">-- Chọn Tỉnh/Thành --</option>
                    <option v-for="prov in provinces" :key="prov.name" :value="prov.name">
                      {{ prov.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.tinhThanh }}</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small text-muted mb-1 fw-bold">Quận/Huyện *</label>
                  <select
                    class="form-select rounded-2 shadow-none bg-white text-muted"
                    :class="{ 'is-invalid': errors.quanHuyen }"
                    v-model="customerForm.quanHuyen"
                    :disabled="!customerForm.tinhThanh"
                    @change="handleDistrictChange"
                  >
                    <option value="">-- Chọn Quận/Huyện --</option>
                    <option v-for="dist in districts" :key="dist.code" :value="dist.name">
                      {{ dist.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.quanHuyen }}</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small text-muted mb-1 fw-bold">Phường/Xã *</label>
                  <select
                    class="form-select rounded-2 shadow-none bg-white text-muted"
                    :class="{ 'is-invalid': errors.phuongXa }"
                    v-model="customerForm.phuongXa"
                    :disabled="!customerForm.quanHuyen"
                    @change="handleWardChange"
                  >
                    <option value="">-- Chọn Phường/Xã --</option>
                    <option v-for="ward in wards" :key="ward.code" :value="ward.name">
                      {{ ward.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.phuongXa }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div v-if="!showAddressForm">
              <div
                v-if="danhSachDiaChi.length === 0"
                class="text-muted small text-center p-4 border rounded bg-light"
              >
                Khách hàng chưa có địa chỉ nào.
              </div>
              <div
                v-for="(addr, i) in danhSachDiaChi"
                :key="addr.id || i"
                class="card border rounded-3 bg-light shadow-none mb-3"
              >
                <div class="card-body p-3">
                  <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                    <div class="d-flex align-items-center">
                      <span class="fw-bold text-dark">Địa chỉ {{ i + 1 }}</span>
                      <span
                        v-if="addr.isMacDinh"
                        class="badge bg-primary ms-2 rounded-pill fw-normal"
                        style="font-size: 11px"
                        >Mặc định</span
                      >
                    </div>
                    <button
                      class="btn btn-link p-0 text-decoration-none small text-primary shadow-none fw-bold"
                      @click="openEditAddressForm(addr)"
                    >
                      Sửa
                    </button>
                  </div>
                  <div class="small text-muted mb-2">
                    Người nhận:
                    <span class="text-dark fw-bold">{{
                      addr.tenNguoiNhan || customerForm.hoTen
                    }}</span>
                    | SĐT:
                    <span class="text-dark fw-bold">{{
                      addr.sdtNguoiNhan || customerForm.soDienThoai
                    }}</span>
                  </div>
                  <div class="small text-muted">
                    Địa chỉ cụ thể:
                    <span class="text-dark"
                      >{{ addr.diaChiCuThe }}, {{ addr.phuongXa }}, {{ addr.quanHuyen }},
                      {{ addr.tinhThanh }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="showAddressForm"
              class="card border border-primary border-opacity-25 rounded-3 bg-white p-4 shadow-none"
            >
              <h6 class="fw-bold mb-4 text-primary">
                <i class="bi bi-cursor me-2"></i
                >{{ isEditAddressMode ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới' }}
              </h6>
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label small text-muted mb-1">Tên người nhận</label>
                  <input
                    type="text"
                    class="form-control rounded-2 shadow-none"
                    placeholder="Lấy tên KH nếu trống"
                    :class="{ 'is-invalid': addressErrors.tenNguoiNhan }"
                    v-model="addressFormData.tenNguoiNhan"
                    @input="clearAddressError('tenNguoiNhan')"
                  />
                  <div class="invalid-feedback">{{ addressErrors.tenNguoiNhan }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small text-muted mb-1">SĐT nhận hàng</label>
                  <input
                    type="tel"
                    class="form-control rounded-2 shadow-none"
                    placeholder="Lấy SĐT KH nếu trống"
                    :class="{ 'is-invalid': addressErrors.sdtNguoiNhan }"
                    v-model="addressFormData.sdtNguoiNhan"
                    @input="clearAddressError('sdtNguoiNhan')"
                  />
                  <div class="invalid-feedback">{{ addressErrors.sdtNguoiNhan }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label small text-muted mb-1">Số nhà, Tên đường *</label>
                  <input
                    type="text"
                    class="form-control rounded-2 shadow-none"
                    placeholder="VD: 12A Nguyễn Trãi..."
                    :class="{ 'is-invalid': addressErrors.diaChiCuThe }"
                    v-model="addressFormData.diaChiCuThe"
                    @input="clearAddressError('diaChiCuThe')"
                  />
                  <div class="invalid-feedback">{{ addressErrors.diaChiCuThe }}</div>
                </div>
                <div class="col-md-4">
                  <select
                    class="form-select rounded-2 shadow-none text-muted"
                    :class="{ 'is-invalid': addressErrors.tinhThanh }"
                    v-model="addressFormData.tinhThanh"
                    @change="handleAddressProvinceChange"
                  >
                    <option value="">Tỉnh/Thành phố *</option>
                    <option v-for="prov in provinces" :key="prov.name" :value="prov.name">
                      {{ prov.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ addressErrors.tinhThanh }}</div>
                </div>
                <div class="col-md-4">
                  <select
                    class="form-select rounded-2 shadow-none text-muted"
                    :class="{ 'is-invalid': addressErrors.quanHuyen }"
                    v-model="addressFormData.quanHuyen"
                    :disabled="!addressFormData.tinhThanh"
                    @change="handleAddressDistrictChange"
                  >
                    <option value="">Quận/Huyện *</option>
                    <option
                      v-for="dist in addressFormDistricts"
                      :key="dist.code"
                      :value="dist.name"
                    >
                      {{ dist.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ addressErrors.quanHuyen }}</div>
                </div>
                <div class="col-md-4">
                  <select
                    class="form-select rounded-2 shadow-none text-muted"
                    :class="{ 'is-invalid': addressErrors.phuongXa }"
                    v-model="addressFormData.phuongXa"
                    :disabled="!addressFormData.quanHuyen"
                    @change="handleAddressWardChange"
                  >
                    <option value="">Phường/Xã *</option>
                    <option v-for="ward in addressFormWards" :key="ward.code" :value="ward.name">
                      {{ ward.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ addressErrors.phuongXa }}</div>
                </div>
                <div class="col-12">
                  <div class="form-check mt-1">
                    <input
                      class="form-check-input shadow-none"
                      type="checkbox"
                      id="checkDefaultAddr"
                      v-model="addressFormData.isMacDinh"
                    />
                    <label
                      class="form-check-label small text-danger fw-medium"
                      for="checkDefaultAddr"
                      >Đặt làm địa chỉ mặc định</label
                    >
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  class="btn btn-outline-secondary rounded-2 px-3 shadow-none"
                  @click="showAddressForm = false"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  class="btn text-white rounded-2 px-4 shadow-sm"
                  style="background-color: #0b1a30"
                  @click="submitAddressForm"
                >
                  {{ isEditAddressMode ? 'Lưu thay đổi' : 'Thêm địa chỉ' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-3 mt-4 mb-5 pb-5">
        <button
          type="button"
          class="btn btn-light border px-4 rounded-2 fw-medium shadow-none text-muted"
          @click="goBack"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          class="btn text-white px-4 rounded-2 fw-medium shadow-none"
          style="background-color: #dccbc0; color: #5a4031"
          @click="saveCustomerInfo"
        >
          {{ isEditMode ? 'Cập nhật thay đổi' : 'Lưu khách hàng mới' }}
        </button>
      </div>
    </template>

    <div v-if="showAddressBookModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content border-0 rounded-4 shadow-lg bg-white position-relative">
          <button
            type="button"
            class="btn-close position-absolute shadow-none"
            style="top: 1.25rem; right: 1.25rem; z-index: 10"
            @click="closeModal"
            aria-label="Close"
          ></button>

          <div
            class="modal-header border-bottom p-4 align-items-start"
            style="
              background-color: #fcfcfc;
              border-top-left-radius: 1rem;
              border-top-right-radius: 1rem;
            "
          >
            <div>
              <h5
                class="modal-title fw-bold m-0 d-flex align-items-center gap-2"
                style="color: #333"
              >
                <i class="bi bi-geo-alt text-danger"></i> Sổ địa chỉ khách hàng
              </h5>
              <div class="small text-muted mt-1">
                {{ customerForm.hoTen }} - {{ customerForm.maKhachHang }}
              </div>
            </div>
          </div>

          <div class="modal-body p-4 bg-light">
            <div class="row g-4">
              <div class="col-lg-7">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-white border-bottom py-3">
                    <h6 class="fw-bold m-0"><i class="bi bi-list-ul me-2"></i>Danh sách địa chỉ</h6>
                  </div>
                  <div class="card-body p-0">
                    <table class="table mb-0 align-middle">
                      <thead class="bg-light text-muted small">
                        <tr>
                          <th class="border-0 px-4 py-2">STT</th>
                          <th class="border-0 py-2 w-75">Địa chỉ</th>
                          <th class="border-0 py-2 text-center">Mặc định</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="danhSachDiaChi.length === 0">
                          <td colspan="3" class="text-center py-5 text-muted small">
                            Danh sách trống. Vui lòng thêm địa chỉ mới.
                          </td>
                        </tr>
                        <tr v-for="(addr, i) in danhSachDiaChi" :key="addr.id || i">
                          <td class="px-4 text-muted">{{ i + 1 }}</td>
                          <td class="py-3">
                            <div class="fw-medium text-dark mb-1">
                              {{ addr.diaChiCuThe }}, {{ addr.phuongXa }}, {{ addr.quanHuyen }},
                              {{ addr.tinhThanh }}
                            </div>
                            <div class="small text-muted">
                              Người nhận: {{ addr.tenNguoiNhan || customerForm.hoTen }} - SĐT:
                              {{ addr.sdtNguoiNhan || customerForm.soDienThoai }}
                            </div>
                          </td>
                          <td class="text-center">
                            <span
                              v-if="addr.isMacDinh"
                              class="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2 fw-normal"
                              >Mặc định</span
                            >
                            <button
                              v-else
                              type="button"
                              class="btn btn-sm btn-outline-secondary rounded-pill px-3 shadow-none"
                              style="font-size: 12px"
                              @click="setDefaultAddress(addr.id)"
                            >
                              Thiết lập
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="col-lg-5">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-white border-bottom py-3">
                    <h6 class="fw-bold m-0">
                      <i class="bi bi-cursor text-secondary me-2"></i>Thêm nhanh địa chỉ
                    </h6>
                  </div>
                  <div class="card-body p-4">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label small mb-1 text-muted">Họ tên người nhận</label>
                        <input
                          type="text"
                          class="form-control rounded-2 shadow-none"
                          placeholder="Lấy tên KH nếu trống"
                          :class="{ 'is-invalid': addressErrors.tenNguoiNhan }"
                          v-model="addressFormData.tenNguoiNhan"
                          @input="clearAddressError('tenNguoiNhan')"
                        />
                        <div class="invalid-feedback">{{ addressErrors.tenNguoiNhan }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small mb-1 text-muted">Số điện thoại</label>
                        <input
                          type="tel"
                          class="form-control rounded-2 shadow-none"
                          placeholder="Lấy SĐT KH nếu trống"
                          :class="{ 'is-invalid': addressErrors.sdtNguoiNhan }"
                          v-model="addressFormData.sdtNguoiNhan"
                          @input="clearAddressError('sdtNguoiNhan')"
                        />
                        <div class="invalid-feedback">{{ addressErrors.sdtNguoiNhan }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small mb-1 text-muted">Thành phố/Tỉnh *</label>
                        <select
                          class="form-select rounded-2 shadow-none text-muted"
                          :class="{ 'is-invalid': addressErrors.tinhThanh }"
                          v-model="addressFormData.tinhThanh"
                          @change="handleAddressProvinceChange"
                        >
                          <option value="">Chọn tỉnh/thành...</option>
                          <option v-for="prov in provinces" :key="prov.name" :value="prov.name">
                            {{ prov.name }}
                          </option>
                        </select>
                        <div class="invalid-feedback">{{ addressErrors.tinhThanh }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small mb-1 text-muted">Quận/Huyện *</label>
                        <select
                          class="form-select rounded-2 shadow-none text-muted"
                          :class="{ 'is-invalid': addressErrors.quanHuyen }"
                          v-model="addressFormData.quanHuyen"
                          :disabled="!addressFormData.tinhThanh"
                          @change="handleAddressDistrictChange"
                        >
                          <option value="">Chọn quận/huyện...</option>
                          <option
                            v-for="dist in addressFormDistricts"
                            :key="dist.code"
                            :value="dist.name"
                          >
                            {{ dist.name }}
                          </option>
                        </select>
                        <div class="invalid-feedback">{{ addressErrors.quanHuyen }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small mb-1 text-muted">Phường/Xã *</label>
                        <select
                          class="form-select rounded-2 shadow-none text-muted"
                          :class="{ 'is-invalid': addressErrors.phuongXa }"
                          v-model="addressFormData.phuongXa"
                          :disabled="!addressFormData.quanHuyen"
                          @change="handleAddressWardChange"
                        >
                          <option value="">Chọn phường/xã...</option>
                          <option
                            v-for="ward in addressFormWards"
                            :key="ward.code"
                            :value="ward.name"
                          >
                            {{ ward.name }}
                          </option>
                        </select>
                        <div class="invalid-feedback">{{ addressErrors.phuongXa }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small mb-1 text-muted">Địa chỉ cụ thể *</label>
                        <input
                          type="text"
                          class="form-control rounded-2 shadow-none"
                          placeholder="Số nhà, đường..."
                          :class="{ 'is-invalid': addressErrors.diaChiCuThe }"
                          v-model="addressFormData.diaChiCuThe"
                          @input="clearAddressError('diaChiCuThe')"
                        />
                        <div class="invalid-feedback">{{ addressErrors.diaChiCuThe }}</div>
                      </div>
                      <div class="col-12 mt-3">
                        <div class="form-check">
                          <input
                            class="form-check-input shadow-none"
                            type="checkbox"
                            id="checkDefault"
                            v-model="addressFormData.isMacDinh"
                          />
                          <label class="form-check-label small text-muted" for="checkDefault"
                            >Đặt làm địa chỉ mặc định</label
                          >
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-end mt-4 pt-3 border-top">
                      <button
                        type="button"
                        class="btn text-white rounded-3 px-4 shadow-sm"
                        style="background-color: #0b1a30"
                        @click="submitAddressForm"
                      >
                        Thêm nhanh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddressBookModal" class="modal-backdrop fade show" style="opacity: 0.5"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const toastMessage = ref('')
const toastType = ref('success')
const showToast = ref(false)
const showPassword = ref(false)

// ĐIỀU KHIỂN VIEW: LIST hoặc FORM
const viewState = ref('LIST')

const displayToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 5000)
}

const customers = ref([])
const filterKeyword = ref('')
const filterStatus = ref('')
const filterGioiTinh = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)

const rawLocations = ref([])
const provinces = ref([])
const districts = ref([])
const wards = ref([])

const fetchProvinces = async () => {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/?depth=3')
    rawLocations.value = await response.json()
    provinces.value = rawLocations.value.map((p) => ({
      name: p.name,
      code: p.code,
      districts: p.districts,
    }))
  } catch (error) {
    console.error('Lỗi:', error)
  }
}

const fetchCustomers = async () => {
  try {
    const url = new URL('http://localhost:8080/api/khach-hang')
    url.searchParams.append('page', currentPage.value - 1)
    url.searchParams.append('size', itemsPerPage.value)
    if (filterKeyword.value) url.searchParams.append('keyword', filterKeyword.value)
    if (filterStatus.value !== '') url.searchParams.append('trangThai', filterStatus.value)
    if (filterGioiTinh.value !== '') url.searchParams.append('gioiTinh', filterGioiTinh.value)

    const response = await fetch(url)
    if (!response.ok) throw new Error('Lỗi mạng')
    const data = await response.json()
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
    customers.value = data.content
  } catch (error) {
    console.error('Lỗi:', error)
  }
}

const applyFilter = () => {
  currentPage.value = 1
  fetchCustomers()
}

let filterTimeout = null
watch([filterKeyword, filterStatus, filterGioiTinh], () => {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    applyFilter()
  }, 400)
})

const clearFilter = () => {
  filterKeyword.value = ''
  filterStatus.value = ''
  filterGioiTinh.value = ''
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchCustomers()
  }
}

watch(itemsPerPage, () => {
  currentPage.value = 1
  fetchCustomers()
})

const toggleCustomerStatus = async (customer) => {
  const newStatus = customer.trangThai === 1 ? 0 : 1
  const payload = { ...customer, trangThai: newStatus }

  try {
    const res = await fetch(`http://localhost:8080/api/khach-hang/${customer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      displayToast(
        `Đã ${newStatus === 1 ? 'mở' : 'ngừng'} hoạt động khách hàng ${customer.maKhachHang}`,
        'success',
      )
      fetchCustomers()
    } else {
      displayToast('Đổi trạng thái thất bại!', 'danger')
      fetchCustomers()
    }
  } catch (e) {
    console.error(e)
  }
}

const showAddressBookModal = ref(false)
const isEditMode = ref(false)
const errors = ref({})
const addressErrors = ref({})

const customerForm = ref({
  id: null,
  hoTen: '',
  maKhachHang: '',
  email: '',
  ngaySinh: '',
  soDienThoai: '',
  gioiTinh: 1,
  matKhau: '',
  trangThai: 1,
  tinhThanh: '',
  quanHuyen: '',
  phuongXa: '',
  diaChiCuThe: '',
  taiKhoan: '',
})

const danhSachDiaChi = ref([])
const showAddressForm = ref(false)
const isEditAddressMode = ref(false)
const addressFormData = ref({
  id: null,
  tenNguoiNhan: '',
  sdtNguoiNhan: '',
  tinhThanh: '',
  quanHuyen: '',
  phuongXa: '',
  diaChiCuThe: '',
  isMacDinh: false,
})
const addressFormDistricts = ref([])
const addressFormWards = ref([])

const onProvinceChange = () => {
  const p = rawLocations.value.find((x) => x.name === customerForm.value.tinhThanh)
  districts.value = p ? p.districts : []
  customerForm.value.quanHuyen = ''
  customerForm.value.phuongXa = ''
  wards.value = []
}
const onDistrictChange = () => {
  const d = districts.value.find((x) => x.name === customerForm.value.quanHuyen)
  wards.value = d ? d.wards : []
  customerForm.value.phuongXa = ''
}

const onAddressFormProvinceChange = () => {
  const p = rawLocations.value.find((x) => x.name === addressFormData.value.tinhThanh)
  addressFormDistricts.value = p ? p.districts : []
  addressFormData.value.quanHuyen = ''
  addressFormData.value.phuongXa = ''
  addressFormWards.value = []
}
const onAddressFormDistrictChange = () => {
  const d = addressFormDistricts.value.find((x) => x.name === addressFormData.value.quanHuyen)
  addressFormWards.value = d ? d.wards : []
  addressFormData.value.phuongXa = ''
}

const clearError = (field) => {
  if (errors.value[field]) delete errors.value[field]
}
const clearAddressError = (field) => {
  if (addressErrors.value[field]) delete addressErrors.value[field]
}

const handleProvinceChange = () => {
  onProvinceChange()
  clearError('tinhThanh')
}

const handleDistrictChange = () => {
  onDistrictChange()
  clearError('quanHuyen')
}

const handleWardChange = () => {
  clearError('phuongXa')
}

const handleAddressProvinceChange = () => {
  onAddressFormProvinceChange()
  clearAddressError('tinhThanh')
}

const handleAddressDistrictChange = () => {
  onAddressFormDistrictChange()
  clearAddressError('quanHuyen')
}

const handleAddressWardChange = () => {
  clearAddressError('phuongXa')
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!customerForm.value.hoTen?.trim()) {
    errors.value.hoTen = 'Vui lòng nhập họ tên'
    isValid = false
  }
  if (!customerForm.value.taiKhoan?.trim()) {
    errors.value.taiKhoan = 'Vui lòng nhập tài khoản'
    isValid = false
  }
  if (!isEditMode.value && !customerForm.value.matKhau?.trim()) {
    errors.value.matKhau = 'Vui lòng nhập mật khẩu'
    isValid = false
  }
  if (!customerForm.value.email?.trim()) {
    errors.value.email = 'Vui lòng nhập email'
    isValid = false
  }
  if (!customerForm.value.soDienThoai?.trim()) {
    errors.value.soDienThoai = 'Vui lòng nhập số điện thoại'
    isValid = false
  }

  if (!isEditMode.value) {
    if (!customerForm.value.diaChiCuThe?.trim()) {
      errors.value.diaChiCuThe = 'Vui lòng nhập số nhà/đường'
      isValid = false
    }
    if (!customerForm.value.tinhThanh) {
      errors.value.tinhThanh = 'Vui lòng chọn tỉnh/thành'
      isValid = false
    }
    if (!customerForm.value.quanHuyen) {
      errors.value.quanHuyen = 'Vui lòng chọn quận/huyện'
      isValid = false
    }
    if (!customerForm.value.phuongXa) {
      errors.value.phuongXa = 'Vui lòng chọn phường/xã'
      isValid = false
    }
  }

  if (customerForm.value.taiKhoan && !/^[a-zA-Z0-9]{5,20}$/.test(customerForm.value.taiKhoan)) {
    errors.value.taiKhoan = 'Tài khoản từ 5-20 ký tự, không chứa ký tự đặc biệt'
    isValid = false
  }
  if (customerForm.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.value.email)) {
    errors.value.email = 'Email không đúng định dạng (VD: example@gmail.com)'
    isValid = false
  }
  if (customerForm.value.soDienThoai && !/^\d{10}$/.test(customerForm.value.soDienThoai)) {
    errors.value.soDienThoai = 'Số điện thoại phải bao gồm đúng 10 chữ số'
    isValid = false
  }
  return isValid
}

const validateAddressForm = () => {
  addressErrors.value = {}
  let isValid = true
  if (!addressFormData.value.diaChiCuThe?.trim()) {
    addressErrors.value.diaChiCuThe = 'Vui lòng nhập số nhà/đường'
    isValid = false
  }
  if (!addressFormData.value.tinhThanh) {
    addressErrors.value.tinhThanh = 'Vui lòng chọn tỉnh/thành'
    isValid = false
  }
  if (!addressFormData.value.quanHuyen) {
    addressErrors.value.quanHuyen = 'Vui lòng chọn quận/huyện'
    isValid = false
  }
  if (!addressFormData.value.phuongXa) {
    addressErrors.value.phuongXa = 'Vui lòng chọn phường/xã'
    isValid = false
  }

  if (addressFormData.value.sdtNguoiNhan && !/^\d{10}$/.test(addressFormData.value.sdtNguoiNhan)) {
    addressErrors.value.sdtNguoiNhan = 'Số điện thoại phải bao gồm đúng 10 chữ số'
    isValid = false
  }
  return isValid
}

const goToAdd = () => {
  viewState.value = 'FORM'
  isEditMode.value = false
  showPassword.value = false
  errors.value = {}
  showAddressForm.value = false
  customerForm.value = {
    id: null,
    hoTen: '',
    maKhachHang: '',
    email: '',
    ngaySinh: '',
    soDienThoai: '',
    gioiTinh: 1,
    matKhau: '',
    trangThai: 1,
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    diaChiCuThe: '',
    taiKhoan: '',
  }
  districts.value = []
  wards.value = []
}

const goToEdit = async (customer) => {
  isEditMode.value = true
  showPassword.value = false
  errors.value = {}
  showAddressForm.value = false
  try {
    const res = await fetch(`http://localhost:8080/api/khach-hang/${customer.id}`)
    if (!res.ok) throw new Error('Lỗi fetch')
    const data = await res.json()
    customerForm.value = { ...data }
    danhSachDiaChi.value = data.danhSachDiaChi || []
    viewState.value = 'FORM'
  } catch (error) {
    displayToast('Lỗi khi tải thông tin khách hàng!', 'danger')
  }
}

const goBack = () => {
  viewState.value = 'LIST'
}

const openAddressBook = async (customer) => {
  try {
    const res = await fetch(`http://localhost:8080/api/khach-hang/${customer.id}`)
    const data = await res.json()
    customerForm.value = { ...data }
    danhSachDiaChi.value = data.danhSachDiaChi || []

    addressFormData.value = {
      id: null,
      tenNguoiNhan: '',
      sdtNguoiNhan: '',
      tinhThanh: '',
      quanHuyen: '',
      phuongXa: '',
      diaChiCuThe: '',
      isMacDinh: danhSachDiaChi.value.length === 0,
    }
    addressFormDistricts.value = []
    addressFormWards.value = []
    addressErrors.value = {}

    showAddressBookModal.value = true
  } catch (error) {
    displayToast('Lỗi tải thông tin địa chỉ!', 'danger')
  }
}

const closeModal = () => {
  showAddressBookModal.value = false
}

const saveCustomerInfo = async () => {
  if (!validateForm()) return
  const method = isEditMode.value ? 'PUT' : 'POST'
  const url = isEditMode.value
    ? `http://localhost:8080/api/khach-hang/${customerForm.value.id}`
    : 'http://localhost:8080/api/khach-hang'

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerForm.value),
    })
    if (!res.ok) {
      const err = await res.text()
      if (err === 'ERR_EMAIL') errors.value.email = 'Email đã tồn tại trong hệ thống'
      else if (err === 'ERR_TK') errors.value.taiKhoan = 'Tài khoản đã tồn tại trong hệ thống'
      else if (err === 'ERR_SDT') errors.value.soDienThoai = 'Số điện thoại đã tồn tại'
      else displayToast('Lỗi hệ thống', 'danger')
      return
    }
    displayToast(
      isEditMode.value ? 'Cập nhật thông tin thành công!' : 'Thêm mới khách hàng thành công!',
    )
    goBack()
    fetchCustomers()
  } catch (error) {
    console.error('Lỗi:', error)
  }
}

const openAddAddressForm = () => {
  isEditAddressMode.value = false
  addressErrors.value = {}
  addressFormData.value = {
    id: null,
    tenNguoiNhan: '',
    sdtNguoiNhan: '',
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    diaChiCuThe: '',
    isMacDinh: danhSachDiaChi.value.length === 0,
  }
  addressFormDistricts.value = []
  addressFormWards.value = []
  showAddressForm.value = true
}

const openEditAddressForm = (addr) => {
  isEditAddressMode.value = true
  addressErrors.value = {}
  addressFormData.value = { ...addr }
  const p = rawLocations.value.find((x) => x.name === addr.tinhThanh)
  addressFormDistricts.value = p ? p.districts : []
  const d = addressFormDistricts.value.find((x) => x.name === addr.quanHuyen)
  addressFormWards.value = d ? d.wards : []
  showAddressForm.value = true
}

const fetchAddressesForModal = async (id) => {
  try {
    const res = await fetch(`http://localhost:8080/api/khach-hang/${id}`)
    const data = await res.json()
    danhSachDiaChi.value = data.danhSachDiaChi || []
  } catch (error) {
    console.error('Lỗi load địa chỉ', error)
  }
}

const submitAddressForm = async () => {
  if (!validateAddressForm()) return
  try {
    const url = `http://localhost:8080/api/khach-hang/${customerForm.value.id}/dia-chi`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressFormData.value),
    })
    if (res.ok) {
      displayToast(
        isEditAddressMode.value ? 'Cập nhật địa chỉ thành công!' : 'Thêm mới địa chỉ thành công!',
      )
      showAddressForm.value = false
      await fetchAddressesForModal(customerForm.value.id)
      fetchCustomers()
      addressFormData.value = {
        tenNguoiNhan: '',
        sdtNguoiNhan: '',
        tinhThanh: '',
        quanHuyen: '',
        phuongXa: '',
        diaChiCuThe: '',
        isMacDinh: false,
      }
      addressFormDistricts.value = []
      addressFormWards.value = []
    } else {
      displayToast('Thao tác thất bại!', 'danger')
    }
  } catch (error) {
    console.error(error)
  }
}

const setDefaultAddress = async (addressId) => {
  danhSachDiaChi.value.forEach((addr) => {
    addr.isMacDinh = addr.id === addressId
  })
  displayToast('Đã thiết lập địa chỉ mặc định!', 'success')
}

onMounted(() => {
  fetchCustomers()
  fetchProvinces()
})
</script>
