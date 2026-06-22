<template>
  <div class="client-home bg-white" style="min-height: 100vh">
    <div class="position-fixed" style="top: 80px; right: 0; z-index: 9999; margin-right: 15px;">
      <div v-if="toast.show" 
           class="custom-toast shadow-sm" 
           :class="toast.type === 'danger' ? 'danger' : ''">
        
        <i class="bi toast-icon" 
           :class="toast.type === 'danger' ? 'bi-x-circle-fill text-danger' : toast.type === 'warning' ? 'bi-exclamation-triangle-fill text-warning' : 'bi-check-circle-fill text-success'"></i>
        
        <div class="toast-body fw-medium text-dark" style="font-size: 0.95rem; white-space: pre-line;">
          {{ toast.message }}
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg sticky-top py-3 border-bottom shadow-sm" style="background-color: #ffffff !important">
      <div class="container-fluid px-4 px-lg-5">
        <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
          <img src="/Logo.png" alt="Logo Giai Đài" style="height: 60px; object-fit: contain" />
        </router-link>

        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-5 text-center align-items-center justify-content-center">
            <li class="nav-item"><router-link to="/" class="nav-link fw-medium nav-text">TRANG CHỦ</router-link></li>
            <li class="nav-item"><router-link to="/gioi-thieu" class="nav-link fw-medium nav-text">GIỚI THIỆU</router-link></li>
            <li class="nav-item"><router-link to="/cua-hang" class="nav-link fw-medium nav-text" active-class="active-link">SẢN PHẨM</router-link></li>
            <li class="nav-item"><router-link to="/don-hang" class="nav-link fw-medium nav-text ">ĐƠN HÀNG</router-link></li>
            <li class="nav-item"><router-link to="/tra-cuu" class="nav-link fw-medium nav-text">TRA CỨU</router-link></li>
            <li class="nav-item"><router-link to="/lien-he" class="nav-link fw-medium nav-text">LIÊN HỆ</router-link></li>
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

    <!-- MÀN HÌNH DANH SÁCH SẢN PHẨM -->
    <div v-if="currentView === 'PRODUCTS'" class="container-fluid px-4 px-lg-5 py-5">
      <section class="text-center mb-5">
        <h2 class="title-cursive-elegant text-center mb-3" style="font-size: 3.5rem; color: #3d211a;">Áo Dài Giai Đài</h2>
        <p class="lh-lg fst-italic mx-auto" style="font-size: 1rem; color: #6f4d38; max-width: 700px;">
          "Mang trong mình vẻ đẹp truyền thống, tinh khôi và đằm thắm. Từng đường kim mũi chỉ là sự chắt chiu tinh hoa văn hóa Việt."
        </p>
      </section>

      <div class="row g-4">
        <!-- CỘT BỘ LỌC BÊN TRÁI -->
        <div class="col-12 col-lg-3">
          <div class="card border-0 shadow-sm p-4 bg-white rounded-3" style="border: 1px solid #f0e9df !important;">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0" style="color: #3D211A; letter-spacing: 0.5px;">Bộ lọc sản phẩm</h5>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Từ khóa</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-start-0 ps-0 shadow-none" placeholder="Tên sản phẩm..." v-model="searchKeyword" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Khoảng giá</label>
              <div class="d-flex gap-2">
                <input type="text" class="form-control form-control-sm" placeholder="Giá Từ" 
                       v-model="minPriceStr" @input="formatInput('min')">
                <input type="text" class="form-control form-control-sm" placeholder="Giá Đến" 
                       v-model="maxPriceStr" @input="formatInput('max')">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Loại sản phẩm (Danh mục)</label>
              <select class="form-select shadow-none" v-model="currentCategory">
                <option value="Tất cả">Tất cả danh mục</option>
                <option v-for="cat in categoriesList" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Thương hiệu</label>
              <select class="form-select shadow-none" v-model="filterBrand">
                <option value="Tất cả">Tất cả thương hiệu</option>
                <option v-for="brand in brandsList" :key="brand" :value="brand">{{ brand }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted mb-2">Màu sắc</label>
              <select class="form-select shadow-none" v-model="filterColor">
                <option value="">Tất cả màu sắc</option>
                <option v-for="color in dynamicColorsFilter" :key="color" :value="color">{{ color }}</option>
              </select>
            </div>

            <button class="btn w-100 text-white fw-medium py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 btn-main-brown mt-3" @click="clearAllFilters">
              <i class="bi bi-arrow-counterclockwise"></i> Xóa toàn bộ bộ lọc
            </button>
          </div>
        </div>

        <!-- CỘT DANH SÁCH SẢN PHẨM BÊN PHẢI -->
        <div class="col-12 col-lg-9">
          <!-- ĐANG TẢI -->
          <div v-if="isLoading" class="card border-0 shadow-sm text-center p-5 bg-white rounded-3 d-flex flex-column justify-content-center align-items-center" style="min-height: 400px;">
            <div class="spinner-border mb-3" style="width: 3rem; height: 3rem; color: #6f4d38;" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
            <h5 class="fw-bold" style="color: #3d211a;">Đang tải dữ liệu sản phẩm, vui lòng đợi...</h5>
          </div>

          <!-- TRỐNG -->
          <div v-else-if="filteredProductList.length === 0" class="card border-0 shadow-sm text-center p-5 bg-white rounded-3">
            <i class="bi bi-search-heart text-muted mb-3" style="font-size: 3rem;"></i>
            <h5 class="fw-bold" style="color: #3d211a;">Không tìm thấy sản phẩm phù hợp trong hệ thống</h5>
          </div>

          <!-- LƯỚI SẢN PHẨM -->
          <div v-else class="row g-4 justify-content-start mt-0 animate__animated animate__fadeIn">
            <div class="col-12 col-sm-6 col-lg-4" v-for="product in filteredProductList" :key="product.id">
              <div class="card border-0 shadow-none h-100 product-card-v2 text-center bg-white d-flex flex-column justify-content-between" style="cursor: pointer;" @click="showDetail(product)">
                <div>
                  <div class="position-relative overflow-hidden mb-3 bg-white border rounded-2 d-flex align-items-center justify-content-center" style="height: 400px">
                    <span v-if="product.hasDiscount" class="position-absolute top-0 start-0 badge bg-danger m-2 px-2 py-1 rounded-1 shadow-sm" style="z-index: 5; font-size: 0.8rem;">
                      -{{ product.discountPercent }}%
                    </span>
                    <img :src="product.image || '/Logo.png'" @error="handleImageError" class="w-100 h-100 object-fit-cover product-img" :alt="product.name" />
                  </div>
                  <div class="card-body p-0 bg-white d-flex flex-column align-items-center">
                    <h5 class="fw-bold mb-1 px-2" style="font-size: 1.1rem; color: #3d211a; font-family: 'Playfair Display', sans-serif; min-height: 2.4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      {{ product.name }}
                    </h5>
                    <div class="mb-3 d-flex flex-column align-items-center gap-1">
                      <span class="fw-bold" style="font-size: 1.15rem; color: #dc3545;">
                        {{ product.priceRangeLabel }}
                      </span>
                      <span class="text-muted text-decoration-line-through small" v-if="product.hasDiscount && product.originalPriceLabel">
                        {{ product.originalPriceLabel }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="px-3 pb-2">
                  <button class="btn btn-sm w-100 btn-outline-brown py-2 fw-medium" style="font-size: 0.85rem;">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MÀN HÌNH CHI TIẾT SẢN PHẨM -->
    <div v-else-if="currentView === 'PRODUCT_DETAIL' && selectedProduct" class="container py-5 mt-2 animate__animated animate__fadeIn" style="min-height: 70vh">
      <button class="btn btn-link text-decoration-none mb-4 px-0 fw-medium" style="color: #3D211A" @click="currentView = 'PRODUCTS'">
        <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
      </button>

      <!-- PHẦN ĐẦU CHI TIẾT -->
      <div class="row g-5 mb-5">
        <!-- ẢNH SLIDER -->
        <div class="col-md-6">
          <div class="rounded-2 overflow-hidden position-relative d-flex align-items-center justify-content-center bg-white border style-main-frame" style="height: 550px">
            <button v-if="allProductImages.length > 1" @click.stop="prevImage" class="btn position-absolute start-0 top-50 translate-middle-y ms-2 slider-arrow shadow-sm">
              <i class="bi bi-chevron-left fs-5"></i>
            </button>
            <img :src="allProductImages[currentImageIndex]" @error="handleImageError" class="w-100 h-100 object-fit-cover" :alt="selectedProduct.name" />
            <button v-if="allProductImages.length > 1" @click.stop="nextImage" class="btn position-absolute end-0 top-50 translate-middle-y me-2 slider-arrow shadow-sm">
              <i class="bi bi-chevron-right fs-5"></i>
            </button>
            <div v-if="allProductImages.length > 1" class="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
              <span v-for="(img, idx) in allProductImages" :key="idx" class="slider-dot" :class="{ 'active': currentImageIndex === idx }" @click="currentImageIndex = idx"></span>
            </div>
          </div>
        </div>

        <!-- THÔNG TIN VÀ FORM MUA -->
        <div class="col-md-6">
          <h1 class="fw-bold mb-2" style="font-family: 'Playfair Display', sans-serif; color: #3d211a; font-size: 2.2rem;">
            {{ selectedProduct.name }}
          </h1>
          
          <div class="mb-3 small text-muted d-flex gap-3">
            <span>Mã SKU: <strong class="text-dark">{{ selectedVariantInfo?.maSku || 'Vui lòng chọn size...' }}</strong></span>
            <span>|</span>
            <span>Thương hiệu: <strong class="text-dark">{{ selectedProduct.thuongHieu || 'Chưa cập nhật' }}</strong></span>
          </div>

          <!-- ĐÁNH GIÁ TRUNG BÌNH -->
          <div class="d-flex align-items-center gap-2 mb-3" style="cursor: pointer;" @click="scrollToReviews">
            <span class="text-danger fw-bold fs-5">{{ averageRating }}</span>
            <div class="fs-5 my-1 d-flex gap-1">
              <i class="bi bi-star-fill text-warning" v-for="n in Math.round(Number(averageRating))" :key="'top-s-'+n"></i>
              <i class="bi bi-star text-muted opacity-50" v-for="n in (5 - Math.round(Number(averageRating)))" :key="'top-e-'+n"></i>
            </div>
            <span class="text-muted small">({{ productReviews.length }} đánh giá)</span>
          </div>

          <!-- GIÁ SẢN PHẨM -->
          <div class="d-flex align-items-center gap-3 mb-4 flex-wrap">
            <h2 class="fw-bold mb-0" style="color: #dc3545; font-size: 1.8rem; transition: color 0.3s ease;">
              {{ displayPrice }}
            </h2>
            <span class="text-muted text-decoration-line-through fs-5" v-if="displayOriginalPrice">
              {{ displayOriginalPrice }}
            </span>
            <span v-if="displayDiscountPercent > 0" class="badge bg-danger fs-6 py-1 px-2 rounded-1 animate__animated animate__rubberBand">
              -{{ displayDiscountPercent }}%
            </span>
          </div>

          <!-- BẢNG CHỌN BIẾN THỂ -->
          <div class="p-4 rounded-2 mb-4" style="background-color: #faf8f5; border: 1px solid #f2edd9;">
            <div class="d-flex align-items-center mb-4">
              <span class="text-secondary fw-medium" style="width: 110px; font-size: 0.95rem;">Màu Sắc</span>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="color in uniqueColors" :key="color" class="btn variant-brown-btn" :class="{ active: selectedColor === color }" @click="selectColor(color)">
                  {{ color }}
                </button>
              </div>
            </div>

            <div class="d-flex align-items-center mb-4">
              <span class="text-secondary fw-medium" style="width: 110px; font-size: 0.95rem;">Kích Cỡ</span>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="size in uniqueSizes" :key="size" class="btn variant-brown-btn" :class="{ active: selectedSize === size, 'disabled-brown': isSizeDisabledForCurrentColor(size) }" :disabled="isSizeDisabledForCurrentColor(size)" @click="selectSize(size)">
                  {{ size }}
                </button>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <span class="text-secondary fw-medium" style="width: 110px; font-size: 0.95rem;">Số Lượng</span>
              <div class="d-flex align-items-center gap-3">
                <div class="quantity-selector d-flex border bg-white rounded-2 overflow-hidden" :class="{ 'opacity-50': !selectedColor || !selectedSize }" style="width: 120px; height: 38px;">
                  <button class="btn border-0 shadow-none px-3" :disabled="!selectedColor || !selectedSize || quantity <= 1" @click="handleDecreaseQty" style="background: #f8f9fa; color: #3d211a; font-weight: bold; border-right: 1px solid #dee2e6 !important;">-</button>
                  <input type="text" class="form-control border-0 text-center shadow-none p-0 fw-bold bg-white" v-model="quantity" :disabled="!selectedColor || !selectedSize" @input="validateQtyInput" @blur="handleQtyBlur" style="color: #3d211a; font-size: 0.95rem;" />
                  <button class="btn border-0 shadow-none px-3" :disabled="!selectedColor || !selectedSize || quantity >= currentMaxStock" @click="handleIncreaseQty" style="background: #f8f9fa; color: #3d211a; font-weight: bold; border-left: 1px solid #dee2e6 !important;">+</button>
                </div>
                <span class="text-muted small">
                  {{ (!selectedColor || !selectedSize) ? 'Vui lòng chọn màu và size' : stockMessage }}
                </span>
              </div>
            </div>
          </div>

          <div class="d-flex gap-3 mt-4">
            <button class="btn flex-fill fw-bold py-3 btn-outline-brown" @click="handleAddToCart">
              Thêm vào giỏ hàng
            </button>
            <button class="btn flex-fill text-white fw-bold py-3 btn-main-brown" @click="handleBuyNow">
              Mua ngay
            </button>
          </div>

          <!-- CAM KẾT -->
          <div class="mt-4 pt-3 border-top d-flex flex-wrap justify-content-start gap-4 text-dark align-items-center style-service-bar">
            <div class="d-flex align-items-center gap-2 font-medium small" style="color: #3D211A;">
              <i class="bi bi-arrow-counterclockwise fs-5 text-danger"></i>
              <span class="fw-bold">Đổi trả hàng trong 15 ngày</span>
            </div>
            <div class="vertical-divider d-none d-sm-block"></div>
            <div class="d-flex align-items-center gap-2 font-medium small" style="color: #3D211A;">
              <i class="bi bi-shield-check fs-5 text-danger"></i>
              <span class="fw-bold">Bảo hiểm thời trang</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MÔ TẢ CHI TIẾT SẢN PHẨM -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="product-description p-4 rounded-3 bg-white shadow-sm" style="border: 1px solid #eadecc; color: #523b2e">
            <h5 class="fw-bold mb-3 pb-2 text-uppercase" style="color: #3d211a; border-bottom: 2px solid #3d211a; display: inline-block; letter-spacing: 0.5px;">
              Mô tả chi tiết sản phẩm
            </h5>
            <p class="mb-4 text-secondary lh-lg" style="font-size: 1rem; white-space: pre-line;">
              {{ selectedProduct.desc }}
            </p>
            <div class="row g-3 bg-light p-3 rounded-2" style="background-color: #fafafa !important;">
              <div class="col-12 col-sm-6">
                <span class="text-muted">Cổ áo:</span> <strong class="ms-1 text-dark">{{ selectedProduct.coAo || 'Cổ tròn truyền thống' }}</strong>
              </div>
              <div class="col-12 col-sm-6">
                <span class="text-muted">Tay áo:</span> <strong class="ms-1 text-dark">{{ selectedProduct.tayAo || 'Tay lỡ tôn dáng' }}</strong>
              </div>
              <div class="col-12 col-sm-6">
                <span class="text-muted">Chất liệu:</span> <strong class="ms-1 text-dark">{{ selectedProduct.chatLieu || 'Tơ lụa cao cấp tự nhiên' }}</strong>
              </div>
              <div class="col-12 col-sm-6">
                <span class="text-muted">Kiểu dáng:</span> <strong class="ms-1 text-dark">{{ selectedProduct.kieuDang || 'Phom suông cách tân' }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ĐÁNH GIÁ SẢN PHẨM -->
      <div class="row mt-4" id="review-section">
        <div class="col-12">
          <div class="p-4 rounded-3 bg-white shadow-sm" style="border: 1px solid #eadecc;">
            <h5 class="fw-bold mb-4 pb-2 text-uppercase" style="color: #3d211a; border-bottom: 2px solid #3d211a; display: inline-block; letter-spacing: 0.5px;">
              Đánh giá sản phẩm
            </h5>
            
            <div class="d-flex align-items-center gap-4 mb-4 p-4 rounded-3" style="background-color: #faf8f5; border: 1px solid #f2edd9;">
              <div class="text-center px-4" style="border-right: 1px solid #dcd1c4;">
                <div class="fw-bold" style="font-size: 2.5rem; color: #dc3545; line-height: 1;">{{ averageRating }}</div>
                <div class="fs-5 my-1 d-flex gap-1 justify-content-center">
                  <i class="bi bi-star-fill text-warning" v-for="n in Math.round(Number(averageRating))" :key="'star-'+n"></i>
                  <i class="bi bi-star text-muted opacity-50" v-for="n in (5 - Math.round(Number(averageRating)))" :key="'empty-'+n"></i>
                </div>
              </div>
              
              <!-- Bộ lọc sao -->
              <div class="d-flex flex-wrap gap-2 flex-grow-1 ps-2">
                <button class="btn btn-sm btn-outline-brown rounded-1 px-3 py-2" 
                        :class="{ 'active': selectedStarFilter === 'all' }" 
                        @click="selectedStarFilter = 'all'">
                  Tất cả ({{ productReviews.length }})
                </button>
                <button v-for="star in [5, 4, 3, 2, 1]" :key="'btn-'+star"
                        class="btn btn-sm btn-outline-brown rounded-1 px-3 py-2"
                        :class="{ 'active': selectedStarFilter === star }"
                        @click="selectedStarFilter = star">
                  {{ star }} Sao ({{ countReviewsByStar(star) }})
                </button>
              </div>
            </div>

            <div v-if="productReviews.length === 0" class="text-center text-muted my-5 py-3">
              <i class="bi bi-chat-square-dots fs-1 d-block mb-3 opacity-50"></i>
              Chưa có đánh giá nào cho sản phẩm này.
            </div>
            <div v-else-if="filteredReviews.length === 0" class="text-center text-muted my-5 py-3">
              <i class="bi bi-chat-square-dots fs-1 d-block mb-3 opacity-50"></i>
              Không có đánh giá nào phù hợp với bộ lọc này.
            </div>
            
            <!-- List Review -->
            <div v-else class="review-list mt-2">
              <div v-for="(rv, idx) in filteredReviews" :key="idx" 
                   class="d-flex gap-3 mb-4 pb-4" 
                   :class="{'border-bottom': idx !== filteredReviews.length - 1}">
                
                <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                     style="width: 45px; height: 45px; font-size: 1.2rem; background-color: #eadecc; color: #3d211a;">
                  {{ rv.ten_khach_hang ? rv.ten_khach_hang.charAt(0).toUpperCase() : 'K' }}
                </div>
                
                <div class="flex-grow-1">
                  <div class="fw-bold text-dark fs-6">{{ rv.ten_khach_hang || 'Khách hàng' }}</div>
                  
                  <div class="text-warning small my-1">
                    <i class="bi bi-star-fill" v-for="s in rv.diem_danh_gia" :key="s"></i>
                    <i class="bi bi-star" v-for="e in (5 - rv.diem_danh_gia)" :key="'e-'+e"></i>
                  </div>
                  
                  <div class="text-muted small mb-2 d-flex align-items-center gap-2">
                    <span>Phân loại: {{ rv.ten_mau }} - {{ rv.ten_kich_co }}</span>
                    <span>|</span>
                    <span>{{ formatReviewDate(rv.ngay_tao) }}</span>
                  </div>
                  
                  <p class="mb-0 text-dark" style="white-space: pre-line; background-color: #fafafa; padding: 12px; border-radius: 6px;">
                    {{ rv.nhan_xet || 'Khách hàng không để lại nhận xét.' }}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <footer class="footer-section pt-5 pb-4 mt-5 bg-white" style="border-top: 1px solid #cbb799">
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img src="/Logo.png" alt="Logo Giai Đài" style="height: 55px; object-fit: contain" class="mb-3" />
            <p class="small lh-lg" style="color: #6f4d38">Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam.</p>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Về chúng tôi</h6>
            <ul class="list-unstyled footer-links">
              <li><router-link to="/gioi-thieu">Câu chuyện thương hiệu</router-link></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Liên hệ</h6>
            <ul class="list-unstyled footer-links text-muted small">
              <li><i class="bi bi-telephone-fill me-2" style="color: #a07856"></i><span style="color: #6f4d38">0123 456 789</span></li>
              <li><i class="bi bi-envelope-fill me-2" style="color: #a07856"></i><span style="color: #6f4d38">cskh@giaidai.vn</span></li>
            </ul>
          </div>
        </div>
        <div class="text-center pt-4 mt-4" style="border-top: 1px solid #f0f0f0">
          <p class="small mb-0" style="color: #a07856">&copy; 2026 Giai Đài. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addToCart, cartCount, cartState } from '../../store/cartStore.js'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const currentUsername = ref(localStorage.getItem('username') || 'Guest')
let pollingInterval = null; 
let isFetchingRealtime = false; 

// ĐỒNG BỘ GIỎ HÀNG 
onMounted(() => {
  const storedCart = localStorage.getItem('cart') || localStorage.getItem('cart')
  if (storedCart) {
    try {
      const parsedCart = JSON.parse(storedCart)
      if (Array.isArray(parsedCart)) {
        cartCount.value = parsedCart.reduce((total, item) => total + (item.quantity || 1), 0)
      }
    } catch (error) {}
  }
})

const minPriceStr = ref('');
const maxPriceStr = ref('');

const productReviews = ref([]);
const selectedStarFilter = ref('all');

const averageRating = computed(() => {
  if (productReviews.value.length === 0) return "0.0";
  const sum = productReviews.value.reduce((acc, r) => acc + (r.diem_danh_gia || 0), 0);
  return (sum / productReviews.value.length).toFixed(1);
});

const filteredReviews = computed(() => {
  if (selectedStarFilter.value === 'all') {
    return productReviews.value;
  }
  return productReviews.value.filter(r => r.diem_danh_gia === selectedStarFilter.value);
});

const countReviewsByStar = (star) => {
  return productReviews.value.filter(r => r.diem_danh_gia === star).length;
};

const formatReviewDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

const scrollToReviews = () => {
  const el = document.getElementById('review-section');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const parsePrice = (str) => {
  if (!str) return null;
  return parseInt(str.toString().replace(/\./g, ''));
};

const formatInput = (type) => {
  let val = (type === 'min' ? minPriceStr.value : maxPriceStr.value).replace(/\./g, '');
  if (!isNaN(val) && val !== '') {
    const formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (type === 'min') minPriceStr.value = formatted;
    else maxPriceStr.value = formatted;
  }
};

const toast = ref({ show: false, message: '', type: 'success' });

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const handleLogout = () => { 
  localStorage.removeItem('username')
  localStorage.removeItem('userRole')
  localStorage.removeItem('token')
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('token')
  
  cartState.items = []
  currentUsername.value = 'Guest'
  cartCount.value = 0
  
  showToast('Đăng xuất thành công!', 'success')
  setTimeout(() => { window.location.href = '/dang-nhap' }, 500)
}

const handleImageError = (e) => {
  e.target.src = '/Logo.png' 
  e.target.style.objectFit = 'contain'
  e.target.onerror = null 
}

const currentView = ref('PRODUCTS')
const selectedProduct = ref(null)

const selectedColor = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)
const currentImageIndex = ref(0)

const searchKeyword = ref('')
const currentCategory = ref('Tất cả') 
const filterBrand = ref('Tất cả') 
const filterColor = ref('')

const allProductsMaster = ref([])
const categoriesList = ref([])
const brandsList = ref([])

const dynamicColorsFilter = computed(() => {
  const colors = []
  allProductsMaster.value.forEach(p => {
    if (p.variants) {
      p.variants.forEach(v => { if (v.tenMau) colors.push(v.tenMau) })
    }
  })
  return [...new Set(colors)]
})

const formatVND = (value) => {
  if (value === undefined || value === null) return '0 đ'
  return value.toLocaleString('vi-VN') + ' đ'
}

const formatProductImage = (imgName) => {
  if (!imgName || imgName === 'null' || imgName === 'undefined') return '/Logo.png' 
  if (imgName.startsWith('data:image')) return imgName
  if (imgName.startsWith('http://') || imgName.startsWith('https://')) return imgName
  return `http://localhost:8080/api/sanpham-chitiet/images/${imgName}`
}

const fetchFiltersData = async () => {
  try {
    const catRes = await axios.get('http://localhost:8080/api/danh-muc')
    if (catRes.data && Array.isArray(catRes.data)) {
      const activeCats = catRes.data.filter(item => item.trangThai === 1)
      const sortedCats = activeCats.sort((a, b) => b.id - a.id)
      categoriesList.value = sortedCats.map(c => (c.tenDanhMuc || c.ten || '').trim()).filter(Boolean)
    }
  } catch (error) { console.error('Lỗi khi tải danh mục:', error) }

  try {
    const brandRes = await axios.get('http://localhost:8080/api/thuong-hieu')
    if (brandRes.data && Array.isArray(brandRes.data)) {
      const activeBrands = brandRes.data.filter(item => item.trangThai === 1)
      const sortedBrands = activeBrands.sort((a, b) => b.id - a.id)
      brandsList.value = sortedBrands.map(b => (b.tenThuongHieu || b.ten || '').trim()).filter(Boolean)
    }
  } catch (error) { console.error('Lỗi tải thương hiệu:', error) }
}

// =========================================================================================
// HÀM TẢI SẢN PHẨM & CẬP NHẬT REAL-TIME (KHÔNG ĐỘ TRỄ, KHÔNG NGHẼN SERVER)
// =========================================================================================
const loadAllProductsFromServer = async (isSilent = false) => {
  if (isFetchingRealtime) return; 
  isFetchingRealtime = true;

  if (allProductsMaster.value.length === 0 && !isSilent) isLoading.value = true;
  try {
    const timestamp = new Date().getTime();
    const response = await axios.get(`http://localhost:8080/api/sanpham?t=${timestamp}`); 
    if (response.data && response.data.length > 0) {
      
      const parentProducts = response.data.filter(p => p.trangThai === 1 || p.trangThai === true);
      const fullLoadedProducts = [];

      for (const p of parentProducts) {
        let variants = [];
        try {
          const variantRes = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${p.id}?t=${timestamp}`);
          variants = variantRes.data || [];
        } catch (err) { }

        let priceRangeLabel = 'Chưa cập nhật giá';
        let originalPriceLabel = ''; 
        let defaultImg = p.hinhAnhDaiDien || p.hinh_anh_dai_dien;
        let hasDiscount = false;
        let maxDiscountPercent = 0;

        if (variants.length > 0) {
          const prices = variants.map(v => Number(v.giaSauGiam || v.gia_sau_giam || v.giaBan || v.gia_ban || 0));
          const originalPrices = variants.map(v => Number(v.giaBan || v.gia_ban || v.giaSauGiam || v.gia_sau_giam || 0));
          
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          variants.forEach(v => {
            const gGoc = Number(v.giaBan || v.gia_ban || 0);
            const gGiam = Number(v.giaSauGiam || v.gia_sau_giam || gGoc);
            if (gGoc > 0 && gGoc > gGiam) {
              hasDiscount = true;
              const pct = Math.round(((gGoc - gGiam) / gGoc) * 100);
              if (pct > maxDiscountPercent) maxDiscountPercent = pct;
            }
          });

          if (minPrice > 0 && minPrice === maxPrice) {
            priceRangeLabel = formatVND(minPrice);
          } else if (minPrice > 0 && minPrice < maxPrice) {
            priceRangeLabel = `${minPrice.toLocaleString('vi-VN')} ~ ${maxPrice.toLocaleString('vi-VN')} đ`;
          }

          if (hasDiscount) {
            const minOriginal = Math.min(...originalPrices);
            const maxOriginal = Math.max(...originalPrices);
            if (minOriginal === maxOriginal) {
              originalPriceLabel = formatVND(minOriginal);
            } else {
              originalPriceLabel = `${minOriginal.toLocaleString('vi-VN')} ~ ${maxOriginal.toLocaleString('vi-VN')} đ`;
            }
          }

          if (!defaultImg) {
            defaultImg = variants[0].hinhAnh || variants[0].hinh_anh || variants[0].image;
          }
        }

        const tenDM = p.danhMuc?.tenDanhMuc || p.danhMuc?.ten || (typeof p.danhMuc === 'string' ? p.danhMuc : p.tenDanhMuc) || '';
        const tenTH = p.thuongHieu?.tenThuongHieu || p.thuongHieu?.ten || (typeof p.thuongHieu === 'string' ? p.thuongHieu : p.tenThuongHieu) || '';

        fullLoadedProducts.push({
          id: p.id,
          name: p.tenSanPham || p.name,
          category: tenDM.trim(), 
          thuongHieu: tenTH.trim(), 
          desc: p.moTa || 'Kiểu dáng suông tà dài mềm mại quyến rũ phong cách quý phái.',
          image: formatProductImage(defaultImg),
          variants: variants,
          priceRangeLabel: priceRangeLabel,
          originalPriceLabel: originalPriceLabel,
          hasDiscount: hasDiscount,
          discountPercent: maxDiscountPercent
        });
      }
      
      fullLoadedProducts.sort((a, b) => b.id - a.id);
      allProductsMaster.value = fullLoadedProducts;

      // NẾU KHÁCH ĐANG Ở TRANG CHI TIẾT SẢN PHẨM -> CẬP NHẬT REALTIME TRỰC TIẾP
      if (currentView.value === 'PRODUCT_DETAIL' && selectedProduct.value) {
        const stillActive = fullLoadedProducts.find(p => p.id === selectedProduct.value.id);
        if (!stillActive) {
           currentView.value = 'PRODUCTS';
           showToast('Sản phẩm này vừa ngừng kinh doanh!', 'warning');
        } else {
           availableVariants.value = stillActive.variants;
           selectedProduct.value.image = stillActive.image;
        }
      }

    } else {
      allProductsMaster.value = []; 
    }
  } catch (error) {
    if (!isSilent) allProductsMaster.value = []; 
  } finally {
    if (!isSilent) isLoading.value = false;
    isFetchingRealtime = false;
  }
}
// =========================================================================================

const fetchReviewsForProduct = async (productId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/hoadon/danh-gia/san-pham/${productId}`);
    productReviews.value = res.data || [];
  } catch (err) {
    productReviews.value = [];
  }
}

const filteredProductList = computed(() => {
  return allProductsMaster.value.filter(product => {
    const prices = product.variants ? product.variants.map(v => Number(v.giaSauGiam || v.gia_sau_giam || v.giaBan || v.gia_ban || 0)) : [0];
    const productMinPrice = Math.min(...prices);

    const min = parsePrice(minPriceStr.value);
    const max = parsePrice(maxPriceStr.value);

    const matchCategory = currentCategory.value === 'Tất cả' || (product.category === currentCategory.value.trim());
    const matchKeyword = !searchKeyword.value || product.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    const matchMin = min === null || productMinPrice >= min;
    const matchMax = max === null || productMinPrice <= max;
    const matchBrand = filterBrand.value === 'Tất cả' || product.thuongHieu === filterBrand.value.trim();
    const matchColor = filterColor.value === '' || (product.variants && product.variants.some(v => v.tenMau === filterColor.value));

    return matchCategory && matchKeyword && matchMin && matchMax && matchBrand && matchColor;
  });
});

const availableVariants = ref([])

const uniqueColors = computed(() => {
  const colors = availableVariants.value.map(v => v.tenMau)
  return [...new Set(colors)]
})

const uniqueSizes = computed(() => {
  const sizes = availableVariants.value.map(v => v.tenKichCo)
  return [...new Set(sizes)]
})

const isSizeDisabledForCurrentColor = (size) => {
  if (!selectedColor.value) return false
  const match = availableVariants.value.find(v => v.tenMau === selectedColor.value && v.tenKichCo === size)
  if (!match) return true
  return (match.soLuongTon || match.so_luong_ton || 0) === 0
}

const selectedVariantInfo = computed(() => {
  if (!selectedColor.value || !selectedSize.value) return null
  return availableVariants.value.find(v => v.tenMau === selectedColor.value && v.tenKichCo === selectedSize.value)
})

const allProductImages = computed(() => {
  if (!selectedProduct.value) return ['/Logo.png'];
  const images = [];
  const addedColors = new Set(); 

  availableVariants.value.forEach(v => {
    const img = v.hinhAnh || v.hinh_anh || v.image;
    if (img && v.tenMau && !addedColors.has(v.tenMau)) {
      const formattedImg = formatProductImage(img);
      if (formattedImg !== '/Logo.png') {
        images.push(formattedImg);
        addedColors.add(v.tenMau); 
      }
    }
  });

  if (images.length === 0 && selectedProduct.value.image && selectedProduct.value.image !== '/Logo.png') {
    images.push(selectedProduct.value.image);
  }
  return images.length > 0 ? images : ['/Logo.png'];
})

const nextImage = () => {
  if (allProductImages.value.length <= 1) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % allProductImages.value.length;
}

const prevImage = () => {
  if (allProductImages.value.length <= 1) return;
  currentImageIndex.value = (currentImageIndex.value - 1 + allProductImages.value.length) % allProductImages.value.length;
}

const displayPrice = computed(() => {
  if (selectedVariantInfo.value) {
    const v = selectedVariantInfo.value;
    return formatVND(v.giaSauGiam || v.gia_sau_giam || v.giaBan || v.gia_ban || 0)
  }
  if (availableVariants.value.length > 0) {
    const listGia = availableVariants.value.map(v => Number(v.giaSauGiam || v.gia_sau_giam || v.giaBan || v.gia_ban || 0))
    const minGia = Math.min(...listGia)
    const maxGia = Math.max(...listGia)
    if (minGia > 0 && minGia === maxGia) return formatVND(minGia)
    if (minGia > 0 && minGia < maxGia) return `${minGia.toLocaleString('vi-VN')} ~ ${maxGia.toLocaleString('vi-VN')} đ`
  }
  return 'Chưa cập nhật giá'
})

const displayOriginalPrice = computed(() => {
  if (selectedVariantInfo.value) {
    const v = selectedVariantInfo.value;
    const gGoc = Number(v.giaBan || v.gia_ban || 0);
    const gGiam = Number(v.giaSauGiam || v.gia_sau_giam || gGoc);
    if (gGoc > 0 && gGoc > gGiam) {
      return formatVND(gGoc);
    }
    return '';
  }
  if (availableVariants.value.length > 0) {
    const hasAnyDiscount = availableVariants.value.some(v => {
       const gGoc = Number(v.giaBan || v.gia_ban || 0);
       const gGiam = Number(v.giaSauGiam || v.gia_sau_giam || gGoc);
       return gGoc > 0 && gGoc > gGiam;
    });
    if (!hasAnyDiscount) return '';

    const listGiaGoc = availableVariants.value.map(v => Number(v.giaBan || v.gia_ban || v.giaSauGiam || v.gia_sau_giam || 0))
    const minGiaGoc = Math.min(...listGiaGoc)
    const maxGiaGoc = Math.max(...listGiaGoc)
    if (minGiaGoc === maxGiaGoc) return formatVND(minGiaGoc)
    return `${minGiaGoc.toLocaleString('vi-VN')} ~ ${maxGiaGoc.toLocaleString('vi-VN')} đ`
  }
  return ''
})

const displayDiscountPercent = computed(() => {
  if (selectedVariantInfo.value) {
    const v = selectedVariantInfo.value;
    const gGoc = Number(v.giaBan || v.gia_ban || 0);
    const gGiam = Number(v.giaSauGiam || v.gia_sau_giam || gGoc);
    if (gGoc > 0 && gGoc > gGiam) {
      return Math.round(((gGoc - gGiam) / gGoc) * 100);
    }
    return 0;
  }
  if (availableVariants.value.length > 0) {
    let maxPct = 0;
    availableVariants.value.forEach(v => {
      const gGoc = Number(v.giaBan || v.gia_ban || 0);
      const gGiam = Number(v.giaSauGiam || v.gia_sau_giam || gGoc);
      if (gGoc > 0 && gGoc > gGiam) {
        const pct = Math.round(((gGoc - gGiam) / gGoc) * 100);
        if (pct > maxPct) maxPct = pct;
      }
    });
    return maxPct;
  }
  return 0;
})

const currentMaxStock = computed(() => {
  if (selectedVariantInfo.value) {
    return Number(selectedVariantInfo.value.soLuongTon || selectedVariantInfo.value.so_luong_ton || 0);
  }
  return 9999;
});

const stockMessage = computed(() => {
  if (selectedVariantInfo.value) {
    const slTon = currentMaxStock.value;
    return `${slTon} sản phẩm có sẵn`
  }
  const totalStock = availableVariants.value.reduce((sum, item) => sum + Number(item.soLuongTon || item.so_luong_ton || 0), 0)
  return `${totalStock} sản phẩm có sẵn`
})

const selectColor = (color) => {
  selectedColor.value = color
  if (selectedSize.value && isSizeDisabledForCurrentColor(selectedSize.value)) {
    selectedSize.value = null
  }
  quantity.value = 1

  const variantWithImg = availableVariants.value.find(v => v.tenMau === color && (v.hinhAnh || v.hinh_anh || v.image));
  if (variantWithImg) {
    const targetImg = formatProductImage(variantWithImg.hinhAnh || variantWithImg.hinh_anh || variantWithImg.image);
    const index = allProductImages.value.indexOf(targetImg);
    if (index !== -1) {
      currentImageIndex.value = index;
    }
  }
}

const selectSize = (size) => {
  selectedSize.value = size
  quantity.value = 1
}

const handleDecreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

const handleIncreaseQty = () => {
  if (quantity.value < currentMaxStock.value) quantity.value++
}

const validateQtyInput = (e) => {
  let val = e.target.value.replace(/[^0-9]/g, '');
  if (val !== '') {
    val = parseInt(val, 10);
    if (val > currentMaxStock.value) val = currentMaxStock.value;
  }
  quantity.value = val;
};

const handleQtyBlur = () => {
  if (!quantity.value || quantity.value < 1 || isNaN(quantity.value)) {
    quantity.value = 1;
  }
};

const showDetail = async (product) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sanpham-chitiet/by-sanpham/${product.id}`);
    const variantsList = response.data;

    selectedProduct.value = {
      id: product.id,
      name: product.name || product.tenSanPham,
      thuongHieu: product.thuongHieu || 'Chưa cập nhật',
      desc: product.desc || 'Kiểu dáng suông tà dài mềm mại quyến rũ phong cách quý phái.',
      image: product.image,
      coAo: product.coAo,
      tayAo: product.tayAo,
      chatLieu: product.chatLieu,
      kieuDang: product.kieuDang
    };
    
    availableVariants.value = variantsList;
    selectedColor.value = null;    
    selectedSize.value = null;     
    currentImageIndex.value = 0;
    currentView.value = 'PRODUCT_DETAIL';
    quantity.value = 1;
    selectedStarFilter.value = 'all'; 
    window.scrollTo(0, 0);

    await fetchReviewsForProduct(product.id);
    
  } catch (error) {
    showToast('Không thể tải thông tin sản phẩm!', 'danger');
  }
};

const handleAddToCart = () => {
  if (!selectedColor.value || !selectedSize.value) {
    showToast('Vui lòng chọn Màu sắc và Kích cỡ trước khi thêm vào giỏ hàng!', 'danger');
    return;
  }
  
  let variantImage = selectedProduct.value.image;
  if (selectedVariantInfo.value && (selectedVariantInfo.value.hinhAnh || selectedVariantInfo.value.hinh_anh || selectedVariantInfo.value.image)) {
     variantImage = formatProductImage(selectedVariantInfo.value.hinhAnh || selectedVariantInfo.value.hinh_anh || selectedVariantInfo.value.image);
  }

  const currentOriginalPrice = Number(selectedVariantInfo.value.giaBan || selectedVariantInfo.value.gia_ban || 0);
  const currentSalePrice = Number(selectedVariantInfo.value.giaSauGiam || selectedVariantInfo.value.gia_sau_giam || currentOriginalPrice);
  
  let discountPct = 0;
  if (currentOriginalPrice > 0 && currentOriginalPrice > currentSalePrice) {
    discountPct = Math.round(((currentOriginalPrice - currentSalePrice) / currentOriginalPrice) * 100);
  }

  const cartItem = {
    ...selectedProduct.value,
    name: `${selectedProduct.value.name} (${selectedColor.value})`,
    price: currentSalePrice,
    originalPrice: currentOriginalPrice > currentSalePrice ? currentOriginalPrice : null,
    discountPercent: discountPct > 0 ? discountPct : null,
    stock: selectedVariantInfo.value.soLuongTon || selectedVariantInfo.value.so_luong_ton || 0,
    image: variantImage,
    idSpct: selectedVariantInfo.value.id
  };
  
  const result = addToCart(cartItem, selectedSize.value, quantity.value);
  if (result.success) {
    showToast(result.message, 'success');
  } else {
    showToast(result.message, 'danger');
  }
};

const handleBuyNow = () => {
  if (!selectedColor.value || !selectedSize.value) {
    showToast('Vui lòng chọn Màu sắc và Kích cỡ trước khi mua hàng!', 'danger');
    return;
  }
  
  let variantImage = selectedProduct.value.image;
  if (selectedVariantInfo.value && (selectedVariantInfo.value.hinhAnh || selectedVariantInfo.value.hinh_anh || selectedVariantInfo.value.image)) {
     variantImage = formatProductImage(selectedVariantInfo.value.hinhAnh || selectedVariantInfo.value.hinh_anh || selectedVariantInfo.value.image);
  }

  const currentOriginalPrice = Number(selectedVariantInfo.value.giaBan || selectedVariantInfo.value.gia_ban || 0);
  const currentSalePrice = Number(selectedVariantInfo.value.giaSauGiam || selectedVariantInfo.value.gia_sau_giam || currentOriginalPrice);
  
  let discountPct = 0;
  if (currentOriginalPrice > 0 && currentOriginalPrice > currentSalePrice) {
    discountPct = Math.round(((currentOriginalPrice - currentSalePrice) / currentOriginalPrice) * 100);
  }

  const cartItem = {
    ...selectedProduct.value,
    name: `${selectedProduct.value.name} (${selectedColor.value})`,
    price: currentSalePrice,
    originalPrice: currentOriginalPrice > currentSalePrice ? currentOriginalPrice : null,
    discountPercent: discountPct > 0 ? discountPct : null,
    stock: selectedVariantInfo.value.soLuongTon || selectedVariantInfo.value.so_luong_ton || 0,
    image: variantImage,
    idSpct: selectedVariantInfo.value.id
  };
  
  const result = addToCart(cartItem, selectedSize.value, quantity.value);
  if (result.success) {
    router.push('/gio-hang');
  } else {
    showToast(result.message, 'danger');
  }
};

const clearAllFilters = () => {
  searchKeyword.value = '';
  filterColor.value = '';
  currentCategory.value = 'Tất cả';
  filterBrand.value = 'Tất cả';
  minPriceStr.value = '';
  maxPriceStr.value = '';
}

onMounted(async () => {
  await fetchFiltersData();
  await loadAllProductsFromServer();
  checkPendingProduct();
  
  // BẬT RADAR QUÉT REALTIME CẬP NHẬT TÌNH TRẠNG NGỪNG BÁN HOẶC GIẢM GIÁ
  pollingInterval = setInterval(() => {
     loadAllProductsFromServer(true);
  }, 5000); // Tốc độ quét là 5 giây để không làm nghẽn SQL Server
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
})

const checkPendingProduct = () => {
  const pendingId = localStorage.getItem('pendingProductId');
  if (pendingId) {
    const pId = parseInt(pendingId);
    const productToOpen = allProductsMaster.value.find(p => p.id === pId);
    if (productToOpen) {
      showDetail(productToOpen);
      localStorage.removeItem('pendingProductId'); 
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap');

/* --- NAVBAR VÀ GẠCH CHÂN ACTIVE --- */
.nav-text {
  color: #3d211a !important;
  font-size: 1rem;
  text-transform: uppercase;
  transition: all 0.3s ease;
  padding: 10px 0 !important;
  position: relative;
  display: inline-block;
}

.menu-underline { border-bottom: 2px solid transparent; }
.menu-underline:hover, .active-link { border-bottom: 2px solid #3d211a !important; font-weight: 700 !important; }
.custom-dropdown { border-top: 3px solid #6f4d38 !important; }

/* CARD SẢN PHẨM */
.product-card-v2 {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #f2edd9 !important;
  border-radius: 8px;
  overflow: hidden;
}
.product-card-v2:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(61, 33, 26, 0.08) !important;
}
.product-img { transition: transform 0.4s ease; }
.product-card-v2:hover .product-img { transform: scale(1.03); }

/* === MŨI TÊN VÀ DẤU CHẤM CỦA SLIDER ẢNH === */
.slider-arrow {
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcd1c4;
  color: #3d211a;
  transition: all 0.3s ease;
  z-index: 10;
}
.slider-arrow:hover { background-color: #3d211a; color: white; }
.slider-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background-color: rgba(61, 33, 26, 0.3);
  cursor: pointer; transition: all 0.3s ease;
}
.slider-dot.active { background-color: #3d211a; transform: scale(1.3); }

/* BIẾN THỂ VÀ NÚT CHUNG */
.variant-brown-btn {
  border: 1px solid #dcd1c4; color: #523b2e; background: white;
  min-width: 45px; border-radius: 4px; font-weight: 500; transition: all 0.2s ease;
}
.variant-brown-btn:hover:not(:disabled) { border-color: #3d211a; background-color: #fcfbfa; }
.variant-brown-btn.active { background-color: #3d211a; color: white; border-color: #3d211a; }
.variant-brown-btn.disabled-brown { opacity: 0.4; cursor: not-allowed; background-color: #f9f9f9; }

.btn-outline-brown { border: 1px solid #3d211a; color: #3d211a; background: white; transition: all 0.3s; }
.btn-outline-brown:hover { background: #3d211a; color: white; }
.btn-outline-brown.active { background-color: #3d211a !important; color: #ffffff !important; border-color: #3d211a !important; }
.btn-main-brown { background-color: #3d211a; border: 1px solid #3d211a; transition: all 0.3s; }
.btn-main-brown:hover { background-color: #523b2e; border-color: #523b2e; }

.style-service-bar { background-color: #faf8f5; padding: 12px 15px; border-radius: 6px; }
.vertical-divider { width: 1px; height: 25px; background-color: #dcd1c4; }

/* ẨN NÚT LÊN XUỐNG MẶC ĐỊNH TRONG Ô INPUT SỐ LƯỢNG */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }

/* THÔNG BÁO TOAST */
.custom-toast {
  background-color: white; border-left: 5px solid #28a745;
  padding: 12px 20px; border-radius: 4px; display: flex; align-items: center; gap: 12px;
  min-width: 280px; animation: slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.custom-toast.danger { border-left-color: #dc3545; }
.toast-icon { font-size: 1.5rem; }

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.footer-section { color: #3D211A; }
.footer-links li { margin-bottom: 8px; }
.footer-links a:hover { color: #3d211a !important; text-decoration: underline !important; }
.title-cursive-elegant { font-family: 'Dancing Script', cursive !important; font-weight: 700; }
</style>