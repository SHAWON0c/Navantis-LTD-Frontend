// // // src/pages/auth/Login.jsx
// // import React, { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { useDispatch } from "react-redux";
// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import logo from "/images/NPL-Updated-Logo.png";
// // import { setCredentials } from "../../redux/features/auth/authSlice";
// // import { useLoginMutation } from "../../redux/features/auth/authAPI";

// // export default function Login() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const [employeeId, setEmployeeId] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loginError, setLoginError] = useState("");

// //   const [login, { isLoading }] = useLoginMutation();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoginError("");

// //     try {
// //       const response = await login({ employeeId, password }).unwrap();

// //       // ✅ Save user info in Redux
// //       dispatch(
// //         setCredentials({
// //           user: { employeeId, role: response.role },
// //           token: response.token,
// //         })
// //       );

// //       // ✅ Persist in localStorage
// //       localStorage.setItem("token", response.token);
// //       localStorage.setItem("role", response.role);

// //       toast.success("Login successful!");

// //       // ✅ Navigate to dashboard for all roles
// //       navigate("/dashboard", { replace: true });
// //     } catch (err) {
// //       console.error("Login failed:", err);
// //       setLoginError(err?.data?.message || "Login failed. Please check your credentials.");
// //       toast.error(err?.data?.message || "Login failed.");
// //     }
// //   };

// //   return (
// //     <div className="flex w-full min-h-screen bg-gray-50">
// //       <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
// //       <div className="flex-1 flex items-center justify-center px-8 py-16">
// //         <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">

// //           {/* Header */}
// //           <div className="space-y-4 text-center">
// //             <div className="flex justify-center">
// //               <img src={logo} alt="Company Logo" className="h-16 w-auto" />
// //             </div>
// //             <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
// //             <p className="text-sm text-gray-500">Use your corporate credentials</p>
// //           </div>

// //           {/* API Error */}
// //           {loginError && (
// //             <div className="mt-4 text-sm text-red-600 text-center">{loginError}</div>
// //           )}

// //           {/* Form */}
// //           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
// //             <div className="space-y-2">
// //               <label className="text-sm text-gray-600">Employee ID or Email</label>
// //               <input
// //                 type="text"
// //                 placeholder="EMP-1001 or name@company.com"
// //                 value={employeeId}
// //                 onChange={(e) => setEmployeeId(e.target.value)}
// //                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
// //                 required
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <label className="text-sm text-gray-600">Password</label>
// //               <input
// //                 type="password"
// //                 placeholder="••••••••"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
// //                 required
// //               />
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={isLoading}
// //               className="w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium disabled:opacity-60"
// //             >
// //               {isLoading ? "Signing in..." : "Sign in"}
// //             </button>
// //           </form>

// //           {/* Footer */}
// //           <div className="mt-6 text-center text-sm">
// //             Don’t have an account?{" "}
// //             <Link to="/register" className="text-blue-700 font-medium hover:underline">
// //               Register
// //             </Link>
// //           </div>

// //           <div className="mt-8 text-center text-xs text-gray-400">
// //             Authorized users only. All activities are monitored.
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // src/pages/auth/Login.jsx
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logo from "/images/NPL-Updated-Logo.png";
// import { setCredentials } from "../../redux/features/auth/authSlice";
// import { useLoginMutation } from "../../redux/features/auth/authAPI";

// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [employeeId, setEmployeeId] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   const [login, { isLoading }] = useLoginMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("🔵 Login form submitted");
//     console.log("📤 Sending login request with:", { employeeId, password });

//     setLoginError("");

//     try {
//       const response = await login({ employeeId, password }).unwrap();

//       console.log("✅ API response received:", response);

//       // ✅ Save user info in Redux
//       dispatch(
//         setCredentials({
//           user: { employeeId, role: response.role },
//           token: response.token,
//         })
//       );

//       console.log("🟢 Redux credentials stored:", {
//         employeeId,
//         role: response.role,
//         token: response.token,
//       });

//       // ✅ Persist in localStorage
//       localStorage.setItem("token", response.token);
//       localStorage.setItem("role", response.role);

//       console.log("💾 Saved to localStorage:");
//       console.log("token:", localStorage.getItem("token"));
//       console.log("role:", localStorage.getItem("role"));

//       toast.success("Login successful!");

