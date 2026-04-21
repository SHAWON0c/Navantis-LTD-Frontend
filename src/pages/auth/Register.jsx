import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../redux/features/auth/authAPI";
import logo from "/images/NPL-Updated-Logo.png";

export default function Register() {
  const navigate = useNavigate();

  // RTK Query mutation
  const [signUp, { isLoading, isSuccess, isError, error }] = useSignUpMutation();

  // Form state
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await signUp({ employeeId, email, password }).unwrap(); // unwrap gives the actual response or throws error
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  // Redirect to verify email page after successful registration
  useEffect(() => {
    if (isSuccess) {
      navigate("/verify-email", { state: { email } });
    }
  }, [isSuccess, navigate, email]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="space-y-3 sm:space-y-4 text-center">
            <div className="flex justify-center">
              <img src={logo} alt="Company Logo" className="h-12 sm:h-14 md:h-16 w-auto" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800">Register</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">Create your corporate account</p>
          </div>

          {/* Show API error */}
          {isError && (
            <div className="mt-4 text-xs sm:text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {error?.data?.message || "Something went wrong."}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="mt-8 space-y-6">

            {/* Employee ID */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Employee ID</label>
              <input
                type="text"
                placeholder="EMP-1002"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium disabled:opacity-60"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-medium hover:underline">
              Sign in
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400">
            Authorized users only. All activities are monitored.
          </div>

        </div>
      </div>
    </div>
  );
}
