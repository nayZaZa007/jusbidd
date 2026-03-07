import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../pages/CSS/Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [openMenu, setOpenMenu] = useState(false);

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
          <div className="profile-wrapper">

            {/* PROFILE ICON */}
            <div
              className="profile-icon"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <FaUserCircle />
            </div>

            {/* DROPDOWN */}
            {openMenu && (
              <div className="profile-menu">
                <div onClick={() => navigate("/profile")}>
                  โปรไฟล์
                </div>

                <div onClick={handleLogout}>
                  ออกจากระบบ
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}