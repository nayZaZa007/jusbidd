const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "jusbid",
});

async function createBidder() {
  try {
    // Get bidder role ID
    const roleRes = await pool.query("SELECT id FROM roles WHERE name=$1", ["bidder"]);
    if (roleRes.rows.length === 0) {
      console.log("Bidder role not found");
      return;
    }
    
    const roleId = roleRes.rows[0].id;
    
    // Hash password
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert bidder account
    const insertRes = await pool.query(
      "INSERT INTO users (display_name, username, password, role_id) VALUES ($1,$2,$3,$4) RETURNING id, username, display_name",
      ["Bidder User", "bidder1", hashedPassword, roleId]
    );
    
    if (insertRes.rows.length > 0) {
      const user = insertRes.rows[0];
      console.log("✅ Bidder account created successfully!");
      console.log(`Username: ${user.username}`);
      console.log(`Password: ${password}`);
      console.log(`Display Name: ${user.display_name}`);
    }
    
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

createBidder();
