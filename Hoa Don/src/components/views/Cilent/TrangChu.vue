
<template>
  <div class="client-home" style="background-color: #ffffff !important; min-height: 100vh">
    <!-- ==============================================
         NAVBAR ĐỒNG BỘ CÁC TRANG
         ============================================== -->
    <nav
      class="navbar navbar-expand-lg sticky-top py-3 border-bottom shadow-sm"
      style="background-color: #ffffff !important"
    >
      <div class="container-fluid px-4 px-lg-5">
        <a
          class="navbar-brand d-flex align-items-center text-decoration-none"
          href="#"
          @click.prevent="router.push('/')"
        >
          <img src="/Logo.png" alt="Logo Giai Đài" style="height: 60px; object-fit: contain" />
        </a>

        <button
          class="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center align-items-center">
            <li class="nav-item">
              <a class="nav-link fw-medium nav-text" href="#" @click.prevent="router.push('/')"
                >Trang chủ</a
              >
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link fw-medium nav-text dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Sản phẩm
              </a>
              <ul
                class="dropdown-menu border-0 shadow rounded-0 mt-3 p-2"
                style="min-width: 250px; background-color: #ffffff !important"
              >
                <li v-for="(cat, idx) in categories" :key="idx">
                  <a
                    class="dropdown-item d-flex justify-content-between align-items-center py-2 text-secondary custom-drop-item"
                    href="#"
                    @click.prevent="goToStore(cat)"
                  >
                    {{ cat }} <i class="bi bi-chevron-right small"></i>
                  </a>
                </li>
              </ul>
            </li>

            <li class="nav-item">
              <a
                class="nav-link fw-medium nav-text"
                href="#"
                @click.prevent="router.push('/san-voucher')"
                >Săn Voucher</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link fw-medium nav-text"
                href="#"
                @click.prevent="router.push('/lien-he')"
                >Liên hệ</a
              >
            </li>
          </ul>

          <div
            class="d-flex align-items-center justify-content-center gap-4 fs-5 nav-text mt-3 mt-lg-0"
          >
            <div class="dropdown">
              <i
                class="bi bi-bell icon-btn position-relative"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="cursor: pointer"
              ></i>
              <div
                class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3 rounded-3 text-center custom-dropdown"
                style="background-color: #ffffff !important"
              >
                <i class="bi bi-bell-slash fs-3 mb-2 d-block" style="color: #a07856"></i>
                <span class="small" style="color: #6f4d38">Không có thông báo mới</span>
              </div>
            </div>

            <div class="dropdown">
              <i
                class="bi bi-bag icon-btn position-relative"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="cursor: pointer"
              ></i>
              <div
                class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-3 rounded-3 text-center custom-dropdown"
                style="background-color: #ffffff !important"
              >
                <i class="bi bi-bag-x fs-3 mb-2 d-block" style="color: #a07856"></i>
                <span class="small" style="color: #6f4d38">Giỏ hàng đang trống</span>
              </div>
            </div>

            <div class="dropdown">
              <i
                class="bi bi-person-circle icon-btn"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="cursor: pointer"
              ></i>
              <div
                class="dropdown-menu dropdown-menu-end shadow-sm border-0 p-4 rounded-3 text-center custom-dropdown"
                style="min-width: 220px; background-color: #ffffff !important"
              >
                <div class="d-flex flex-column align-items-center mb-3">
                  <div
                    class="rounded-circle d-flex align-items-center justify-content-center mb-2"
                    style="
                      width: 55px;
                      height: 55px;
                      border: 1px solid #cbb799;
                      background-color: #ffffff;
                    "
                  >
                    <i class="bi bi-person fs-2" style="color: #6f4d38"></i>
                  </div>
                  <span class="fw-bold" style="color: #3d211a; font-size: 1.1rem"
                    >Tài khoản Khách</span
                  >
                </div>
                <button class="btn btn-outline-secondary w-100 btn-sm mb-2 rounded-1 btn-login">
                  Đăng nhập
                </button>
                <button
                  class="btn w-100 btn-sm text-white rounded-1"
                  style="background-color: #6f4d38"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- ==============================================
         NỘI DUNG TRANG CHỦ 
         ============================================== -->
    <header class="hero-banner-section mb-5">
      <div class="hero-bg-image d-flex align-items-center" style="background-image: url('s.png')">
        <div class="container px-4 px-lg-5">
          <div class="row">
            <div class="col-12 col-md-8 col-lg-6">
              <div class="hero-text-box">
                <div class="hero-brand mt-4">
                  <span
                    class="fw-bold"
                    style="
                      font-family: 'Playfair Display', serif;
                      font-size: 1.1rem;
                      letter-spacing: 2px;
                    "
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="container px-4 px-lg-5 pb-2 mt-5">
      <!-- Khối 1 -->
      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 pe-lg-5 mb-4 mb-lg-0">
          <div class="img-elegant shadow-none" style="background-image: url('anh2.jpg')"></div>
        </div>
        <div class="col-lg-6 ps-lg-4 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Ngang qua ngày cũ</h2>
          <p class="desc-elegant mb-0">
            Một mùa mới, bước ra từ ký ức. Lắng nghe những khoảng lặng vang vọng trong những khoảnh
            khắc của những ngày cuối cùng trong năm: mùi vải và chỉ thêu trong chiếc hộp kim chỉ của
            mẹ, tiếng chim sẻ rúc rích ngoài hiên, những buổi trưa nắng lung linh trên tà áo. Những
            điều bé nhỏ ấy, khi năm tháng đi qua, bỗng trở thành nơi trú ẩn của tâm hồn.
            <br /><br />
            Từng nếp gấp, từng khoảnh khắc của thời gian và những bộ áo dài được sáng tạo ra để trân
            trọng hành trình phát triển bản thân của mỗi người phụ nữ, là sự trở về với vẻ đẹp nền
            tảng của đời sống Việt: dịu dàng, chừng mực và sâu sắc.
          </p>
        </div>
      </div>

      <!-- Khối 2 -->
      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 order-2 order-lg-1 pe-lg-5 mt-4 mt-lg-0 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Duyên Nhã</h2>
          <p class="desc-elegant mb-0">
            Trải qua bốn mùa và trở thành một lựa chọn quen thuộc của nhiều chị em, "Duyên" vẫn giữ
            trọn sự yêu mến nhờ vẻ đẹp truyền thống có sức sống bền bỉ. Ở mỗi mùa, chúng tôi không
            chỉ tạo nên một thiết kế, mà nuôi dưỡng một tinh thần: sự nền nã, thanh lịch và nét
            duyên thầm rất Việt Nam.
            <br /><br />
            Duyên Nhã không tìm cách thay đổi những giá trị đã làm nên bản sắc của Duyên. Ngược lại,
            những chiếc áo dài tiếp tục tôn vinh vẻ đẹp chuẩn mực của Áo Dài Việt Nam, nhưng với hơi
            thở mới mẻ nhẹ nhàng, tinh tế và ứng dụng linh hoạt. Một tà áo có thể đồng hành cùng các
            chị trong nhiều khoảnh khắc của cuộc sống.
          </p>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 ps-lg-4">
          <div class="img-elegant shadow-none" style="background-image: url('duyennha.jpg')"></div>
        </div>
      </div>

      <!-- Khối 3 -->
      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 pe-lg-5 mb-4 mb-lg-0">
          <div class="img-elegant shadow-none" style="background-image: url('tuvien.jpg')"></div>
        </div>
        <div class="col-lg-6 ps-lg-4 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Tứ Viễn</h2>
          <p class="desc-elegant mb-0">
            Áo Dài được khơi nguồn từ mỹ cảm dân gian Á Đông, bắt đầu từ hình ảnh bộ tứ bình và
            những loài hoa quen thuộc trong nghệ thuật truyền thống. Các chất liệu ấy không được tái
            hiện nguyên bản, mà được chắt lọc và tiết chế, kể lại bằng ngôn ngữ đương đại, nơi tinh
            thần truyền thống hiện diện tự nhiên trong đời sống hôm nay.
            <br /><br />
            Lần đầu tiên, chi tiết cúc pha lê được đưa vào thiết kế Áo Dài Tết, như một điểm nhấn
            tinh tế, góp phần hoàn thiện diện mạo nhất quán của Tứ Viễn. Mọi chi tiết làm nên một vẻ
            đẹp đã được thời gian gọt giũa - chín muồi, hiểu nghề và bền bỉ.
          </p>
        </div>
      </div>

      <!-- Khối 4 -->
      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 order-2 order-lg-1 pe-lg-5 mt-4 mt-lg-0 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Duyên Ước</h2>
          <p class="desc-elegant mb-0">
            Duyên Ước là bản tình ca bằng lụa, được dệt nên từ sự thấu hiểu và cảm xúc chân thành
            của những người yêu nhau. Đó là hiện thân cho tình yêu khi đã đủ chín, đủ sâu — lặng lẽ,
            điềm nhiên mà bền vững như gốc rễ lâu năm của một mối duyên lành. Duyên Ước là lời
            nguyện ước thành hình, là hồi ức của khoảnh khắc mà cả hai biết: đây chính là người sẽ
            cùng nắm tay đi đến trọn đời.
            <br /><br />
            Giai Đài tin rằng Duyên Ước sẽ là nơi chốn dịu dàng để mỗi cặp đôi tìm thấy chính mình -
            trong tình yêu, trong ký ức, và trong vẻ đẹp của một di sản đang sống.
          </p>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 ps-lg-4">
          <div class="img-elegant shadow-none" style="background-image: url('duyenuoc.jpg')"></div>
        </div>
      </div>

      <!-- Khối 5 -->
      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 pe-lg-5 mb-4 mb-lg-0">
          <div class="img-elegant shadow-none" style="background-image: url('giaoduyen.jpg')"></div>
        </div>
        <div class="col-lg-6 ps-lg-4 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Giao Duyên</h2>
          <p class="desc-elegant mb-0">
            Tình yêu không được đo đếm bằng những xa hoa phù phiếm, mà đọng lại trong những khoảnh
            khắc chân thật và giản dị nhất. Như ánh mắt của lần đầu gặp gỡ, hay nhịp tim hẫng trong
            khoảnh khắc tay đan - Giao Duyên được sinh ra từ chính những điều đơn thuần ấy - một
            thiết kế mang đậm hơi thở truyền thống nhưng tinh giản, nơi từng đường kim mũi chỉ được
            chăm chút để kể lại câu chuyện tình yêu thuần khiết qua ngôn ngữ của Áo Dài Việt.
            <br /><br />
            Dành tặng cho những cặp đôi muốn lưu lại những khoảnh khắc Pre-wedding đầy dấu ấn, Giao
            Duyên với chất liệu lụa gấm cùng những đường may tinh tế trên dáng áo suông mềm là thiết
            kế vừa vặn nhất để ôm trọn xúc cảm của người mặc.
          </p>
        </div>
      </div>

      <!-- Khối 6 -->
      <div class="row align-items-center mb-5 pb-5">
        <div class="col-lg-6 order-2 order-lg-1 pe-lg-5 mt-4 mt-lg-0 text-center text-lg-start">
          <h2 class="title-cursive-elegant mb-3">Từ Vân</h2>
          <p class="desc-elegant mb-0">
            Không chỉ là Áo Dài dành cho mẹ, Từ Vân còn là dấu mốc kết tinh một thập kỷ thiết kế của
            Giai Đài cùng sự thấu hiểu văn hoá Việt. Từng chi tiết không chỉ chăm chút cho diện mạo,
            mà còn tôn vinh hình ảnh người mẹ trong ngày cưới – biểu tượng của tình yêu, sự gắn kết
            và bản sắc gia đình.
            <br /><br />
            Từ Vân sử dụng chất liệu cao cấp, hoạ tiết độc quyền cùng hai kỹ thuật thêu đặc trưng.
            Ngân Sa tạo hiệu ứng lấp lánh như vân mây bạc dưới ánh trăng, mềm mại và quý phái. Vũ
            Sắc mang đến sắc độ chuyển hoà như vũ điệu trên cánh hoa, điểm xuyết sợi vàng bạc để hoa
            văn bừng sáng theo từng chuyển động tà áo.
          </p>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 ps-lg-4">
          <div class="img-elegant shadow-none" style="background-image: url('tuvan.jpg')"></div>
        </div>
      </div>
    </section>

    <!-- ==============================================
         SẢN PHẨM NỔI BẬT (BEST SELLER)
         ============================================== -->
    <section class="container px-4 px-lg-5 pt-5 border-top border-light">
      <div class="text-center mb-5">
        <h2 class="title-cursive-elegant mb-2" style="font-size: 3.5rem">Sản Phẩm Nổi Bật</h2>
        <p class="text-muted fst-italic" style="color: #6f4d38 !important">
          Những thiết kế được yêu thích nhất mùa này
        </p>
      </div>

      <div class="row justify-content-center g-4">
        <div class="col-12 col-md-4" v-for="item in bestSellers" :key="item.id">
          <div class="card border-0 shadow-none h-100 text-center bg-white product-bestseller">
            <div
              class="position-relative overflow-hidden mb-3"
              style="height: 600px; background-color: #f8f9fa"
            >
              <img :src="item.image" class="w-100 h-100 object-fit-cover" :alt="item.name" />
            </div>
            <div class="card-body p-0">
              <h6
                class="fw-bold mb-2 text-dark"
                style="font-size: 1.1rem; color: #3d211a !important"
              >
                {{ item.name }}
              </h6>
              <p class="mb-3 fw-medium" style="font-size: 0.95rem; color: #6f4d38">Liên hệ</p>
              <button
                class="btn rounded-0 px-4 py-2 fw-medium btn-xem-chi-tiet"
                @click="goToStore('Áo dài truyền thống')"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==============================================
         KHÁCH HÀNG GIAI ĐÀI (FEEDBACK)
         ============================================== -->
    <section class="container px-4 px-lg-5 py-5 mt-5">
      <div class="text-center mb-5">
        <h3 class="mb-2" style="color: #3d211a; letter-spacing: 1px">
          Khách hàng
          <span class="fw-bold" style="font-family: 'Playfair Display', serif; color: #a82e3e"
            >GIAI ĐÀI</span
          >
        </h3>
      </div>

      <!-- Lưới ảnh Feedback 3x3 -->
      <div class="row g-3">
        <div class="col-4 col-md-4" v-for="(img, index) in feedbacks" :key="index">
          <div class="feedback-img-wrapper overflow-hidden rounded-1">
            <img :src="img" class="w-100 object-fit-cover feedback-img" alt="Khách hàng Giai Đài" />
          </div>
        </div>
      </div>
    </section>

    <!-- ==============================================
         FOOTER ĐỒNG BỘ
         ============================================== -->
    <footer
      class="footer-section pt-5 pb-4 mt-5"
      style="border-top: 1px solid #cbb799; background-color: #ffffff !important"
    >
      <div class="container px-4 px-lg-5">
        <div class="row g-4 mb-4">
          <div class="col-lg-4 col-md-6 pe-lg-5">
            <img
              src="/Logo.png"
              alt="Logo Giai Đài"
              style="height: 55px; object-fit: contain"
              class="mb-3"
            />
            <p class="small lh-lg" style="color: #6f4d38">
              Giai Đài tự hào mang đến những thiết kế Áo Dài tôn vinh nét đẹp văn hóa Việt Nam. Từng
              đường kim mũi chỉ là sự kết tinh của nghệ thuật thủ công và hơi thở thời đại.
            </p>
            <div class="d-flex gap-3 mt-3">
              <a href="#" class="social-icon"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Về chúng tôi</h6>
            <ul class="list-unstyled footer-links">
              <li><a href="#">Câu chuyện thương hiệu</a></li>
              <li><a href="#">Hệ thống cửa hàng</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold mb-3 text-uppercase" style="color: #3d211a">Liên hệ</h6>
            <ul class="list-unstyled footer-links text-muted small">
              <li class="mb-2">
                <i class="bi bi-telephone-fill me-2" style="color: #a07856"></i
                ><span style="color: #6f4d38">0123 456 789</span>
              </li>
              <li>
                <i class="bi bi-envelope-fill me-2" style="color: #a07856"></i
                ><span style="color: #6f4d38">cskh@giaidai.vn</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="text-center pt-4 mt-4" style="border-top: 1px solid #f0f0f0">
          <p class="small mb-0" style="color: #a07856">
            &copy; 2026 Giai Đài - Áo Dài Việt Nam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  'Áo dài truyền thống',
  'Áo dài cách tân',
  'Áo dài nam',
  'Áo dài cưới',
  'Áo dài học sinh',
]

