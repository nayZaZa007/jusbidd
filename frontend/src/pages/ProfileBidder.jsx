import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import api from "../api";
import Navbar from "../components/Navbar";
import "./CSS/ProfileBidder.css";

export default function Profile() {

  const [user, setUser] = useState({ display_name: "" });
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchBids();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await api.get("/my-bids");
      setBids(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-header">

        <div className="avatar">
          <FaUser />
        </div>

        <h2>{user.display_name}</h2>

        <p>จำนวนการประมูล: {bids.length}</p>

        <button className="edit-btn">
          แก้ไขโปรไฟล์
        </button>

      </div>

      <div className="profile-container">

        <h3>ประวัติการประมูล</h3>

        <div className="auction-grid">

          {bids.map((item) => (
            <div key={item.id} className="auction-card">

              <img src={item.image_url} />

              <div className="card-info">
                <p>{item.title}</p>
                <p>ราคาที่ประมูล {item.price}</p>
              </div>

            </div>
          ))}

        </div>

      </div>
    </>
  );
}