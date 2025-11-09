import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/Hooks";

const CheckOutWrapper: React.FC = () => {
  const user = useAppSelector((state) => state.authSlice.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return <Outlet />;
};

export default CheckOutWrapper;
