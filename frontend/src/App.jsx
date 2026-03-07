import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeBidder from "./pages/HomeBidder";
import HomeSeller from "./pages/HomeSeller";
import HomeAdmin from "./pages/HomeAdmin";
import Seller from "./pages/Seller";
import Admin from "./pages/Admin";
import ProfileBidder from "./pages/ProfileBidder";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function HomeRedirect() {
  const role = localStorage.getItem("role");
  if (role === "seller") return <Navigate to="/home-seller" replace />;
  if (role === "admin") return <Navigate to="/home-admin" replace />;
  return <Navigate to="/home-bidder" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/home-bidder" element={<HomeBidder />} />
      <Route path="/home-seller" element={<HomeSeller />} />
      <Route path="/home-admin" element={<HomeAdmin />} />
      <Route path="/profile" element={<ProfileBidder />} />

      <Route
        path="/seller"
        element={
          <PrivateRoute>
            <Seller />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}