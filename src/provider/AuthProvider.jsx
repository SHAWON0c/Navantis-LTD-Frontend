// src/provider/AuthProvider.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, resetAuthState } from "../redux/features/auth/authSlice";
import { Navigate, Outlet } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

export default function AuthProvider({ roles = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Restore user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      dispatch(setCredentials(storedUser));
    } else {
      dispatch(resetAuthState());
    }
  }, [dispatch]);

  // Wait until user is loaded
  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PropagateLoader color="rgb(248,113,113)" size={15} />
      </div>
    );
  }

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Role-based access
  if (roles.length && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        <div className="bg-white p-10 rounded-xl shadow-md max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Access Denied</h2>
          <p className="mt-4 text-gray-600">
            You do not have permission to access this page. Please contact HR, Admin, or IT for proper credentials.
          </p>
        </div>
      </div>
    );
  }

  // Authorized → render child routes
  return <Outlet />;
}
