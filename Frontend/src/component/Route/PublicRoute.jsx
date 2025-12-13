// src/components/PublicRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../layout/Loader/Loader'; // Adjust path if necessary

import { useLocation, Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    // yaha redirect param check karo
    const redirect = new URLSearchParams(location.search).get("redirect");

    return <Navigate to={redirect ? `/${redirect}` : "/account"} replace />;
  }

  return children;
};

export default PublicRoute;