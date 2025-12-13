import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../../images/logo.png";
import "./Header.css";
import { useSelector } from "react-redux";
const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.user)
  
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
        {isAuthenticated ? "": <Link to="/login">Login</Link>
          }
      </div>
    </nav>
  );
};

export default Header;
