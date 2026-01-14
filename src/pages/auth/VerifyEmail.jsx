import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useVerifyEmailMutation } from "../../redux/features/auth/authAPI";
import logo from "../../assets/react.svg";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Email passed from Register page
  const email = location.state?.email || "";

  // OTP state
  const [otp, setOtp] = useState("");

  // RTK Query mutation for verifying OTP
  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();

  // Handle OTP submit
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail({ email, otp }).unwrap(); // unwrap gives the actual response or throws error
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  // Redirect to login after successful verification
  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <img src={logo} alt="Company Logo" className="h-16 w-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Verify Your Email</h2>
            <p className="text-sm text-gray-500">
              We sent a verification code to <span className="font-medium">{email}</span>. Enter it below to activate your account.
            </p>
          </div>

          {/* Show API error */}
          {isError && (
            <div className="mt-4 text-sm text-red-600 text-center">
              {error?.data?.message || "Something went wrong."}
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium disabled:opacity-60"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-sm">
            Back to{" "}
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
