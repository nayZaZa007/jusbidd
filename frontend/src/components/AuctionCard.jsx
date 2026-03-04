import "./AuctionCard.css";

export default function AuctionCard({ item }) {
  return (
    <div className="card">
      <img src={item.image} alt={item.title} />

      <div className="card-overlay">
        <h3>{item.title}</h3>
        <p>ราคาเปิด {item.startPrice} บาท</p>
        <button>เริ่มประมูล</button>
      </div>
    </div>
  );
}