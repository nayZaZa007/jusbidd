import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import AuctionCard from "../components/AuctionCard";
import "./CSS/Home.css";

export default function HomeAdmin() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await api.get("/auctions");
      setAuctions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        {/* ชื่อกลางหน้า */}
        <h1 className="home-title">Admin Dashboard - Jus(tice) Bid</h1>

        {/* สถิติสำหรับ admin */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>จำนวนรายการประมูล</h3>
            <p>{auctions.length}</p>
          </div>
          <div className="stat-card">
            <h3>ผู้ใช้ทั้งหมด</h3>
            <p>กำลังพัฒนา</p>
          </div>
        </div>

        {/* รายการประมูล */}
        <h2 className="auction-header">รายการประมูลทั้งหมด</h2>

        <div className="auction-grid">
          {auctions.map((item) => (
            <AuctionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}