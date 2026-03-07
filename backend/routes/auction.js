const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticate } = require("../auth");

// ดึงรายการประมูลทั้งหมด
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = `
      SELECT * FROM auctions
      WHERE status = 'active'
    `;

    let values = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND title ILIKE $${values.length}`;
    }

    if (category) {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/my-bids", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bids WHERE user_id = $1", [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;