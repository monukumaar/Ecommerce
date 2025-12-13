import React, { useState } from "react";
import "./sidebar.css";
import logo from "/Profile.png";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaPlus, FaList, FaUsers, FaStar } from "react-icons/fa";

const Sidebar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  // Optional: Handle navigation errors (e.g., unauthorized access)
  const handleNavigationError = (error) => {
    setNotification({ message: `❌ ${error}`, type: "error" });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  return (
    <div className="sidebar">
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <Link to="/">
        <img src={logo} alt="Ecommerce" className="sidebar-logo" />
      </Link>
      <Link to="/admin/dashboard" onClick={() => handleNavigationError("")}>
        <p>
          <FaTachometerAlt /> Dashboard
        </p>
      </Link>
      <div className="sidebar-tree">
        <p onClick={toggleProducts} className="sidebar-tree-toggle">
          <FaBox /> Products {isProductsOpen ? "▼" : "▶"}
        </p>
        {isProductsOpen && (
          <div className="sidebar-tree-items">
            <Link to="/admin/products">
              <p>
                <FaList /> All
              </p>
            </Link>
            <Link to="/admin/product">
              <p>
                <FaPlus /> Create
              </p>
            </Link>
          </div>
        )}
      </div>
      <Link to="/admin/orders">
        <p>
          <FaList /> Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <FaUsers /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <FaStar /> Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;