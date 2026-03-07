import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Admin() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1>Admin Page</h1>
        <p>Admin management page</p>
      </div>
    </>
  );
}
