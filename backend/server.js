const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { authenticate, SECRET } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json());

// REGISTER
app.post("/register", async (req, res) => {
  try {

    const { display_name, username, email, password, confirm_password, role } = req.body;

    if (!display_name || !username || !email || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบ"
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านไม่ตรงกัน"
      });
    }

    // เช็ค username / email ซ้ำ
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username หรือ Email ถูกใช้งานแล้ว"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const roleRes = await pool.query(
      "SELECT id FROM roles WHERE name=$1",
      [role]
    );

    if (roleRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "บทบาทไม่ถูกต้อง"
      });
    }

    const roleId = roleRes.rows[0].id;

    await pool.query(
      "INSERT INTO users (display_name, username, email, password, role_id) VALUES ($1,$2,$3,$4,$5)",
      [display_name, username, email, hash, roleId]
    );

    res.json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});


// LOGIN
app.post("/login", async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบ"
      });
    }

    const result = await pool.query(
      "SELECT users.*, roles.name as role FROM users JOIN roles ON users.role_id=roles.id WHERE username=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบผู้ใช้"
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านไม่ถูกต้อง"
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token: token,
      role: user.role,
      id: user.id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});

// GET CURRENT USER
app.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, display_name, username, email, role_id FROM users WHERE id = $1",
      [req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const auctionRoutes = require("./routes/auction");
app.use("/auctions", auctionRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));