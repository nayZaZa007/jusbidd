import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
/*import "./Navbar.css";*/

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="navbar">
      <div className="nav-left">
        <img src={logo} alt="logo" className="nav-logo" />
        <span onClick={() => navigate("/home")}>หน้าแรก</span>
        <span>ค้นหาสินค้า</span>
      </div>

      <div className="nav-search">
        <input
          type="text"
          placeholder="ค้นหา..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="nav-right">
        {!token && (
          <>
            <button onClick={() => navigate("/")}>ลงชื่อเข้าใช้</button>
            <button onClick={() => navigate("/register")}>
              สมัครสมาชิก
            </button>
          </>
        )}
      </div>
    </div>
  );
}