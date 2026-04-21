import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/features/auth/authAPI";
import logo from "../../assets/react.svg";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // Email passed from Verify OTP page
  const email = location.state?.email || "";

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // RTK Query mutation for resetting password
  const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();

  // Validate password
  const validatePasswords = () => {
    const errors = {};

    if (!newPassword) {
      errors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  // Handle password reset submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePasswords();

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await resetPassword({ email, newPassword, confirmPassword }).unwrap();
      // Show success message and redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Password reset failed:", err);
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
            <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800">Reset Password</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Enter your new password to regain access to your account.
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mt-4 text-xs sm:text-sm text-green-600 text-center bg-green-50 border border-green-200 rounded-lg p-3 font-medium">
              ✓ Password reset successfully! Redirecting to login...
            </div>
          )}

          {/* Show API error */}
          {isError && (
            <div className="mt-4 text-xs sm:text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {error?.data?.message || "Something went wrong. Please try again."}
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            {/* Required Fields Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs sm:text-sm text-blue-700 font-medium">
              <p>Required fields marked with <span className="text-red-600">*</span></p>
            </div>

            {/* Email Field (Display only) */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">
                New Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (validationErrors.newPassword) {
                      setValidationErrors({ ...validationErrors, newPassword: "" });
                    }
                  }}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition ${
                    validationErrors.newPassword ? "border-red-600 bg-red-50" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-600 hover:text-gray-800 text-lg active:text-gray-900"
                  tabIndex="-1"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {validationErrors.newPassword && (
                <p className="text-red-600 text-xs font-medium">{validationErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors({ ...validationErrors, confirmPassword: "" });
                    }
                  }}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition ${
                    validationErrors.confirmPassword ? "border-red-600 bg-red-50" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-600 hover:text-gray-800 text-lg active:text-gray-900"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-600 text-xs font-medium">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs sm:text-xs text-blue-700 space-y-1 font-medium">
              <p>Password Requirements:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Minimum 6 characters</li>
                <li>Must match confirmation password</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-2.5 sm:py-3 bg-blue-800 text-white text-sm sm:text-base rounded-lg hover:bg-blue-900 active:bg-blue-950 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting Password..." : isSuccess ? "Password Reset!" : "Reset Password"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs sm:text-sm space-y-2">
            <div className="leading-relaxed">
              <Link to="/login" className="text-blue-700 font-medium hover:underline active:text-blue-900">
                ← Back to Sign in
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
