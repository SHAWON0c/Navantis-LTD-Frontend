
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/NPL-Updated-Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/features/auth/authAPI";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  // RTK Query mutation
  const [login, { isLoading, isSuccess, isError, error, data }] = useLoginMutation();

  // Get user from Redux
  const { user } = useSelector((state) => state.auth);

  // Handle form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ employeeId, password }).unwrap();
      console.log("Login success:", response);

      // Save token & role in Redux
      dispatch(setCredentials({ user: { employeeId, role: response.role }, token: response.token }));

      // Optional: persist token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Redirect based on role after successful login
  useEffect(() => {
    if (isSuccess && user) {
      switch (user.role) {
        case "user":
          navigate("/user-dashboard");
          break;
        case "md":
          navigate("/md-dashboard");
          break;
        default:
          navigate("/"); // fallback
      }
    }
  }, [isSuccess, user, navigate]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <img src={logo} alt="Company Logo" className="h-16 w-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
            <p className="text-sm text-gray-500">Use your corporate credentials</p>
          </div>

          {/* API Error */}
          {isError && (
            <div className="mt-4 text-sm text-red-600 text-center">
              {error?.data?.message || "Something went wrong."}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Employee ID or Email</label>
              <input
                type="text"
                placeholder="EMP-1001 or name@company.com"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-700 font-medium hover:underline">
              Register
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            Authorized users only. All activities are monitored.
          </div>
        </div>
      </div>
    </div>
  );
}
