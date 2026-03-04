import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("/register", form);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container">
      <h2>สมัครสมาชิก</h2>

      {error && <p className="error">{error}</p>}

      <input
        placeholder="Display Name"
        onChange={e => setForm({ ...form, display_name: e.target.value })}
      />

      <input
        placeholder="Username"
        onChange={e => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        onChange={e => setForm({ ...form, confirm_password: e.target.value })}
      />

      <select
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="">เลือก Role</option>
        <option value="bidder">Bidder</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleSubmit}>สร้างบัญชี</button>
    </div>
  );
}