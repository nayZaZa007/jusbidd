const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5434,
  user: "postgres",
  password: "1234",
  database: "jusbid",
});

async function insertAuctions() {
  try {
    const auctions = [
      {
        title: "ของสะสมหายาก",
        description: "ของสะสมจากยุคโบราณ",
        image: "https://via.placeholder.com/300x200?text=Auction+1",
        starting_price: 1000,
        category: "ของสะสม"
      },
      {
        title: "สมาร์ทโฟนใหม่",
        description: "สมาร์ทโฟนรุ่นล่าสุด",
        image: "https://via.placeholder.com/300x200?text=Auction+2",
        starting_price: 5000,
        category: "อิเล็กทรอนิกส์"
      },
      {
        title: "เสื้อผ้าสวยงาม",
        description: "เสื้อผ้าจากแบรนด์ดัง",
        image: "https://via.placeholder.com/300x200?text=Auction+3",
        starting_price: 2000,
        category: "แฟชั่น"
      },
      {
        title: "ภาพวาดศิลปะ",
        description: "ภาพวาดจากศิลปินชื่อดัง",
        image: "https://via.placeholder.com/300x200?text=Auction+4",
        starting_price: 10000,
        category: "ศิลปะ"
      },
      {
        title: "รถยนต์คลาสสิก",
        description: "รถยนต์คลาสสิกปี 1960",
        image: "https://via.placeholder.com/300x200?text=Auction+5",
        starting_price: 50000,
        category: "ยานพาหนะ"
      }
    ];

    for (const auction of auctions) {
      await pool.query(
        "INSERT INTO auctions (title, description, image, starting_price, category) VALUES ($1, $2, $3, $4, $5)",
        [auction.title, auction.description, auction.image, auction.starting_price, auction.category]
      );
    }

    console.log("✅ Auctions inserted successfully!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

insertAuctions();