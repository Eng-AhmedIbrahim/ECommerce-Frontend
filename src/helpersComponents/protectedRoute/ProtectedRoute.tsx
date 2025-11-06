import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/Hooks";
const ProtectedRoute = () => {
  const isAuth = useAppSelector((state) => state.authSlice.isAuthenticated);
  if (!isAuth) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
