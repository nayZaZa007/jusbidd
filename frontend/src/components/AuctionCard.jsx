import "../pages/CSS/AuctionCard.css";
import { useEffect, useState } from "react";
import "../pages/CSS/AuctionCard.css";

export default function AuctionCard({ item }) {
  const [countdown, setCountdown] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(item.start_time);
      const end = new Date(item.end_time);
      if (now < start) {
        setStatus("before");
        setCountdown("");
      } else if (now >= start && now < end) {
        setStatus("during");
        const diff = end - now;
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
        } else {
          setCountdown("");
        }
      } else {
        setStatus("after");
        setCountdown("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [item.start_time, item.end_time]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="card">
      <img src={item.image} alt={item.title} />

      <div className="card-content">
        <div className="card-left">
          <h3>{item.title}</h3>
          <p className="price">ราคาเปิด {item.starting_price} บาท</p>
          <button className="bid-btn">เริ่มประมูล</button>
        </div>
        <div className="card-right">
          <div className="start-time">
            {status === "before" && (
              <>
                <p className="label">เวลาเปิดประมูล</p>
                <p className="time">{formatDate(item.start_time)}</p>
              </>
            )}
            {status === "during" && (
              <>
                <p className="label">เวลาถอยหลังปิดประมูล</p>
                <p className="time">{countdown}</p>
              </>
            )}
            {status === "after" && (
              <>
                <p className="label">สถานะ</p>
                <p className="time">ปิดประมูลแล้ว</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}