//       window.location.href = "/dashboard";

//       // ✅ Navigate to dashboard for all roles
//       navigate("/dashboard", { replace: true });

//       console.log("🏁 navigate('/dashboard') executed");
//     } catch (err) {
//       console.error("❌ Login failed:", err);

//       setLoginError(
//         err?.data?.message || "Login failed. Please check your credentials."
//       );

//       toast.error(err?.data?.message || "Login failed.");

//       console.log("🚨 Error message:", err?.data?.message);
//     }
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-gray-50">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//       />

//       <div className="flex-1 flex items-center justify-center px-8 py-16">
//         <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">

//           {/* Header */}
//           <div className="space-y-4 text-center">
//             <div className="flex justify-center">
//               <img src={logo} alt="Company Logo" className="h-16 w-auto" />
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
//             <p className="text-sm text-gray-500">Use your corporate credentials</p>
//           </div>

//           {/* API Error */}
//           {loginError && (
//             <div className="mt-4 text-sm text-red-600 text-center">
//               {loginError}
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             <div className="space-y-2">
//               <label className="text-sm text-gray-600">
//                 Employee ID or Email
//               </label>
//               <input
//                 type="text"
//                 placeholder="EMP-1001 or name@company.com"
//                 value={employeeId}
//                 onChange={(e) => {
//                   console.log("✏️ EmployeeId changed:", e.target.value);
//                   setEmployeeId(e.target.value);
//                 }}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm text-gray-600">Password</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => {
//                   console.log("✏️ Password input changed");
//                   setPassword(e.target.value);
//                 }}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium disabled:opacity-60"
//             >
//               {isLoading ? "Signing in..." : "Sign in"}
//             </button>
//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center text-sm">
//             Don’t have an account?{" "}
//             <Link
//               to="/register"
//               className="text-blue-700 font-medium hover:underline"
//             >
//               Register
//             </Link>
//           </div>

//           <div className="mt-8 text-center text-xs text-gray-400">
//             Authorized users only. All activities are monitored.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/auth/Login.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "/images/NPL-Updated-Logo.png";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/features/auth/authAPI";
import { useAuth } from "../../provider/AuthProvider";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    const reason = sessionStorage.getItem("authLogoutReason");

    if (reason) {
      toast.warning(reason);
      sessionStorage.removeItem("authLogoutReason");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔵 Login form submitted");

    setLoginError("");

    try {
      console.log("📤 Sending login request:", {
        employeeId,
        password,
      });

      const response = await login({
        employeeId,
        password,
      }).unwrap();

      console.log("✅ Login API response:", response);

      /*
      response example
      {
        token: "...",
        role: "mpo"
      }
      */

      // 1️⃣ Update Redux
      dispatch(
        setCredentials({
          user: { employeeId, role: response.role },
          token: response.token,
        })
      );

      console.log("🟢 Redux credentials stored");

      // 2️⃣ Update AuthProvider + localStorage
      loginUser({
        token: response.token,
        role: response.role,
        employeeId,
      });

      console.log("🟢 AuthProvider state updated");

      toast.success("Login successful!");

      // 3️⃣ Navigate smoothly
      console.log("➡️ Navigating to /dashboard");

      navigate("/dashboard", { replace: true });

      console.log("🏁 navigate('/dashboard') executed");

    } catch (err) {
      console.error("❌ Login failed:", err);

      const message =
        err?.data?.message || "Login failed. Please check your credentials.";

      setLoginError(message);

      toast.error(message);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <img src={logo} alt="Company Logo" className="h-16 w-auto" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">
              Sign in
            </h2>

            <p className="text-sm text-gray-500">
              Use your corporate credentials
            </p>
          </div>

          {/* API Error */}
          {loginError && (
            <div className="mt-4 text-sm text-red-600 text-center">
              {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            {/* Employee ID */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Employee ID or Email
              </label>

              <input
                type="text"
                placeholder="EMP-1001 or name@company.com"
                value={employeeId}
                onChange={(e) => {
                  console.log("✏️ EmployeeId changed:", e.target.value);
                  setEmployeeId(e.target.value);
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  console.log("✏️ Password input changed");
                  setPassword(e.target.value);
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Login Button */}
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
            <Link
              to="/register"
              className="text-blue-700 font-medium hover:underline"
            >
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