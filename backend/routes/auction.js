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
      WHERE status = 'active' AND end_time > NOW()
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

router.get("/my-listings", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM auctions WHERE seller_id = $1", [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, image, starting_price, category, bid_increment, start_time, end_time } = req.body;

    if (!title || !description || !starting_price || !category || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const startTimeValue = start_time && start_time.trim() !== '' ? start_time : null;
    const endTimeValue = end_time && end_time.trim() !== '' ? end_time : null;

    const result = await pool.query(
      "INSERT INTO auctions (title, description, image, starting_price, category, seller_id, bid_increment, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [title, description, image || '', parseInt(starting_price), category, req.userId, parseInt(bid_increment) || 100, startTimeValue, endTimeValue]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;