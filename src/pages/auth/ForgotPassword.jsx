import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/features/auth/authAPI";
import logo from "../../assets/react.svg";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [forgotPassword, { isLoading, isError, error }] = useForgotPasswordMutation();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle forgot password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      // Navigate to verify OTP page with email
      navigate("/verify-forgot-password-otp", { state: { email } });
    } catch (err) {
      console.error("Forgot password failed:", err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="space-y-3 sm:space-y-4 text-center">
            <div className="flex justify-center">
              <img src={logo} alt="Company Logo" className="h-12 sm:h-14 md:h-16 w-auto" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800">Forgot Password?</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Enter your email address and we'll send you a code to reset your password.
            </p>
          </div>

          {/* Show API error */}
          {isError && (
            <div className="mt-4 text-xs sm:text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {error?.data?.message || "Something went wrong. Please try again."}
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                inputMode="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: "" });
                  }
                }}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition ${
                  validationErrors.email ? "border-red-600 bg-red-50" : "border-gray-300"
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-600 text-xs font-medium">{validationErrors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 bg-blue-800 text-white text-sm sm:text-base rounded-lg hover:bg-blue-900 active:bg-blue-950 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed touch-highlight-transparent"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs sm:text-sm space-y-3 sm:space-y-2">
            <div className="leading-relaxed">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-700 font-medium hover:underline active:text-blue-900">
                Sign in
              </Link>
            </div>
            <div className="leading-relaxed">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-700 font-medium hover:underline active:text-blue-900">
                Create one
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center text-xs text-gray-400">
            Authorized users only. All activities are monitored.
          </div>

        </div>
      </div>
    </div>
  );
}