// DỮ LIỆU BEST SELLER
const bestSellers = [
  {
    id: 'bs1',
    name: 'Áo Dài Ngọc Châu',
    image: 'https://pos.nvncdn.com/22713a-176435/ps/20241122_z3Vexw178r.jpeg?v=1732289677',
  },
  {
    id: 'bs2',
    name: 'Áo Dài Túc Hoà',
    image: 'https://pos.nvncdn.com/22713a-176435/ps/20240925_URc9GrAi80.jpeg?v=1727247491',
  },
  {
    id: 'bs3',
    name: 'Áo Dài Cẩm Vân',
    image: 'https://pos.nvncdn.com/22713a-176435/ps/20240625_7ckXGjoTpQ.jpeg?v=1719303781',
  },
]

// DỮ LIỆU KHÁCH HÀNG (9 ẢNH)
const feedbacks = [
  'https://i.pinimg.com/1200x/a6/24/4e/a6244efe696231f53a85edf4006a9a80.jpg',
  'https://i.pinimg.com/736x/a1/dc/9c/a1dc9c697c321bb5b06e6d1f99517148.jpg',
  'https://i.pinimg.com/736x/44/68/8a/44688aad3f0e8db7eb53d9e99fc49bb5.jpg',
  'https://i.pinimg.com/736x/b4/54/23/b45423238fd7c3fecc06bb2d7b1550ee.jpg',
  'https://i.pinimg.com/1200x/e6/c2/ee/e6c2ee0550b7f16965e0311c7f88acb4.jpg',
  'https://i.pinimg.com/1200x/90/dd/cd/90ddcd9b09accec2ea93e798f59f7128.jpg',
  'https://i.pinimg.com/1200x/be/df/f1/bedff10d70f20f1a122a390db7320557.jpg',
  'https://i.pinimg.com/736x/d6/da/a3/d6daa31a1a50b2fc9a51ecad4a957cf3.jpg',
  'https://i.pinimg.com/1200x/6d/25/df/6d25df3882e1a50adb03f70ebb1000c4.jpg',
]

