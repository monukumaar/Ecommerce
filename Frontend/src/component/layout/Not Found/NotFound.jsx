import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // optional

const NotFound = () => {
  return (
    <div className="pageNotFound">
      <h1>404</h1>
      <p>Oops! Page Not Found</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default NotFound;
