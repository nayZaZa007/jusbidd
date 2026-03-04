import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import AuctionCard from "../components/AuctionCard";
import "./Home.css";

export default function Home() {
  const [auctions, setAuctions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchAuctions = async () => {
    try {
      const res = await api.get("/auctions", {
        params: { search, category }
      });
      setAuctions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [search, category]);

  return (
    <>
      <Navbar onSearch={setSearch} />

      <div className="home-container">

        <h1 className="home-title">Jus(tice) Bid</h1>

        <div className="categories">
          {[
            "ของสะสม",
            "อิเล็กทรอนิกส์",
            "แฟชั่น",
            "ศิลปะ",
            "ของเก่า"
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="section-title">รายการประมูล</h2>

        <div className="auction-grid">
          {auctions.map((item) => (
            <AuctionCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </>
  );
}