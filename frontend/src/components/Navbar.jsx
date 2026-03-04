import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="navbar">
      {/* LEFT LOGO */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="nav-logo" />
      </div>

      {/* CENTER SEARCH */}
      <div className="nav-center">
        <input type="text" placeholder="ค้นหาสินค้า..." />
      </div>

      {/* RIGHT BUTTONS */}
      <div className="nav-right">
        {!token ? (
          <>
            <button
              className="btn-outline"
              onClick={() => navigate("/login")}
            >
              ลงชื่อเข้าใช้
            </button>

            <button
              className="btn-fill"
              onClick={() => navigate("/register")}
            >
              สมัครสมาชิก
            </button>
          </>
        ) : (
          <button className="btn-fill" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        )}
      </div>
    </div>
  );
}