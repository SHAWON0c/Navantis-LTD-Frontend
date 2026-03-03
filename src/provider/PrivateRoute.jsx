import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../component/Loader";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/login");

  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRedirectPath("/login");
      setIsAllowed(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://ems.navantispharma.com/api/auth/verify-token", {
        headers: { Authorization: token }, // send raw token
      });

      if (!res.ok) throw new Error("Invalid token");

      const data = await res.json();

      // Role check
      if (allowedRoles && !allowedRoles.includes(data.role)) {
        setRedirectPath("/unauthorized");
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    } catch (err) {
      // If token is tampered, immediately remove it
      localStorage.removeItem("token");
      setRedirectPath("/login");
      setIsAllowed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial check
    verifyToken();

    // Periodic check every 30s
    const intervalId = setInterval(verifyToken, 30000);

    // Detect manual token paste / deletion in localStorage
    const handleStorageChange = (e) => {
      if (e.key === "token") verifyToken();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [allowedRoles]);

if (loading) return null;

  if (!isAllowed)
    return <Navigate to={redirectPath} state={{ from: location }} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
