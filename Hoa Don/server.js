// server.js
import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 1. Cấu hình tài khoản SQL Server
const config = {
  user: "sa",
  password: "123456789",
  server: "localhost",
  database: "DuAnTotNghiep",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Hàm khởi chạy hệ thống
async function startServer() {
  try {
    // Kết nối đến SQL Server
    await sql.connect(config);
    console.log("👉 Đã kết nối thành công tới SQL Server!");

    // API: Lấy danh sách nhân viên cho Vue
    app.get("/api/employees", async (req, res) => {
      try {
        const result = await sql.query("SELECT * FROM nhan_vien");
        res.json(result.recordset);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    app.post("/api/employees", async (req, res) => {
      try {
        const {
          ma_nhan_vien,
          ho_ten,
          email,
          so_dien_thoai,
          mat_khau,
          ngay_sinh,
          gioi_tinh,
          dia_chi,
          chuc_vu,
          anh_dai_dien,
        } = req.body;

        const pool = await sql.connect(config);
        await pool
          .request()
          .input("ma_nhan_vien", sql.VarChar, ma_nhan_vien)
          .input("ho_ten", sql.NVarChar, ho_ten)
          .input("email", sql.VarChar, email)
          .input("so_dien_thoai", sql.VarChar, so_dien_thoai)
          .input("mat_khau", sql.VarChar, mat_khau)
          .input("ngay_sinh", sql.Date, ngay_sinh)
          .input("gioi_tinh", sql.Int, gioi_tinh)
          .input("dia_chi", sql.NVarChar, dia_chi)
          .input("chuc_vu", sql.NVarChar, chuc_vu)
          .input("anh_dai_dien", sql.VarChar, anh_dai_dien) // Nhận chuỗi ảnh base64 gửi từ Vue
          .query(`INSERT INTO nhan_vien (ma_nhan_vien, ho_ten, email, so_dien_thoai, mat_khau, ngay_sinh, gioi_tinh, dia_chi, chuc_vu, anh_dai_dien, trang_thai) 
                    VALUES (@ma_nhan_vien, @ho_ten, @email, @so_dien_thoai, @mat_khau, @ngay_sinh, @gioi_tinh, @dia_chi, @chuc_vu, @anh_dai_dien, 1)`);

        res.json({ success: true, message: "Thêm nhân viên thành công!" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.put('/api/employees/:id', async (req, res) => {
            try {
                const { id } = req.params; // Lấy ID nhân viên cần sửa từ URL
                const { ma_nhan_vien, ho_ten, email, so_dien_thoai, mat_khau, ngay_sinh, gioi_tinh, dia_chi, chuc_vu, anh_dai_dien } = req.body;
                
                const pool = await sql.connect(config);
                await pool.request()
                    .input('id', sql.Int, id)
                    .input('ma_nhan_vien', sql.VarChar, ma_nhan_vien)
                    .input('ho_ten', sql.NVarChar, ho_ten)
                    .input('email', sql.VarChar, email)
                    .input('so_dien_thoai', sql.VarChar, so_dien_thoai)
                    .input('mat_khau', sql.VarChar, mat_khau)
                    .input('ngay_sinh', sql.Date, ngay_sinh)
                    .input('gioi_tinh', sql.Int, gioi_tinh)
                    .input('dia_chi', sql.NVarChar, dia_chi)
                    .input('chuc_vu', sql.NVarChar, chuc_vu)
                    .input('anh_dai_dien', sql.VarChar, anh_dai_dien)
                    .query(`UPDATE nhan_vien SET 
                                ma_nhan_vien = @ma_nhan_vien, 
                                ho_ten = @ho_ten, 
                                email = @email, 
                                so_dien_thoai = @so_dien_thoai, 
                                mat_khau = @mat_khau, 
                                ngay_sinh = @ngay_sinh, 
                                gioi_tinh = @gioi_tinh, 
                                dia_chi = @dia_chi, 
                                chuc_vu = @chuc_vu, 
                                anh_dai_dien = @anh_dai_dien 
                            WHERE id = @id`);
                    
                res.json({ success: true, message: "Cập nhật thông tin nhân viên thành công!" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    // Chạy Express Server
    app.listen(8000, () => {
      console.log("🚀 Backend đang chạy tại http://localhost:5000");
    });
  } catch (err) {
    console.error("❌ Lỗi kết nối SQL Server thất bại:", err.message);
  }
}

startServer();
