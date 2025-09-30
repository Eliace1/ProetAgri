import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const authed = isLoggedIn();
  const location = useLocation();
  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
