const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { authenticate, SECRET } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow larger payloads for image uploads

// Email verification utils
const { sendVerificationEmail } = require("./emailUtils");
const crypto = require("crypto");

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { display_name, username, email, password, confirm_password, role } = req.body;

    if (!display_name || !username || !email || !password || !confirm_password) {
      return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ success: false, message: "รหัสผ่านไม่ตรงกัน" });
    }
    // เช็ค username / email ซ้ำ
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Username หรือ Email ถูกใช้งานแล้ว" });
    }

    // Email syntax check (simple)
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: "รูปแบบอีเมลไม่ถูกต้อง" });
    }

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const hash = await bcrypt.hash(password, 10);
    const roleRes = await pool.query("SELECT id FROM roles WHERE name=$1", [role]);
    if (roleRes.rows.length === 0) {
      return res.status(400).json({ success: false, message: "บทบาทไม่ถูกต้อง" });
    }
    const roleId = roleRes.rows[0].id;

    // Insert user with verified=false and token
    await pool.query(
      "INSERT INTO users (display_name, username, email, password, role_id, verified, verify_token) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [display_name, username, email, hash, roleId, false, verifyToken]
    );

    // Send verification email
    await sendVerificationEmail(email, verifyToken);

    res.json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลของคุณ"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// VERIFY EMAIL
app.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");
  try {
    const result = await pool.query("UPDATE users SET verified=true, verify_token=null WHERE verify_token=$1 RETURNING *", [token]);
    if (result.rowCount === 0) {
      return res.status(400).send("Token ไม่ถูกต้องหรือหมดอายุ");
    }
    res.send("อีเมลของคุณได้รับการยืนยันแล้ว สามารถเข้าสู่ระบบได้");
  } catch (err) {
    res.status(500).send("Server error");
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

// UPDATE PROFILE
app.put("/update-profile", authenticate, async (req, res) => {
  try {
    const { display_name, email, password } = req.body;
    
    if (!display_name || !email) {
      return res.status(400).json({ message: "display_name และ email จำเป็น" });
    }

    let query = "UPDATE users SET display_name = $1, email = $2";
    let values = [display_name, email];

    // ถ้าหากมีการเปลี่ยนรหัสผ่าน
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว" });
      }
      const hash = await bcrypt.hash(password, 10);
      query += ", password = $3";
      values.push(hash);
    }

    query += ` WHERE id = $${values.length + 1}`;
    values.push(req.userId);

    await pool.query(query, values);
    
    res.json({ message: "แก้ไขโปรไฟล์สำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const auctionRoutes = require("./routes/auction");
app.use("/auctions", auctionRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));