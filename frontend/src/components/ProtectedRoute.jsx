import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, getUser } from "../lib/auth";

export default function ProtectedRoute(props) {
  const { children, onlyFarmer = false, onlyCustomer = false } = props;

  const authed = isLoggedIn();
  const location = useLocation();
  const user = getUser();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (onlyFarmer && !user?.farmer) {
    return <Navigate to="/" replace />;
  }

  if (onlyCustomer && !user?.customer) {
    return <Navigate to="/" replace />;
  }

  return children;
}
