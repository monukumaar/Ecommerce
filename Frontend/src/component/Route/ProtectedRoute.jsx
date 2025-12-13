import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAdmin = false, children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (isAdmin && user?.role !== "admin") {
      return (
        <Navigate
          to="/account"
          replace
          state={{
            profileUpdated: true,
            message: "❌ User is not allowed to access that resource",
            type: "error",
          }}
        />
      );
    }

    return children ? children : <Outlet />;
  }

  return null; // Ya spinner dikha sakte ho
};

export default ProtectedRoute;
