import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useVerifyPasswordOtpMutation } from "../../redux/features/auth/authAPI";
import logo from "../../assets/react.svg";

export default function VerifyForgotPasswordOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  // Email passed from Forgot Password page
  const email = location.state?.email || "";

  // OTP state
  const [otp, setOtp] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  // RTK Query mutation for verifying OTP
  const [verifyPasswordOtp, { isLoading, isError, error }] = useVerifyPasswordOtpMutation();

  // Handle OTP submit
  const handleVerify = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validation
    if (!email) errors.email = "Email is required";
    if (!otp) errors.otp = "OTP is required";
    if (!employeeId) errors.employeeId = "Employee ID is required";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await verifyPasswordOtp({ email, otp, employeeId }).unwrap();
      // Navigate to reset password page with email
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800">Verify OTP</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              We sent a verification code to <span className="font-medium break-all">{email}</span>. Enter it below to reset your password.
            </p>
          </div>

          {/* Show API error */}
          {isError && (
            <div className="mt-4 text-xs sm:text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {error?.data?.message || "Something went wrong."}
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerify} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            {/* Required Fields Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs sm:text-sm text-blue-700 font-medium">
              <p>Required fields marked with <span className="text-red-600">*</span></p>
            </div>

            {/* Email Field (Display only) */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Employee ID Field */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">
                Employee ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="text"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  if (validationErrors.employeeId) {
                    setValidationErrors({ ...validationErrors, employeeId: "" });
                  }
                }}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition ${
                  validationErrors.employeeId ? "border-red-600 bg-red-50" : "border-gray-300"
                }`}
                required
              />
              {validationErrors.employeeId && (
                <p className="text-red-600 text-xs font-medium">{validationErrors.employeeId}</p>
              )}
            </div>

            {/* OTP Field */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">
                OTP <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (validationErrors.otp) {
                    setValidationErrors({ ...validationErrors, otp: "" });
                  }
                }}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition ${
                  validationErrors.otp ? "border-red-600 bg-red-50" : "border-gray-300"
                }`}
                required
              />
              {validationErrors.otp && (
                <p className="text-red-600 text-xs font-medium">{validationErrors.otp}</p>
              )}
            </div>

            {/* OTP Timer */}
            <div className="flex items-center justify-between text-xs sm:text-sm bg-orange-50 border border-orange-200 rounded-lg p-3 gap-2">
              <span className="text-orange-800 font-medium">OTP expires in:</span>
              <span className="text-orange-600 font-bold text-base sm:text-lg">{formatTime(countdown)}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 bg-blue-800 text-white text-sm sm:text-base rounded-lg hover:bg-blue-900 active:bg-blue-950 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs sm:text-sm space-y-3 sm:space-y-2">
            <div className="leading-relaxed">
              <Link to="/forgot-password" className="text-blue-700 font-medium hover:underline active:text-blue-900">
                ← Back to Forgot Password
              </Link>
            </div>
            <div className="leading-relaxed">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-700 font-medium hover:underline active:text-blue-900">
                Sign in
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
