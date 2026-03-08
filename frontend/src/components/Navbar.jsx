import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../pages/CSS/Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleProfileClick = () => {
    if (role === "seller") {
      navigate("/profile-seller");
    } else {
      navigate("/profile");
    }
  };

  const handleHomeClick = () => {
    if (!role) {
      navigate("/");
    } else if (role === "seller") {
      navigate("/home-seller");
    } else if (role === "bidder") {
      navigate("/home-bidder");
    } else if (role === "admin") {
      navigate("/home-admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="navbar">

      {/* LEFT LOGO */}
      <div className="nav-left"> 
        <img src={logo} alt="logo" className="nav-logo" />
      </div>

      {/* HOME BUTTON */}
      <button className="btn-home" onClick={handleHomeClick} style={{marginLeft: 16}}>
        หน้าแรก
      </button>

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
                <div onClick={handleProfileClick}>
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