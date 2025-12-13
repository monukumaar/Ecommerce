import React from "react";
import { Link } from "react-router-dom";
import "./orderSuccess.css";

const OrderSuccess = () => {
  return (
    <div className="orderSuccess">
      <span className="successIcon">✔</span>
      <h2>Your Order has been Placed successfully</h2>
      <Link to="/orders" className="viewOrdersBtn">
        View Orders
      </Link>
    </div>
  );
};

export default OrderSuccess;