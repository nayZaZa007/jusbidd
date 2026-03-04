/*import "./AuctionCard.css";*/

export default function AuctionCard({ item }) {
  return (
    <div className="auction-card">
      <img src={item.image} alt={item.title} />

      <div className="overlay">
        <h4>{item.title}</h4>
        <p>ราคาเปิด {item.starting_price} บาท</p>
        <button>เริ่มประมูล</button>
      </div>
    </div>
  );
}