const goToStore = (category) => {
  router.push({ path: '/cua-hang', query: { category: category } })
  window.scrollTo(0, 0)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.client-home {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* --- MENU --- */
.nav-text {
  color: #3d211a !important;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: color 0.3s ease;
}
.nav-text:hover {
  color: #a07856 !important;
}

.custom-dropdown {
  min-width: 200px;
  border-top: 3px solid #6f4d38 !important;
  margin-top: 10px;
}
.custom-drop-item {
  color: #6f4d38 !important;
  transition: all 0.2s ease;
}
.custom-drop-item:hover {
  background-color: #ffffff !important;
  color: #a07856 !important;
  padding-left: 15px;
}

/* --- BANNER CHÍNH --- */
.hero-banner-section {
  width: 100%;
}
.hero-bg-image {
  width: 100%;
  height: 85vh;
  min-height: 600px;
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
}
.hero-text-box {
  padding: 20px 0;
}

/* =========================================
   CSS KHỐI NỘI DUNG 
   ========================================= */

.title-cursive-elegant {
  font-family: 'Dancing Script', cursive !important;
  font-size: 3rem;
  font-weight: 700;
  color: #3d211a;
  line-height: 1.2;
  white-space: nowrap;
}

.desc-elegant {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #6f4d38;
  text-align: justify;
}

.btn-login {
  color: #6f4d38;
  border: 1px solid #cbb799;
  background-color: #ffffff;
  transition: all 0.2s;
}
.btn-login:hover {
  background-color: #6f4d38;
  color: #ffffff;
  border-color: #6f4d38;
}

.img-elegant {
  width: 100%;
  height: 380px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  background-color: #ffffff !important;
}

/* CSS BEST SELLER */
.product-bestseller {
  transition: all 0.3s ease;
}
.product-bestseller:hover {
  transform: translateY(-5px);
}
.btn-xem-chi-tiet {
  background-color: #f1efef;
  color: #a82e3e;
  border: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}
.btn-xem-chi-tiet:hover {
  background-color: #e2e0e0;
}

/* CSS FEEDBACK IMAGE */
.feedback-img-wrapper {
  aspect-ratio: 1 / 1; /* Cắt ảnh thành hình vuông đều nhau */
}
.feedback-img {
  height: 100%;
  transition: transform 0.3s ease;
}
.feedback-img:hover {
  transform: scale(1.05); /* Hiệu ứng zoom nhẹ khi di chuột */
}

/* FOOTER LINKS VÀ ICON */
.footer-links li a {
  color: #6f4d38;
  text-decoration: none;
  display: block;
  padding-bottom: 8px;
  transition: color 0.2s;
}
.footer-links li a:hover {
  color: #a07856;
}
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #cbb799;
  color: #6f4d38;
  transition: all 0.3s;
  text-decoration: none;
}
.social-icon:hover {
  background-color: #6f4d38;
  color: #ffffff;
}

@media (max-width: 992px) {
  .title-cursive-elegant {
    font-size: 2.5rem;
    text-align: center;
    white-space: normal;
  }
  .desc-elegant {
    text-align: center;
  }
  .img-elegant {
    height: 300px;
  }
}
</style>
