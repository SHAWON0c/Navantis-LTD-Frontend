import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let userRole = null;
  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    userRole = payload.role; // assuming your JWT has a "role" field
  } catch (err) {
    // Invalid token → remove it and redirect
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role is allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Token exists and role is allowed → render the route
  return <Outlet />;
};

export default ProtectedRoute;
