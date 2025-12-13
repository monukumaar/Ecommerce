import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../actions/userAction";

const UserOptions = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //console.log(user);

  const options = [
    { icon: "🏠", name: "Home", func: home },   // ✅ new option
    { icon: "📋", name: "Orders", func: orders },
    { icon: "👤", name: "Profile", func: account },
    {
      icon: "🛒",
      name: `Cart(${cartItems.length})`,
      func: cart,
      style: { color: cartItems.length > 0 ? "#f87171" : "inherit" },
    },
    { icon: "🚪", name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: "📊",
      name: "Dashboard",
      func: dashboard,
    });
  }

  function home() {
    navigate("/");
  }
  function dashboard() {
    navigate("/admin/dashboard");
  }

  function orders() {
    navigate("/orders");
  }

  function account() {
    navigate("/account");
  }

  function cart() {
    navigate("/cart");
  }


  // function logoutUser() {
  //   dispatch(logout());
  //   navigate("/login");
  // }
  async function logoutUser() {
    const result = await dispatch(logout());
     console.log(result);

    if (result.success) {
      navigate("/login");
    } else {
      console.error("Logout failed:", result.error);
      // Optional: show toast or alert
    }
  };


  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      {/* Backdrop */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10,
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* SpeedDial Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 20,
          padding: "8px",
          borderRadius: "50%",
          backgroundColor: "#1F2937",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1F2937")}
      >
        <img
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          src={user.avatar?.url || "/Profile.png"}
          alt="Profile"
        />
      </button>

      {/* Menu Options */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "64px",
            right: "16px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "8px",
            zIndex: 20,
          }}
        >
          {options.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                item.func();
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "8px 16px",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                transition: "background-color 0.2s",
                color: "#1F2937",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#F3F4F6")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span style={{ marginRight: "8px", ...item.style }}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOptions;